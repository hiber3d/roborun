import * as vectorUtils from "scripts/utils/VectorUtils.js";
import * as regUtils from "scripts/utils/RegUtils.js";
import * as roboRunUtils from "scripts/utils/RoboRunUtils.js";

export class {
  // TODO: Move these into magnet and keep some factor here?
  MAGNET_ATTRACTION_SPEED = 30;
  MAGNET_ATTRACTION_SPEED_ACCELERATION = 25;
  latestDeltaTime = 0;
  onCreate() {
    hiber3d.addEventListener(this.entity, "Hiber3D::CollisionPersisted");
  }
  update(dt) {
    this.latestDeltaTime = dt;
  }
  onEvent(event, payload) {
    if (event === "Hiber3D::CollisionPersisted") {
      const otherEntityInCollision = roboRunUtils.getOtherEntityInCollision(this.entity, payload);
      if (otherEntityInCollision !== undefined && hiber3d.hasScripts(otherEntityInCollision, "scripts/powerups/MagnetCollider.js")) {

        const worldPosition = hiber3d.getComponent(this.entity, "Hiber3D::ComputedWorldTransform", "position");
        const otherWorldPosition = hiber3d.getComponent(otherEntityInCollision, "Hiber3D::ComputedWorldTransform", "position");
        if (worldPosition === undefined || otherWorldPosition === undefined) {
          return;
        }

        const worldPositionDifference = vectorUtils.subtractVectors(otherWorldPosition, worldPosition);
        const worldPositionDifferenceLength = vectorUtils.getVectorLength(worldPositionDifference);
        if (worldPositionDifferenceLength > 0.01) {
          const worldPositionDirection = vectorUtils.normalizeVector(worldPositionDifference);
          const magnetizeToMove = vectorUtils.multiplyVector(worldPositionDirection, this.MAGNET_ATTRACTION_SPEED * this.latestDeltaTime);
          const magnetizeToMoveLength = vectorUtils.getVectorLength(magnetizeToMove);

          const isOvershoot = magnetizeToMoveLength > worldPositionDifferenceLength;
          const distanceToMove = isOvershoot ? worldPositionDifferenceLength : magnetizeToMoveLength;

          const toMove = vectorUtils.multiplyVector(worldPositionDirection, distanceToMove);

          const newWorldPosition = vectorUtils.addVectors(worldPosition, toMove);
          const newLocalPosition = regUtils.worldToLocalPosition(this.entity, newWorldPosition);

          hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", newLocalPosition);
        }

        this.MAGNET_ATTRACTION_SPEED += this.MAGNET_ATTRACTION_SPEED_ACCELERATION * this.latestDeltaTime;
      }
    }
  }
}