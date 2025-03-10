const collisionUtils = require("scripts/utils/CollisionUtils.js");
const regUtils = require("scripts/utils/RegUtils.js");
const roboRunUtils = require("scripts/utils/RoboRunUtils.js");
const scalarUtils = require("scripts/utils/ScalarUtils.js");
const segUtils = require("scripts/utils/SegUtils.js");
const splineUtils = require("scripts/utils/SplineUtils.js");
const vectorUtils = require("scripts/utils/VectorUtils.js");
const quatUtils = require("scripts/utils/QuatUtils.js");

const DEBUG = false;

({
  onCreate() {
    hiber3d.addEventListener(this.entity, "StartInput");
    hiber3d.addEventListener(this.entity, "PauseInput");
  },
  update() {
  },
  onEvent(event, payload) {
    if (event === "StartInput") {
      hiber3d.setValue("GameState", "paused", false);
    } else if (event === "PauseInput") {
      hiber3d.setValue("GameState", "paused", true);
    }
  },
});