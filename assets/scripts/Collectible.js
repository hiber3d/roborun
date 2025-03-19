({
  RADIUS: 0.75,
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
      var stats = regUtils.addComponentIfNotPresent(playerEntity, "Stats");
      stats.collectibles += 1;
      stats.multiplier = 1 + stats.collectibles / 100;
      hiber3d.setValue(playerEntity, "Stats", stats);
      hiber3d.writeEvent("BroadcastCollectiblePickup", {});
      regUtils.destroyEntity(this.entity);
    }
  },

  onEvent(event, payload) {
  }
});