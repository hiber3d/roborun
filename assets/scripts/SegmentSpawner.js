const STRAIGHT_ROOMS = [
  {
    room: "scenes/rooms/RoomStraightA.scene",
    probability: 0.2,
  },
  {
    room: "scenes/rooms/RoomStraightB.scene",
    probability: 0.2,
  },
  {
    room: "scenes/rooms/RoomStraightC.scene",
    probability: 0.2,
  },
  {
    room: "scenes/rooms/RoomStraightD.scene",
    probability: 0.2,
  },
  {
    room: "scenes/rooms/RoomStraightE.scene",
    probability: 0.1,
  },
  {
    room: "scenes/rooms/RoomStraightF.scene",
    probability: 0.1,
  },
];

const LEFT_ROOMS = [
  {
    room: "scenes/rooms/RoomLeftA.scene",
    probability: 1,
  },
];

const RIGHT_ROOMS = [
  {
    room: "scenes/rooms/RoomRightA.scene",
    probability: 1,
  },
];

const LANE = {
  LEFT: 0,
  MID: 1,
  RIGHT: 2,
};

const PICK_UP_HEIGHT = {
  NONE: 0,
  SLIDE: 1,
  RUN: 2,
  JUMP: 3,
};

const PICK_UP_LANE_BEHAVIOR = {
  // Must be same as LANE
  LEFT: 0,
  MID: 1,
  RIGHT: 2,

  SAME_AS_OBSTACLE: 3,
  ANY_BUT_NOT_SAME_AS_OBSTACLE: 4,
  LEFT_OF_OBSTACLE: 5,
  RIGHT_OF_OBSTACLE: 6,
};

const PICK_UP_DEPTH = {
  START: 0,
  MID: 1,
};

