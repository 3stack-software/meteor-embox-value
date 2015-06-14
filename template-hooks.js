
// Hooks embox's in to template hooks automatically
if (Package.blaze) {
  var Blaze = Package.blaze.Blaze;
  Blaze.TemplateInstance.prototype.emboxValue = function (f, equals, lazy) {
    return this.view.emboxValue(f, equals, lazy);
  };
  Blaze.View.prototype.emboxValue = function (f, equals, lazy) {
    var self = this;
    // from Blaze.View.prototype.autorun
    if (! self.isCreated) {
      throw new Error("View#emboxValue must be called from the created callback at the earliest");
    }
    if (self._isInRender) {
      throw new Error("Can't call View#emboxValue from inside render(); try calling it from the created or rendered callback");
    }
    if (Tracker.active) {
      throw new Error("Can't call View#emboxValue from a Tracker Computation; try calling it from the created or rendered callback");
    }

    var templateInstanceFunc = Blaze.Template._currentTemplateInstanceFunc;

    var box = emboxValue(function(){
      return Blaze._withCurrentView(self, function(){
        return Blaze.Template._withTemplateInstanceFunc(
          templateInstanceFunc, function(){
            return f.call(self);
          }
        );
      });
    }, equals, lazy);

    self.onViewDestroyed(function () { box.stop(); });

    return box;
  };

}
