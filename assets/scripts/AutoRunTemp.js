// This script will become obsolete and will be removed after [HIB-33606] and [HIB-33679]
({
  AUTO_RUN_DURATION: 4, // full duration
  AUTO_RUN_ASCEND_DURATION: 0.3, // fly up
  AUTO_RUN_DIP_DURATION: 0.3, // slight dip before power-up ends
  AUTO_RUN_DESCEND_DURATION: 0.3, // fly down
  AUTO_RUN_DESCEND_GROUNDED_DURATION: 1.0, // keep running

  AUTO_RUN_MAX_HEIGHT: 3.5,
  AUTO_RUN_DIP_HEIGHT_DIFF: 0.5, // 0.5 --> will dip from MAX_HEIGHT down to MAX_HEIGHT - 0.5

  // OBS: Duplicate in PathTypes.hpp
  STAGE: {
    UNDEFINED: 0,
    ASCEND: 1,
    MAX_HEIGHT: 2,
    DIP: 3,
    DESCEND: 4,
    GROUNDED: 5
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

  shouldRun() {
    return hiber3d.hasComponents(this.entity, "AutoRun") && !hiber3d.getValue("GameState", "paused");
  },
  getAutoRunStage() {
    const timeSinceStarted = hiber3d.getValue(this.entity, "AutoRun", "timeSinceStarted");
    if (timeSinceStarted < this.ascendEnd) {
      return this.STAGE.ASCEND;
    }
    if (timeSinceStarted < this.maxHeightEnd) {
      return this.STAGE.MAX_HEIGHT;
    }
    if (timeSinceStarted < this.dipEnd) {
      return this.STAGE.DIP;
    }
    if (timeSinceStarted < this.descendEnd) {
      return this.STAGE.DESCEND;
    }
    if (timeSinceStarted < this.end) {
      return this.STAGE.GROUNDED;
    }
    return this.STAGE.UNDEFINED;
  },
  getGroundHeight() {
    if (hiber3d.hasComponents(this.entity, "SplineData")) {
      return hiber3d.getValue(this.entity, "SplineData", "position", "y");
    }
    return 0;
  },
  getAutoRunHeight(stage) {
    const timeSinceStarted = hiber3d.getValue(this.entity, "AutoRun", "timeSinceStarted");
    if (stage === this.STAGE.ASCEND) {
      return scalarUtils.lerpScalar(0, this.AUTO_RUN_MAX_HEIGHT, timeSinceStarted / this.AUTO_RUN_ASCEND_DURATION);
    }
    if (stage === this.STAGE.MAX_HEIGHT) {
      return this.AUTO_RUN_MAX_HEIGHT;
    }
    if (stage === this.STAGE.DIP) {
      return scalarUtils.lerpScalar(this.AUTO_RUN_MAX_HEIGHT, this.AUTO_RUN_MAX_HEIGHT - this.AUTO_RUN_DIP_HEIGHT_DIFF, (timeSinceStarted - this.dipStart) / this.AUTO_RUN_DIP_DURATION);
    }
    if (stage === this.STAGE.DESCEND) {
      return scalarUtils.lerpScalar(this.AUTO_RUN_MAX_HEIGHT - this.AUTO_RUN_DIP_HEIGHT_DIFF, this.getGroundHeight(), (timeSinceStarted - this.descendStart) / this.AUTO_RUN_DESCEND_DURATION);
    }
    if (stage === this.STAGE.GROUNDED) {
      return this.getGroundHeight();
    }
    hiber3d.print("AutoRunTemp.js: Illegal stage value:'" + stage + "'");
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
  },
  update(dt) {
    if (!this.shouldRun()) {
      return;
    }
    const timeSinceStarted = hiber3d.getValue(this.entity, "AutoRun", "timeSinceStarted");
    hiber3d.setValue(this.entity, "AutoRun", "timeSinceStarted", timeSinceStarted + dt);

    // Started auto-running
    if (timeSinceStarted === 0) {
      hiber3d.writeEvent("BroadcastPowerupPickup", {});
      hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "autoRun", layer: ANIMATION_LAYER.ROLL, loop: true });
      const startingHeight = hiber3d.getValue(this.entity, "Hiber3D::ComputedWorldTransform", "position", "y");
      hiber3d.setValue(this.entity, "AutoRun", "startingHeight", startingHeight);
      isAutoRunning = true;
    }

    const newStage = this.getAutoRunStage();
    hiber3d.setValue(this.entity, "AutoRun", "stage", newStage);


    if (newStage === this.STAGE.UNDEFINED) { // End auto-running
      regUtils.removeComponentIfPresent(this.entity, "AutoRun");
      isAutoRunning = false;

    } else { // Continue auto-running

      if (newStage == this.STAGE.GROUNDED) { // "Land"
        hiber3d.writeEvent("CancelAnimation", { entity: this.entity, name: "autoRun" });
      }

      const newHeight = this.getAutoRunHeight(newStage);
      const startingHeight = hiber3d.getValue(this.entity, "AutoRun", "startingHeight");
      hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", "y", startingHeight + newHeight);
    }

  },
  onEvent(event, payload) {
  }
});