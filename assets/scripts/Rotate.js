latestRotationOffset = 0;

({
  REVOLUTION_TIME: 2,

  timeSinceStart: 0,
  onCreate() {
    const averageOffset = 1;
    const randomOffset = 4 * Math.random();
    const offsetScale = 0.1;
    latestRotationOffset -= (averageOffset + (-randomOffset + 2 * randomOffset * Math.random())) * offsetScale;
    this.timeSinceStart = latestRotationOffset; // Prevent all objects from moving in sync
  },

  update(dt) {
    if (!hiber3d.hasComponents(this.entity, "Hiber3D::Transform")) {
      return;
    }
    const progress = Math.cos(this.timeSinceStart / this.REVOLUTION_TIME);
    const transform = hiber3d.getComponent(this.entity, "Hiber3D::Transform");
    transform.rotation = quatUtils.rotateQuaternionAroundY(new globalThis["Hiber3D::Quaternion"](), progress);
    hiber3d.setComponent(this.entity, "Hiber3D::Transform", transform);
    this.timeSinceStart += dt;
  },

  onEvent(event, payload) {
  }
});