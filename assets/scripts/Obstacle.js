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
  onCreate() {
    hiber3d.addEventListener(this.entity, "Hiber3D::CollisionStarted");
  },
  update(dt) {
  },
  onEvent(event, payload) {
    if (event === "Hiber3D::CollisionStarted") {
      if (typeof roboRunUtils !== 'undefined' && roboRunUtils.isPlayerCollision(this.entity, payload)) {
        const playerEntity = hiber3d.getValue("GameState", "playerEntity");
        if (!hiber3d.hasScripts(playerEntity, "scripts/powerups/AutoRun.js")) {
          hiber3d.writeEvent("KillPlayer", {});
          
          // TODO: Work-in-progress
          if (true) {
            const deathScenePath = this.getDeathScenePath();
            if (deathScenePath !== undefined) {
              hiber3d.call("changeScene", deathScenePath);
            }
          }
        }
      }
    }
  }
});