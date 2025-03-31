({
  MAGNET_DURATION: 7.5,
  OUTRO_DURATION: 2,
  EFFECT_SCALE: 0.1,

  timeSinceStarted: 0,
  shouldRun() {
    return !hiber3d.getValue("GameState", "paused");
  },
  onCreate() {
  },
  update(dt) {
    if (!this.shouldRun()) {
      return;
    }

    // Stop
    if (this.timeSinceStarted >= this.MAGNET_DURATION) {
      hiber3d.removeScript(this.entity, "scripts/powerups/Magnet.js");
    }
    this.timeSinceStarted += dt;
  },
  onEvent(event, payload) {
  }
});