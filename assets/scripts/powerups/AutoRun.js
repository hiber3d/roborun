({
  AUTO_RUN_DURATION: 3, // full duration
  AUTO_RUN_ASCEND_DURATION: 0.3, // fly up
  AUTO_RUN_DIP_DURATION: 0.3, // slight dip before power-up ends
  AUTO_RUN_DESCEND_DURATION: 0.3, // fly down
  AUTO_RUN_DESCEND_GROUNDED_DURATION: 1.0, // keep running

  AUTO_RUN_MAX_HEIGHT: 3.5,
  AUTO_RUN_DIP_HEIGHT_DIFF: 0.5, // 0.5 --> will dip from MAX_HEIGHT down to MAX_HEIGHT - 0.5

  STAGE: {
    ASCEND: 0,
    MAX_HEIGHT: 1,
    DIP: 2,
    DESCEND: 3,
    GROUNDED: 4
  },

  // Assigned in onCreate()
  start: 0,
  ascendStart: 0,
  ascendEnd: 0,
  maxHeightStart: 0,
  maxHeightEnd: 0,
  dipStart: 0,
  dipEnd: 0,
  descendStart: 0,
  descendEnd: 0,
  groundedStart: 0,
  groundedEnd: 0,
  end: 0,

  stage: 0,
  timeSinceStarted: 0,
  startingHeightDiff: 0,
  latestHeightDiff: 0,

  shouldRun() {
    return !hiber3d.getValue("GameState", "paused");
  },
  updateStage() {
    if (this.timeSinceStarted < this.ascendEnd) {
      this.stage = this.STAGE.ASCEND;
    }
    else if (this.timeSinceStarted < this.maxHeightEnd) {
      this.stage = this.STAGE.MAX_HEIGHT;
    }
    else if (this.timeSinceStarted < this.dipEnd) {
      this.stage = this.STAGE.DIP;
    }
    else if (this.timeSinceStarted < this.descendEnd) {
      this.stage = this.STAGE.DESCEND;
    }
    else if (this.timeSinceStarted < this.end) {
      this.stage = this.STAGE.GROUNDED;
    }
  },
  getHeightDiff(stage) {
    if (stage === this.STAGE.ASCEND) {
      return scalarUtils.lerpScalar(this.startingHeightDiff, this.AUTO_RUN_MAX_HEIGHT, this.timeSinceStarted / this.AUTO_RUN_ASCEND_DURATION);
    }
    if (stage === this.STAGE.MAX_HEIGHT) {
      return this.AUTO_RUN_MAX_HEIGHT;
    }
    if (stage === this.STAGE.DIP) {
      return scalarUtils.lerpScalar(this.AUTO_RUN_MAX_HEIGHT, this.AUTO_RUN_MAX_HEIGHT - this.AUTO_RUN_DIP_HEIGHT_DIFF, (this.timeSinceStarted - this.dipStart) / this.AUTO_RUN_DIP_DURATION);
    }
    if (stage === this.STAGE.DESCEND) {
      return scalarUtils.lerpScalar(this.AUTO_RUN_MAX_HEIGHT - this.AUTO_RUN_DIP_HEIGHT_DIFF, 0, (this.timeSinceStarted - this.descendStart) / this.AUTO_RUN_DESCEND_DURATION);
    }
    if (stage === this.STAGE.GROUNDED) {
      return 0;
    }
    hiber3d.print("AutoRun.js: Illegal stage value:'" + stage + "'");
    return 0;
  },
  onCreate() {
    this.start = 0;
    this.ascendStart = this.start;
    this.ascendEnd = this.start + this.AUTO_RUN_ASCEND_DURATION;
    this.maxHeightStart = this.ascendEnd;
    this.maxHeightEnd = this.AUTO_RUN_DURATION - this.AUTO_RUN_DIP_DURATION - this.AUTO_RUN_DESCEND_DURATION - this.AUTO_RUN_DESCEND_GROUNDED_DURATION;
    this.dipStart = this.maxHeightEnd;
    this.dipEnd = this.dipStart + this.AUTO_RUN_DIP_DURATION;
    this.descendStart = this.dipEnd;
    this.descendEnd = this.descendStart + this.AUTO_RUN_DESCEND_DURATION;
    this.groundedStart = this.descendEnd;
    this.groundedEnd = this.groundedStart + this.AUTO_RUN_DESCEND_GROUNDED_DURATION;
    this.end = this.AUTO_RUN_DURATION;
    
    hiber3d.addEventListener(this.entity, "DivedEvent");
    hiber3d.addEventListener(this.entity, "JumpedEvent");
  },
  update(dt) {
    if (!this.shouldRun()) {
      return;
    }

    // Handle refresh
    if (this.timeSinceStarted === 0) {
      hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "autoRun", layer: ANIMATION_LAYER.ROLL, loop: true });
      this.startingHeightDiff = this.latestHeightDiff;
    }
    
    this.timeSinceStarted += dt;
    this.updateStage();

    if (this.timeSinceStarted >= this.end) { // End auto-running
      hiber3d.removeScript(this.entity, "scripts/powerups/AutoRun.js");

    } else { // Continue auto-running

      if (this.stage == this.STAGE.GROUNDED) { // "Land"
        hiber3d.writeEvent("CancelAnimation", { entity: this.entity, name: "autoRun" });
      }

      const newHeightDiff = this.getHeightDiff(this.stage);
      const newHeight = roboRunUtils.getSplineHeight(this.entity) + newHeightDiff;
      hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", "y", newHeight);
      this.latestHeightDiff = newHeightDiff;
    }
    
  },
  onEvent(event, payload) {
    // Cancel AutoRun if jumping or diving
    if(event === "JumpedEvent" || event === "DivedEvent"){
      if(payload.entity === this.entity){
        hiber3d.removeScript(this.entity, "scripts/powerups/AutoRun.js");
      }
    }
  }
});