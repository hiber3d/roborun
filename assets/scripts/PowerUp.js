({
  // TODO: Temorary solution until we can save modified script values in editor
  POWER_UPS: {
    "AutoRun": "scripts/powerups/AutoRun.js",
    "Magnet": "scripts/powerups/Magnet.js"
  },
  RADIUS: 0.75,
  // DURATION: 7.5, // TODO: Define this here, send to script
  getScriptPath() {
    const name = hiber3d.getValue(this.entity, "Hiber3D::Name");
    const path = this.POWER_UPS[name];
    if (path === undefined) {
      hiber3d.print("PowerUp.js - getScriptPath() - Unknown power-up name: " + name);
    }
    hiber3d.print("PowerUp.js: Adding power-up to player: '" + name+"'");
    return path;
  },
  shouldRun() {
    const playerEntity = hiber3d.getValue("GameState", "playerEntity");
    return playerEntity !== undefined &&
      hiber3d.hasComponents(playerEntity, "Hiber3D::ComputedWorldTransform") &&
      hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform");
  },
  onCreate() {
  },
  update() {
    if (this.shouldRun() === false) {
      return;
    }
    if (collisionUtils.collidesWithPlayer(this.entity, this.RADIUS)) {

      const playerEntity = hiber3d.getValue("GameState", "playerEntity");
      const scriptPath = this.getScriptPath();
      regUtils.addScript(playerEntity, scriptPath);


      // Destroy this power-up
      regUtils.destroyEntity(this.entity);
    }
  },
  onEvent(event, payload) {
  }
});