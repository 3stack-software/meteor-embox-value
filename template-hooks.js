
// Hooks embox's in to template hooks automatically
if (Package.blaze){
  var Blaze = Package.blaze.Blaze;
  Blaze.Template.prototype.emboxValue = function(f, equals){
    return this.view.emboxValue(f, equals);
  };
  Blaze.View.prototype.emboxValue = function(f, equals){
    // from Blaze.View.prototype.autorun
    if (! self.isCreated) {
      throw new Error("View#autorun must be called from the created callback at the earliest");
    }
    if (this._isInRender) {
      throw new Error("Can't call View#autorun from inside render(); try calling it from the created or rendered callback");
    }
    if (Tracker.active) {
      throw new Error("Can't call View#autorun from a Tracker Computation; try calling it from the created or rendered callback");
    }

    var box = emboxValue(f, equals);
    self.onViewDestroyed(function () { box.stop(); });

    return box;
  }

}
