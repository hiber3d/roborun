({
  shouldRun() {
    return hiber3d.getValue("GameState", "playerEntity") !== undefined &&
      hiber3d.hasComponents(hiber3d.getValue("GameState", "playerEntity"), "Hiber3D::ComputedWorldTransform") &&
      hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform") &&
      hiber3d.getValue("GameState", "alive") &&
      !hiber3d.getValue("GameState", "paused");
  },
  onCreate() {
  },
  update(dt) {
    if (!this.shouldRun()) {
      return;
    }
    const playerEntity = hiber3d.getValue("GameState", "playerEntity");
    if (collisionUtils.collidesWithPlayer(this.entity, 0.4) && !hiber3d.hasScript(playerEntity, "scripts/powerups/AutoRun.js")) {
      hiber3d.writeEvent("KillPlayer", {});
    }
  },
  onEvent(event, payload) {
  }
});