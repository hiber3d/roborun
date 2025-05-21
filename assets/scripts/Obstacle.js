({
  // TODO: Temorary solution until we can save modified script values in editor
  OBSTACLE_TYPES: {
    "Arm1": "scenes/deaths/Arm1.scene",
    "Arm2": "scenes/deaths/Arm2.scene",
  },
  getDeathScenePath() {
    if(hiber3d.hasComponents(this.entity, "DeathScene")){
      return hiber3d.getValue(this.entity, "DeathScene", "path");
    }

    const name = hiber3d.getValue(this.entity, "Hiber3D::Name");
    const path = this.OBSTACLE_TYPES[name];
    if (path !== undefined) {
      return path;
    }

    for (var i = 0; i < Object.keys(this.OBSTACLE_TYPES).length; i++) {
      const key = Object.keys(this.OBSTACLE_TYPES)[i];
      const ancestor = regUtils.findEntityWithNameAmongAncestors(this.entity, key);
      if(ancestor !== undefined) {
        const path = this.OBSTACLE_TYPES[key];
        return path;
      }
    }
    return undefined;
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
          
          const deathScenePath = this.getDeathScenePath();
          if (deathScenePath !== undefined) {
            hiber3d.writeEvent("ChangeScene", { path:deathScenePath });
          }
        }
      }
    }
  }
});