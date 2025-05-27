import ANIMATION_LAYER from "scripts/state/AnimationLayers.js";
import * as regUtils from "scripts/utils/RegUtils.js";
import * as roboRunUtils from "scripts/utils/RoboRunUtils.js";
import * as segUtils from "scripts/utils/SegUtils.js";

export default class {
  DIVE_DURATION = 0.5;
  DIVE_SPEED_BASE = 1;
  DIVE_SPEED_ACCELERATION = 20;

  diveStartHeight = 0;
  timeSpentDivingInAir = 0;
  timeSpentDivingOnGround = 0;
  shouldRun() {
    return hiber3d.hasComponents(this.entity, "Hiber3D_ComputedWorldTransform") &&
      hiber3d.getSingleton("GameState", "alive") &&
      !hiber3d.getSingleton("GameState", "paused") &&
      segUtils.getCurrentStepEntity() !== undefined;
  }
  getDeltaHeight() {
    return Math.min(1, 1 - Math.pow(1 + this.DIVE_SPEED_BASE, this.timeSpentDivingInAir * this.DIVE_SPEED_ACCELERATION));
  }
  onCreate() {
    hiber3d.addEventListener(this, "DiveInput");
    
    regUtils.removeScriptIfPresent(this.entity, "scripts/Jumping.js");
    regUtils.removeScriptIfPresent(this.entity, "scripts/powerups/AutoRun.js");

    this.diveStartHeight = hiber3d.getComponent(this.entity, "Hiber3D_Transform", "position", "y");

    hiber3d.writeEvent("CancelAnimation", { entity: this.entity, name: "jump" });
    hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "dive", layer: ANIMATION_LAYER.ROLL, loop: true });
    hiber3d.writeEvent("DivedEvent", { entity: this.entity });
  }
  update(dt) {
    if (!this.shouldRun()) {
      return;
    }

    if (roboRunUtils.isInAir(this.entity, hiber3d.getComponent(this.entity, "Hiber3D_Transform", "position", "y"))) {
      const newDeltaHeight = this.getDeltaHeight();
      const newDiveHeight = this.diveStartHeight + newDeltaHeight;

      if (roboRunUtils.isInAir(this.entity, newDiveHeight)) {
        hiber3d.setComponent(this.entity, "Hiber3D_Transform", "position", "y", newDiveHeight);
      } else {
        // landed
        hiber3d.writeEvent("LandedEvent", { entity: this.entity });
        hiber3d.setComponent(this.entity, "Hiber3D_Transform", "position", "y", roboRunUtils.getSplineHeight(this.entity));
      }

      this.timeSpentDivingInAir += dt;
    } else {
      this.timeSpentDivingOnGround += dt;
        hiber3d.setComponent(this.entity, "Hiber3D_Transform", "position", "y", roboRunUtils.getSplineHeight(this.entity));
      if (this.timeSpentDivingOnGround >= this.DIVE_DURATION) {
        hiber3d.writeEvent("CancelAnimation", { entity: this.entity, name: "dive" });
        hiber3d.removeScript(this.entity, "scripts/Diving.js");
      }
    }

  }
  onEvent(event, payload) {
  }
}