({
  NUM_SEGMENTS: 13,

  // Straights
  START_STRAIGHT_BASE_LENGTH: 3,
  MIN_STRAIGHTS_IN_ROW_AT_DIFFICULTY_0: 3,
  MIN_STRAIGHTS_IN_ROW_AT_DIFFICULTY_1: 0,
  MAX_STRAIGHTS_IN_ROW: 6, // Should not be too similar to NUM_SEGMENTS --> will cause "end-of-tunnel" visible

  // Obstacles
  OBSTACLE_CHANCE_AT_DIFFICULTY_0: 0.25,
  OBSTACLE_CHANCE_AT_DIFFICULTY_1: 1,
  MIN_OBSTACLELESS_BETWEEN_OBSTACLES_AT_DIFFICULTY_0: 2,
  MIN_OBSTACLELESS_BETWEEN_OBSTACLES_AT_DIFFICULTY_1: 0,

  // PickUps
  POWERUP_CHANCE_AT_DIFFICULTY_0: 0.01,
  POWERUP_CHANCE_AT_DIFFICULTY_1: 0.05,
  COLLECTIBLE_CHANCE_AT_DIFFICULTY_0: 0.25,
  COLLECTIBLE_CHANCE_AT_DIFFICULTY_1: 0.5,

  SPAWNABLE_STUFF: {

    straight: {
      probability: 0.8,
      segments: [
        {
          probability: 0.9,
          segment: "scenes/segments/SegmentStraightBase.scene", // The first "segment" entry should be the base segment
          rooms: STRAIGHT_ROOMS,
          obstacles: [
            {
              probability: 1,
              obstacle: undefined, // The first "obstacle" entry should be undefined
              obstacleLane: [],
              pickUps: [
                {
                  probability: 1,
                  pickUpHeights: [PICK_UP_HEIGHT.RUN, PICK_UP_HEIGHT.JUMP],
                  pickUpLanes: [PICK_UP_LANE_BEHAVIOR.LEFT, PICK_UP_LANE_BEHAVIOR.MID, PICK_UP_LANE_BEHAVIOR.RIGHT],
                },
              ],
            },
            {
              probability: 1,
              obstacle: "scenes/obstacles/Obstacle1LaneJumpOver.scene",
              obstacleLane: [LANE.LEFT, LANE.MID, LANE.RIGHT],
              pickUps: [
                {
                  probability: 1,
                  pickUpHeights: [PICK_UP_HEIGHT.JUMP],
                  pickUpLanes: [PICK_UP_LANE_BEHAVIOR.SAME_AS_OBSTACLE],
                },
                {
                  probability: 1,
                  pickUpHeights: [PICK_UP_HEIGHT.RUN],
                  pickUpLanes: [PICK_UP_LANE_BEHAVIOR.ANY_BUT_NOT_SAME_AS_OBSTACLE],
                }
              ],
            },
            {
              probability: 1,
              obstacle: "scenes/obstacles/Obstacle2LaneJumpOver.scene",
              obstacleLane: [LANE.LEFT, LANE.MID],
              pickUps: [
                {
                  probability: 1,
                  pickUpHeights: [PICK_UP_HEIGHT.JUMP],
                  pickUpLanes: [PICK_UP_LANE_BEHAVIOR.SAME_AS_OBSTACLE, PICK_UP_LANE_BEHAVIOR.RIGHT_AS_OBSTACLE],
                },
                {
                  probability: 1,
                  pickUpHeights: [PICK_UP_HEIGHT.RUN],
                  pickUpLanes: [PICK_UP_LANE_BEHAVIOR.LEFT_OF_OBSTACLE],
                }
              ],
            },
            {
              probability: 1,
              obstacle: "scenes/obstacles/Obstacle3LaneJumpOver.scene",
              obstacleLane: [LANE.MID],
              pickUps: [
                {
                  probability: 1,
                  pickUpHeights: [PICK_UP_HEIGHT.JUMP],
                  pickUpLanes: [PICK_UP_LANE_BEHAVIOR.LEFT, PICK_UP_LANE_BEHAVIOR.MID, PICK_UP_LANE_BEHAVIOR.RIGHT],
                }
              ],
            }
          ],
        },
        {
          probability: 0.1,
          segment: "scenes/segments/SegmentBridgeBase.scene",
          rooms: STRAIGHT_ROOMS,
        },
      ],
    },

    turn: {
      probability: 0.2,
      segments: [
        {
          probability: 0.5,
          segment: "scenes/segments/SegmentLeftBase.scene",
          rooms: LEFT_ROOMS,
        },
        {
          probability: 0.5,
          segment: "scenes/segments/SegmentRightBase.scene",
          rooms: RIGHT_ROOMS,
        },
      ],
    },

  },

  startStraightBaseCounter: 0,
  straightInARowCounter: 0,
  obstaclelessStraightsInARowCounter: 0,
  latestSegmentSceneEntity: undefined,
  segmentIndex: 0,
  getRandomElement(list) {
    if (list === undefined) {
      hiber3d.print("SegmentSpawner::getRandomElement() - ERROR: No list found");
      return undefined;
    }
    const length = list.length !== undefined ? list.length : Object.keys(list).length;
    if (length === 1) {
      return list[0];
    }
    var cumulativeProbability = 0;
    for (var i = 0; i < length; i++) {
      const object = list[Object.keys(list)[i]];
      if (object.probability === undefined) {
        hiber3d.print("SegmentSpawner::getRandomElement() - ERROR: No probability found for element: " + JSON.stringify(object));
      } else {
        cumulativeProbability += object.probability;
      }
    }
    const outcome = Math.random() * cumulativeProbability;
    var iteratedProbability = 0;
    for (var i = 0; i < length; i++) {
      const object = list[Object.keys(list)[i]];
      iteratedProbability += object.probability;
      if (iteratedProbability >= outcome) {
        return object;
      }
    }
    hiber3d.print("SegmentSpawner::getRandomElement() - ERROR: No element found");
    return undefined;
  },
  getStuffToSpawn() {
    const difficulty = hiber3d.getValue("GameState", "difficulty");

    const isAtStart = this.startStraightBaseCounter < this.START_STRAIGHT_BASE_LENGTH;
    const tooFewStraightsInARow = this.straightInARowCounter < Math.max(0, Math.ceil(scalarUtils.lerpScalar(this.MIN_STRAIGHTS_IN_ROW_AT_DIFFICULTY_0, this.MIN_STRAIGHTS_IN_ROW_AT_DIFFICULTY_1, difficulty)));
    const tooManyStraightsInARow = this.straightInARowCounter > this.MAX_STRAIGHTS_IN_ROW;

    var useStraight = false;
    var useFirstSegment = false;
    var useObstacle = false;
    var usePowerup = false;
    var useCollectible = false;

    // useStraight
    if (isAtStart) {
      useStraight = true;
      useFirstSegment = true;
      this.startStraightBaseCounter += 1;
    } else if (tooFewStraightsInARow) {
      useStraight = true;
    } else if (tooManyStraightsInARow) {
      useStraight = false;
    } else {
      useStraight = this.getRandomElement(this.SPAWNABLE_STUFF) === this.SPAWNABLE_STUFF.straight;
    }

    // useObstacle
    const obstaclelessSuccess = this.obstaclelessStraightsInARowCounter >= scalarUtils.lerpScalar(this.MIN_OBSTACLELESS_BETWEEN_OBSTACLES_AT_DIFFICULTY_0, this.MIN_OBSTACLELESS_BETWEEN_OBSTACLES_AT_DIFFICULTY_1, difficulty);
    const obstacleChanceSuccess = Math.random() < scalarUtils.lerpScalar(this.OBSTACLE_CHANCE_AT_DIFFICULTY_0, this.OBSTACLE_CHANCE_AT_DIFFICULTY_1, difficulty);
    useObstacle = !isAtStart && useStraight && obstaclelessSuccess && obstacleChanceSuccess;

    // usePowerup
    const powerupChanceSuccess = Math.random() < scalarUtils.lerpScalar(this.POWERUP_CHANCE_AT_DIFFICULTY_0, this.POWERUP_CHANCE_AT_DIFFICULTY_1, difficulty);
    usePowerup = powerupChanceSuccess;

    // useCollectible
    const collectibleChanceSuccess = Math.random() < scalarUtils.lerpScalar(this.COLLECTIBLE_CHANCE_AT_DIFFICULTY_0, this.COLLECTIBLE_CHANCE_AT_DIFFICULTY_1, difficulty);
    useCollectible = !usePowerup && collectibleChanceSuccess;

    // segmentPath
    const segmentTypeBlock = useStraight ? this.SPAWNABLE_STUFF.straight : this.SPAWNABLE_STUFF.turn;
    const segmentBlock = useFirstSegment ? segmentTypeBlock.segments[0] : this.getRandomElement(segmentTypeBlock.segments);
    const segmentPath = segmentBlock.segment;

    // roomPath
    const roomBlock = this.getRandomElement(segmentBlock.rooms);
    const roomPath = roomBlock.room;

    // obstaclePath
    const obstacleBlock = useObstacle ? this.getRandomElement(segmentBlock.obstacles) : segmentBlock.obstacles !== undefined ? segmentBlock.obstacles[0] : undefined;
    const obstaclePath = obstacleBlock !== undefined ? obstacleBlock.obstacle : undefined;
    const obstacleLaneIndex = obstacleBlock !== undefined ? Math.floor(Math.random() * Object.keys(obstacleBlock.obstacleLane).length) : undefined;
    const obstacleLane = obstacleBlock !== undefined ? obstacleBlock.obstacleLane[obstacleLaneIndex] : undefined;

    // pickUpPath
    var pickUpPath = undefined;
    var pickUpLane = undefined;
    var pickUpHeight = undefined;
    var pickUpDepth = undefined;
    if (obstacleBlock !== undefined && (usePowerup || useCollectible)) {
      const pickUpsBlock = this.getRandomElement(obstacleBlock.pickUps);
      const pickUpHeights = (usePowerup || useCollectible) && pickUpsBlock !== undefined ? pickUpsBlock.pickUpHeights : undefined;

      const pickUpLaneIndex = pickUpsBlock !== undefined ? Math.floor(Math.random() * Object.keys(pickUpsBlock.pickUpLanes).length) : undefined;
      pickUpLane = pickUpsBlock !== undefined ? pickUpsBlock.pickUpLanes[pickUpLaneIndex] : undefined;
      pickUpLane = pickUpLane === PICK_UP_LANE_BEHAVIOR.SAME_AS_OBSTACLE ? obstacleLane : pickUpLane;
      pickUpLane = pickUpLane === PICK_UP_LANE_BEHAVIOR.ANY_BUT_NOT_SAME_AS_OBSTACLE ? (obstacleLane + Math.ceil(2 * Math.random())) % 3 : pickUpLane;
      pickUpLane = pickUpLane === PICK_UP_LANE_BEHAVIOR.LEFT_OF_OBSTACLE ? (obstacleLane + 2) % 3 : pickUpLane;
      pickUpLane = pickUpLane === PICK_UP_LANE_BEHAVIOR.RIGHT_OF_OBSTACLE ? (obstacleLane + 1) % 3 : pickUpLane;

      const pickUpHeightIndex = pickUpHeights !== undefined ? Math.floor(Math.random() * Object.keys(pickUpHeights).length) : undefined;
      pickUpHeight = pickUpHeights !== undefined ? pickUpHeights[pickUpHeightIndex] : undefined;

      if (usePowerup) {
        // TODO: Add support for multiple power-ups here
        pickUpPath = "scenes/powerups/PowerUpAutoRun.scene";
        pickUpDepth = PICK_UP_DEPTH.MID;
      } else if(useCollectible){
        pickUpPath =
          (pickUpHeight === PICK_UP_HEIGHT.SLIDE) ? "scenes/collectibles/CollectiblesDip.scene" :
            (pickUpHeight === PICK_UP_HEIGHT.RUN) ? "scenes/collectibles/CollectiblesLine.scene" :
              (pickUpHeight === PICK_UP_HEIGHT.JUMP) ? "scenes/collectibles/CollectiblesCurve.scene" :
                undefined;

        pickUpHeight = PICK_UP_HEIGHT.NONE; // Collectibles have height as part of the scene
        pickUpDepth = PICK_UP_DEPTH.START; // Collectibles have depth as part of the scene
      }
    }

    if (segmentPath === undefined) {
      hiber3d.print("SegmentSpawner::getSegment() - ERROR: No segmentPath found");
    }
    if (roomPath === undefined) {
      hiber3d.print("SegmentSpawner::getSegment() - ERROR: No roomPath found");
    }

    this.straightInARowCounter = useStraight ? this.straightInARowCounter + 1 : 0;
    this.obstaclelessStraightsInARowCounter = useObstacle ? 0 : this.obstaclelessStraightsInARowCounter + 1;

    return { segmentPath, roomPath, obstaclePath, obstacleLane, pickUpPath, pickUpLane, pickUpHeight, pickUpDepth};
  },
  spawnSegmentScene(transform) {
    const segmentsSceneEntity = hiber3d.getValue("SegmentsState", "segmentsSceneEntity");

    const stuffToSpawn = this.getStuffToSpawn();
    const segmentPath = stuffToSpawn.segmentPath;
    const roomPath = stuffToSpawn.roomPath;
    const obstaclePath = stuffToSpawn.obstaclePath;
    const obstacleLane = stuffToSpawn.obstacleLane;
    const pickUpPath = stuffToSpawn.pickUpPath;
    const pickUpLane = stuffToSpawn.pickUpLane;
    const pickUpHeight = stuffToSpawn.pickUpHeight;
    const pickUpDepth = stuffToSpawn.pickUpDepth;

    // Segment
    const segmentSceneEntity = regUtils.createChildToParent(segmentsSceneEntity);
    hiber3d.addComponent(segmentSceneEntity, "Hiber3D::SceneRoot");
    hiber3d.setValue(segmentSceneEntity, "Hiber3D::SceneRoot", "scene", segmentPath);
    hiber3d.addComponent(segmentSceneEntity, "SegmentScene");
    hiber3d.addComponent(segmentSceneEntity, "Hiber3D::Name");
    hiber3d.setValue(segmentSceneEntity, "Hiber3D::Name", "SegmentScene" + this.segmentIndex);
    hiber3d.addComponent(segmentSceneEntity, "Hiber3D::Transform");
    if (transform !== undefined) {
      hiber3d.setValue(segmentSceneEntity, "Hiber3D::Transform", transform);
    }

    // Room
    const roomSceneEntity = regUtils.createChildToParent(segmentSceneEntity);
    hiber3d.addComponent(roomSceneEntity, "Hiber3D::SceneRoot");
    hiber3d.setValue(roomSceneEntity, "Hiber3D::SceneRoot", "scene", roomPath);
    hiber3d.addComponent(roomSceneEntity, "Hiber3D::Name");
    hiber3d.setValue(roomSceneEntity, "Hiber3D::Name", "RoomScene");
    hiber3d.addComponent(roomSceneEntity, "Hiber3D::Transform");

    // Obstacle
    if (obstaclePath !== undefined) {
      const obstacleEntity = regUtils.createChildToParent(segmentSceneEntity);
      hiber3d.addComponent(obstacleEntity, "Hiber3D::SceneRoot");
      hiber3d.setValue(obstacleEntity, "Hiber3D::SceneRoot", "scene", obstaclePath);
      hiber3d.addComponent(obstacleEntity, "Hiber3D::Name");
      hiber3d.setValue(obstacleEntity, "Hiber3D::Name", "ObstacleScene");
      hiber3d.addComponent(obstacleEntity, "Hiber3D::Transform");
      const x = obstacleLane === LANE.LEFT ? -1 : obstacleLane === LANE.RIGHT ? 1 : 0; // TODO: Get width from scene
      const z = -5;
      hiber3d.setValue(obstacleEntity, "Hiber3D::Transform", "position", { x, y: 0, z });
    }

    // PickUp
    if (pickUpPath !== undefined) {
      const pickUpEntity = regUtils.createChildToParent(segmentSceneEntity);
      hiber3d.addComponent(pickUpEntity, "Hiber3D::SceneRoot");
      hiber3d.setValue(pickUpEntity, "Hiber3D::SceneRoot", "scene", pickUpPath);
      hiber3d.addComponent(pickUpEntity, "Hiber3D::Name");
      hiber3d.setValue(pickUpEntity, "Hiber3D::Name", "PickUpScene");
      hiber3d.addComponent(pickUpEntity, "Hiber3D::Transform");
      const x =
        pickUpLane === LANE.LEFT ? -1 :
          pickUpLane === LANE.RIGHT ? 1 :
            0; // TODO: Get width from scene
      const y =
        pickUpHeight === PICK_UP_HEIGHT.SLIDE ? 0 :
          pickUpHeight === PICK_UP_HEIGHT.RUN ? 0.5 :
            pickUpHeight === PICK_UP_HEIGHT.JUMP ? 2.5 :
              0; // TODO: Get height from scene
      const z =
        pickUpDepth === PICK_UP_DEPTH.MID ? -5 :
          0; // TODO: Get depth from scene
      hiber3d.setValue(pickUpEntity, "Hiber3D::Transform", "position", { x, y, z });
    }

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