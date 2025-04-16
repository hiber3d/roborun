const KEYS = {
  START: 41, // W
  PAUSE: 40, // V
  UNPAUSE: 40, // V
  RESTART: 36, // R

  JUMP: 1, // SPACE
  DIVE: 37, // S
  SLIDE: 37, // S

  TURN_LEFT: 19, // A
  TURN_RIGHT: 22, // D
  TOGGLE_AUTO_TURN_DEBUG: 38, // T
};

({
  onCreate() {
    hiber3d.addEventListener(this.entity, "SwipedUp");
    hiber3d.addEventListener(this.entity, "SwipedDown");
    hiber3d.addEventListener(this.entity, "SwipedLeft");
    hiber3d.addEventListener(this.entity, "SwipedRight");
    hiber3d.addEventListener(this.entity, "LeftTapped");
    hiber3d.addEventListener(this.entity, "RightTapped");
  },
  update(dt) {
    // Keyboard events
    if (hiber3d.call("keyJustPressed", KEYS.START)) {
      hiber3d.writeEvent("StartInput", {});
    }
    if (hiber3d.call("keyJustPressed", KEYS.PAUSE) && !hiber3d.getValue("GameState", "paused")) {
      hiber3d.writeEvent("PauseInput", {});
    }
    if (hiber3d.call("keyJustPressed", KEYS.UNPAUSE) && hiber3d.getValue("GameState", "paused")) {
      hiber3d.writeEvent("UnpauseInput", {});
    }
    if (hiber3d.call("keyJustPressed", KEYS.JUMP)) {
      hiber3d.writeEvent("JumpInput", {});
    }
    if (hiber3d.call("keyJustPressed", KEYS.DIVE)) {
      hiber3d.writeEvent("DiveInput", {});
    }
    if (hiber3d.call("keyJustPressed", KEYS.SLIDE)) {
      hiber3d.writeEvent("SlideInput", {});
    }
    if (hiber3d.call("keyJustPressed", KEYS.TURN_LEFT)) {
      hiber3d.writeEvent("TurnLeftInput", {});
    }
    if (hiber3d.call("keyJustPressed", KEYS.TURN_RIGHT)) {
      hiber3d.writeEvent("TurnRightInput", {});
    }
    if (hiber3d.call("keyJustPressed", KEYS.TURN_LEFT)) {
      hiber3d.writeEvent("LeftLaneInput", {});
    }
    if (hiber3d.call("keyJustPressed", KEYS.TURN_RIGHT)) {
      hiber3d.writeEvent("RightLaneInput", {});
    }
    if (hiber3d.call("keyJustPressed", KEYS.RESTART)) {
      hiber3d.writeEvent("RestartInput", {});
    }
  },
  onEvent(event, payload) {
    // Touch events

    // Start game on any touch input
    if (hiber3d.getValue("GameState", "paused") === true) {
      hiber3d.writeEvent("StartInput", {});
      return;
    }

    if (event === "LeftTapped" || event === "SwipedLeft") {
      hiber3d.writeEvent("TurnLeftInput", {});
      hiber3d.writeEvent("LeftLaneInput", {});
    }
    if (event === "RightTapped" || event === "SwipedRight") {
      hiber3d.writeEvent("TurnRightInput", {});
      hiber3d.writeEvent("RightLaneInput", {});
    }

    if (event === "SwipedUp") {
      hiber3d.writeEvent("JumpInput", {});
    }
    if (event === "SwipedDown") {
      hiber3d.writeEvent("DiveInput", {});
    }
    if (event === "SwipedDown") {
      hiber3d.writeEvent("SlideInput", {});
    }
  },
});