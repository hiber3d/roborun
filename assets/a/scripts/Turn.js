const segUtils = require("a/scripts/utils/SegUtils.js");

({
  TURN_SPEED: 270, // degrees per second
  TURN_SPEED_DIFFICULTY_FACTOR: 1.5,
  TURN_SPEED_MAX: 3600,

  shouldRun() {
    return hiber3d.hasComponents(this.entity, "Hiber3D::Transform") &&
      hiber3d.getValue("GameState", "alive") &&
      !hiber3d.getValue("GameState", "paused");
  },
  onCreate() {
    hiber3d.addEventListener(this.entity, "TurnLeftInput");
    hiber3d.addEventListener(this.entity, "TurnRightInput");
  },
  update() {
    if (!this.shouldRun()) {
      return;
    }
    if (hiber3d.hasComponents(this.entity, "AutoTurn")) {
      regUtils.addComponentIfNotPresent(this.entity, "OnPath");
    }
    if (hiber3d.hasComponents(this.entity, "OnPath")) {
      const rotation = hiber3d.getValue(this.entity, "Hiber3D::Transform", "rotation");
      hiber3d.setValue("GameState", "direction", quatUtils.vectorFromQuaternion(rotation));
    }
  },
  onEvent(event, payload) {
    if (!this.shouldRun()) {
      return;
    }
    if (event === "TurnLeftInput" || event === "TurnRightInput") {
      const playerTurnsLeft = event === "TurnLeftInput";
      const playerTurnsRight = event === "TurnRightInput";
      const isAtLeftTurn = segUtils.isPlayerAtLeftTurn();
      const isAtRightTurn = segUtils.isPlayerAtRightTurn();

      const successfullTurn = (playerTurnsLeft && isAtLeftTurn) || (playerTurnsRight && isAtRightTurn);
      if (successfullTurn) {
        regUtils.addComponentIfNotPresent(this.entity, "OnPath");
        hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: playerTurnsLeft ? "turnLeft" : "turnRight", loop: false });

      } else if (playerTurnsLeft || playerTurnsRight) {
        // Player turns without being at a turn
        const rotation = hiber3d.getValue(this.entity, "Hiber3D::ComputedWorldTransform", "rotation");
        const direction = quatUtils.vectorFromQuaternion(rotation);
        const newDirection = vectorUtils.rotateVectorAroundY(direction, 45 * (playerTurnsLeft ? -1 : 1));
        hiber3d.setValue("GameState", "direction", newDirection);
        regUtils.removeComponentIfPresent(this.entity, "OnPath");
      }
    } else if (event === "ToggleAutoTurnDebugInput") {
      if (DEBUG) {
        if (hiber3d.hasComponents(this.entity, "AutoTurn")) {
          hiber3d.removeComponent(this.entity, "AutoTurn");
        } else {
          hiber3d.addComponent(this.entity, "AutoTurn");
        }
      }
    }
  },
});