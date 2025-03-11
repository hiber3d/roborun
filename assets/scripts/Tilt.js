({
  TILT_ENABLED: true,
  SECONDS_TO_TILT: 0.1,

  tiltFactor: 0,
  tiltFactorPreviousTick: 0,
  lerpedTiltFactorPreviousTick: 0,
  shouldRun() {
    return this.TILT_ENABLED &&
      hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform") &&
      (hiber3d.hasComponents(this.entity, "OnPath") || hiber3d.hasComponents(this.entity, "AutoTurn")) &&
      hiber3d.getValue("GameState", "alive") &&
      !hiber3d.getValue("GameState", "paused") &&
      segUtils.getCurrentStepEntity() !== undefined;
  },
  onCreate() {
    hiber3d.addEventListener(this.entity, "TiltStraightInput");
    hiber3d.addEventListener(this.entity, "TiltLeftInput");
    hiber3d.addEventListener(this.entity, "TiltRightInput");
  },
  update(dt) {
    if (!this.shouldRun()) {
      return;
    }

    const lerpedTiltFactor = this.lerpedTiltFactorPreviousTick + (this.tiltFactor - this.lerpedTiltFactorPreviousTick) * dt / this.SECONDS_TO_TILT;
    regUtils.addComponentIfNotPresent(this.entity, "TiltFactor")
    hiber3d.setValue(this.entity, "TiltFactor", "factor", lerpedTiltFactor);

    if (
      this.tiltFactor < 0 && this.tiltFactorPreviousTick === 0 ||
      this.tiltFactor < 1 && this.tiltFactorPreviousTick === 1) {
      hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "tiltLeft", loop: false });
    } else if (
      this.tiltFactor > 0 && this.tiltFactorPreviousTick === 0 ||
      this.tiltFactor > -1 && this.tiltFactorPreviousTick === -1) {
      hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "tiltRight", loop: false });
    }

    this.tiltFactorPreviousTick = this.tiltFactor;
    this.lerpedTiltFactorPreviousTick = lerpedTiltFactor;
  },
  onEvent(event, payload) {
    if (event === "TiltStraightInput") {
      this.tiltFactor = 0;
    } else if (event === "TiltLeftInput") {
      this.tiltFactor = -1;
    } else if (event === "TiltRightInput") {
      this.tiltFactor = 1;
    }
  },
});