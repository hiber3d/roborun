import * as regUtils from "scripts/utils/RegUtils.js";

export default class {
  MAGNET_DURATION = 7.5;
  OUTRO_DURATION = 2;
  MAGNET_COLLIDER_OFFSET_HEIGHT = 1.0;
  MAGNET_EFFECT_SCALING_DURATION = 1;

  timeSinceStarted = 0;
  magnetColliderEntity = undefined;
  magnetEffectEntity = undefined;
  createMagnetCollider() { 
    this.magnetColliderEntity = hiber3d.call("createEntityAsChild", this.entity);

    hiber3d.addComponent(this.magnetColliderEntity, "Hiber3D_Transform");
    hiber3d.setComponent(this.magnetColliderEntity, "Hiber3D_Transform", "position", "y", this.MAGNET_COLLIDER_OFFSET_HEIGHT);

    hiber3d.addComponent(this.magnetColliderEntity, "Hiber3D_SceneInstance");
    hiber3d.setComponent(this.magnetColliderEntity, "Hiber3D_SceneInstance", "scene", "scenes/powerups/MagnetCollider.scene");

    hiber3d.addComponent(this.magnetColliderEntity, "Hiber3D_Name");
    hiber3d.setComponent(this.magnetColliderEntity, "Hiber3D_Name", "MagnetCollider.scene");
  }
  createMagnetEffect() {
    this.magnetEffectEntity = hiber3d.call("createEntityAsChild", this.entity);

    hiber3d.addComponent(this.magnetEffectEntity, "Hiber3D_Transform");

    hiber3d.addComponent(this.magnetEffectEntity, "Hiber3D_SceneInstance");
    hiber3d.setComponent(this.magnetEffectEntity, "Hiber3D_SceneInstance", "scene", "scenes/powerups/MagnetActivated.scene");

    hiber3d.addComponent(this.magnetEffectEntity, "Hiber3D_Name");
    hiber3d.setComponent(this.magnetEffectEntity, "Hiber3D_Name", "MagnetEffect.scene");
  }
  updateMagnetEffectScale() {
    if (this.timeSinceStarted >= (this.MAGNET_DURATION - this.MAGNET_EFFECT_SCALING_DURATION)) {
      const newScale = 1 - ((this.timeSinceStarted - (this.MAGNET_DURATION - this.MAGNET_EFFECT_SCALING_DURATION)) / this.MAGNET_EFFECT_SCALING_DURATION);
      hiber3d.setComponent(this.magnetEffectEntity, "Hiber3D_Transform", "scale", { x: newScale, y: newScale, z: newScale });
    }
  }
  shouldRun() {
    return !hiber3d.getSingleton("GameState", "paused");
  }
  onCreate() {
    this.createMagnetCollider();
    this.createMagnetEffect();
  }
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
  }
  onEvent(event, payload) {
  }
}