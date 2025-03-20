({
  POSITION_LERP_FACTOR: 0.5, // 0: follow spline, 1: follow player
  shouldRun() {
    const playerEntity = hiber3d.getValue("GameState", "playerEntity");
    return playerEntity !== undefined &&
      hiber3d.hasComponents(playerEntity, "SplineData") &&
      hiber3d.hasComponents(playerEntity, "Hiber3D::Transform") &&
      hiber3d.hasComponents(this.entity, "Hiber3D::Transform");
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
    var splinePosition = playerSplineData.position;
    if (hiber3d.hasComponents(playerEntity, "AutoRun")) {
      splinePosition.y = hiber3d.getValue(playerEntity, "AutoRun", "startingGroundHeight");
    }
    const lerpedPosition = vectorUtils.lerpVector(splinePosition, playerPosition, this.POSITION_LERP_FACTOR);
    hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", lerpedPosition);

    // Rotation
    const isPlayerOnPath = hiber3d.hasComponents(playerEntity, "OnPath");
    if (isPlayerOnPath) {
      const flatRotation = quatUtils.flattenQuaternion(playerSplineData.rotation);
      hiber3d.setValue(this.entity, "Hiber3D::Transform", "rotation", flatRotation);
    }
  },
  onEvent(event, payload) {
  },
});