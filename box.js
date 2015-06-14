Box = function (func, equals) {
  var self = this;

  self.func = func;
  self.equals = equals;

  self.curResult = null;

  self.dep = new Tracker.Dependency;

  self.resultComputation = Tracker.nonreactive(function () {
    return Tracker.autorun(function (c) {
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
    });
  });
};

Box.prototype.stop = function () {
  this.resultComputation.stop();
  this.resultComputation = null;
  this.func = null;
  this.equals = null;
  this.curResult = null;
  this.dep = null;
};

Box.prototype.get = function () {
  var self = this;
  if (self.resultComputation == null || self.resultComputation.stopped){
    throw new Error('Box#get() called after stopped.');
  }
  if (self.resultComputation.invalidated) {
    // or recompute if invalidated
    self.resultComputation._recompute();
  }
  if (Tracker.active){
    self.dep.depend();
  }
  return this.curResult;
};
