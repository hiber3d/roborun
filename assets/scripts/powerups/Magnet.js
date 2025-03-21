// TODO: Will be used after [HIB-33606] and [HIB-33679]
({
  shouldRun() {
    const playerEntity = hiber3d.getValue("GameState", "playerEntity");
    return playerEntity !== undefined &&
      hiber3d.hasComponents(playerEntity, "Hiber3D::ComputedWorldTransform") &&
      hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform");
  },
  onCreate() {
  },
  update() {
    if (!this.shouldRun()) {
      return;
    }
  },
  onEvent(event, payload) {
  }
});