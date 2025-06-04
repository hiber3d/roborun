import ANIMATION_LAYER from "scripts/state/AnimationLayers.js";

export default class {
  pausedLastTick = true;
  onCreate() {
  }
  update() {
    if (!hiber3d.getSingleton("GameState", "alive") ||
    !hiber3d.hasComponents(this.entity, "Hiber3D::Transform")) {
      return;
    }
    // TODO: Make event
    const pausedThisTick = hiber3d.getSingleton("GameState", "paused");
    if (this.pausedLastTick === true && pausedThisTick === false) {
      hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "run", layer: ANIMATION_LAYER.BASE, loop: true });
    }
    if (this.pausedLastTick === false && pausedThisTick === true) {
      hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "idle", layer: ANIMATION_LAYER.BASE, loop: true });
    }
    this.pausedLastTick = pausedThisTick;
    if (pausedThisTick === true) {
      return;
    }
  }
}