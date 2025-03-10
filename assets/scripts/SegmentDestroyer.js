({
  DEBUG_SEGMENTS: true,

  playerPositionLastTick: undefined,

  shouldRun() {
    const playerEntity = hiber3d.getValue("GameState", "playerEntity");
    if (playerEntity === undefined ||
      !hiber3d.hasComponents(playerEntity, "Hiber3D::ComputedWorldTransform") ||
      !hiber3d.hasComponents(playerEntity, "SplineData")) {
      return false;
    }
    const isOnPath = hiber3d.hasComponents(playerEntity, "OnPath") || hiber3d.hasComponents(playerEntity, "AutoTurn");
    if (!isOnPath) {
      return false;
    }
    return hiber3d.getValue("GameState", "alive") &&
      !hiber3d.getValue("GameState", "paused");
  },
  spawnDebugCylinder(entity) {
    if (entity !== undefined &&
      hiber3d.hasComponents(entity, "Hiber3D::ComputedWorldTransform")) {

      //hiber3d.print("Debugging entity:'" + entity + "'");
      hiber3d.addComponent(entity, "Hiber3D::SceneRoot");
      hiber3d.setValue(entity, "Hiber3D::SceneRoot", "scene", "glbs/primitives/Cylinder.glb#scene0");
      hiber3d.setValue(entity, "Hiber3D::Transform", "scale", { x: 0.1, y: 0.4, z: 0.1 });
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
    if (nextStepEntity === undefined) {
      return;
    }
    const playerEntity = hiber3d.getValue("GameState", "playerEntity");
    const playerSplineData = hiber3d.getValue(playerEntity, "SplineData");
    const playerPosition = playerSplineData.position;
    const nextStepPosition = hiber3d.getValue(nextStepEntity, "Hiber3D::ComputedWorldTransform", "position");
    const nextStepRotation = hiber3d.getValue(nextStepEntity, "Hiber3D::ComputedWorldTransform", "rotation");

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
        hiber3d.setValue("SegmentsState", "currentStepIndex", newStepIndex);
        hiber3d.setValue("SegmentsState", "distanceFromCurrentStep", 0);
        hiber3d.writeEvent("NewStepEvent");
        const newNextStepEntity = segUtils.getNextStepEntity();
        const newNextStepIndex = regUtils.getChildIndexOf(newNextStepEntity);
        if (newNextStepIndex === 0) {
          const currentSegmentEntity = hiber3d.getValue("SegmentsState", "currentSegmentSceneEntity");
          const nextSegmentEntity = hiber3d.getValue(currentSegmentEntity, "SegmentScene", "next");
          hiber3d.setValue("SegmentsState", "currentSegmentSceneEntity", nextSegmentEntity);
          hiber3d.setValue("SegmentsState", "currentStepIndex", 0);
          hiber3d.writeEvent("NewSegmentEvent");
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
        const playerEntity = hiber3d.getValue("GameState", "playerEntity");
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
      const current = hiber3d.getValue("SegmentsState", "currentSegmentSceneEntity");
      if (current !== undefined && hiber3d.hasComponents(current, "SegmentScene")) {
        const prev = hiber3d.getValue(current, "SegmentScene", "prev");
        if (prev !== undefined && hiber3d.hasComponents(prev, "SegmentScene")) {
          const prevPrev = hiber3d.getValue(prev, "SegmentScene", "prev");
          if (prevPrev !== undefined && hiber3d.hasComponents(prevPrev, "SegmentScene")) {
            const prevPrevPrev = hiber3d.getValue(prevPrev, "SegmentScene", "prev");
            if (prevPrevPrev !== undefined && hiber3d.hasComponents(prevPrevPrev, "SegmentScene")) {
              const prevPrevPrevPrev = hiber3d.getValue(prevPrevPrev, "SegmentScene", "prev");
              if (prevPrevPrevPrev !== undefined && hiber3d.hasComponents(prevPrevPrevPrev, "SegmentScene")) {
                const prevPrevPrevPrevPrev = hiber3d.getValue(prevPrevPrevPrev, "SegmentScene", "prev");
                if (prevPrevPrevPrevPrev !== undefined && hiber3d.hasComponents(prevPrevPrevPrevPrev, "SegmentScene")) {
                  regUtils.destroyEntity(prevPrevPrevPrevPrev);
                }
              }
            }
          }
        }
      }
    }
  }
});