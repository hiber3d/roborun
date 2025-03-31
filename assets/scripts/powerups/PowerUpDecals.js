({
  OUTRO_DURATION: 2,

  decals: {},

  clock: 0,
  hasDecals() {
    for (var i = 0; i < this.decals.length; i++) {
      if (this.decals[i] !== undefined) {
        return true;
      }
    }
    return false;
  },
  createDecal(powerUp, scene, maxDuration, scale) {
    if (this.decals[powerUp] !== undefined) {
      this.decals[powerUp].stopTime = this.clock + maxDuration;
      this.decals[powerUp].scale = scale;
      return;
    }
    const decalEntity = hiber3d.createEntity();
    hiber3d.addScript(decalEntity, "scripts/Rotate.js");
    hiber3d.addComponent(decalEntity, "Hiber3D::Transform");
    hiber3d.setValue(decalEntity, "Hiber3D::Transform", "position", { x: 0, y: 0.75, z: 0.25 });
    hiber3d.setValue(decalEntity, "Hiber3D::Transform", "scale", { x: scale, y: scale, z: scale });
    hiber3d.addComponent(decalEntity, "Hiber3D::SceneRoot");
    hiber3d.setValue(decalEntity, "Hiber3D::SceneRoot", "scene", scene);
    hiber3d.addComponent(decalEntity, "Hiber3D::Name");
    hiber3d.setValue(decalEntity, "Hiber3D::Name", "MagnetEffect");
    this.decals[powerUp] = { entity: decalEntity, stopTime: clock + maxDuration, scale: scale };
  },
  destroyDecal(powerUp) {
    if (this.decals[powerUp] === undefined) {
      return;
    }
    regUtils.destroyEntity(this.decals[powerUp]);
    this.decals[powerUp] = undefined;
    if (!this.hasDecals()) {
      hiber3d.removeScript(this.entity, "scripts/powerups/PowerUpDecals.js");
    }
  },
  onCreate() {

  },
  update(deltaTime) {
    this.clock += deltaTime;

    for (var i = 0; i < this.decals.length; i++) {
      const decal = this.decals[i];
      if (decal === undefined) {
        continue;
      }
      if (this.clock >= decal.stopTime) {
        if (!hiber3d.hasScript(this.entity, decal.powerUp)) {
          this.destroyDecal(decal.powerUp);
          continue;
        }
      }
      if (this.clock >= decal.stopTime - this.OUTRO_DURATION) {
        const outroStartTime = decal.stopTime - this.OUTRO_DURATION;
        const newScale = decal.scale * (1 - ((this.clock - outroStartTime) / this.OUTRO_DURATION));
        const safeScale = Math.max(0.001, newScale);
        hiber3d.setValue(this.effectEntity, "Hiber3D::Transform", "scale", { x: safeScale, y: safeScale, z: safeScale });
      }
    }
  },

  onEvent(event, payload) {
  }
});