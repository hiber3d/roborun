const collisionUtils = require("a/scripts/utils/CollisionUtils.js");
const regUtils = require("a/scripts/utils/RegUtils.js");
const roboRunUtils = require("a/scripts/utils/RoboRunUtils.js");
const scalarUtils = require("a/scripts/utils/ScalarUtils.js");
const segUtils = require("a/scripts/utils/SegUtils.js");
const splineUtils = require("a/scripts/utils/SplineUtils.js");
const vectorUtils = require("a/scripts/utils/VectorUtils.js");
const quatUtils = require("a/scripts/utils/QuatUtils.js");

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