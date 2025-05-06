({
  shouldRun() {
    return hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform");
  },
  onCreate() {
  },
  update(dt) {
    if (!this.shouldRun()) {
      return;
    }
    // Don't pass mid-line 
    var worldPosition = hiber3d.getComponent(this.entity, "Hiber3D::ComputedWorldTransform").position;
    if (worldPosition.x > 0) {
      hiber3d.removeScript(this.entity, "scripts/Move.js");
      worldPosition.x = 0;
      const transform = hiber3d.getComponent(this.entity, "Hiber3D::Transform");
      transform.position = regUtils.worldToLocalPosition(this.entity, worldPosition);
      hiber3d.setComponent(this.entity, "Hiber3D::Transform", transform);
    }
  },
  onEvent(event, payload) {
  }
});