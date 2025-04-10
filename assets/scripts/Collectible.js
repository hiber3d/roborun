({
  RADIUS: 0.75,
  shouldRun() {
    const playerEntity = hiber3d.getValue("GameState", "playerEntity");
    return playerEntity !== undefined &&
      hiber3d.hasComponents(playerEntity, "Hiber3D::ComputedWorldTransform") &&
      hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform");
  },
  onCreate() {
    //hiber3d.addEventListener(this.entity, "Hiber3D::CollisionStarted");
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
      const parent = regUtils.getParent(this.entity);
      regUtils.destroyEntity(parent);
      regUtils.destroyEntity(this.entity);
    }
  },

  onEvent(event, payload) {
    /*if(event === "Hiber3D::CollisionStarted") {
      hiber3d.print("Collision");
    }*/
  }
});