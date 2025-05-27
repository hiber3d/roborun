import * as regUtils from "scripts/utils/RegUtils.js";
import * as roboRunUtils from "scripts/utils/RoboRunUtils.js";

export default class {
  onCreate() {
    hiber3d.addEventListener(this, "Hiber3D_CollisionStarted");
  }
  update() {
  }

  onEvent(event, payload) {
    if (event === "Hiber3D_CollisionStarted") {
      if (roboRunUtils.isPlayerCollision(this.entity, payload)) {
        const playerEntity = hiber3d.getSingleton("GameState", "playerEntity");

        var stats = regUtils.addComponentIfNotPresent(playerEntity, "Stats");
        stats.collectibles += 1;
        stats.multiplier = 1 + stats.collectibles / 100;
        hiber3d.setComponent(playerEntity, "Stats", stats);

        hiber3d.writeEvent("BroadcastCollectiblePickup", {});

        regUtils.destroyEntity(this.entity);
      }
    }
  }
}