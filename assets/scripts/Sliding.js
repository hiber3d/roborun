({
  SLIDE_DURATION: 0.5,
  timeSpentSliding: 0,
  shouldRun() {
    const gameState = hiber3d.getSingleton("GameState");
    return hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform") &&
      gameState.alive &&
      !gameState.paused &&
      segUtils.getCurrentStepEntity() !== undefined;
  },
  onCreate() {
    hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "slide", layer: ANIMATION_LAYER.ROLL, loop: true });
    hiber3d.writeEvent("BroadcastSlided", {})
  },
  update(dt) {
    if (!this.shouldRun()) {
      return;
    }
    this.timeSpentSliding += dt;
    if (this.timeSpentSliding >= this.SLIDE_DURATION) {
      hiber3d.writeEvent("CancelAnimation", { entity: this.entity, name: "slide" });
      hiber3d.removeScript(this.entity, "scripts/Sliding.js");
    }
  },
  onEvent(event, payload) { }
});