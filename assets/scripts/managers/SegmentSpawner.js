const STRAIGHT_ROOMS = [
  {
    room: "scenes/roomsNEW/RoomStraightA.scene",
    probability: 0.2,
  },
  {
    room: "scenes/roomsNEW/RoomStraightB.scene",
    probability: 0.2,
  },
  {
    room: "scenes/roomsNEW/RoomStraightC.scene",
    probability: 0.2,
  },
  {
    room: "scenes/roomsNEW/RoomStraightD.scene",
    probability: 0.2,
  },
  {
    room: "scenes/roomsNEW/RoomStraightE.scene",
    probability: 0.1,
  },
  {
    room: "scenes/roomsNEW/RoomStraightF.scene",
    probability: 0.1,
  },
];

const INCLINE_ROOMS = [
  {
    room: "scenes/roomsNEW/RoomInclineA.scene",
    probability: 1,
  },
];

const LEFT_ROOMS = [
  {
    room: "scenes/roomsNEW/RoomTurnLeftA.scene",
    probability: 1,
  },
];

const RIGHT_ROOMS = [
  {
    room: "scenes/roomsNEW/RoomTurnRightA.scene",
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
  START_STRAIGHT_BASE_LENGTH: 5,
  MIN_STRAIGHTS_IN_ROW_AT_DIFFICULTY_0: 3,
  MIN_STRAIGHTS_IN_ROW_AT_DIFFICULTY_1: 0,
  MAX_STRAIGHTS_IN_ROW: 6, // Should not be too similar to NUM_SEGMENTS --> will cause "end-of-tunnel" visible

  // Inclines
  MAX_INCLINES_IN_A_ROW: 1,

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

  POWER_UPS: [
    {
      probability: 1,
      powerUp: "scenes/powerups/PowerUpAutoRun.scene",
    }, {
      probability: 1,
      powerUp: "scenes/powerups/PowerUpMagnet.scene",
    }
  ],

  SPAWNABLE_STUFF: {

    straight: {
      probability: 4,
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
            },
            {
              probability: 0.8,
              obstacle: "scenes/obstacles/ObstacleBlockLane.scene",
              obstacleLane: [LANE.LEFT, LANE.MID, LANE.RIGHT],
              pickUps: [
                {
                  probability: 1,
                  pickUpHeights: [PICK_UP_HEIGHT.RUN],
                  pickUpLanes: [PICK_UP_LANE_BEHAVIOR.ANY_BUT_NOT_SAME_AS_OBSTACLE],
                }
              ],
            },
            {
              probability: 0.8,
              obstacle: "scenes/obstacles/ObstacleProcessor.scene",
              obstacleLane: [LANE.MID],
              pickUps: [
                {
                  probability: 1,
                  pickUpHeights: [PICK_UP_HEIGHT.SLIDE],
                  pickUpLanes: [PICK_UP_LANE_BEHAVIOR.LEFT, PICK_UP_LANE_BEHAVIOR.MID, PICK_UP_LANE_BEHAVIOR.RIGHT],
                }
              ],
            },
            {
              probability: 0.8,
              obstacle: "scenes/obstacles/ObstacleRobotArm1.scene",
              obstacleLane: [LANE.MID],
            },
            {
              probability: 0.8,
              obstacle: "scenes/obstacles/ObstacleRobotArm2.scene",
              obstacleLane: [LANE.MID],
            }
          ],
        },
        {
          probability: 0.0,
          segment: "scenes/segments/SegmentBridgeBase.scene",
          tags: ["VANILLA"],
          rooms: STRAIGHT_ROOMS,
        },
        {
          probability: 1,
          segment: "scenes/segments/SegmentInclineBase.scene",
          tags: ["VANILLA", "INCLINE"],
          rooms: INCLINE_ROOMS,
        },
        {
          probability: 0.05,
          segment: "scenes/segments/SegmentStraightHole.scene",
          tags: ["SEGMENT_INCLUDES_OBSTACLE"],
          rooms: STRAIGHT_ROOMS,
          obstacles: [
            {
              probability: 0.75,
              obstacle: undefined,
              obstacleLane: [],
              pickUps: [
                {
                  probability: 1,
                  pickUpHeights: [PICK_UP_HEIGHT.JUMP],
                  pickUpLanes: [PICK_UP_LANE_BEHAVIOR.LEFT, PICK_UP_LANE_BEHAVIOR.MID, PICK_UP_LANE_BEHAVIOR.RIGHT],
                },
              ],
            },
          ],
        },
      ],
    },

    turn: {
      probability: 1,
      segments: [
        {
          probability: 1,
          segment: "scenes/segments/SegmentLeftBase.scene",
          tags: ["LEFT_TURN"],
          rooms: LEFT_ROOMS,
        },
        {
          probability: 1,
          segment: "scenes/segments/SegmentRightBase.scene",
          tags: ["RIGHT_TURN"],
          rooms: RIGHT_ROOMS,
        },
      ],
    },

  },

  startStraightBaseCounter: 0,
  straightInARowCounter: 0,
  inclincesInARowCounter: 0,
  obstaclelessStraightsInARowCounter: 0,
  latestSegmentSceneEntity: undefined,
  segmentIndex: 0,
  leftInARowCounter: 0,
  rightInARowCounter: 0,
  hasTag(element, tag) {
    if (element === undefined || element.tags === undefined) {
      return false;
    }
    for (var i = 0; i < element.tags.length; i++) {
      if (element.tags[i] === tag) {
        return true;
      }
    }
  },
  ignoreElement(element, ignoreTags) {
    if (ignoreTags === undefined || element.tags === undefined) {
      return false;
    }
    for (var i = 0; i < ignoreTags.length; i++) {
      if (this.hasTag(element, ignoreTags[i])) {
        return true;
      }
    }
    return false;
  },
  getRandomElement(list, ignoreTags) {
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
        continue;
      }
      if (this.ignoreElement(object, ignoreTags)) {
        continue;
      }
      cumulativeProbability += object.probability;
    }
    const outcome = Math.random() * cumulativeProbability;
    var iteratedProbability = 0;
    for (var i = 0; i < length; i++) {
      const object = list[Object.keys(list)[i]];
      if (this.ignoreElement(object, ignoreTags)) {
        continue;
      }
      iteratedProbability += object.probability;
      if (iteratedProbability >= outcome) {
        return object;
      }
    }
    hiber3d.print("SegmentSpawner::getRandomElement() - ERROR: No element found");
    return undefined;
  },
  getStuffToSpawn() {
    const difficulty = hiber3d.getSingleton("GameState").difficulty;

    const isAtStart = this.startStraightBaseCounter < this.START_STRAIGHT_BASE_LENGTH;
    const tooFewStraightsInARow = this.straightInARowCounter < Math.max(0, Math.ceil(scalarUtils.lerpScalar(this.MIN_STRAIGHTS_IN_ROW_AT_DIFFICULTY_0, this.MIN_STRAIGHTS_IN_ROW_AT_DIFFICULTY_1, difficulty)));
    const tooManyStraightsInARow = this.straightInARowCounter > this.MAX_STRAIGHTS_IN_ROW;

    var useStraight = false;
    var useFirstSegment = false;
    var useObstacle = false;
    var usePowerup = false;
    var useCollectible = false;
    var allowInclines = false;
    var allowLeft = false;
    var allowRight = false;

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

    // allows
    allowInclines = this.inclincesInARowCounter < this.MAX_INCLINES_IN_A_ROW;
    allowLeft = this.leftInARowCounter < 2;
    allowRight = this.rightInARowCounter < 2;

    // segmentPath
    const segmentTypeBlock = useStraight ? this.SPAWNABLE_STUFF.straight : this.SPAWNABLE_STUFF.turn;
    var ignoreTags = [];
    if (useObstacle) {
      ignoreTags.push("SEGMENT_INCLUDES_OBSTACLE");
    }
    if (!allowInclines) {
      ignoreTags.push("INCLINE");
    }
    if (!useStraight) {
      if (!allowLeft) {
        ignoreTags.push("LEFT_TURN");
      }
      if (!allowRight) {
        ignoreTags.push("RIGHT_TURN")
      }
    }
    if (useObstacle || usePowerup || useCollectible) {
      ignoreTags.push("VANILLA");
    }
    const segmentBlock = useFirstSegment ? segmentTypeBlock.segments[0] : this.getRandomElement(segmentTypeBlock.segments, ignoreTags);
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
    var pickUpScale = undefined;
    if ((usePowerup || useCollectible) && obstacleBlock !== undefined && obstacleBlock.pickUps !== undefined) {

      const pickUpsBlock = this.getRandomElement(obstacleBlock.pickUps);
      if (pickUpsBlock !== undefined && pickUpsBlock.pickUpHeights !== undefined && pickUpsBlock.pickUpLanes !== undefined) {

        const pickUpHeights = pickUpsBlock.pickUpHeights;
        const pickUpLanes = pickUpsBlock.pickUpLanes;
        const pickUpLaneIndex = Math.floor(Math.random() * Object.keys(pickUpLanes).length);

        const pickUpLaneBehavior = pickUpLanes[pickUpLaneIndex];
        switch (pickUpLaneBehavior) {
          case PICK_UP_LANE_BEHAVIOR.SAME_AS_OBSTACLE:
            pickUpLane = obstacleLane;
            break;
          case PICK_UP_LANE_BEHAVIOR.ANY_BUT_NOT_SAME_AS_OBSTACLE:
            pickUpLane = (obstacleLane + Math.ceil(2 * Math.random())) % 3;
            break;
          case PICK_UP_LANE_BEHAVIOR.LEFT_OF_OBSTACLE:
            pickUpLane = (obstacleLane + 2) % 3;
            break;
          case PICK_UP_LANE_BEHAVIOR.RIGHT_OF_OBSTACLE:
            pickUpLane = (obstacleLane + 1) % 3;
            break;
          default:
            pickUpLane = pickUpLaneBehavior;
        }

        const pickUpHeightIndex = Math.floor(Math.random() * Object.keys(pickUpHeights).length);
        pickUpHeight = pickUpHeights[pickUpHeightIndex];

        if (usePowerup) {
          const pickUpBlock = this.getRandomElement(this.POWER_UPS);
          pickUpPath = pickUpBlock.powerUp;
          pickUpDepth = PICK_UP_DEPTH.MID;
          pickUpScale = pickUpHeight === PICK_UP_HEIGHT.SLIDE ? 0.75 : 1;
        } else if (useCollectible) {
          pickUpPath =
            (pickUpHeight === PICK_UP_HEIGHT.SLIDE) ? "scenes/collectibles/CollectiblesDip.scene" :
              (pickUpHeight === PICK_UP_HEIGHT.RUN) ? "scenes/collectibles/CollectiblesLine.scene" :
                (pickUpHeight === PICK_UP_HEIGHT.JUMP) ? "scenes/collectibles/CollectiblesCurve.scene" :
                  undefined;

          pickUpHeight = PICK_UP_HEIGHT.NONE; // Collectibles have height as part of the scene
          pickUpDepth = PICK_UP_DEPTH.START; // Collectibles have depth as part of the scene
          pickUpScale = 1;
        }
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
    if (this.hasTag(segmentBlock, "INCLINE")) {
      this.inclincesInARowCounter += 1;
    } else {
      this.inclincesInARowCounter = 0;
    }
    if (this.hasTag(segmentBlock, "LEFT_TURN")) {
      this.leftInARowCounter += 1;
      this.rightInARowCounter = 0;
    }
    if (this.hasTag(segmentBlock, "RIGHT_TURN")) {
      this.leftInARowCounter = 0;
      this.rightInARowCounter += 1;
    }

    return { segmentPath, roomPath, obstaclePath, obstacleLane, pickUpPath, pickUpLane, pickUpHeight, pickUpDepth, pickUpScale };
  },
  spawnSegmentScene(transform) {
    const segmentsSceneEntity = hiber3d.getSingleton("SegmentsState").segmentsSceneEntity;

    const stuffToSpawn = this.getStuffToSpawn();
    const segmentPath = stuffToSpawn.segmentPath;
    const roomPath = stuffToSpawn.roomPath;
    const obstaclePath = stuffToSpawn.obstaclePath;
    const obstacleLane = stuffToSpawn.obstacleLane;
    const pickUpPath = stuffToSpawn.pickUpPath;
    const pickUpLane = stuffToSpawn.pickUpLane;
    const pickUpHeight = stuffToSpawn.pickUpHeight;
    const pickUpDepth = stuffToSpawn.pickUpDepth;
    const pickUpScale = stuffToSpawn.pickUpScale;

    // Segment
    {
      const segmentSceneEntity = hiber3d.call("createEntityAsChild", segmentsSceneEntity);
      hiber3d.addComponent(segmentSceneEntity, "Hiber3D::SceneRoot");
      const sceneRoot = hiber3d.getComponent(segmentSceneEntity, "Hiber3D::SceneRoot");
      sceneRoot.scene = segmentPath;
      hiber3d.setComponent(segmentSceneEntity, "Hiber3D::SceneRoot", sceneRoot);
      hiber3d.addComponent(segmentSceneEntity, "SegmentScene");
      hiber3d.addComponent(segmentSceneEntity, "Hiber3D::Name");
      hiber3d.setComponent(segmentSceneEntity, "Hiber3D::Name", "SegmentScene" + this.segmentIndex);
      hiber3d.addComponent(segmentSceneEntity, "Hiber3D::Transform");
      if (transform !== undefined) {
        hiber3d.setComponent(segmentSceneEntity, "Hiber3D::Transform", transform);
      }
    }

    // Room
    {
      const roomSceneEntity = hiber3d.call("createEntityAsChild", segmentSceneEntity);
      hiber3d.addComponent(roomSceneEntity, "Hiber3D::SceneRoot");
      const sceneRoot = hiber3d.getComponent(roomSceneEntity, "Hiber3D::SceneRoot");
      sceneRoot.scene = roomPath;
      hiber3d.setComponent(roomSceneEntity, "Hiber3D::SceneRoot", sceneRoot);
      hiber3d.addComponent(roomSceneEntity, "Hiber3D::Name");
      hiber3d.setComponent(roomSceneEntity, "Hiber3D::Name", "RoomScene");
      hiber3d.addComponent(roomSceneEntity, "Hiber3D::Transform");
    }

    // Obstacle
    if (obstaclePath !== undefined) {
      const obstacleEntity = hiber3d.call("createEntityAsChild", segmentSceneEntity);
      hiber3d.addComponent(obstacleEntity, "Hiber3D::SceneRoot");
      const sceneRoot = hiber3d.getComponent(obstacleEntity, "Hiber3D::SceneRoot");
      sceneRoot.scene = obstaclePath;
      hiber3d.setComponent(obstacleEntity, "Hiber3D::SceneRoot", sceneRoot);
      hiber3d.addComponent(obstacleEntity, "Hiber3D::Name");
      hiber3d.setComponent(obstacleEntity, "Hiber3D::Name", "ObstacleScene");
      hiber3d.addComponent(obstacleEntity, "Hiber3D::Transform");
      const x = obstacleLane === LANE.LEFT ? -1 : obstacleLane === LANE.RIGHT ? 1 : 0; // TODO: Get width from scene
      const z = -5;
      const transform = hiber3d.getComponent(obstacleEntity, "Hiber3D::Transform");
      const position = transform.position;
      position.x = x;
      position.y = 0;
      position.z = z;
      hiber3d.setComponent(obstacleEntity, "Hiber3D::Transform", transform);
    }

    // PickUp
    if (pickUpPath !== undefined) {
      const pickUpEntity = hiber3d.call("createEntityAsChild", segmentSceneEntity);
      hiber3d.addComponent(pickUpEntity, "Hiber3D::SceneRoot");
      const sceneRoot = hiber3d.getComponent(pickUpEntity, "Hiber3D::SceneRoot");
      sceneRoot.scene = pickUpPath;
      hiber3d.setComponent(pickUpEntity, "Hiber3D::SceneRoot", sceneRoot);
      hiber3d.addComponent(pickUpEntity, "Hiber3D::Name");
      hiber3d.setComponent(pickUpEntity, "Hiber3D::Name", "PickUpScene");
      hiber3d.addComponent(pickUpEntity, "Hiber3D::Transform");
      const x =
        pickUpLane === LANE.LEFT ? -1 :
          pickUpLane === LANE.RIGHT ? 1 :
            0; // TODO: Get width from scene
      const y =
        pickUpHeight === PICK_UP_HEIGHT.SLIDE ? 0.25 :
          pickUpHeight === PICK_UP_HEIGHT.RUN ? 0.5 :
            pickUpHeight === PICK_UP_HEIGHT.JUMP ? 2.5 :
              0; // TODO: Get height from scene
      const z =
        pickUpDepth === PICK_UP_DEPTH.MID ? -5 :
          0; // TODO: Get depth from scene
      const transform = hiber3d.getComponent(obstacleEntity, "Hiber3D::Transform");
      const position = transform.position;
      position.x = x;
      position.y = y;
      position.z = z;
      const scale = transform.scale;
      scale.x = pickUpScale;
      scale.y = pickUpScale;
      scale.z = pickUpScale;
      hiber3d.setComponent(pickUpEntity, "Hiber3D::Transform", transform);
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
    const outTransform = hiber3d.getComponent(out, "Hiber3D::ComputedWorldTransform");
    var newSegmentEntity = this.spawnSegmentScene(outTransform);
    const lastSegmentScene = hiber3d.getComponent(latestSegment, "SegmentScene");
    lastSegmentScene.next = newSegmentEntity;
    hiber3d.setComponent(latestSegment, "SegmentScene", lastSegmentScene);
    const newSegmentScene = hiber3d.getComponent(newSegmentEntity, "SegmentScene");
    newSegmentScene.prev = latestSegment;
    hiber3d.setComponent(newSegmentEntity, "SegmentScene", newSegmentScene);
  },

  onCreate() {
    const newSegmentsSceneEntity = hiber3d.createEntity();
    const segmentsState = hiber3d.getSingleton("SegmentsState");
    segmentsState.segmentsSceneEntity = newSegmentsSceneEntity;
    hiber3d.addComponent(newSegmentsSceneEntity, "Hiber3D::Name");
    hiber3d.addComponent(newSegmentsSceneEntity, "Hiber3D::Transform");
    hiber3d.setComponent(newSegmentsSceneEntity, "Hiber3D::Name", "SegmentsScenes");

    var transform = hiber3d.getComponent(this.entity, "Hiber3D::Transform");
    var newSegmentEntity = this.spawnSegmentScene(transform);
    segmentsState.currentSegmentSceneEntity = newSegmentEntity;
    hiber3d.setSingleton("SegmentsState", segmentsState);
  },
  update() {
    // When too few segments, spawn another
    const currentSegmentSceneEntity = hiber3d.getSingleton("SegmentsState").currentSegmentSceneEntity;
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
