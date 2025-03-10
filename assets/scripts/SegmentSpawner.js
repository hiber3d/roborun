const segUtils = require("scripts/utils/SegUtils.js");

({
  NUM_SEGMENTS: 13,
  START_VANILLA_STRAIGHT_LENGTH: 3,
  MIN_STRAIGHTS_IN_ROW: 3,
  MIN_STRAIGHTS_IN_ROW_AT_DIFFICULTY_1: 0,
  MAX_STRAIGHTS_IN_ROW: 6, // Should not be too similar to NUM_SEGMENTS --> will cause "end-of-tunnel" visible
  TURN_CHANCE_MIN: 0.2, // 0.1 --> 10% chance of turning (then left/right is 50/50)
  TURN_CHANCE_AT_DIFFICULTY_1: 0.75,
  TURN_CHANCE_MAX: 0.9,
  SEGMENTS: {
    // first number is base probability
    // second number is probability factor at difficulty 1 (i.e. a value of 1 means no change, 0 means it doesn't occur at all, 2 means it occurs twice as often, etc.)
    "straight": [
      [1, 0.1, "scenes/SegmentStraightBase.scene"],

      [0.01, 0.1, "scenes/segments/SegmentStraightCCL.scene"], 
      [0.01, 0.1, "scenes/segments/SegmentStraightCCM.scene"],
      [0.01, 0.1, "scenes/segments/SegmentStraightCCR.scene"],

      [0.1, 0.1, "scenes/segments/SegmentStraightCLL.scene"],
      [0.01, 0.1, "scenes/segments/SegmentStraightCLM.scene"],
      [0.1, 0.1, "scenes/segments/SegmentStraightCLR.scene"],
      [0.001, 1, "scenes/segments/SegmentStraightCLA.scene"],

      [0.1, 1, "scenes/segments/SegmentStraightNOM.scene"],
      [0.1, 1, "scenes/segments/SegmentStraightCOM.scene"],
      [0.1, 1, "scenes/segments/SegmentStraightNOA.scene"],
      [0.1, 1, "scenes/segments/SegmentStraightCOA.scene"],

      [0.1, 1, "scenes/segments/SegmentStraightNPL.scene"],
      [0.1, 1, "scenes/segments/SegmentStraightNPR.scene"],
      [0.1, 1, "scenes/segments/SegmentStraightCPL.scene"],
      [0.1, 1, "scenes/segments/SegmentStraightCPR.scene"],

      [0, 1, "scenes/segments/SegmentStraightPTL.scene"],
      [0, 1, "scenes/segments/SegmentStraightPTR.scene"]
    ],
    "left": [
      [1, 1, "scenes/SegmentLeftBase.scene"]
    ],
    "right": [
      [1, 1, "scenes/SegmentRightBase.scene"]
    ],
  },
  ROOMS: {
    "straight": [
      [1, 0.1, "scenes/rooms/RoomStraightA.scene"],
      [1, 1, "scenes/rooms/RoomStraightB.scene"],
      [0.1, 10, "scenes/rooms/RoomStraightC.scene"]
    ],
    "left": [
      [1, 1, "scenes/rooms/RoomLeftA.scene"]
    ],
    "right": [
      [1, 1, "scenes/rooms/RoomRightA.scene"]
    ],
  },

  lastTurn: "",
  secondToLastTurn: "",
  straightsInARow: 0,
  latestSegmentSceneEntity: undefined,
  segmentIndex: 0,

  getTurnChance() {
    const difficulty = hiber3d.getValue("GameState", "difficulty");
    return Math.min(this.TURN_CHANCE_MIN + (this.TURN_CHANCE_AT_DIFFICULTY_1 - this.TURN_CHANCE_MIN) * difficulty, this.TURN_CHANCE_MAX);
  },
  getSegmentType() {
    var segmentType = undefined;
    const difficulty = hiber3d.getValue("GameState", "difficulty");
    const passedVanilla = this.segmentIndex > this.START_VANILLA_STRAIGHT_LENGTH;
    const chanceSuccess = Math.random() < this.getTurnChance();
    const minStraightsInARow = this.MIN_STRAIGHTS_IN_ROW + (this.MIN_STRAIGHTS_IN_ROW_AT_DIFFICULTY_1 - this.MIN_STRAIGHTS_IN_ROW) * difficulty;
    const passedMinStraightsInARow = this.straightsInARow >= minStraightsInARow;
    const passedMaxStraightsInARow = this.straightsInARow >= this.MAX_STRAIGHTS_IN_ROW;
    if ((passedVanilla && chanceSuccess && passedMinStraightsInARow) || passedMaxStraightsInARow) {
      if (this.lastTurn === this.secondToLastTurn && this.lastTurn !== "") {
        segmentType = this.lastTurn === "left" ? "right" : "left";
      } else {
        segmentType = Math.random() < 0.5 ? "left" : "right";
      }
      this.straightsInARow = 0;
    } else {
      segmentType = "straight";
      this.straightsInARow++;
    }
    return segmentType;
  },
  getProbability(segment) {
    const difficulty = hiber3d.getValue("GameState", "difficulty");
    const probabilityAtDifficulty0 = segment[0];
    const probabilityFactorAtDifficulty1 = segment[1];
    return probabilityAtDifficulty0 * Math.max(0, scalarUtils.lerpScalar(1, probabilityFactorAtDifficulty1, difficulty));
  },
  getPath(segmentType, types) {
    if (types[segmentType] === undefined) {
      hiber3d.print("SegmentSpawner::getSegmentPath: Unknown segment type: '" + segmentType + "'");
    }
    const numSegmentPaths = types[segmentType].length;
    var totalProbability = 0;
    if (this.segmentIndex > this.START_VANILLA_STRAIGHT_LENGTH) {
      for (var i = 0; i < numSegmentPaths; i++) {
        totalProbability += this.getProbability(types[segmentType][i]);
      }
    }
    const outcome = Math.random() * totalProbability;
    var iteratedProbability = 0;
    for (var i = 0; i < numSegmentPaths; i++) {
      iteratedProbability += this.getProbability(types[segmentType][i]);
      if (iteratedProbability >= outcome) {
        return types[segmentType][i][2];
      }
    }
    return types[segmentType][0][2];
  },
  getSegmentPath(segmentType) {
    return this.getPath(segmentType, this.SEGMENTS);
  },
  getRoomPath(segmentType) {
    return this.getPath(segmentType, this.ROOMS);
  },
  spawnSegmentScene(transform) {
    const segmentsSceneEntity = hiber3d.getValue("SegmentsState", "segmentsSceneEntity");

    const segmentType = this.getSegmentType();
    if (segmentType == undefined) {
      return;
    }
    if (segmentType != "straight") {
      this.secondToLastTurn = this.lastTurn;
      this.lastTurn = segmentType;
    }
    const segmentPath = this.getSegmentPath(segmentType);
    if (segmentPath === undefined) {
      return;
    }
    const roomPath = this.getRoomPath(segmentType);
    if (roomPath === undefined) {
      return;
    }

    // Segment
    const segmentSceneEntity = regUtils.createChildToParent(segmentsSceneEntity);
    hiber3d.addComponent(segmentSceneEntity, "Hiber3D::SceneRoot");
    hiber3d.setValue(segmentSceneEntity, "Hiber3D::SceneRoot", "scene", segmentPath);
    hiber3d.addComponent(segmentSceneEntity, "SegmentScene");
    hiber3d.addComponent(segmentSceneEntity, "Hiber3D::Name");
    hiber3d.setValue(segmentSceneEntity, "Hiber3D::Name", "Segment" + this.segmentIndex);
    hiber3d.addComponent(segmentSceneEntity, "Hiber3D::Transform");
    if (transform !== undefined) {
      hiber3d.setValue(segmentSceneEntity, "Hiber3D::Transform", transform);
    }

    // Room
    const roomSceneEntity = regUtils.createChildToParent(segmentSceneEntity);
    hiber3d.addComponent(roomSceneEntity, "Hiber3D::SceneRoot");
    hiber3d.setValue(roomSceneEntity, "Hiber3D::SceneRoot", "scene", roomPath);
    hiber3d.addComponent(roomSceneEntity, "Hiber3D::Transform");

    this.latestSegmentSceneEntity = segmentSceneEntity;
    this.segmentIndex++;
    return segmentSceneEntity;
  },
  spawnSegmentSceneWithHierarchy() {
    const latestSegment = this.latestSegmentSceneEntity;
    const out = segUtils.getLastStepEntityOf(latestSegment);
    if (out === undefined || !hiber3d.hasComponents(out, "Hiber3D::ComputedWorldTransform")) {
      return;
    }
    const outTransform = hiber3d.getValue(out, "Hiber3D::ComputedWorldTransform");
    var newSegmentEntity = this.spawnSegmentScene(outTransform)
    hiber3d.setValue(latestSegment, "SegmentScene", "next", newSegmentEntity);
    hiber3d.setValue(newSegmentEntity, "SegmentScene", "prev", latestSegment);
  },

  onCreate() {
    const newSegmentsSceneEntity = hiber3d.createEntity();
    hiber3d.setValue("SegmentsState", "segmentsSceneEntity", newSegmentsSceneEntity);
    hiber3d.addComponent(newSegmentsSceneEntity, "Hiber3D::Children");
    hiber3d.addComponent(newSegmentsSceneEntity, "Hiber3D::Name");
    hiber3d.addComponent(newSegmentsSceneEntity, "Hiber3D::Transform");
    hiber3d.setValue(newSegmentsSceneEntity, "Hiber3D::Name", "SegmentsScenes");

    var transform = hiber3d.getValue(this.entity, "Hiber3D::Transform");
    var newSegmentEntity = this.spawnSegmentScene(transform);
    hiber3d.setValue("SegmentsState", "currentSegmentSceneEntity", newSegmentEntity);
  },
  update() {
    // When too few segments, spawn another
    const currentSegmentSceneEntity = hiber3d.getValue("SegmentsState", "currentSegmentSceneEntity");
    if (currentSegmentSceneEntity === undefined) {
      return;
    }
    if (segUtils.getNumberOfSegments() < this.NUM_SEGMENTS) {
      this.spawnSegmentSceneWithHierarchy();
    }
  },
  onEvent(event, payload) {
  }
});