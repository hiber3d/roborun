({
  onCreate() {
  },
  onUpdate(dt) {
    if (!hiber3d.hasComponents(this.entity, "Hiber3D::AudioComponent")) {
      // TODO: Destroy this.entity entity here!
    }
    else if (hiber3d.hasComponents(this.entity, "Hiber3D::AudioComponent")) {
      if (hiber3d.getValue(this.entity, "Hiber3D::AudioComponent", "isFinished"));
      // TODO: Destroy this.entity entity here!
    }
  },
  onEvent(event, payload) {
  }
});