({
  MAGNET_DURATION: 7.5,

  timeSinceStarted: 0,
  shouldRun() {
    return !hiber3d.getValue("GameState", "paused");
  },
  onCreate() {
    var decalsScript = regUtils.addScriptIfNotPresent(this.entity, "scripts/powerups/PowerUpDecals.js");
    decalsScript.createDecal("scripts/powerups/Magnet.js", "assets/glbs/PowerUp_magnet.glb#scene0", this.MAGNET_DURATION, 0.1);
  },
  update(dt) {
    if (!this.shouldRun()) {
      return;
    }

    // Stop
    if (this.timeSinceStarted >= this.MAGNET_DURATION) {
      hiber3d.removeScript(this.entity, "scripts/powerups/Magnet.js");
      if(hiber3d.hasScript(this.entity, "scripts/powerups/PowerUpDecals.js")) {
        var decalsScript = hiber3d.getScript(this.entity, "scripts/powerups/PowerUpDecals.js");
        decalsScript.destroyDecal("scripts/powerups/Magnet.js");
      }
      return;
    }
    this.timeSinceStarted += dt;
  },
  onEvent(event, payload) {
  }
});