({
  DEBUG_SEGMENTS: false,

  playerPositionLastTick: undefined,

  shouldRun() {
    const playerEntity = hiber3d.getSingleton("GameState").playerEntity;
    if (regUtils.isNullEntity(playerEntity) ||
      !hiber3d.hasComponents(playerEntity, "Hiber3D::ComputedWorldTransform") ||
      !hiber3d.hasComponents(playerEntity, "SplineData")) {
      return false;
    }
    const isOnPath = hiber3d.hasComponents(playerEntity, "OnPath") || hiber3d.hasScripts(playerEntity, "scripts/powerups/AutoRun.js");
    if (!isOnPath) {
      return false;
    }
    const gameState = hiber3d.getSingleton("GameState");
    return gameState.alive &&
      !gameState.paused;
  },
  spawnDebugCylinder(entity) {
    if (entity !== undefined &&
      hiber3d.hasComponents(entity, "Hiber3D::ComputedWorldTransform")) {

      //hiber3d.print("Debugging entity:'" + entity + "'");
      hiber3d.addComponent(entity, "Hiber3D::SceneRoot");
      const sceneRoot = hiber3d.getComponent(entity, "");
      sceneRoot.scene = "glbs/primitives/cylinder.glb#scene0";
      hiber3d.setComponent(entity, "Hiber3D::SceneRoot", sceneRoot);

      const transform = hiber3d.getComponent(entity, "Hiber3D::Transform");
      const scale = transform.scale;
      scale.x = 0.1;
      scale.y = 0.4;
      scale.z = 0.1;
      hiber3d.setComponent(entity, "Hiber3D::Transform", transform);
    }
  },

  onCreate() {
    hiber3d.addEventListener(this.entity, "NewStepEvent");
    hiber3d.addEventListener(this.entity, "NewSegmentEvent");
  },
  update() {
    if (!this.shouldRun()) {
      return;
    }

    const nextStepEntity = segUtils.getNextStepEntity();
    if (regUtils.isNullEntity(nextStepEntity)) {
      return;
    }
    const playerEntity = hiber3d.getSingleton("GameState").playerEntity;
    const playerSplineData = hiber3d.getComponent(playerEntity, "SplineData");
    const playerPosition = playerSplineData.position;
    const computedWorldTransform = hiber3d.getComponent(nextStepEntity, "Hiber3D::ComputedWorldTransform");
    const nextStepPosition = computedWorldTransform.position;
    const nextStepRotation = computedWorldTransform.rotation;

    if (this.playerPositionLastTick !== undefined) {
      const forwardVector = quatUtils.rotateVectorByQuaternion({ x: 0, y: 0, z: -1 }, nextStepRotation);
      const lastTickToNextStep = vectorUtils.subtractVectors(nextStepPosition, this.playerPositionLastTick);
      const playerToNextStep = vectorUtils.subtractVectors(nextStepPosition, playerPosition);
      const isLastTickBehind = vectorUtils.dotProduct(lastTickToNextStep, forwardVector) > 0;
      const isPlayerAhead = vectorUtils.dotProduct(playerToNextStep, forwardVector) <= 0;

      const playerPositionRelative = vectorUtils.subtractVectors(playerPosition, nextStepPosition);
      const forwardDotProduct = vectorUtils.dotProduct(playerPositionRelative, forwardVector);
      const epsilon = 0.001;
      const isPlayerOrthogonal = Math.abs(forwardDotProduct) < epsilon;
      const isPlayerOnNextStep = vectorUtils.vectorEquality(vectorUtils.stripY(playerPosition), vectorUtils.stripY(nextStepPosition));

      //hiber3d.print(
      //  " playerPosition: " + JSON.stringify(playerPosition) +
      //  " nextStepPosition: " + JSON.stringify(nextStepPosition) +
      //  " isPlayerOnNextStep: " + JSON.stringify(isPlayerOnNextStep) +
      //  ""
      //);

      const hasPassed = (isLastTickBehind && isPlayerAhead) || isPlayerOrthogonal || isPlayerOnNextStep;
      //hiber3d.print(
      //  " playerPos: " + vectorUtils.formatVector(vectorUtils.stripY(playerPosition)) +
      //  " nextPos: " + vectorUtils.formatVector(vectorUtils.stripY(nextStepPosition)) +
      //  " isLastTickBehind: " + JSON.stringify(isLastTickBehind) +
      //  " isPlayerAhead: " + JSON.stringify(isPlayerAhead) +
      //  " isPlayerOrthogonal: " + JSON.stringify(isPlayerOrthogonal) +
      //  " isPlayerOnNextStep: " + JSON.stringify(isPlayerOnNextStep) +
      //  ""
      //);
      if (hasPassed) {
        const newStepIndex = regUtils.getChildIndexOf(nextStepEntity);
        const segmentsState = hiber3d.getSingleton("SegmentsState");
        segmentsState.currentStepIndex = newStepIndex;
        segmentsState.distanceFromCurrentStep = 0;
        hiber3d.setSingleton("SegmentsState", segmentsState);
        hiber3d.writeEvent("NewStepEvent", new NewStepEvent());
        const newNextStepEntity = segUtils.getNextStepEntity();
        const newNextStepIndex = regUtils.getChildIndexOf(newNextStepEntity);
        if (newNextStepIndex === 0) {
          const currentSegmentEntity = hiber3d.getSingleton("SegmentsState").currentSegmentSceneEntity;
          const nextSegmentEntity = hiber3d.getComponent(currentSegmentEntity, "SegmentScene").next;
          segmentsState.currentSegmentSceneEntity = nextSegmentEntity;
          segmentsState.currentStepIndex = 0;
          hiber3d.setSingleton("SegmentsState", segmentsState);
          hiber3d.writeEvent("NewSegmentEvent", new NewSegmentEvent());
        }
        if (!segUtils.isPlayerAtForward() && hiber3d.hasComponents(playerEntity, "OnPath")) {
          hiber3d.removeComponent(playerEntity, "OnPath");
        }
      }
    }

    //hiber3d.print(
    //  " playerPositionLastTick: " + JSON.stringify(this.playerPositionLastTick) +
    //  " playerPosition: " + JSON.stringify(playerPosition) +
    //  " nextStepPosition: " + JSON.stringify(nextStepPosition) +
    //  ""
    //);

    this.playerPositionLastTick = playerPosition;
  },
  onEvent(event, payload) {
    if (event === "NewStepEvent") {
      // Going off-path
      if (!segUtils.isPlayerAtForward()) {
        const playerEntity = hiber3d.getSingleton("GameState").playerEntity;
        if (playerEntity !== undefined && hiber3d.hasComponents(playerEntity, "OnPath")) {
          hiber3d.removeComponent(playerEntity, "OnPath");
        }
      }

      // TODO: Test if this still works // It doesn't, lol
      if (this.DEBUG_SEGMENTS) {
        const nextStepEntity = segUtils.getNextStepEntity();
        this.spawnDebugCylinder(nextStepEntity);
      }
    }
    if (event === "NewSegmentEvent") {
      const current = hiber3d.getSingleton("SegmentsState").currentSegmentSceneEntity;
      if (current !== undefined && hiber3d.hasComponents(current, "SegmentScene")) {
        const prev = hiber3d.getComponent(current, "SegmentScene").prev;
        if (prev !== undefined && hiber3d.hasComponents(prev, "SegmentScene")) {
          const prevPrev = hiber3d.getComponent(prev, "SegmentScene").prev;
          if (prevPrev !== undefined && hiber3d.hasComponents(prevPrev, "SegmentScene")) {
            const prevPrevPrev = hiber3d.getComponent(prevPrev, "SegmentScene").prev;
            if (prevPrevPrev !== undefined && hiber3d.hasComponents(prevPrevPrev, "SegmentScene")) {
              const prevPrevPrevPrev = hiber3d.getComponent(prevPrevPrev, "SegmentScene").prev;
              if (prevPrevPrevPrev !== undefined && hiber3d.hasComponents(prevPrevPrevPrev, "SegmentScene")) {
                const prevPrevPrevPrevPrev = hiber3d.getComponent(prevPrevPrevPrev, "SegmentScene").prev;
                if (prevPrevPrevPrevPrev !== undefined && hiber3d.hasComponents(prevPrevPrevPrevPrev, "SegmentScene")) {
                  hiber3d.destroyEntity(prevPrevPrevPrevPrev);
                }
              }
            }
          }
        }
      }
    }
  }
});