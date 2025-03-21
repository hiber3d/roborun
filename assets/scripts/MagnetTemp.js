// This script will become obsolete and will be removed after [HIB-33606] and [HIB-33679]
({
  MAGNET_DURATION: 3,
  OUTRO_DURATION: 2,
  EFFECT_SCALE: 0.1,

  effectEntity: undefined,
  shouldRun() {
    return hiber3d.hasComponents(this.entity, "Magnet") && !hiber3d.getValue("GameState", "paused");
  },
  onCreate() {
  },
  update(dt) {
    if (!this.shouldRun()) {
      return;
    }
    const timeSinceStarted = hiber3d.getValue(this.entity, "Magnet", "timeSinceStarted");

    // Start
    if (timeSinceStarted === 0) {
      if (this.effectEntity !== undefined) {
        regUtils.destroyEntity(this.effectEntity);
      }
      this.effectEntity = regUtils.createChildToParent(this.entity);
      hiber3d.addScript(this.effectEntity, "scripts\\Rotate.js");
      hiber3d.addComponent(this.effectEntity, "Hiber3D::Transform");
      hiber3d.setValue(this.effectEntity, "Hiber3D::Transform", "position", { x: 0, y: 0.75, z: 0.25 });
      hiber3d.setValue(this.effectEntity, "Hiber3D::Transform", "scale", { x: this.EFFECT_SCALE, y: this.EFFECT_SCALE, z: this.EFFECT_SCALE});
      hiber3d.addComponent(this.effectEntity, "Hiber3D::SceneRoot");
      hiber3d.setValue(this.effectEntity, "Hiber3D::SceneRoot", "scene", "glbs\\powerups\\PowerUp_magnet.glb#scene0");
      hiber3d.addComponent(this.effectEntity, "Hiber3D::Name");
      hiber3d.setValue(this.effectEntity, "Hiber3D::Name", "MagnetEffect");
    }

    if (timeSinceStarted >= this.MAGNET_DURATION - this.OUTRO_DURATION) {
      const newScale = this.EFFECT_SCALE * (1 - ((timeSinceStarted - (this.MAGNET_DURATION - this.OUTRO_DURATION)) / this.OUTRO_DURATION));
      const safeScale = Math.max(0.001, newScale);
      hiber3d.setValue(this.effectEntity, "Hiber3D::Transform", "scale", { x: safeScale, y: safeScale, z: safeScale });
    }

    // Stop
    if (timeSinceStarted >= this.MAGNET_DURATION) {
      regUtils.destroyEntity(this.effectEntity);
      hiber3d.removeComponent(this.entity, "Magnet");
    }

    hiber3d.setValue(this.entity, "Magnet", "timeSinceStarted", timeSinceStarted + dt);
  },
  onEvent(event, payload) {
  }
});