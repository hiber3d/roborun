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
    hiber3d.addEventListener(this.entity, "ToggleAutoRunDebugInput");
  },
  update() {
    if (!this.shouldRun()) {
      return;
    }
    if (hiber3d.hasScripts(this.entity, "scripts/powerups/AutoRun.js")) {
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
      const isOnPath = hiber3d.hasComponents(this.entity, "OnPath");
      const playerTurnsLeft = event === "TurnLeftInput";
      const playerTurnsRight = event === "TurnRightInput";
      const isAtLeftTurn = segUtils.isPlayerAtLeftTurn();
      const isAtRightTurn = segUtils.isPlayerAtRightTurn();

      const successfullTurn = (playerTurnsLeft && isAtLeftTurn) || (playerTurnsRight && isAtRightTurn);
      if (successfullTurn) {
        regUtils.addComponentIfNotPresent(this.entity, "OnPath");
        hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: playerTurnsLeft ? "turnLeft" : "turnRight", layer: ANIMATION_LAYER.ACTION, loop: false });
        hiber3d.writeEvent("BroadcastTurned", {});

      } else if ((playerTurnsLeft || playerTurnsRight) && !isOnPath) {
        // Player turns without being at a turn
        const rotation = hiber3d.getValue(this.entity, "Hiber3D::ComputedWorldTransform", "rotation");
        const direction = quatUtils.vectorFromQuaternion(rotation);
        const newDirection = vectorUtils.rotateVectorAroundY(direction, 45 * (playerTurnsLeft ? -1 : 1));
        hiber3d.setValue("GameState", "direction", newDirection);
        regUtils.removeComponentIfPresent(this.entity, "OnPath");
      }
    } else if (event === "ToggleAutoRunDebugInput") {
      if (DEBUG) {
        if (hiber3d.hasScripts(this.entity, "scripts/powerups/AutoRun.js")) {
          hiber3d.removeComponent(this.entity, "AutoRun");
        } else {
          hiber3d.addComponent(this.entity, "AutoRun");
        }
      }
    }
  },
});