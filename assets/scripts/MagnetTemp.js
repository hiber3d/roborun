// This script will become obsolete and will be removed after [HIB-33606] and [HIB-33679]
({
  MAGNET_DURATION: 10,

  shouldRun() {
    return hiber3d.hasComponents(this.entity, "Magnet") && !hiber3d.getValue("GameState", "paused");
  },
  onCreate() {
  },
  update(dt) {
    if (!this.shouldRun()) {
      return;
    }
    const timeSinceStarted = hiber3d.getValue(this.entity, "Magnet", "timeSinceStarted");

    // Start
    if (timeSinceStarted === 0) {

    }

    // Stop
    if (timeSinceStarted >= this.MAGNET_DURATION) {
      hiber3d.removeComponent(this.entity, "Magnet");
    }

    hiber3d.setValue(this.entity, "Magnet", "timeSinceStarted", timeSinceStarted + dt);
  },
  onEvent(event, payload) {
  }
});