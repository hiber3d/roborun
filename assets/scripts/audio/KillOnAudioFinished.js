({
  onCreate() {
  },
  onUpdate(dt) {
    if (!hiber3d.hasComponents(this.entity, "Hiber3D::AudioComponent")) {
      // TODO: Destroy this.entity entity here!
    }
  },
  onEvent(event, payload) {
  }
});