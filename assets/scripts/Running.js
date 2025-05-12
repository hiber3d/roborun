({
  RUN_SPEED: 15,
  RUN_AIR_FACTOR: 0.45,
  AUTO_RUN_FACTOR: 2,
  RUN_IN_HILL_FACTOR: 1.1, // 2 --> x2 speed downhill
  SLIDE_IN_HILL_FACTOR: 1.25,
  RUN_DIFFICULTY_BONUS_FACTOR_AT_DIFFICULTY_1: 0.25,
  DEBUG_SPLINE: false,

  debugSplineEntity: undefined,
  debugSplineLeftLaneEntity: undefined,
  debugSplineRightLaneEntity: undefined,
  debugSplineLeftWallEntity: undefined,
  debugSplineRightWallEntity: undefined,
  pausedLastTick: true,

  shouldRun() {
    const gameState = hiber3d.getSingleton("GameState");
    return hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform") &&
      gameState.alive &&
      !gameState.paused &&
      !regUtils.isNullEntity(segUtils.getCurrentStepEntity());
  },
  getSpeed() {
    var speed = this.RUN_SPEED;

    const jumpingScript = hiber3d.getScript(this.entity, "scripts/Jumping.js");
    if (jumpingScript !== undefined && jumpingScript.timeSinceJumped !== undefined) {
      speed *= Math.max(0, Math.pow(this.RUN_AIR_FACTOR, jumpingScript.timeSinceJumped));
    }
    if (hiber3d.hasScripts(this.entity, "scripts/powerups/AutoRun.js") && hiber3d.getScript(this.entity, "scripts/powerups/AutoRun.js").stage < 4) {
      speed *= this.AUTO_RUN_FACTOR;
    }

    const rotation = hiber3d.getComponent(this.entity, "Hiber3D::Transform").rotation;
    const direction = quatUtils.vectorFromQuaternion(rotation);
    if (direction.y !== 0) {
      const rawHillFactor = hiber3d.hasScripts(this.entity, "scripts/Diving.js") || hiber3d.hasScripts(this.entity, "scripts/Sliding.js") ? this.SLIDE_IN_HILL_FACTOR : this.RUN_IN_HILL_FACTOR;
      const scaledHillFactor = (direction.y < 0 ? rawHillFactor : 1 / rawHillFactor);
      const safeHillFactor = Math.abs(scaledHillFactor) > 0.01 ? scaledHillFactor : 1;
      speed *= safeHillFactor;
    }

    if (!hiber3d.hasComponents(this.entity, "OnPath")) {
      const currentStepEntity = segUtils.getCurrentStepEntity();
      const curveFactor = hiber3d.getComponent(currentStepEntity, "Step").curveFactor;
      speed /= scalarUtils.lerpScalar(1, Math.sqrt(2), curveFactor);
    }

    const difficulty = hiber3d.getSingleton("GameState").difficulty;
    speed *= (1 + difficulty * this.RUN_DIFFICULTY_BONUS_FACTOR_AT_DIFFICULTY_1);

    return speed;

  },
  debugTransformScale(entity, x, y, z) {
    hiber3d.addComponent(entity, "Hiber3D::Transform");
    const transform = hiber3d.getComponent(entity, "Hiber3D::Transform");
    const scale = transform.scale;
    scale.x = x;
    scale.y = y;
    scale.z = z;
    hiber3d.setComponent(entity, "Hiber3D::Transform", transform);
  },
  debugScene(entity) {
    hiber3d.addComponent(entity, "Hiber3D::SceneRoot");
    const sceneRoot = hiber3d.getComponent(entity, "Hiber3D::SceneRoot");
    sceneRoot.scene = "glbs/primitives/cylinder.glb#scene0";
    hiber3d.setComponent(entity, "Hiber3D::SceneRoot", "scene", sceneRoot);
  },
  debugUpdateTransform(entity, position, rotation) {
    const transform = new globalThis["Hiber3D::Transform"]();
    transform.position = position;
    transform.rotation = rotation;
    hiber3d.setComponent(entity, "Hiber3D::Transform", transform);
  },
  debugSpline(splinePosition, splineRotation) {
    const currentStepEntity = segUtils.getCurrentStepEntity();
    if (regUtils.isNullEntity(this.debugSplineEntity)) {
      this.debugSplineEntity = hiber3d.createEntity();
      debugTransformScale(this.debugSplineEntity, 0.1, 0.3, 0.1);
      debugScene(this.debugSplineEntity);
      hiber3d.addComponent(this.debugSplineEntity, "Hiber3D::Name");
      hiber3d.setComponent(this.debugSplineEntity, "Hiber3D::Name", "DebugSpline");
    }
    {
      const offset = { x: 0, y: 0.5, z: 0 };
      debugUpdateTransform(this.debugSplineEntity, vectorUtils.addVectors(splinePosition, offset), splineRotation);
    }

    if (regUtils.isNullEntity(this.debugSplineLeftLaneEntity)) {
      this.debugSplineLeftLaneEntity = hiber3d.createEntity();
      debugTransformScale(this.debugSplineLeftLaneEntity, 0.1, 0.1, 0.1);
      debugScene(this.debugSplineLeftLaneEntity);
      hiber3d.addComponent(this.debugSplineLeftLaneEntity, "Hiber3D::Name");
      hiber3d.setComponent(this.debugSplineLeftLaneEntity, "Hiber3D::Name", "DebugSplineLeftLane");
    }
    {
      const leftLaneOffset = quatUtils.rotateVectorByQuaternion({ x: -hiber3d.getComponent(currentStepEntity, "Step").laneOffsetLeft, y: 0, z: 0 }, splineRotation);
      debugUpdateTransform(this.debugSplineLeftLaneEntity, vectorUtils.addVectors(splinePosition, leftLaneOffset), splineRotation);
    }

    if (regUtils.isNullEntity(this.debugSplineRightLaneEntity)) {
      this.debugSplineRightLaneEntity = hiber3d.createEntity();
      debugTransformScale(this.debugSplineRightLaneEntity, 0.1, 0.1, 0.1);
      debugScene(this.debugSplineRightLaneEntity);
      hiber3d.addComponent(this.debugSplineRightLaneEntity, "Hiber3D::Name");
      hiber3d.setComponent(this.debugSplineRightLaneEntity, "Hiber3D::Name", "DebugSplineRightLane");
    }
    {
      const rightLaneOffset = quatUtils.rotateVectorByQuaternion({ x: hiber3d.getComponent(currentStepEntity, "Step").laneOffsetRight, y: 0, z: 0 }, splineRotation);
      debugUpdateTransform(this.debugSplineRightLaneEntity, vectorUtils.addVectors(splinePosition, rightLaneOffset), splineRotation);
    }

    if (regUtils.isNullEntity(this.debugSplineLeftWallEntity)) {
      this.debugSplineLeftWallEntity = hiber3d.createEntity();
      debugTransformScale(this.debugSplineLeftWallEntity, 0.2, 0.2, 0.2);
      debugScene(this.debugSplineEntity);
      hiber3d.addComponent(this.debugSplineLeftWallEntity, "Hiber3D::Name");
      hiber3d.setComponent(this.debugSplineLeftWallEntity, "Hiber3D::Name", "DebugSplineLeftWall");
    }
    {
      const leftWallOffset = quatUtils.rotateVectorByQuaternion({ x: -hiber3d.getComponent(currentStepEntity, "Step").wallOffsetLeft, y: 0, z: 0 }, splineRotation);
      debugUpdateTransform(this.debugSplineLeftWallEntity, vectorUtils.addVectors(splinePosition, leftWallOffset), splineRotation);
    }

    if (regUtils.isNullEntity(this.debugSplineRightWallEntity)) {
      this.debugSplineRightWallEntity = hiber3d.createEntity();
      debugTransformScale(this.debugSplineRightWallEntity, 0.2, 0.2, 0.2);
      debugScene(this.debugSplineEntity);
      hiber3d.addComponent(this.debugSplineRightWallEntity, "Hiber3D::Name");
      hiber3d.setComponent(this.debugSplineRightWallEntity, "Hiber3D::Name", "DebugSplineRightWall");
    }
    {
      const rightWallOffset = quatUtils.rotateVectorByQuaternion({ x: hiber3d.getComponent(currentStepEntity, "Step").wallOffsetRight, y: 0, z: 0 }, splineRotation);
      debugUpdateTransform(this.debugSplineRightWallEntity, vectorUtils.addVectors(splinePosition, rightWallOffset), splineRotation);
    }
  },
  getSpline() {
    const currentStepEntity = segUtils.getCurrentStepEntity();
    const nextStepEntity = segUtils.getNextStepEntity();
    if (regUtils.isNullEntity(currentStepEntity) || regUtils.isNullEntity(nextStepEntity)) {
      return undefined;
    }

    const computedWorldTransform = hiber3d.getComponent(currentStepEntity, "Hiber3D::ComputedWorldTransform");
    const currentStepPosition = computedWorldTransform.position;
    const currentStepRotation = computedWorldTransform.rotation;
    const nextComputedWorldTransform = hiber3d.getComponent(nextStepEntity, "Hiber3D::ComputedWorldTransform");
    const nextStepPosition = nextComputedWorldTransform.position;
    const nextStepRotation = nextComputedWorldTransform.rotation;
    const distanceFromCurrentStep = hiber3d.getSingleton("SegmentsState").distanceFromCurrentStep;
    const curveFactor = hiber3d.getComponent(currentStepEntity, "Step").curveFactor;
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
    if (regUtils.isNullEntity(currentStepEntity)) {
      return undefined;
    }
    regUtils.addComponentIfNotPresent(this.entity, "TiltFactor");
    const tiltFactor = hiber3d.getComponent(this.entity, "TiltFactor").factor;
    const isLeft = tiltFactor < 0;
    const laneOffset = hiber3d.getComponent(currentStepEntity, "Step")[isLeft ? "laneOffsetLeft" : "laneOffsetRight"];
    const tiltVector = { x: laneOffset * tiltFactor, y: 0, z: 0 };
    const result = quatUtils.rotateVectorByQuaternion(tiltVector, rotation);
    return result;
  },
  recordStats(delta) {
    const playerEntity = hiber3d.getSingleton("GameState").playerEntity;
    if (this.entity === playerEntity) {
      var stats = regUtils.addComponentIfNotPresent(playerEntity, "Stats");
      stats.meters += delta;
      stats.points = stats.points + delta * stats.multiplier;
      hiber3d.setComponent(playerEntity, "Stats", stats);

      const segmentsState = hiber3d.getSingleton("SegmentsState");
      segmentsState.distanceFromCurrentStep = segmentsState.distanceFromCurrentStep + delta;
      hiber3d.setSingleton("SegmentsState", segmentsState);
    }
  },
  isSettingHeightAvailable() {
    return !hiber3d.hasScripts(this.entity, "scripts/Jumping.js") &&
      !hiber3d.hasScripts(this.entity, "scripts/Diving.js") &&
      !hiber3d.hasScripts(this.entity, "scripts/powerups/AutoRun.js");
  },
  setPosition(newPosition) {
    const isSettingHeightAvailable = this.isSettingHeightAvailable();
    const transform = hiber3d.getComponent(this.entity, "Hiber3D::Transform");
    if (isSettingHeightAvailable) {
      transform.position = newPosition;
    } else {
      transform.position.x = newPosition.x;
      transform.position.z = newPosition.z;
    }
    hiber3d.setComponent(this.entity, "Hiber3D::Transform", transform);
  },
  onCreate() {
  },
  update(dt) {
    if (!this.shouldRun()) {
      return;
    }

    const isOnPath = hiber3d.hasComponents(this.entity, "OnPath") || hiber3d.hasScripts(this.entity, "scripts/powerups/AutoRun.js");
    const speed = this.getSpeed();
    this.recordStats(speed * dt);
    const spline = this.getSpline();
    regUtils.addComponentIfNotPresent(this.entity, "SplineData");
    const splineData = hiber3d.getComponent(this.entity, "SplineData");
    splineData.position = spline.position;
    splineData.rotation = spline.rotation;
    hiber3d.setComponent(this.entity, "SplineData", splineData);

    if (isOnPath) {
      const tiltOffset = this.getTiltOffset(spline.rotation) !== undefined ? this.getTiltOffset(spline.rotation) : { x: 0, y: 0, z: 0 };
      const tiltedPosition = vectorUtils.addVectors(spline.position, tiltOffset);
      this.setPosition(tiltedPosition);

      const rotationPostPotentialAutoRun = hiber3d.hasScripts(this.entity, "scripts/powerups/AutoRun.js") ? quatUtils.flattenQuaternion(spline.rotation) : spline.rotation;
      const transform = hiber3d.getComponent(this.entity, "Hiber3D::Transform");
      transform.rotation = rotationPostPotentialAutoRun;
      hiber3d.setComponent(this.entity, "Hiber3D::Transform", transform);
    } else {

      const currentStepEntity = segUtils.getCurrentStepEntity();
      const leftWallOffset = hiber3d.getComponent(currentStepEntity, "Step").wallOffsetLeft;
      const rightWallOffset = hiber3d.getComponent(currentStepEntity, "Step").wallOffsetRight;
      const leftWallVectorOffset = quatUtils.rotateVectorByQuaternion({ x: -leftWallOffset, y: 0, z: 0 }, spline.rotation);
      const rightWallVectorOffset = quatUtils.rotateVectorByQuaternion({ x: rightWallOffset, y: 0, z: 0 }, spline.rotation);
      const leftWallPosition = vectorUtils.addVectors(spline.position, leftWallVectorOffset);
      const rightWallPosition = vectorUtils.addVectors(spline.position, rightWallVectorOffset);
      const position = hiber3d.getComponent(this.entity, "Hiber3D::Transform").position;

      const fallenOff = !vectorUtils.inRangeOfPoints(position, leftWallPosition, rightWallPosition);
      if (fallenOff) {
        const playerEntity = hiber3d.getSingleton("GameState").playerEntity;
        if (this.entity === playerEntity) {
          hiber3d.writeEvent("KillPlayer", new KillPlayer());
        }
      } else {
        const position = hiber3d.getComponent(this.entity, "Hiber3D::Transform").position;
        const direction = hiber3d.getSingleton("GameState").direction;
        const newPosition = new globalThis["Hiber3D::float3"]();
        newPosition.x = position.x + direction.x * speed * dt;
        newPosition.y = position.y + direction.y * speed * dt;
        newPosition.z = position.z + direction.z * speed * dt;
        this.setPosition(newPosition);
      }
    }
  }
});
