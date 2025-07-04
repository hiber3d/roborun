({
  onCreate() {
    hiber3d.addEventListener(this.entity, "Hiber3D::CollisionStarted");
  },
  update() {
  },

  onEvent(event, payload) {
    if (event === "Hiber3D::CollisionStarted") {
      if (roboRunUtils.isPlayerCollision(this.entity, payload)) {
        const playerEntity = hiber3d.getValue("GameState", "playerEntity");

        var stats = regUtils.addComponentIfNotPresent(playerEntity, "Stats");
        stats.collectibles += 1;
        stats.multiplier = 1 + stats.collectibles / 100;
        hiber3d.setValue(playerEntity, "Stats", stats);

        hiber3d.writeEvent("BroadcastCollectiblePickup", {});

        regUtils.destroyEntity(this.entity);
      }
    }
  }
});