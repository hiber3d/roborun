({
  SLIDE_DURATION: 0.5,
  timeSpentSliding: 0,
  shouldRun() {
    const gameState = hiber3d.getSingleton("GameState");
    return hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform") &&
      gameState.alive &&
      !gameState.paused &&
      !regUtils.isNullEntity(segUtils.getCurrentStepEntity());
  },
  onCreate() {
    const playAnimation = new PlayAnimation();
    playAnimation.entity = this.entity; playAnimation.name = "slide"; playAnimation.layer = ANIMATION_LAYER.ROLL; playAnimation.loop = true;
    hiber3d.writeEvent("PlayAnimation", playAnimation);
  },
  update(dt) {
    if (!this.shouldRun()) {
      return;
    }
    if (this.timeSpentSliding === 0) {
      hiber3d.writeEvent("BroadcastSlided", new BroadcastSlided());
    }
    this.timeSpentSliding += dt;
    if (this.timeSpentSliding >= this.SLIDE_DURATION) {
      const cancelAnimation = new CancelAnimation();
      cancelAnimation.entity = this.entity; cancelAnimation.name = "slide";
      hiber3d.writeEvent("CancelAnimation", cancelAnimation);
      hiber3d.removeScript(this.entity, "scripts/Sliding.js");
    }
  },
  onEvent(event, payload) { }
});