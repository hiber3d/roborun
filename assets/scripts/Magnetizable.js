({
  MAGNET_ATTRACTION_RADIUS: 7,
  MAGNET_ATTRACTION_SPEED: 30,
  MAGNET_ATTRACTION_SPEED_ACCELERATION: 25,
  shouldRun() {
    const playerEntity = hiber3d.getValue("GameState", "playerEntity");
    return playerEntity !== undefined &&
      hiber3d.hasComponents(playerEntity, "Hiber3D::ComputedWorldTransform") &&
      hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform");
  },
  onCreate() {
  },
  update(dt) {
    if (this.shouldRun() === false) {
      return;
    }
    const playerEntity = hiber3d.getValue("GameState", "playerEntity");
    const playerHasMagnet = hiber3d.hasComponents(playerEntity, "Magnet");
    if (playerHasMagnet && collisionUtils.collidesWithPlayerFlat(this.entity, this.MAGNET_ATTRACTION_RADIUS)) {

      const worldPosition = hiber3d.getValue(this.entity, "Hiber3D::ComputedWorldTransform", "position");
      const playerWorldPosition = vectorUtils.addVectors({x:0, y:0.5, z:0}, hiber3d.getValue(playerEntity, "Hiber3D::ComputedWorldTransform", "position"));

      const worldPositionDifference = vectorUtils.subtractVectors(playerWorldPosition, worldPosition);
      const worldPositionDirection = vectorUtils.normalizeVector(worldPositionDifference);
      const worldPositionDifferenceLength = vectorUtils.getVectorLength(worldPositionDifference);

      const magnetizeToMove = vectorUtils.multiplyVector(vectorUtils.normalizeVector(worldPositionDifference), dt * this.MAGNET_ATTRACTION_SPEED);
      const magnetizeToMoveLength = vectorUtils.getVectorLength(magnetizeToMove)
      const isOvershoot = magnetizeToMoveLength > worldPositionDifferenceLength;
      const distanceToMove = isOvershoot ? worldPositionDifferenceLength : magnetizeToMoveLength;

      const toMove = vectorUtils.multiplyVector(worldPositionDirection, distanceToMove);

      const newWorldPosition = vectorUtils.addVectors(worldPosition, toMove);
      const newLocalPosition = regUtils.worldToLocalPosition(this.entity, newWorldPosition);

      hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", newLocalPosition);

      this.MAGNET_ATTRACTION_SPEED += this.MAGNET_ATTRACTION_SPEED_ACCELERATION * dt;
    }
  },

  onEvent(event, payload) {
  }
});