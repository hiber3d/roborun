({
  MAGNET_DURATION: 7.5,
  OUTRO_DURATION: 2,
  MAGNET_COLLIDER_OFFSET_HEIGHT: 1.0,
  MAGNET_EFFECT_SCALING_DURATION: 1,

  timeSinceStarted: 0,
  magnetColliderEntity: undefined,
  magnetEffectEntity: undefined,
  createMagnetCollider() {
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
  createMagnetEffect() {
    this.magnetEffectEntity = hiber3d.call("createEntityAsChild", this.entity);

    hiber3d.addComponent(this.magnetEffectEntity, "Hiber3D::Transform");

    hiber3d.addComponent(this.magnetEffectEntity, "Hiber3D::SceneRoot");
    const sceneRoot = hiber3d.getComponent(this.magnetEffectEntity, "Hiber3D::SceneRoot");
    sceneRoot.scene = "scenes/powerups/MagnetActivated.scene";
    hiber3d.setComponent(this.magnetEffectEntity, "Hiber3D::SceneRoot", sceneRoot);

    hiber3d.addComponent(this.magnetEffectEntity, "Hiber3D::Name");
    hiber3d.setComponent(this.magnetEffectEntity, "Hiber3D::Name", "MagnetEffect.scene");
  },
  updateMagnetEffectScale() {
    if (this.timeSinceStarted >= (this.MAGNET_DURATION - this.MAGNET_EFFECT_SCALING_DURATION)) {
      const newScale = 1 - ((this.timeSinceStarted - (this.MAGNET_DURATION - this.MAGNET_EFFECT_SCALING_DURATION)) / this.MAGNET_EFFECT_SCALING_DURATION);
      const transform = hiber3d.getComponent(this.magnetEffectEntity, "Hiber3D::Transform");
      const scale = transform.scale;
      scale.x = newScale;
      scale.y = newScale;
      scale.z = newScale;
      hiber3d.setComponent(this.magnetEffectEntity, "Hiber3D::Transform", transform);
      hiber3d.print("newScale: '" + newScale + "'");
    }
  },
  shouldRun() {
    return !hiber3d.getSingleton("GameState").paused;
  },
  onCreate() {
    this.createMagnetCollider();
    this.createMagnetEffect();
  },
  update(dt) {
    if (!this.shouldRun()) {
      return;
    }

    // Stop
    if (this.timeSinceStarted >= this.MAGNET_DURATION) {
      regUtils.destroyEntity(this.magnetColliderEntity);
      regUtils.destroyEntity(this.magnetEffectEntity);
      hiber3d.removeScript(this.entity, "scripts/powerups/Magnet.js");
    } else {
      this.updateMagnetEffectScale();
    }
    this.timeSinceStarted += dt;
  },
  onEvent(event, payload) {
  }
});