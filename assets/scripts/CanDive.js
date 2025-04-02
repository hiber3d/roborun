({
  shouldRun() {
    return hiber3d.getValue("GameState", "alive") && !hiber3d.getValue("GameState", "paused");
  },
  canStartDiving(){
    return (hiber3d.hasComponents(this.entity, "Jumping") ||
    hiber3d.hasScripts(this.entity, "scripts/powerups/AutoRun.js")) &&
    !hiber3d.hasScripts(this.entity, "scripts/Diving.js");
  },
  onCreate() {
    hiber3d.addEventListener(this.entity, "DiveInput");
  },
  update(dt) {
  },
  onEvent(event, payload) {
    if (!this.shouldRun()) {
      return;
    }
    if (event === "DiveInput") {
      if (this.canStartDiving()) {
        regUtils.addOrReplaceScript(this.entity, "scripts/Diving.js");
      }
    }
  },
});