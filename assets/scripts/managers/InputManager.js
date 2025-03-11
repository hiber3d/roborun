const KEYS = {
  START: 41, // W
  PAUSE: 36, // R

  TILT_LEFT: 19, // A
  TILT_RIGHT: 22, // D

  JUMP: 1, // SPACE
  DIVE: 37, // S
  SLIDE: 37, // S

  TURN_LEFT: 35, // Q
  TURN_RIGHT: 23, // E
  TOGGLE_AUTO_TURN_DEBUG: 38, // T
};

({
  onCreate() {
  },
  update(dt) {
    // Keyboard events
    if (hiber3d.call("keyIsPressed", KEYS.START)) {
      hiber3d.writeEvent("StartInput", {});
    }
    if (hiber3d.call("keyIsPressed", KEYS.PAUSE)) {
      hiber3d.writeEvent("PauseInput", {});
    }
    if (hiber3d.call("keyIsPressed", KEYS.TILT_LEFT) && !hiber3d.call("keyIsPressed", KEYS.TILT_RIGHT)) {
      hiber3d.writeEvent("TiltLeftInput", {});
    }
    else if (!hiber3d.call("keyIsPressed", KEYS.TILT_LEFT) && hiber3d.call("keyIsPressed", KEYS.TILT_RIGHT)) {
      hiber3d.writeEvent("TiltRightInput", {});
    }
    else if (hiber3d.call("keyJustReleased", KEYS.TILT_LEFT) || hiber3d.call("keyJustReleased", KEYS.TILT_RIGHT)) {
      hiber3d.writeEvent("TiltStraightInput", {});
    }
    if (hiber3d.call("keyIsPressed", KEYS.JUMP)) {
      hiber3d.writeEvent("JumpInput", {});
    }
    if (hiber3d.call("keyIsPressed", KEYS.DIVE)) {
      hiber3d.writeEvent("DiveInput", {});
    }
    if (hiber3d.call("keyJustPressed", KEYS.SLIDE)) {
      hiber3d.writeEvent("SlideInput", {});
    }
    if (hiber3d.call("keyIsPressed", KEYS.TURN_LEFT)) {
      hiber3d.writeEvent("TurnLeftInput", {});
    }
    if (hiber3d.call("keyIsPressed", KEYS.TURN_RIGHT)) {
      hiber3d.writeEvent("TurnRightInput", {});
    }
    if (hiber3d.call("keyIsPressed", KEYS.TOGGLE_AUTO_TURN_DEBUG)) {
      hiber3d.writeEvent("ToggleAutoTurnDebugInput", {});
    }
  },
  onEvent(event, payload) {
    // Touch events
    if (event === "Tilt") {
      if (Math.abs(payload) < 0.01) {
        hiber3d.writeEvent("TiltStraightInput", {});
      } else if (payload < 0) {
        hiber3d.writeEvent("TiltLeftInput", {});
      } else {
        hiber3d.writeEvent("TiltRightInput", {});
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
      if (event === "SwipedLeft") {
        hiber3d.writeEvent("TurnLeftInput", {});
      }
      if (event === "SwipedRight") {
        hiber3d.writeEvent("TurnRightInput", {});
      }
    }
  },
});