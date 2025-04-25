// TODO: Remove after [HIB-33915]
({
  onCreate() {
    const playerCreated = new PlayerCreated();
    playerCreated.entity = this.entity;
    hiber3d.writeEvent("PlayerCreated", playerCreated);
    const playAnimation = new PlayAnimation();
    playAnimation.entity = this.entity;
    playAnimation.name = "idle";
    playAnimation.layer = ANIMATION_LAYER.BASE;
    playAnimation.loop = true;
    hiber3d.writeEvent("PlayAnimation", playAnimation);

    if (!hiber3d.hasComponents(this.entity, "OnPath")) {
      hiber3d.addComponent(this.entity, "OnPath");
    }
  }
});