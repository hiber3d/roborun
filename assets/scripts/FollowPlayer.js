import * as vectorUtils from "scripts/utils/VectorUtils.js";
import * as quatUtils from "scripts/utils/QuatUtils.js";
import * as regUtils from "scripts/utils/RegUtils.js";

export default class {
  POSITION_LERP_FACTOR = 0.5; // 0: follow spline, 1: follow player
  shouldRun() {
    const playerEntity = hiber3d.getSingleton("GameState", "playerEntity");
    return (playerEntity !== undefined && playerEntity !== regUtils.NULL_ENTITY) &&
      hiber3d.hasComponents(playerEntity, "SplineData") &&
      hiber3d.hasComponents(playerEntity, "Hiber3D_Transform") &&
      hiber3d.hasComponents(this.entity, "Hiber3D_Transform");
  }
  onCreate() {
  }
  update(dt) {
    if (this.shouldRun() === false) {
      return;
    }
    const playerEntity = hiber3d.getSingleton("GameState", "playerEntity");
    const playerSplineData = hiber3d.getComponent(playerEntity, "SplineData");

    // Position
    const playerPosition = hiber3d.getComponent(playerEntity, "Hiber3D_Transform", "position");
    const splinePosition = playerSplineData.position;
    const lerpedPosition = vectorUtils.lerpVector(splinePosition, playerPosition, this.POSITION_LERP_FACTOR);
    hiber3d.setComponent(this.entity, "Hiber3D_Transform", "position", lerpedPosition);

    // Rotation
    const isPlayerOnPath = hiber3d.hasComponents(playerEntity, "OnPath");
    if (isPlayerOnPath) {
      const flatRotation = quatUtils.flattenQuaternion(playerSplineData.rotation);
      hiber3d.setComponent(this.entity, "Hiber3D_Transform", "rotation", flatRotation);
    }
  }
  onEvent(event, payload) {
  }
}