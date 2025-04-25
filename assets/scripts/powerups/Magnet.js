({
  MAGNET_DURATION: 7.5,
  OUTRO_DURATION: 2,
  EFFECT_SCALE: 0.1,
  MAGNET_COLLIDER_OFFSET_HEIGHT: 1.0,

  timeSinceStarted: 0,
  magnetColliderEntity: undefined,
  shouldRun() {
    return !hiber3d.getSingleton("GameState").paused;
  },
  onCreate() {
    this.magnetColliderEntity = hiber3d.call("createEntityAsChild", this.entity);

    hiber3d.addComponent(this.magnetColliderEntity, "Hiber3D::Transform");
    const transform = hiber3d.getComponent(this.magnetColliderEntity, "Hiber3D::Transform");
    transform.position.y = this.MAGNET_COLLIDER_OFFSET_HEIGHT;
    hiber3d.setComponent(this.magnetColliderEntity, "Hiber3D::Transform", transform);

    hiber3d.addComponent(this.magnetColliderEntity, "Hiber3D::SceneRoot");
    const sceneRoot = hiber3d.getComponent(this.magnetColliderEntity, "Hiber3D::SceneRoot");
    sceneRoot.scene = "scenes/powerups/MagnetCollider.scene";
    hiber3d.setComponent(this.magnetColliderEntity, "Hiber3D::SceneRoot", sceneRoot);

    hiber3d.addComponent(this.magnetColliderEntity, "Hiber3D::Name");
    hiber3d.setComponent(this.magnetColliderEntity, "Hiber3D::Name", "MagnetCollider.scene");
  },
  update(dt) {
    if (!this.shouldRun()) {
      return;
    }

    // Stop
    if (this.timeSinceStarted >= this.MAGNET_DURATION) {
      hiber3d.destroyEntity(this.magnetColliderEntity);
      hiber3d.removeScript(this.entity, "scripts/powerups/Magnet.js");
    }
    this.timeSinceStarted += dt;
  },
  onEvent(event, payload) {
  }
});