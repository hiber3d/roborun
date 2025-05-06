({
  DIRECTION: { x: 1, y: 0, z: 0 },
  SPEED: 1.5,

  shouldRun() {
    return hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform");
  },
  onCreate() {
  },
  update(dt) {
    if(!this.shouldRun()) {
      return;
    }
    const transform = hiber3d.getComponent(this.entity, "Hiber3D::Transform");
    transform.position = vectorUtils.addVectors(position, vectorUtils.multiplyVector(this.DIRECTION, this.SPEED * dt)); 
    hiber3d.setComponent(this.entity, "Hiber3D::Transform", transform);
  },
  onEvent(event, payload) {
  }
});