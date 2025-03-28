const KEYS = {
  START: 41, // W
  PAUSE: 40, // V
  UNPAUSE: 40, // V

  JUMP: 1, // SPACE
  DIVE: 37, // S
  SLIDE: 37, // S

  TURN_LEFT: 19, // A
  TURN_RIGHT: 22, // D
  TOGGLE_AUTO_TURN_DEBUG: 38, // T
};

({
  onCreate() {
    hiber3d.addEventListener(this.entity, "Hiber3D::SwipeEvent");
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
    if (hiber3d.call("keyJustPressed", KEYS.TURN_LEFT)) {
      hiber3d.writeEvent("LeftLaneInput", {});
    }
    if (hiber3d.call("keyJustPressed", KEYS.TURN_RIGHT)) {
      hiber3d.writeEvent("RightLaneInput", {});
    }
    if (hiber3d.call("keyJustPressed", KEYS.TOGGLE_AUTO_TURN_DEBUG)) {
      hiber3d.writeEvent("ToggleAutoRunDebugInput", {});
    }
  },
  onEvent(event, payload) {
    // Touch events

    // Start game on any non-tilt touch input
    if (hiber3d.getValue("GameState", "paused") === true) {
      hiber3d.writeEvent("StartInput", {});
      return;
    }

    if (event === "Hiber3D::SwipeEvent") {
      hiber3d.print("SwipedEvent");
      deltaX = payload.currentPosition.x - payload.originalPosition.x;
      deltaY = payload.currentPosition.y - payload.originalPosition.y;
      // Would be nice if the angle was already part of the payload, both degrees and radians
      const angle = Math.atan2(deltaX, deltaY);
      hiber3d.print(angle);
      // 0 means down, positive values are on the right, up is +-PI
      if (-Math.PI / 3 < angle && angle < Math.PI / 3) {
        hiber3d.print("SwipedEvent:Down");
        hiber3d.writeEvent("DiveInput", {});
        hiber3d.writeEvent("SlideInput", {});
      }
      else if (2 * Math.PI / 3 < Math.abs(angle) && Math.abs(angle) <= Math.PI) {
        hiber3d.print("SwipedEvent:Up");
        hiber3d.writeEvent("JumpInput", {});
      }
      if (5 * -Math.PI / 6 < angle && angle < -Math.PI / 6) {
        hiber3d.print("SwipedEvent:Left");
        hiber3d.writeEvent("TurnLeftInput", {});
        hiber3d.writeEvent("LeftLaneInput", {});
      }
      else if (Math.PI / 6 < angle && angle < 5 * Math.PI / 6)
      {
        hiber3d.print("SwipedEvent:Right");
        hiber3d.writeEvent("TurnRightInput", {});
        hiber3d.writeEvent("RightLaneInput", {});
      }
    }
    if (event === "LeftTapped") {
      hiber3d.print("LeftTapped");
      hiber3d.writeEvent("TurnLeftInput", {});
      hiber3d.writeEvent("LeftLaneInput", {});
    }
    if (event === "RightTapped") {
      hiber3d.print("RightTapped");
      hiber3d.writeEvent("TurnRightInput", {});
      hiber3d.writeEvent("LeftRightInput", {});
    }
    if (event === "SwipedUp") {
      hiber3d.print("SwipedUp");
    }
    if (event === "SwipedDown") {
      hiber3d.print("SwipedDown");
    }
    if (event === "SwipedLeft") {
      hiber3d.print("SwipedLeft");
    }
    if (event === "SwipedRight") {
      hiber3d.print("SwipedRight");
    }
  },
});