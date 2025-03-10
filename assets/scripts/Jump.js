({
  shouldRun() {
    return hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform") &&
      hiber3d.getValue("GameState", "alive") &&
      !hiber3d.getValue("GameState", "paused") &&
      segUtils.getCurrentStepEntity() !== undefined;
  },
  getDeltaHeight(timeSinceJumped, isDiving) {
    const maxHeight = 3;
    const timeToMaxHeight = isDiving ? 0.05 : 0.2;
    const maxHeightDuration = 0.15; // How long to stay at max height
    const gravityStrength = 30.0; // Increased for faster fall once it begins

    if (timeSinceJumped <= 0) {
      return 0;
    } else if (timeSinceJumped <= timeToMaxHeight) {
      // Rising phase - smooth quadratic rise to max height
      return maxHeight * (timeSinceJumped / timeToMaxHeight) * (2 - (timeSinceJumped / timeToMaxHeight));
    } else if (timeSinceJumped <= timeToMaxHeight + maxHeightDuration) {
      // Plateau phase - maintain max height
      return maxHeight;
    } else {
      // Falling phase - rapid fall after plateau
      const timeInFall = Math.max(0, timeSinceJumped - (timeToMaxHeight + maxHeightDuration));
      result = maxHeight - gravityStrength * Math.pow(timeInFall, 2);
      return result;
    }
  },
  onCreate() {
    hiber3d.addEventListener(this.entity, "JumpInput");
    hiber3d.addEventListener(this.entity, "DiveInput");
  },
  update(dt) {
    if (!this.shouldRun()) {
      return;
    }

    // In air
    if (hiber3d.hasComponents(this.entity, "Jumping")) {
      const newTimeSinceJumped = hiber3d.getValue(this.entity, "Jumping", "timeSinceJumped") + dt;
      const isDiving = hiber3d.getValue(this.entity, "Jumping", "isDiving");
      const newDeltaHeight = this.getDeltaHeight(newTimeSinceJumped, isDiving);
      const newJumpHeight = hiber3d.getValue(this.entity, "Jumping", "startHeight") + newDeltaHeight;

      hiber3d.setValue(this.entity, "Jumping", "timeSinceJumped", newTimeSinceJumped);
      hiber3d.setValue(this.entity, "Jumping", "deltaHeight", newDeltaHeight);

      var landed = false;
      if (hiber3d.hasComponents(this.entity, "SplineData")) {
        const splineHeight = hiber3d.getValue(this.entity, "SplineData", "position").y;
        landed = newJumpHeight <= splineHeight; // touches ground
      } else {
        landed = newDeltaHeight <= 0; // fallback
      }

      if (landed) {
        hiber3d.removeComponent(this.entity, "Jumping");
        if (!isDiving) {
          hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "land", loop: false });
          hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "run", loop: true });
        }
        if (roboRunUtils.isPlayer(this.entity)) {
          hiber3d.writeEvent("PlayerLanded", {});
        }
        hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", "y", 0);
      } else {
        hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", "y", newJumpHeight);
      }
    }
  },
  onEvent(event, payload) {
    if (!this.shouldRun()) {
      return;
    }
    if (event === "JumpInput") {
      if (!hiber3d.hasComponents(this.entity, "Jumping")) {
        hiber3d.addComponent(this.entity, "Jumping");
        const startHeight = hiber3d.getValue(this.entity, "Hiber3D::Transform", "position", "y");
        hiber3d.setValue(this.entity, "Jumping", "startHeight", startHeight);
        hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "jump", loop: false });
        hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "fall", loop: true });
        if (roboRunUtils.isPlayer(this.entity)) {
          hiber3d.writeEvent("PlayerJumped", {});
        }
      }
    } else if (event === "DiveInput") {
      if (hiber3d.hasComponents(this.entity, "Jumping")) {
        hiber3d.setValue(this.entity, "Jumping", "isDiving", true);
        hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "dive", loop: false });
        hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "run", loop: true });
      }
    }
  },
});