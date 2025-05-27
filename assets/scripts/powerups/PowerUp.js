import * as regUtils from "scripts/utils/RegUtils.js";
import * as roboRunUtils from "scripts/utils/RoboRunUtils.js";

export default class {
  // TODO: Temorary solution until we can save modified script values in editor
  POWER_UPS = {
    "scenes/powerups/PowerUpAutoRun.scene": "scripts/powerups/AutoRun.js",
    "scenes/powerups/PowerUpMagnet.scene": "scripts/powerups/Magnet.js"
  };
  getScriptPath() {
    const name = hiber3d.getComponent(this.entity, "Hiber3D::Name");
    const path = this.POWER_UPS[name];
    if (path === undefined) {
      hiber3d.print("PowerUp.js - getScriptPath() - Unknown power-up name: " + name);
    }
    return path;
  }
  onCreate() {
    hiber3d.addEventListener(this.entity, "Hiber3D::CollisionStarted");
  }
  update() {
  }
  onEvent(event, payload) {
    if (event === "Hiber3D::CollisionStarted") {
      if (roboRunUtils.isPlayerCollision(this.entity, payload)) {
        const playerEntity = hiber3d.getSingleton("GameState", "playerEntity");
        const scriptPath = this.getScriptPath();
        if (hiber3d.hasScripts(playerEntity, scriptPath)) {
          // TODO: Remove after [HIB-33909]
          var script = hiber3d.getScript(playerEntity, scriptPath);
          script.timeSinceStarted = 0;
        } else {
          regUtils.addOrReplaceScript(playerEntity, scriptPath);
        }
        hiber3d.writeEvent("BroadcastPowerupPickup", {});

        // Destroy this power-up
        regUtils.destroyEntity(this.entity);
      }
    }
  }
}