// TODO: Remove after [HIB-33915]
({
  onCreate() {
    hiber3d.writeEvent("PlayerCreated", { entity: this.entity });
    hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "idle", layer: ANIMATION_LAYER.BASE, loop: true });

    if (!hiber3d.hasComponents(this.entity, "OnPath")) {
      hiber3d.addComponent(this.entity, "OnPath");
    }
  }
});