({
  POSITION_LERP_FACTOR: 0.5, // 0: follow spline, 1: follow player
  AUTO_RUN_POSITION_LERP_FACTOR: 0.1,
  shouldRun() {
    const playerEntity = hiber3d.getValue("GameState", "playerEntity");
    return playerEntity !== undefined &&
      hiber3d.hasComponents(playerEntity, "SplineData") &&
      hiber3d.hasComponents(playerEntity, "Hiber3D::Transform") &&
      hiber3d.hasComponents(this.entity, "Hiber3D::Transform");
  },
  getLerpFactor() {
const playerEntity = hiber3d.getValue("GameState", "playerEntity");
    return hiber3d.hasComponents(playerEntity, "AutoRun") ? this.AUTO_RUN_POSITION_LERP_FACTOR : this.POSITION_LERP_FACTOR;
  },
  onCreate() {
  },
  update(dt) {
    if (this.shouldRun() === false) {
      return;
    }
    const playerEntity = hiber3d.getValue("GameState", "playerEntity");
    const playerSplineData = hiber3d.getValue(playerEntity, "SplineData");

    // Position
    const playerPosition = hiber3d.getValue(playerEntity, "Hiber3D::Transform", "position");
    const lerpedPosition = vectorUtils.lerpVector(playerSplineData.position, playerPosition, this.getLerpFactor());
    hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", lerpedPosition);

    // Rotation
    const isPlayerOnPath = hiber3d.hasComponents(playerEntity, "OnPath");
    if (isPlayerOnPath) {
      hiber3d.setValue(this.entity, "Hiber3D::Transform", "rotation", playerSplineData.rotation);
    }
  },
  onEvent(event, payload) {
  },
});