import * as quatUtils from "scripts/utils/QuatUtils.js";

// TODO: Does this still work?
latestRotationOffset = 0;

export default class {
  REVOLUTION_TIME = 2;

  timeSinceStart = 0;
  onCreate() {
    const averageOffset = 1;
    const randomOffset = 4 * Math.random();
    const offsetScale = 0.1;
    latestRotationOffset -= (averageOffset + (-randomOffset + 2 * randomOffset * Math.random())) * offsetScale;
    this.timeSinceStart = latestRotationOffset; // Prevent all objects from moving in sync
  }

  update(dt) {
    if (!hiber3d.hasComponents(this.entity, "Hiber3D_Transform")) {
      return;
    }
    const progress = Math.cos(this.timeSinceStart / this.REVOLUTION_TIME);
    var rotation = { x: 0, y: 0, z: 0, w: 1 };
    rotation = quatUtils.rotateQuaternionAroundY(rotation, progress);
    hiber3d.setValue(this.entity, "Hiber3D_Transform", "rotation", rotation);
    this.timeSinceStart += dt;
  }

  onEvent(event, payload) {
  }
}