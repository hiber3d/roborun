({
  pausedLastTick: true,
  onCreate() {
  },
  update() {
    if (!hiber3d.getValue("GameState", "alive") ||
    !hiber3d.hasComponents(this.entity, "Hiber3D::Transform")) {
      return;
    }
    // TODO: Make event
    const pausedThisTick = hiber3d.getValue("GameState", "paused");
    if (this.pausedLastTick === true && pausedThisTick === false) {
      hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "run", loop: true });
    }
    if (this.pausedLastTick === false && pausedThisTick === true) {
      hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "idle", loop: true });
    }
    this.pausedLastTick = pausedThisTick;
    if (pausedThisTick === true) {
      return;
    }
  }
});