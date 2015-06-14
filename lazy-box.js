
function safeAutorun(f){
  return Tracker.nonreactive(function(){
    return Tracker.autorun(f);
  });
}


LazyBox = function (func, equals) {
  var self = this;

  // state tracking
  self.stopped = false;

  self.func = func;
  self.equals = equals;

  self.curResult = null;

  self.dep = new Tracker.Dependency;

  // Don't initialise a computation until required.
  self.resultComputation = null;

  // bind functions so they're only created once
  self._computation = self._computation.bind(self);
  self._onInvalidate = self._onInvalidate.bind(self);
  self._pauseAfterFlush = self._pauseAfterFlush.bind(self);
};

LazyBox.prototype._computation = function (c) {
  var self = this;
  var func = self.func;

  var newResult = func();

  if (! c.firstRun) {
    var equals = self.equals;
    var oldResult = self.curResult;

    if (equals ? equals(newResult, oldResult) :
        newResult === oldResult) {
      // same as last time
      return;
    }
  }

  self.curResult = newResult;
  self.dep.changed();
};

LazyBox.prototype._onInvalidate = function(){
  var self = this;
  // when it's invalidated, Tracker will flush to recompute
  Tracker.afterFlush(self._pauseAfterFlush);
};

LazyBox.prototype._pauseAfterFlush = function(){
  var self = this;
  if (self.stopped || self.resultComputation == null){
    return;
  }
  if (!self.dep.hasDependents()){
    // pause
    self.resultComputation.stop();
    self.resultComputation = null;
  }
};

LazyBox.prototype.depend = function(){
  var self = this;
  if (!Tracker.active){
    // TODO: Warn users calling LazyBox.get without a current computation. Will cause a lot of stop/starting.
    if (!self.dep.hasDependents()){
      self.resultComputation.stop();
      self.resultComputation = null;
    }
    return;
  }
  if (self.dep.depend()) {
    Tracker.currentComputation.onInvalidate(self._onInvalidate);
  }
};

LazyBox.prototype.stop = function () {
  var self = self;
  if (self.resultComputation != null) {
    self.resultComputation.stop();
    self.resultComputation = null;
  }
  self.func = null;
  self.equals = null;
  self.curResult = null;
  self.dep = null;
  self._computation = null;
  self._onInvalidate = null;
  self._pauseAfterFlush = null;
  self.stopped = true;
};

LazyBox.prototype.get = function () {
  var self = this;
  if (self.stopped){
    throw new Error('LazyBox#get() called after stopped.');
  }
  // Check if the computation is running
  if (self.resultComputation == null){
    // restart as necessary
    self.resultComputation = safeAutorun(self._computation);
  } else if (self.resultComputation.invalidated) {
    // or recompute if invalidated
    self.resultComputation._recompute();
  }

  self.depend();

  return self.curResult;
};
