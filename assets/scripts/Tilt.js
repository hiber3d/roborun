import ANIMATION_LAYER from "../state/AnimationLayers.js";
import * as regUtils from "scripts/utils/RegUtils.js";
import * as segUtils from "scripts/utils/SegUtils.js";

export class {
  TILT_ENABLED = true;
  SECONDS_TO_TILT = 0.1;

  tiltFactor = 0;
  tiltFactorPreviousTick = 0;
  lerpedTiltFactorPreviousTick = 0;
  shouldRun() {
    return this.TILT_ENABLED &&
      hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform") &&
      (hiber3d.hasComponents(this.entity, "OnPath") || hiber3d.hasScripts(this.entity, "scripts/powerups/AutoRun.js")) &&
      hiber3d.getSingleton("GameState", "alive") &&
      !hiber3d.getSingleton("GameState", "paused") &&
      segUtils.getCurrentStepEntity() !== undefined;
  }
  onCreate() {
    hiber3d.addEventListener(this.entity, "LeftLaneInput");
    hiber3d.addEventListener(this.entity, "RightLaneInput");
  }
  update(dt) {
    if (!this.shouldRun()) {
      return;
    }

    const lerpedTiltFactor = this.lerpedTiltFactorPreviousTick + (this.tiltFactor - this.lerpedTiltFactorPreviousTick) * dt / this.SECONDS_TO_TILT;
    regUtils.addComponentIfNotPresent(this.entity, "TiltFactor")
    hiber3d.setValue(this.entity, "TiltFactor", "factor", lerpedTiltFactor);

    if (
      this.tiltFactor < 0 && this.tiltFactorPreviousTick === 0 ||
      this.tiltFactor < 1 && this.tiltFactorPreviousTick === 1) {
      hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "tiltLeft", layer: ANIMATION_LAYER.ACTION, loop: false });
      hiber3d.writeEvent("BroadcastTilted", {})
    } else if (
      this.tiltFactor > 0 && this.tiltFactorPreviousTick === 0 ||
      this.tiltFactor > -1 && this.tiltFactorPreviousTick === -1) {
      hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "tiltRight", layer: ANIMATION_LAYER.ACTION, loop: false });
      hiber3d.writeEvent("BroadcastTilted", {})

    }

    this.tiltFactorPreviousTick = this.tiltFactor;
    this.lerpedTiltFactorPreviousTick = lerpedTiltFactor;
  }
  onEvent(event, payload) {
    if (hiber3d.hasComponents(this.entity, "OnPath")) {
      if (event === "LeftLaneInput") {
        this.tiltFactor = Math.max(-1, this.tiltFactor - 1);
      } else if (event === "RightLaneInput") {
        this.tiltFactor = Math.min(1, this.tiltFactor + 1);
      }
    }
  }
}