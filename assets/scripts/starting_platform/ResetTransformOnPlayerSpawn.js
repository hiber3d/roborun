({
  POSITION_SPEED: 0.1, // [0, 1]
  ROTATION_SPEED: 0.1,
  shouldLerpToZero() {
    const playerEntity = hiber3d.getValue("GameState", "playerEntity");
    return playerEntity !== undefined &&
      hiber3d.hasComponents(playerEntity, "Hiber3D::ComputedWorldTransform") &&
      hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform");
  },
  onCreate() {
  },
  update(dt) {
    if(!this.shouldLerpToZero()) {
      return;
    }
    var transform = hiber3d.getValue(this.entity, "Hiber3D::Transform");
    transform.position = vectorUtils.divideVector(transform.position, 1 + this.POSITION_SPEED);

    const realRotation = { x: transform.rotation.x, y: transform.rotation.y, z: transform.rotation.z };
    const scaledRealedRotation = vectorUtils.divideVector(realRotation, 1 + this.ROTATION_SPEED);
    const scaledRotation = { x: scaledRealedRotation.x, y: scaledRealedRotation.y, z: scaledRealedRotation.z, w: transform.rotation.w };
    const normalizedScaledRotation = quatUtils.normalizeQuaternion(scaledRotation);
    transform.rotation = normalizedScaledRotation;

    hiber3d.setValue(this.entity, "Hiber3D::Transform", transform);
  },
  onEvent(event, payload) {
  }
});