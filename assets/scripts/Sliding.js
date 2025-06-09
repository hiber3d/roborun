import ANIMATION_LAYER from "scripts/state/AnimationLayers.js";
import * as segUtils from "scripts/utils/SegUtils.js";

export default class {
  SLIDE_DURATION = 0.5;
  timeSpentSliding = 0;
  shouldRun() {
    return hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform") &&
      hiber3d.getSingleton("GameState", "alive") &&
      !hiber3d.getSingleton("GameState", "paused") &&
      registry.isValid(segUtils.getCurrentStepEntity());
  }
  onCreate() {
    hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "slide", layer: ANIMATION_LAYER.ROLL, loop: true });
  }
  onUpdate(dt) {
    if (!this.shouldRun()) {
      return;
    }
    if (this.timeSpentSliding === 0) {
      hiber3d.writeEvent("BroadcastSlided", {})
    }
    this.timeSpentSliding += dt;
    if (this.timeSpentSliding >= this.SLIDE_DURATION) {
      hiber3d.writeEvent("CancelAnimation", { entity: this.entity, name: "slide" });
      hiber3d.removeScript(this.entity, "scripts/Sliding.js");
    }
  }
  onEvent(event, payload) { }
}