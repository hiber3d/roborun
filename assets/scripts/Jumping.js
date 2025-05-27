import ANIMATION_LAYER from "../state/AnimationLayers.js";
import * as regUtils from "scripts/utils/RegUtils.js";
import * as roboRunUtils from "scripts/utils/RoboRunUtils.js";
import * as segUtils from "scripts/utils/SegUtils.js";

export default class {
  timeSinceJumped = 0;
  startHeight = 0;
  shouldRun() {
    return hiber3d.hasComponents(this.entity, "Hiber3D_ComputedWorldTransform") &&
      hiber3d.getSingleton("GameState", "alive") &&
      !hiber3d.getSingleton("GameState", "paused") &&
      segUtils.getCurrentStepEntity() !== undefined;
  }
  getDeltaHeight() {
    const maxHeight = 2.5;
    const timeToMaxHeight = 0.2;
    const maxHeightDuration = 0.15; // How long to stay at max height
    const gravityStrength = 30.0; // Increased for faster fall once it begins

    if (this.timeSinceJumped <= 0) {
      return 0;
    } else if (this.timeSinceJumped <= timeToMaxHeight) {
      // Rising phase - smooth quadratic rise to max height
      return maxHeight * (this.timeSinceJumped / timeToMaxHeight) * (2 - (this.timeSinceJumped / timeToMaxHeight));
    } else if (this.timeSinceJumped <= timeToMaxHeight + maxHeightDuration) {
      // Plateau phase - maintain max height
      return maxHeight;
    } else {
      // Falling phase - rapid fall after plateau
      const timeInFall = Math.max(0, this.timeSinceJumped - (timeToMaxHeight + maxHeightDuration));
      result = maxHeight - gravityStrength * Math.pow(timeInFall, 2);
      return result;
    }
  }
  onCreate() {
    if (roboRunUtils.isAutoRunGround(this.entity)) {
      regUtils.removeScriptIfPresent(this.entity, "scripts/powerups/AutoRun.js");
    }
    regUtils.removeScriptIfPresent(this.entity, "scripts/Diving.js");

    this.startHeight = hiber3d.getComponent(this.entity, "Hiber3D_Transform", "position", "y");

    hiber3d.writeEvent("CancelAnimation", { entity: this.entity, name: "slide" });
    hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "jump", layer: ANIMATION_LAYER.ACTION, loop: false });
    hiber3d.writeEvent("QueueAnimation", { playAnimation: { entity: this.entity, name: "fall", layer: ANIMATION_LAYER.FALL, loop: true } });
    hiber3d.writeEvent("JumpedEvent", { entity: this.entity });
  }
  update(dt) {
    if (!this.shouldRun()) {
      return;
    }
    
    this.timeSinceJumped += dt;
    const newJumpHeight = this.startHeight + this.getDeltaHeight();

    if (roboRunUtils.isInAir(this.entity, newJumpHeight)) {
      hiber3d.setValue(this.entity, "Hiber3D_Transform", "position", "y", newJumpHeight);
    } else {
      // landed
      hiber3d.writeEvent("CancelAnimation", { entity: this.entity, name: "fall" });
      hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "land", layer: ANIMATION_LAYER.ACTION, loop: false });
      hiber3d.writeEvent("LandedEvent", { entity: this.entity });
      hiber3d.setValue(this.entity, "Hiber3D_Transform", "position", "y", roboRunUtils.getSplineHeight(this.entity));
      
      hiber3d.removeScript(this.entity, "scripts/Jumping.js");
    }
  }
  onEvent(event, payload) {
  }
}