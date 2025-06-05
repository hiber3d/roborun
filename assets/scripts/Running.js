import * as vectorUtils from "scripts/utils/VectorUtils.js";
import * as quatUtils from "scripts/utils/QuatUtils.js";
import * as regUtils from "scripts/utils/RegUtils.js";
import * as scalarUtils from "scripts/utils/ScalarUtils.js";
import * as segUtils from "scripts/utils/SegUtils.js";
import * as splineUtils from "scripts/utils/SplineUtils.js";

export default class {
  RUN_SPEED = 15;
  RUN_AIR_FACTOR = 0.45;
  AUTO_RUN_FACTOR = 2;
  RUN_IN_HILL_FACTOR = 1.1; // 2 --> x2 speed downhill
  SLIDE_IN_HILL_FACTOR = 1.25;
  RUN_DIFFICULTY_BONUS_FACTOR_AT_DIFFICULTY_1 = 0.25;
  DEBUG_SPLINE = false;

  debugSplineEntity = undefined;
  debugSplineLeftLaneEntity = undefined;
  debugSplineRightLaneEntity = undefined;
  debugSplineLeftWallEntity = undefined;
  debugSplineRightWallEntity = undefined;
  pausedLastTick = true;

  shouldRun() {
    return hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform") &&
      hiber3d.getSingleton("GameState", "alive") &&
      !hiber3d.getSingleton("GameState", "paused") &&
      segUtils.getCurrentStepEntity() !== undefined;
  }
  getSpeed() {
    var speed = this.RUN_SPEED;

    const jumpingScript = hiber3d.getScript(this.entity, "scripts/Jumping.js");
    if (jumpingScript !== undefined && jumpingScript.timeSinceJumped !== undefined) {
      speed *= Math.max(0, Math.pow(this.RUN_AIR_FACTOR, jumpingScript.timeSinceJumped));
    }
    if (hiber3d.hasScripts(this.entity, "scripts/powerups/AutoRun.js") && hiber3d.getScript(this.entity, "scripts/powerups/AutoRun.js").stage < 4) {
      speed *= this.AUTO_RUN_FACTOR;
    }

    const rotation = hiber3d.getComponent(this.entity, "Hiber3D::Transform", "rotation");
    const direction = quatUtils.vectorFromQuaternion(rotation);
    if (direction.y !== 0) {
    const rawHillFactor = hiber3d.hasScripts(this.entity, "scripts/Diving.js") || hiber3d.hasScripts(this.entity, "scripts/Sliding.js") ? this.SLIDE_IN_HILL_FACTOR : this.RUN_IN_HILL_FACTOR;
    const scaledHillFactor = (direction.y < 0 ? rawHillFactor : 1 / rawHillFactor);
    const safeHillFactor = Math.abs(scaledHillFactor) > 0.01 ? scaledHillFactor : 1;
    speed *= safeHillFactor;
    }

    if (!hiber3d.hasComponents(this.entity, "OnPath")) {
      const currentStepEntity = segUtils.getCurrentStepEntity();
      const curveFactor = hiber3d.getComponent(currentStepEntity, "Step", "curveFactor");
      speed /= scalarUtils.lerpScalar(1, Math.sqrt(2), curveFactor);
    }

    const difficulty = hiber3d.getSingleton("GameState", "difficulty");
    speed *= (1 + difficulty * this.RUN_DIFFICULTY_BONUS_FACTOR_AT_DIFFICULTY_1);

    return speed;

  }
  debugSpline(splinePosition, splineRotation) {
    const currentStepEntity = segUtils.getCurrentStepEntity();
    if (this.debugSplineEntity === undefined) {
      this.debugSplineEntity = hiber3d.createEntity();
      hiber3d.addComponent(this.debugSplineEntity, "Hiber3D::Transform");
      hiber3d.setComponent(this.debugSplineEntity, "Hiber3D::Transform", "scale", {x:0.1, y:0.3, z:0.1});
      hiber3d.addComponent(this.debugSplineEntity, "Hiber3D::SceneInstance");
      hiber3d.setComponent(this.debugSplineEntity, "Hiber3D::SceneInstance", "scene", "glbs/primitives/cylinder.glb#scene0");
      hiber3d.addComponent(this.debugSplineEntity, "Hiber3D::Name");
      hiber3d.setComponent(this.debugSplineEntity, "Hiber3D::Name", "DebugSpline");
    }
    const offset = { x: 0, y: 0.5, z: 0 };
    hiber3d.setComponent(this.debugSplineEntity, "Hiber3D::Transform", "position", vectorUtils.addVectors(splinePosition, offset));
    hiber3d.setComponent(this.debugSplineEntity, "Hiber3D::Transform", "rotation", splineRotation);

    if (this.debugSplineLeftLaneEntity === undefined) {
      this.debugSplineLeftLaneEntity = hiber3d.createEntity();
      hiber3d.addComponent(this.debugSplineLeftLaneEntity, "Hiber3D::Transform");
      hiber3d.setComponent(this.debugSplineLeftLaneEntity, "Hiber3D::Transform", "scale", { x: 0.1, y: 0.1, z: 0.1 });
      hiber3d.addComponent(this.debugSplineLeftLaneEntity, "Hiber3D::SceneInstance");
      hiber3d.setComponent(this.debugSplineLeftLaneEntity, "Hiber3D::SceneInstance", "scene", "glbs/primitives/cylinder.glb#scene0");
      hiber3d.addComponent(this.debugSplineLeftLaneEntity, "Hiber3D::Name");
      hiber3d.setComponent(this.debugSplineLeftLaneEntity, "Hiber3D::Name", "DebugSplineLeftLane");
    }
    const leftLaneOffset = quatUtils.rotateVectorByQuaternion({ x: -hiber3d.getComponent(currentStepEntity, "Step", "laneOffsetLeft"), y: 0, z: 0 }, splineRotation);
    hiber3d.setComponent(this.debugSplineLeftLaneEntity, "Hiber3D::Transform", "position", vectorUtils.addVectors(splinePosition, leftLaneOffset));
    hiber3d.setComponent(this.debugSplineLeftLaneEntity, "Hiber3D::Transform", "rotation", splineRotation);

    if (this.debugSplineRightLaneEntity === undefined) {
      this.debugSplineRightLaneEntity = hiber3d.createEntity();
      hiber3d.addComponent(this.debugSplineRightLaneEntity, "Hiber3D::Transform");
      hiber3d.setComponent(this.debugSplineRightLaneEntity, "Hiber3D::Transform", "scale", { x: 0.1, y: 0.1, z: 0.1 });
      hiber3d.addComponent(this.debugSplineRightLaneEntity, "Hiber3D::SceneInstance");
      hiber3d.setComponent(this.debugSplineRightLaneEntity, "Hiber3D::SceneInstance", "scene", "glbs/primitives/cylinder.glb#scene0");
      hiber3d.addComponent(this.debugSplineRightLaneEntity, "Hiber3D::Name");
      hiber3d.setComponent(this.debugSplineRightLaneEntity, "Hiber3D::Name", "DebugSplineRightLane");
    }
    const rightLaneOffset = quatUtils.rotateVectorByQuaternion({ x: hiber3d.getComponent(currentStepEntity, "Step", "laneOffsetRight"), y: 0, z: 0 }, splineRotation);
    hiber3d.setComponent(this.debugSplineRightLaneEntity, "Hiber3D::Transform", "position", vectorUtils.addVectors(splinePosition, rightLaneOffset));
    hiber3d.setComponent(this.debugSplineRightLaneEntity, "Hiber3D::Transform", "rotation", splineRotation);

    if (this.debugSplineLeftWallEntity === undefined) {
      this.debugSplineLeftWallEntity = hiber3d.createEntity();
      hiber3d.addComponent(this.debugSplineLeftWallEntity, "Hiber3D::Transform");
      hiber3d.setComponent(this.debugSplineLeftWallEntity, "Hiber3D::Transform", "scale", { x: 0.2, y: 0.2, z: 0.2 });
      hiber3d.addComponent(this.debugSplineLeftWallEntity, "Hiber3D::SceneInstance");
      hiber3d.setComponent(this.debugSplineLeftWallEntity, "Hiber3D::SceneInstance", "scene", "glbs/primitives/cylinder.glb#scene0");
      hiber3d.addComponent(this.debugSplineLeftWallEntity, "Hiber3D::Name");
      hiber3d.setComponent(this.debugSplineLeftWallEntity, "Hiber3D::Name", "DebugSplineLeftWall");
    }
    const leftWallOffset = quatUtils.rotateVectorByQuaternion({ x: -hiber3d.getComponent(currentStepEntity, "Step", "wallOffsetLeft"), y: 0, z: 0 }, splineRotation);
    hiber3d.setComponent(this.debugSplineLeftWallEntity, "Hiber3D::Transform", "position", vectorUtils.addVectors(splinePosition, leftWallOffset));
    hiber3d.setComponent(this.debugSplineLeftWallEntity, "Hiber3D::Transform", "rotation", splineRotation);

    if (this.debugSplineRightWallEntity === undefined) {
      this.debugSplineRightWallEntity = hiber3d.createEntity();
      hiber3d.addComponent(this.debugSplineRightWallEntity, "Hiber3D::Transform");
      hiber3d.setComponent(this.debugSplineRightWallEntity, "Hiber3D::Transform", "scale", { x: 0.2, y: 0.2, z: 0.2 });
      hiber3d.addComponent(this.debugSplineRightWallEntity, "Hiber3D::SceneInstance");
      hiber3d.setComponent(this.debugSplineRightWallEntity, "Hiber3D::SceneInstance", "scene", "glbs/primitives/cylinder.glb#scene0");
      hiber3d.addComponent(this.debugSplineRightWallEntity, "Hiber3D::Name");
      hiber3d.setComponent(this.debugSplineRightWallEntity, "Hiber3D::Name", "DebugSplineRightWall");
    }
    const rightWallOffset = quatUtils.rotateVectorByQuaternion({ x: hiber3d.getComponent(currentStepEntity, "Step", "wallOffsetRight"), y: 0, z: 0 }, splineRotation);
    hiber3d.setComponent(this.debugSplineRightWallEntity, "Hiber3D::Transform", "position", vectorUtils.addVectors(splinePosition, rightWallOffset));
    hiber3d.setComponent(this.debugSplineRightWallEntity, "Hiber3D::Transform", "rotation", splineRotation);
  }
  getSpline() {
    const currentStepEntity = segUtils.getCurrentStepEntity();
    const nextStepEntity = segUtils.getNextStepEntity();
    if (currentStepEntity === undefined || nextStepEntity === undefined) {
      return;
    }

    const currentStepPosition = hiber3d.getComponent(currentStepEntity, "Hiber3D::ComputedWorldTransform", "position");
    const currentStepRotation = hiber3d.getComponent(currentStepEntity, "Hiber3D::ComputedWorldTransform", "rotation");
    const nextStepPosition = hiber3d.getComponent(nextStepEntity, "Hiber3D::ComputedWorldTransform", "position");
    const nextStepRotation = hiber3d.getComponent(nextStepEntity, "Hiber3D::ComputedWorldTransform", "rotation");
    const distanceFromCurrentStep = hiber3d.getSingleton("SegmentsState", "distanceFromCurrentStep");
    const curveFactor = hiber3d.getComponent(currentStepEntity, "Step", "curveFactor");
    const spline = splineUtils.getSpline(currentStepPosition, nextStepPosition, currentStepRotation, nextStepRotation, distanceFromCurrentStep, curveFactor);
    const position = spline.position;
    const rotation = spline.rotation;

    if (this.DEBUG_SPLINE === true) {
      this.debugSpline(position, rotation);
    }

    return { position, rotation };
  }
  getTiltOffset(rotation) {
    const currentStepEntity = segUtils.getCurrentStepEntity();
    if (currentStepEntity === undefined) {
      return undefined;
    }
    regUtils.addComponentIfNotPresent(this.entity, "TiltFactor");
    const tiltFactor = hiber3d.getComponent(this.entity, "TiltFactor", "factor");
    const isLeft = tiltFactor < 0;
    const laneOffset = hiber3d.getComponent(currentStepEntity, "Step", isLeft ? "laneOffsetLeft" : "laneOffsetRight");
    const tiltVector = { x: laneOffset * tiltFactor, y: 0, z: 0 };
    const result = quatUtils.rotateVectorByQuaternion(tiltVector, rotation);
    return result;
  }
  recordStats(delta) {
    const playerEntity = hiber3d.getSingleton("GameState", "playerEntity");
    if(this.entity === playerEntity){
      var stats = regUtils.addComponentIfNotPresent(playerEntity, "Stats");
      stats.meters += delta;
      stats.points = stats.points + delta * stats.multiplier;
      hiber3d.setComponent(playerEntity, "Stats", stats);

      const newDistanceFromCurrentStep = hiber3d.getSingleton("SegmentsState", "distanceFromCurrentStep") + delta;
      hiber3d.setSingleton("SegmentsState", "distanceFromCurrentStep", newDistanceFromCurrentStep);
    }
  }
  isSettingHeightAvailable(){
    return !hiber3d.hasScripts(this.entity, "scripts/Jumping.js") &&
    !hiber3d.hasScripts(this.entity, "scripts/Diving.js") &&
    !hiber3d.hasScripts(this.entity, "scripts/powerups/AutoRun.js");
  }
  setPosition(newPosition){
    const isSettingHeightAvailable = this.isSettingHeightAvailable();
    if(isSettingHeightAvailable){
      hiber3d.setComponent(this.entity, "Hiber3D::Transform", "position", newPosition);
    } else {
      hiber3d.setComponent(this.entity, "Hiber3D::Transform", "position", "x", newPosition.x);
      hiber3d.setComponent(this.entity, "Hiber3D::Transform", "position", "z", newPosition.z);
    }
  }
  onCreate() {
  }
  onUpdate(dt) {
    if (!this.shouldRun()) {
      return;
    }

    const isOnPath = hiber3d.hasComponents(this.entity, "OnPath") || hiber3d.hasScripts(this.entity, "scripts/powerups/AutoRun.js");
    const speed = this.getSpeed();
    this.recordStats(speed * dt);
    const spline = this.getSpline();
    regUtils.addComponentIfNotPresent(this.entity, "SplineData");
    hiber3d.setComponent(this.entity, "SplineData", "position", spline.position);
    hiber3d.setComponent(this.entity, "SplineData", "rotation", spline.rotation);

    if (isOnPath) {
      const tiltOffset = this.getTiltOffset(spline.rotation) !== undefined ? this.getTiltOffset(spline.rotation) : { x: 0, y: 0, z: 0 };
      const tiltedPosition = vectorUtils.addVectors(spline.position, tiltOffset);
      this.setPosition(tiltedPosition);

      const rotationPostPotentialAutoRun = hiber3d.hasScripts(this.entity, "scripts/powerups/AutoRun.js") ? quatUtils.flattenQuaternion(spline.rotation) : spline.rotation;
      hiber3d.setComponent(this.entity, "Hiber3D::Transform", "rotation", rotationPostPotentialAutoRun);

    } else {

      const currentStepEntity = segUtils.getCurrentStepEntity();
      const leftWallOffset = hiber3d.getComponent(currentStepEntity, "Step", "wallOffsetLeft");
      const rightWallOffset = hiber3d.getComponent(currentStepEntity, "Step", "wallOffsetRight");
      const leftWallVectorOffset = quatUtils.rotateVectorByQuaternion({ x: -leftWallOffset, y: 0, z: 0 }, spline.rotation);
      const rightWallVectorOffset = quatUtils.rotateVectorByQuaternion({ x: rightWallOffset, y: 0, z: 0 }, spline.rotation);
      const leftWallPosition = vectorUtils.addVectors(spline.position, leftWallVectorOffset);
      const rightWallPosition = vectorUtils.addVectors(spline.position, rightWallVectorOffset);
      const position = hiber3d.getComponent(this.entity, "Hiber3D::Transform", "position");

      const fallenOff = !vectorUtils.inRangeOfPoints(position, leftWallPosition, rightWallPosition);
      if (fallenOff) {
        const playerEntity = hiber3d.getSingleton("GameState", "playerEntity");
        if(this.entity === playerEntity){
          hiber3d.writeEvent("KillPlayer", {});
        }
      } else {
        const position = hiber3d.getComponent(this.entity, "Hiber3D::Transform", "position");
        const direction = hiber3d.getSingleton("GameState", "direction");
        const newPosition = {
          x: position.x + direction.x * speed * dt,
          y: position.y + direction.y * speed * dt,
          z: position.z + direction.z * speed * dt
        };
        this.setPosition(newPosition);
      }
    }
  }
}