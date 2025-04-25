({
  onCreate() {
    hiber3d.addEventListener(this.entity, "Hiber3D::CollisionStarted");
  },
  update() {
  },

  onEvent(event, payload) {
    if (event === "Hiber3D::CollisionStarted") {
      if (roboRunUtils.isPlayerCollision(this.entity, payload)) {
        const playerEntity = hiber3d.getSingleton("GameState").playerEntity;

        var stats = regUtils.addComponentIfNotPresent(playerEntity, "Stats");
        stats.collectibles += 1;
        stats.multiplier = 1 + stats.collectibles / 100;
        hiber3d.setComponent(playerEntity, "Stats", stats);

        hiber3d.writeEvent("BroadcastCollectiblePickup", new globalThis["BroadcastCollectiblePickup"]());

        const parent = hiber3d.getParent(this.entity); // danger zone, replace after [HIB-33859]
        hiber3d.destroyEntity(parent);
      }
    }
  }
});