({
  onCreate() {
  },
  update(dt) {
    if (!hiber3d.hasComponents(this.entity, "Hiber3D::AudioComponent")) {
      hiber3d.destroyEntity(this.entity);
    }
    else if (hiber3d.hasComponents(this.entity, "Hiber3D::AudioComponent")) {
      if (hiber3d.getValue(this.entity, "Hiber3D::AudioComponent", "isFinished")) {
        hiber3d.destroyEntity(this.entity);
      }
    }
  },
  onEvent(event, payload) {
  }
});