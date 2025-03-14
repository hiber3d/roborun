({
  onCreate() {
    hiber3d.addEventListener(this.entity, "Hiber3D::DeviceOrientationEvent");
    hiber3d.writeEvent("PlayerCreated", { entity: this.entity });
    hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "idle", layer: ANIMATION_LAYER.BASE, loop: true });

    if (!hiber3d.hasComponents(this.entity, "OnPath")) {
      hiber3d.addComponent(this.entity, "OnPath");
    }
    // TODO: This is not implemented yet
    //if (!hiber3d.hasComponents(this.entity, "AutoTurn")) {
    //  hiber3d.addComponent(this.entity, "AutoTurn");
    //}
  },
  onEvent(event, payload) {
    if (event === "Hiber3D::DeviceOrientationEvent") {
      hiber3d.setValue(this.entity, "Hiber3D::Transform", "scale", "x", payload.alpha / 30);
      hiber3d.setValue(this.entity, "Hiber3D::Transform", "scale", "y", payload.beta / 30);
      hiber3d.setValue(this.entity, "Hiber3D::Transform", "scale", "z", payload.gamma / 30);
    }
  }
});