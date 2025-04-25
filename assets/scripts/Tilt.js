({
  TILT_ENABLED: true,
  SECONDS_TO_TILT: 0.1,

  tiltFactor: 0,
  tiltFactorPreviousTick: 0,
  lerpedTiltFactorPreviousTick: 0,
  shouldRun() {
    const gameState = hiber3d.getSingleton("GameState");
    return this.TILT_ENABLED &&
      hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform") &&
      (hiber3d.hasComponents(this.entity, "OnPath") || hiber3d.hasScripts(this.entity, "scripts/powerups/AutoRun.js")) &&
      gameState.alive &&
      !gameState.paused &&
      segUtils.getCurrentStepEntity() !== undefined;
  },
  onCreate() {
    hiber3d.addEventListener(this.entity, "LeftLaneInput");
    hiber3d.addEventListener(this.entity, "RightLaneInput");
  },
  update(dt) {
    if (!this.shouldRun()) {
      return;
    }

    const lerpedTiltFactor = this.lerpedTiltFactorPreviousTick + (this.tiltFactor - this.lerpedTiltFactorPreviousTick) * dt / this.SECONDS_TO_TILT;
    regUtils.addComponentIfNotPresent(this.entity, "TiltFactor")
    const tiltFactor = hiber3d.getComponent(this.entity, "TiltFactor");
    tiltFactor.factor = lerpedTiltFactor;
    hiber3d.setComponent(this.entity, "TiltFactor", tiltFactor);

    if (
      this.tiltFactor < 0 && this.tiltFactorPreviousTick === 0 ||
      this.tiltFactor < 1 && this.tiltFactorPreviousTick === 1) {
      const playAnimation = new PlayAnimation();
      playAnimation.entity = this.entity; playAnimation.name = "tiltLeft"; playAnimation.layer = ANIMATION_LAYER.ACTION; playAnimation.loop = false;
      hiber3d.writeEvent("PlayAnimation", playAnimation);
      hiber3d.writeEvent("BroadcastTilted", new BroadcastTilted())
    } else if (
      this.tiltFactor > 0 && this.tiltFactorPreviousTick === 0 ||
      this.tiltFactor > -1 && this.tiltFactorPreviousTick === -1) {
      const playAnimation = new PlayAnimation();
      playAnimation.entity = this.entity; playAnimation.name = "tiltRight"; playAnimation.layer = ANIMATION_LAYER.ACTION; playAnimation.loop = false
      hiber3d.writeEvent("PlayAnimation", playAnimation);
      hiber3d.writeEvent("BroadcastTilted", new BroadcastTilted())

    }

    this.tiltFactorPreviousTick = this.tiltFactor;
    this.lerpedTiltFactorPreviousTick = lerpedTiltFactor;
  },
  onEvent(event, payload) {
    if (hiber3d.hasComponents(this.entity, "OnPath")) {
      if (event === "LeftLaneInput") {
        this.tiltFactor = Math.max(-1, this.tiltFactor - 1);
      } else if (event === "RightLaneInput") {
        this.tiltFactor = Math.min(1, this.tiltFactor + 1);
      }
    }
  },
});