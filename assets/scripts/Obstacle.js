({
  // TODO: Temorary solution until we can save modified script values in editor
  OBSTACLE_TYPES: {
    "Blockage": "scenes/deaths/Blockage.scene"
  },
  getDeathScenePath() {
    const name = hiber3d.getValue(this.entity, "Hiber3D::Name");
    const path = this.OBSTACLE_TYPES[name];
    if (path === undefined) {
      hiber3d.print("PowerUp.js - getDeathScenePath() - Unknown death scene name: " + name);
    }
    return path;
  },
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
    if (collisionUtils.collidesWithPlayer(this.entity, 0.4) && !hiber3d.hasScripts(playerEntity, "scripts/powerups/AutoRun.js")) {
      hiber3d.writeEvent("KillPlayer", {});

      // TODO: Work-in-progress
      if(true){
        const deathScenePath = this.getDeathScenePath();
        if (deathScenePath !== undefined) {
          hiber3d.call("changeScene", deathScenePath);
        }
      }
    }
  },
  onEvent(event, payload) {
  }
});