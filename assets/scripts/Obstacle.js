({
  // TODO: Temorary solution until we can save modified script values in editor
  OBSTACLE_TYPES: {
    "Arm1": "scenes/deaths/Arm1.scene",
    "Arm2": "scenes/deaths/Arm2.scene",
    "Blockage": "scenes/deaths/Blockage.scene",
    "Grinder": "scenes/deaths/Grinder.scene",
    "Processor": "scenes/deaths/Processor.scene",
  },
  getDeathScenePath() {
    const name = hiber3d.getComponent(this.entity, "Hiber3D::Name");
    const path = this.OBSTACLE_TYPES[name];
    if (path !== undefined) {
      return path;
    }

    for (var i = 0; i < Object.keys(this.OBSTACLE_TYPES).length; i++) {
      const key = Object.keys(this.OBSTACLE_TYPES)[i];
      const ancestor = regUtils.findEntityWithNameAmongAncestors(this.entity, key);
      if (!regUtils.isNullEntity(ancestor) ) {
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
        const playerEntity = hiber3d.getSingleton("GameState").playerEntity;
        if (!hiber3d.hasScripts(playerEntity, "scripts/powerups/AutoRun.js")) {
          hiber3d.writeEvent("KillPlayer", new KillPlayer());

          const deathScenePath = this.getDeathScenePath();
          if (deathScenePath !== undefined) {
            const changeSceneEvent = new ChangeScene();
            changeSceneEvent.path = deathScenePath;
            hiber3d.writeEvent("ChangeScene", changeSceneEvent);
          }
        }
      }
    }
  }
});