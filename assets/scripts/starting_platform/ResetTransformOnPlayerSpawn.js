import * as vectorUtils from "scripts/utils/VectorUtils.js";
import * as quatUtils from "scripts/utils/QuatUtils.js";
import * as regUtils from "scripts/utils/RegUtils.js";

export default class {
  POSITION_SPEED = 0.01;
  ROTATION_SPEED = 0.05;
  shouldLerpToZero() {
    const playerEntity = hiber3d.getSingleton("GameState", "playerEntity");
    return !regUtils.isNullEntity(playerEntity) &&
      hiber3d.hasComponents(playerEntity, "Hiber3D_ComputedWorldTransform") &&
      hiber3d.hasComponents(this.entity, "Hiber3D_ComputedWorldTransform");
  }
  onCreate() {
  }
  update(dt) {
    if(!this.shouldLerpToZero()) {
      return;
    }
    var transform = hiber3d.getComponent(this.entity, "Hiber3D_Transform");
    transform.position = vectorUtils.divideVector(transform.position, 1 + this.POSITION_SPEED);

    const realRotation = { x: transform.rotation.x, y: transform.rotation.y, z: transform.rotation.z };
    const scaledRealedRotation = vectorUtils.divideVector(realRotation, 1 + this.ROTATION_SPEED);
    const scaledRotation = { x: scaledRealedRotation.x, y: scaledRealedRotation.y, z: scaledRealedRotation.z, w: transform.rotation.w };
    const normalizedScaledRotation = quatUtils.normalizeQuaternion(scaledRotation);
    transform.rotation = normalizedScaledRotation;

    hiber3d.setComponent(this.entity, "Hiber3D_Transform", transform);
  }
  onEvent(event, payload) {
  }
}