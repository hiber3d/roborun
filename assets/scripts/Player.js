({
  onCreate() {
    hiber3d.writeEvent("PlayerCreated", { entity: this.entity });
    hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "idle", loop: true });

    if (!hiber3d.hasComponents(this.entity, "OnPath")) {
      hiber3d.addComponent(this.entity, "OnPath");
    }
    // TODO: This is not implemented yet
    //if (!hiber3d.hasComponents(this.entity, "AutoTurn")) {
    //  hiber3d.addComponent(this.entity, "AutoTurn");
    //}
  },
});