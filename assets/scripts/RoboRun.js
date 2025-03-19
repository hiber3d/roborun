const collisionUtils = require("scripts/utils/CollisionUtils.js");
const regUtils = require("scripts/utils/RegUtils.js");
const roboRunUtils = require("scripts/utils/RoboRunUtils.js");
const scalarUtils = require("scripts/utils/ScalarUtils.js");
const segUtils = require("scripts/utils/SegUtils.js");
const splineUtils = require("scripts/utils/SplineUtils.js");
const vectorUtils = require("scripts/utils/VectorUtils.js");
const quatUtils = require("scripts/utils/QuatUtils.js");

const DEBUG = false;

// Duplicate in AnimatedTypes.hpp
const ANIMATION_LAYER = {
  UNDEFINED: 0,
  BASE: 1,
  FALL: 2,
  ACTION: 3,
  ROLL: 4,
  DEAD: 5,
  DYING: 6,
};

({
  hasStarted: false,
  onCreate() {
    hiber3d.addEventListener(this.entity, "StartInput");
    hiber3d.addEventListener(this.entity, "PauseInput");
    hiber3d.addEventListener(this.entity, "UnpauseInput");
  },
  update() {
  },
  onEvent(event, payload) {
    if (event === "StartInput" && !this.hasStarted){
      hiber3d.setValue("GameState", "paused", false);
      hiber3d.writeEvent("BroadcastGameStarted", {})
      this.hasStarted = true;
    } else if (event === "PauseInput") {
      hiber3d.setValue("GameState", "paused", true);
    } else if (event === "UnpauseInput") {
      hiber3d.setValue("GameState", "paused", false);
    }
  },
});