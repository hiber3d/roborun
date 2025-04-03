({
  timeSinceJumped: 0,
  startHeight: 0,
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
  getDeltaHeight() {
    const maxHeight = 2.5;
    const timeToMaxHeight = 0.2;
    const maxHeightDuration = 0.15; // How long to stay at max height
    const gravityStrength = 30.0; // Increased for faster fall once it begins

    if (this.timeSinceJumped <= 0) {
      return 0;
    } else if (this.timeSinceJumped <= timeToMaxHeight) {
      // Rising phase - smooth quadratic rise to max height
      return maxHeight * (this.timeSinceJumped / timeToMaxHeight) * (2 - (this.timeSinceJumped / timeToMaxHeight));
    } else if (this.timeSinceJumped <= timeToMaxHeight + maxHeightDuration) {
      // Plateau phase - maintain max height
      return maxHeight;
    } else {
      // Falling phase - rapid fall after plateau
      const timeInFall = Math.max(0, this.timeSinceJumped - (timeToMaxHeight + maxHeightDuration));
      result = maxHeight - gravityStrength * Math.pow(timeInFall, 2);
      return result;
    }
  },
  onCreate() {
    const isAutoRunGround = hiber3d.hasScripts(this.entity, "scripts/powerups/AutoRun.js") && hiber3d.getScript(this.entity, "scripts/powerups/AutoRun.js").stage === 4;
    if (isAutoRunGround) {
      regUtils.removeScriptIfPresent(this.entity, "scripts/powerups/AutoRun.js");
    }
    regUtils.removeScriptIfPresent(this.entity, "scripts/Diving.js");

    this.startHeight = hiber3d.getValue(this.entity, "Hiber3D::Transform", "position", "y");

    hiber3d.writeEvent("CancelAnimation", { entity: this.entity, name: "slide" });
    hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "jump", layer: ANIMATION_LAYER.ACTION, loop: false });
    hiber3d.writeEvent("QueueAnimation", { playAnimation: { entity: this.entity, name: "fall", layer: ANIMATION_LAYER.FALL, loop: true } });
    hiber3d.writeEvent("JumpedEvent", { entity: this.entity });
  },
  update(dt) {
    if (!this.shouldRun()) {
      return;
    }
    
    this.timeSinceJumped += dt;
    const newJumpHeight = this.startHeight + this.getDeltaHeight();

    if (this.getIsInAir(newJumpHeight)) {
      hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", "y", newJumpHeight);
    } else {
      // landed
      hiber3d.writeEvent("CancelAnimation", { entity: this.entity, name: "fall" });
      hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "land", layer: ANIMATION_LAYER.ACTION, loop: false });
      hiber3d.writeEvent("LandedEvent", { entity: this.entity });
      hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", "y", this.getGroundHeight());
      
      hiber3d.removeScript(this.entity, "scripts/Jumping.js");
    }
  },
  onEvent(event, payload) {
  },
});