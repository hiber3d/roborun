({
  shouldRun() {
    return hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform") &&
      hiber3d.getValue("GameState", "alive") &&
      !hiber3d.getValue("GameState", "paused") &&
      segUtils.getCurrentStepEntity() !== undefined;
  },
  getGroundHeight(){
    return hiber3d.hasComponents(this.entity, "SplineData") ? hiber3d.getValue(this.entity, "SplineData", "position").y : 0;
  },
  getIsInAir(height){
      return height > this.getGroundHeight();
  },
  getDeltaHeight(timeSinceJumped) {
    const maxHeight = 2.5;
    const timeToMaxHeight = 0.2;
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
  },
  update(dt) {
    if (!this.shouldRun()) {
      return;
    }

    // In air
    if (hiber3d.hasComponents(this.entity, "Jumping")) {
      const newTimeSinceJumped = hiber3d.getValue(this.entity, "Jumping", "timeSinceJumped") + dt;
      const newDeltaHeight = this.getDeltaHeight(newTimeSinceJumped);
      const newJumpHeight = hiber3d.getValue(this.entity, "Jumping", "startHeight") + newDeltaHeight;

      hiber3d.setValue(this.entity, "Jumping", "timeSinceJumped", newTimeSinceJumped);
      hiber3d.setValue(this.entity, "Jumping", "deltaHeight", newDeltaHeight);

      if (this.getIsInAir(newJumpHeight)) {
        hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", "y", newJumpHeight);
      } else {
        // landed
        hiber3d.removeComponent(this.entity, "Jumping");
        hiber3d.writeEvent("CancelAnimation", { entity: this.entity, name: "fall" });
        hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "land", layer: ANIMATION_LAYER.ACTION, loop: false });
        hiber3d.writeEvent("LandedEvent", { entity: this.entity });
        hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", "y", this.getGroundHeight());
      }
    }
  },
  onEvent(event, payload) {
    if (!this.shouldRun()) {
      return;
    }
    if (event === "JumpInput") {
      const isAutoRunAir = hiber3d.hasScripts(this.entity, "scripts/powerups/AutoRun.js") && hiber3d.getScript(this.entity, "scripts/powerups/AutoRun.js").stage < 4;
      const isInAir = this.getIsInAir(hiber3d.getValue(this.entity, "Hiber3D::Transform", "position", "y"));
      if (!hiber3d.hasComponents(this.entity, "Jumping") && !isAutoRunAir && !isInAir) {
        const isAutoRunGround = hiber3d.hasScripts(this.entity, "scripts/powerups/AutoRun.js") && hiber3d.getScript(this.entity, "scripts/powerups/AutoRun.js").stage === 4;
        if (isAutoRunGround) {
          regUtils.removeScriptIfPresent(this.entity, "scripts/powerups/AutoRun.js");
        }
        regUtils.removeComponentIfPresent(this.entity, "Diving");
        regUtils.removeScriptIfPresent(this.entity, "scripts/Diving.js");
        hiber3d.addComponent(this.entity, "Jumping");
        const startHeight = hiber3d.getValue(this.entity, "Hiber3D::Transform", "position", "y");
        hiber3d.setValue(this.entity, "Jumping", "startHeight", startHeight);
        hiber3d.writeEvent("CancelAnimation", { entity: this.entity, name: "slide" });
        hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "jump", layer: ANIMATION_LAYER.ACTION, loop: false });
        hiber3d.writeEvent("QueueAnimation", { playAnimation: { entity: this.entity, name: "fall", layer: ANIMATION_LAYER.FALL, loop: true } });
        hiber3d.writeEvent("JumpedEvent", { entity: this.entity });
      }
    }
  },
});