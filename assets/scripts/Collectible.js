import * as regUtils from "scripts/utils/RegUtils.js";
import * as roboRunUtils from "scripts/utils/RoboRunUtils.js";
import * as registry from "hiber3d:registry";

export default class {
  onCreate() {
    hiber3d.addEventListener(this, "Hiber3D::CollisionStarted");
  }
  onUpdate() {
  }

  onEvent(event, payload) {
    if (event === "Hiber3D::CollisionStarted") {
      if (roboRunUtils.isPlayerCollision(this.entity, payload)) {
        const playerEntity = hiber3d.getSingleton("GameState", "playerEntity");

        var stats = regUtils.addComponentIfNotPresent(playerEntity, "Stats");
        stats.collectibles += 1;
        stats.multiplier = 1 + stats.collectibles / 100;
        hiber3d.setComponent(playerEntity, "Stats", stats);

        hiber3d.writeEvent("BroadcastCollectiblePickup", {});

        registry.destroyEntity(this.entity);
      }
    }
  }
}