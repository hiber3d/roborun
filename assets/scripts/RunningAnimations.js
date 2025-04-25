({
  pausedLastTick: true,
  onCreate() {
  },
  update() {
    const gameState = hiber3d.getSingleton("GameState");
    if (!gameState.alive ||
      !hiber3d.hasComponents(this.entity, "Hiber3D::Transform")) {
      return;
    }
    // TODO: Make event
    const pausedThisTick = gameState.paused;
    if (this.pausedLastTick === true && pausedThisTick === false) {
      const playAnimation = new PlayAnimation();
      playAnimation.entity = this.entity; playAnimation.name = "run"; playAnimation.layer = ANIMATION_LAYER.BASE; playAnimation.loop = true;
      hiber3d.writeEvent("PlayAnimation", playAnimation);
    }
    if (this.pausedLastTick === false && pausedThisTick === true) {
      const playAnimation = new PlayAnimation();
      playAnimation.entity = this.entity; playAnimation.name = "idle"; playAnimation.layer = ANIMATION_LAYER.BASE; playAnimation.loop = true;
      hiber3d.writeEvent("PlayAnimation", playAnimation);
    }
    this.pausedLastTick = pausedThisTick;
    if (pausedThisTick === true) {
      return;
    }
  }
});