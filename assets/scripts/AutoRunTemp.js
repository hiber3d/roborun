// This script will become obsolete and will be removed after [HIB-33606] and [HIB-33679]
({
  AUTO_RUN_HEIGHT: 3.5,
  AUTO_RUN_DURATION: 4,
  AUTO_RUN_INTRO_DURATION: 0.3,
  AUTO_RUN_PRE_OUTRO_DURATION: 0.3,
  AUTO_RUN_PRE_OUTRO_HEIGHT_DIP: 0.5,
  AUTO_RUN_OUTRO_DURATION: 0.4,

  timeSpentAutoRunning: 0,
  wasAutoRunningLastTick: false,
  getAutoRunHeight() {
    // TODO: This assumes flat world
    if (this.timeSpentAutoRunning < this.AUTO_RUN_INTRO_DURATION) {
      // Intro
      return scalarUtils.lerpScalar(0, this.AUTO_RUN_HEIGHT, this.timeSpentAutoRunning / this.AUTO_RUN_INTRO_DURATION);
    } else if (this.timeSpentAutoRunning < this.AUTO_RUN_DURATION - this.AUTO_RUN_OUTRO_DURATION - this.AUTO_RUN_PRE_OUTRO_DURATION) {
      // default
      return this.AUTO_RUN_HEIGHT;
    } else if (this.timeSpentAutoRunning < this.AUTO_RUN_DURATION - this.AUTO_RUN_OUTRO_DURATION) {
      // Pre-outro
      return scalarUtils.lerpScalar(this.AUTO_RUN_HEIGHT, this.AUTO_RUN_HEIGHT - this.AUTO_RUN_PRE_OUTRO_HEIGHT_DIP, (this.timeSpentAutoRunning - (this.AUTO_RUN_DURATION - this.AUTO_RUN_OUTRO_DURATION - this.AUTO_RUN_PRE_OUTRO_DURATION)) / (this.AUTO_RUN_OUTRO_DURATION + this.AUTO_RUN_PRE_OUTRO_DURATION));
    } else {
      // Outro
      const groundHeight = 0;
      if (hiber3d.hasComponents(this.entity, "SplineData")) {
        const splineData = hiber3d.getValue(this.entity, "SplineData");
        groundHeight = splineData.position.y;
      }
      return scalarUtils.lerpScalar(this.AUTO_RUN_HEIGHT - this.AUTO_RUN_PRE_OUTRO_HEIGHT_DIP, groundHeight, (this.timeSpentAutoRunning - (this.AUTO_RUN_DURATION - this.AUTO_RUN_OUTRO_DURATION)) / this.AUTO_RUN_OUTRO_DURATION);
    }
  },
  onCreate() {
  },
  update(dt) {
    const isAutoRunning = hiber3d.hasComponents(this.entity, "AutoRun");
    if (isAutoRunning && !hiber3d.getValue("GameState", "paused")) {
      this.timeSpentAutoRunning += dt;
    } else if (!isAutoRunning) {
      this.timeSpentAutoRunning = 0;
    }

    // Start auto-running
    if (!this.wasAutoRunningLastTick && isAutoRunning) {
      hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "autoRun", layer: ANIMATION_LAYER.ROLL, loop: true });
      const startingHeight = hiber3d.getValue(this.entity, "Hiber3D::ComputedWorldTransform", "position", "y");
      hiber3d.setValue(this.entity, "AutoRun", "startingHeight", startingHeight);
    }

    if (isAutoRunning) {
      const newHeight = this.getAutoRunHeight();
      const startingHeight = hiber3d.getValue(this.entity, "AutoRun", "startingHeight");
      hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", "y", startingHeight + newHeight);
    }

    // Stop auto-running
    if (this.timeSpentAutoRunning >= (this.AUTO_RUN_DURATION - this.AUTO_RUN_OUTRO_DURATION)) {
      hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "run", layer: ANIMATION_LAYER.DEAD, loop: false });
      regUtils.removeComponentIfPresent(this.entity, "AutoRun");
    }

    this.wasAutoRunningLastTick = isAutoRunning;
  },
  onEvent(event, payload) {
  }
});