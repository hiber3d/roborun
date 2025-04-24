({
  DISTANCE: 50,
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
    const playerPosition = hiber3d.getValue(playerEntity, "Hiber3D::ComputedWorldTransform", "position");
    const position = hiber3d.getValue(this.entity, "Hiber3D::ComputedWorldTransform", "position");
    if (!vectorUtils.inRange(playerPosition, position, this.DISTANCE)) {
      regUtils.destroyEntity(this.entity);
    }
  },
  onEvent(event, payload) {
  }
});