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
});