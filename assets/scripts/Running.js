({
  RUN_SPEED: 15,
  RUN_AIR_FACTOR: 0.45,
  AUTO_RUN_FACTOR: 2,
  RUN_DIFFICULTY_BONUS_FACTOR_AT_DIFFICULTY_1: 0.2,
  POSITION_LERP_SPEED: 20,
  ROTATION_LERP_SPEED: 1.5,
  DEBUG_SPLINE: false,

  debugSplineEntity: undefined,
  debugSplineLeftLaneEntity: undefined,
  debugSplineRightLaneEntity: undefined,
  debugSplineLeftWallEntity: undefined,
  debugSplineRightWallEntity: undefined,
  pausedLastTick: true,

  shouldRun() {
    return hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform") &&
      hiber3d.getValue("GameState", "alive") &&
      !hiber3d.getValue("GameState", "paused") &&
      segUtils.getCurrentStepEntity() !== undefined;
  },
  getSpeed() {
    var speed = this.RUN_SPEED;

    if (hiber3d.hasComponents(this.entity, "Jumping")) {
      speed *= Math.max(1, Math.pow(this.RUN_AIR_FACTOR, hiber3d.getValue(this.entity, "Jumping", "timeSinceJumped")));
    }
    if (hiber3d.hasComponents(this.entity, "AutoRun")) {
      speed *= this.AUTO_RUN_FACTOR;
    }
    if (hiber3d.hasComponents(this.entity, "OnPath")) {
      const currentStepEntity = segUtils.getCurrentStepEntity();
      const curveFactor = hiber3d.getValue(currentStepEntity, "Step", "curveFactor");
      speed /= scalarUtils.lerpScalar(1, Math.sqrt(2), curveFactor);
    }

    const difficulty = hiber3d.getValue("GameState", "difficulty");
    speed *= (1 + difficulty * this.RUN_DIFFICULTY_BONUS_FACTOR_AT_DIFFICULTY_1);

    return speed;

  },
  debugSpline(splinePosition, splineRotation) {
    const currentStepEntity = segUtils.getCurrentStepEntity();
    if (this.debugSplineEntity === undefined) {
      this.debugSplineEntity = hiber3d.createEntity();
      hiber3d.addComponent(this.debugSplineEntity, "Hiber3D::Transform");
      hiber3d.setValue(this.debugSplineEntity, "Hiber3D::Transform", "scale", {x:0.1, y:0.3, z:0.1});
      hiber3d.addComponent(this.debugSplineEntity, "Hiber3D::SceneRoot");
      hiber3d.setValue(this.debugSplineEntity, "Hiber3D::SceneRoot", "scene", "glbs/primitives/cylinder.glb#scene0");
      hiber3d.addComponent(this.debugSplineEntity, "Hiber3D::Name");
      hiber3d.setValue(this.debugSplineEntity, "Hiber3D::Name", "DebugSpline");
    }
    const offset = { x: 0, y: 0.5, z: 0 };
    hiber3d.setValue(this.debugSplineEntity, "Hiber3D::Transform", "position", vectorUtils.addVectors(splinePosition, offset));
    hiber3d.setValue(this.debugSplineEntity, "Hiber3D::Transform", "rotation", splineRotation);

    if (this.debugSplineLeftLaneEntity === undefined) {
      this.debugSplineLeftLaneEntity = hiber3d.createEntity();
      hiber3d.addComponent(this.debugSplineLeftLaneEntity, "Hiber3D::Transform");
      hiber3d.setValue(this.debugSplineLeftLaneEntity, "Hiber3D::Transform", "scale", { x: 0.1, y: 0.1, z: 0.1 });
      hiber3d.addComponent(this.debugSplineLeftLaneEntity, "Hiber3D::SceneRoot");
      hiber3d.setValue(this.debugSplineLeftLaneEntity, "Hiber3D::SceneRoot", "scene", "glbs/primitives/cylinder.glb#scene0");
      hiber3d.addComponent(this.debugSplineLeftLaneEntity, "Hiber3D::Name");
      hiber3d.setValue(this.debugSplineLeftLaneEntity, "Hiber3D::Name", "DebugSplineLeftLane");
    }
    const leftLaneOffset = quatUtils.rotateVectorByQuaternion({ x: -hiber3d.getValue(currentStepEntity, "Step", "laneOffsetLeft"), y: 0, z: 0 }, splineRotation);
    hiber3d.setValue(this.debugSplineLeftLaneEntity, "Hiber3D::Transform", "position", vectorUtils.addVectors(splinePosition, leftLaneOffset));
    hiber3d.setValue(this.debugSplineLeftLaneEntity, "Hiber3D::Transform", "rotation", splineRotation);

    if (this.debugSplineRightLaneEntity === undefined) {
      this.debugSplineRightLaneEntity = hiber3d.createEntity();
      hiber3d.addComponent(this.debugSplineRightLaneEntity, "Hiber3D::Transform");
      hiber3d.setValue(this.debugSplineRightLaneEntity, "Hiber3D::Transform", "scale", { x: 0.1, y: 0.1, z: 0.1 });
      hiber3d.addComponent(this.debugSplineRightLaneEntity, "Hiber3D::SceneRoot");
      hiber3d.setValue(this.debugSplineRightLaneEntity, "Hiber3D::SceneRoot", "scene", "glbs/primitives/cylinder.glb#scene0");
      hiber3d.addComponent(this.debugSplineRightLaneEntity, "Hiber3D::Name");
      hiber3d.setValue(this.debugSplineRightLaneEntity, "Hiber3D::Name", "DebugSplineRightLane");
    }
    const rightLaneOffset = quatUtils.rotateVectorByQuaternion({ x: hiber3d.getValue(currentStepEntity, "Step", "laneOffsetRight"), y: 0, z: 0 }, splineRotation);
    hiber3d.setValue(this.debugSplineRightLaneEntity, "Hiber3D::Transform", "position", vectorUtils.addVectors(splinePosition, rightLaneOffset));
    hiber3d.setValue(this.debugSplineRightLaneEntity, "Hiber3D::Transform", "rotation", splineRotation);

    if (this.debugSplineLeftWallEntity === undefined) {
      this.debugSplineLeftWallEntity = hiber3d.createEntity();
      hiber3d.addComponent(this.debugSplineLeftWallEntity, "Hiber3D::Transform");
      hiber3d.setValue(this.debugSplineLeftWallEntity, "Hiber3D::Transform", "scale", { x: 0.2, y: 0.2, z: 0.2 });
      hiber3d.addComponent(this.debugSplineLeftWallEntity, "Hiber3D::SceneRoot");
      hiber3d.setValue(this.debugSplineLeftWallEntity, "Hiber3D::SceneRoot", "scene", "glbs/primitives/cylinder.glb#scene0");
      hiber3d.addComponent(this.debugSplineLeftWallEntity, "Hiber3D::Name");
      hiber3d.setValue(this.debugSplineLeftWallEntity, "Hiber3D::Name", "DebugSplineLeftWall");
    }
    const leftWallOffset = quatUtils.rotateVectorByQuaternion({ x: -hiber3d.getValue(currentStepEntity, "Step", "wallOffsetLeft"), y: 0, z: 0 }, splineRotation);
    hiber3d.setValue(this.debugSplineLeftWallEntity, "Hiber3D::Transform", "position", vectorUtils.addVectors(splinePosition, leftWallOffset));
    hiber3d.setValue(this.debugSplineLeftWallEntity, "Hiber3D::Transform", "rotation", splineRotation);

    if (this.debugSplineRightWallEntity === undefined) {
      this.debugSplineRightWallEntity = hiber3d.createEntity();
      hiber3d.addComponent(this.debugSplineRightWallEntity, "Hiber3D::Transform");
      hiber3d.setValue(this.debugSplineRightWallEntity, "Hiber3D::Transform", "scale", { x: 0.2, y: 0.2, z: 0.2 });
      hiber3d.addComponent(this.debugSplineRightWallEntity, "Hiber3D::SceneRoot");
      hiber3d.setValue(this.debugSplineRightWallEntity, "Hiber3D::SceneRoot", "scene", "glbs/primitives/cylinder.glb#scene0");
      hiber3d.addComponent(this.debugSplineRightWallEntity, "Hiber3D::Name");
      hiber3d.setValue(this.debugSplineRightWallEntity, "Hiber3D::Name", "DebugSplineRightWall");
    }
    const rightWallOffset = quatUtils.rotateVectorByQuaternion({ x: hiber3d.getValue(currentStepEntity, "Step", "wallOffsetRight"), y: 0, z: 0 }, splineRotation);
    hiber3d.setValue(this.debugSplineRightWallEntity, "Hiber3D::Transform", "position", vectorUtils.addVectors(splinePosition, rightWallOffset));
    hiber3d.setValue(this.debugSplineRightWallEntity, "Hiber3D::Transform", "rotation", splineRotation);
  },
  getSpline() {
    const currentStepEntity = segUtils.getCurrentStepEntity();
    const nextStepEntity = segUtils.getNextStepEntity();
    if (currentStepEntity === undefined || nextStepEntity === undefined) {
      return;
    }

    const currentStepPosition = hiber3d.getValue(currentStepEntity, "Hiber3D::ComputedWorldTransform", "position");
    const currentStepRotation = hiber3d.getValue(currentStepEntity, "Hiber3D::ComputedWorldTransform", "rotation");
    const nextStepPosition = hiber3d.getValue(nextStepEntity, "Hiber3D::ComputedWorldTransform", "position");
    const nextStepRotation = hiber3d.getValue(nextStepEntity, "Hiber3D::ComputedWorldTransform", "rotation");
    const distanceFromCurrentStep = hiber3d.getValue("SegmentsState", "distanceFromCurrentStep");
    const curveFactor = hiber3d.getValue(currentStepEntity, "Step", "curveFactor");
    const spline = splineUtils.getSpline(currentStepPosition, nextStepPosition, currentStepRotation, nextStepRotation, distanceFromCurrentStep, curveFactor);
    const position = spline.position;
    const rotation = spline.rotation;

    if (this.DEBUG_SPLINE === true) {
      this.debugSpline(position, rotation);
    }

    return { position, rotation };
  },
  getTiltOffset(rotation) {
    const currentStepEntity = segUtils.getCurrentStepEntity();
    if (currentStepEntity === undefined) {
      return undefined;
    }
    regUtils.addComponentIfNotPresent(this.entity, "TiltFactor");
    const tiltFactor = hiber3d.getValue(this.entity, "TiltFactor", "factor");
    const isLeft = tiltFactor < 0;
    const laneOffset = hiber3d.getValue(currentStepEntity, "Step", isLeft ? "laneOffsetLeft" : "laneOffsetRight");
    const tiltVector = { x: laneOffset * tiltFactor, y: 0, z: 0 };
    const result = quatUtils.rotateVectorByQuaternion(tiltVector, rotation);
    return result;
  },
  recordStats(delta) {
    const playerEntity = hiber3d.getValue("GameState", "playerEntity");
    var stats = regUtils.addComponentIfNotPresent(playerEntity, "Stats");
    stats.meters += delta;
    stats.points = stats.points + delta * stats.multiplier;
    hiber3d.setValue(playerEntity, "Stats", stats);

    const newDistanceFromCurrentStep = hiber3d.getValue("SegmentsState", "distanceFromCurrentStep") + delta;
    hiber3d.setValue("SegmentsState", "distanceFromCurrentStep", newDistanceFromCurrentStep);
  },
  onCreate() {
  },
  update(dt) {
    if (!this.shouldRun()) {
      return;
    }

    const isOnPath = hiber3d.hasComponents(this.entity, "OnPath") || hiber3d.hasComponents(this.entity, "AutoRun");
    const speed = this.getSpeed();
    this.recordStats(speed * dt);
    const spline = this.getSpline();
    regUtils.addComponentIfNotPresent(this.entity, "SplineData");
    hiber3d.setValue(this.entity, "SplineData", "position", spline.position);
    hiber3d.setValue(this.entity, "SplineData", "rotation", spline.rotation);

    const position = hiber3d.getValue(this.entity, "Hiber3D::Transform", "position");
    const rotation = hiber3d.getValue(this.entity, "Hiber3D::Transform", "rotation");

    if (isOnPath) {
      const tiltOffset = this.getTiltOffset(spline.rotation) !== undefined ? this.getTiltOffset(spline.rotation) : { x: 0, y: 0, z: 0 };
      const tiltedPosition = vectorUtils.addVectors(spline.position, tiltOffset);

      const lerpFactorFromSpeed = speed / this.RUN_SPEED;
      var lerpedPosition = tiltedPosition;
      if (vectorUtils.getVectorDistance(position, lerpedPosition) > 0.1) {
        lerpedPosition = vectorUtils.lerpVectorWithDistance(position, tiltedPosition, this.POSITION_LERP_SPEED * lerpFactorFromSpeed * dt);
      }
      const lerpedRotation = quatUtils.lerpQuaternionWithDistance(rotation, spline.rotation, this.ROTATION_LERP_SPEED * lerpFactorFromSpeed * dt);

      hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", lerpedPosition);
      hiber3d.setValue(this.entity, "Hiber3D::Transform", "rotation", lerpedRotation);

    } else {

      const currentStepEntity = segUtils.getCurrentStepEntity();
      const leftWallOffset = hiber3d.getValue(currentStepEntity, "Step", "wallOffsetLeft");
      const rightWallOffset = hiber3d.getValue(currentStepEntity, "Step", "wallOffsetRight");
      const leftWallVectorOffset = quatUtils.rotateVectorByQuaternion({ x: -leftWallOffset, y: 0, z: 0 }, spline.rotation);
      const rightWallVectorOffset = quatUtils.rotateVectorByQuaternion({ x: rightWallOffset, y: 0, z: 0 }, spline.rotation);
      const leftWallPosition = vectorUtils.addVectors(spline.position, leftWallVectorOffset);
      const rightWallPosition = vectorUtils.addVectors(spline.position, rightWallVectorOffset);

      const fallenOff = !vectorUtils.inRangeOfPoints(position, leftWallPosition, rightWallPosition);
      //hiber3d.print(
      //  " position: " + vectorUtils.formatVector(position) +
      //  " leftWallPosition: " + vectorUtils.formatVector(leftWallPosition) +
      //  " rightWallPosition: " + vectorUtils.formatVector(rightWallPosition) +
      //  " fallenOff: " + JSON.stringify(fallenOff)
      //);
      if (fallenOff) {
        hiber3d.writeEvent("KillPlayer", {}); // TODO: Make player entity agnostic

      } else {
        // Continue in the current direction
        const direction = hiber3d.getValue("GameState", "direction");
        const newPosition = {
          x: position.x + direction.x * speed * dt,
          y: position.y + direction.y * speed * dt,
          z: position.z + direction.z * speed * dt
        };
        const newRotation = quatUtils.lerpQuaternionWithDistance(rotation, quatUtils.quaternionFromVector(direction), this.ROTATION_LERP_SPEED * dt);
        hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", newPosition);
        hiber3d.setValue(this.entity, "Hiber3D::Transform", "rotation", newRotation);
      }
    }
  }
});