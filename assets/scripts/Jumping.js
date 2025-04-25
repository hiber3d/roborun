({
  timeSinceJumped: 0,
  startHeight: 0,
  shouldRun() {
    const gameState = hiber3d.getSingleton("GameState");
    return hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform") &&
      gameState.alive &&
      !gameState.paused &&
      segUtils.getCurrentStepEntity() !== undefined;
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
    if (roboRunUtils.isAutoRunGround(this.entity)) {
      regUtils.removeScriptIfPresent(this.entity, "scripts/powerups/AutoRun.js");
    }
    regUtils.removeScriptIfPresent(this.entity, "scripts/Diving.js");

    this.startHeight = hiber3d.getComponent(this.entity, "Hiber3D::Transform").position.y;

    const cancelAnimation = new globalThis["CancelAnimation"]();
    cancelAnimation.entity = this.entity; cancelAnimation.name = "slide";
    hiber3d.writeEvent("CancelAnimation", cancelAnimation);

    const playAnimation = new globalThis["PlayAnimation"]();
    playAnimation.entity = this.entity; playAnimation.name = "jump"; playAnimation.layer = ANIMATION_LAYER.ACTION; playAnimation.loop = false;
    hiber3d.writeEvent("PlayAnimation", playAnimation);

    const queueAnimation = new globalThis["QueueAnimation"]();
    const playAnimation2 = queueAnimation.playAnimation;
    playAnimation2.entity = this.entity; playAnimation2.name = "fall"; playAnimation2.layer = ANIMATION_LAYER.FALL; playAnimation2.loop = true;
    hiber3d.writeEvent("QueueAnimation", queueAnimation);

    const jumpedEvent = new globalThis["JumpedEvent"]();
    jumpedEvent.entity = this.entity;
    hiber3d.writeEvent("JumpedEvent", jumpedEvent);
  },
  update(dt) {
    if (!this.shouldRun()) {
      return;
    }

    this.timeSinceJumped += dt;
    const newJumpHeight = this.startHeight + this.getDeltaHeight();

    const transform = hiber3d.getComponent(this.entity, "Hiber3D::Transform");
    if (roboRunUtils.isInAir(this.entity, newJumpHeight)) {
      transform.position.y = newJumpHeight;
      hiber3d.setComponent(this.entity, "Hiber3D::Transform", transform);
    } else {
      // landed

      const cancelAnimation = new globalThis["CancelAnimation"]();
      cancelAnimation.entity = this.entity; cancelAnimation.name = "fall";
      hiber3d.writeEvent("CancelAnimation", cancelAnimation);

      const playAnimation = new globalThis["PlayAnimation"]();
      playAnimation.entity = this.entity; playAnimation.name = "land"; playAnimation.layer = ANIMATION_LAYER.ACTION; playAnimation.loop = false;
      hiber3d.writeEvent("PlayAnimation", playAnimation);

      const landedEvent = new globalThis["LandedEvent"]();
      landedEvent.entity = this.entity;
      hiber3d.writeEvent("LandedEvent", landedEvent);

      transform.position.y = roboRunUtils.getSplineHeight(this.entity);
      hiber3d.setComponent(this.entity, "Hiber3D::Transform", transform);

      hiber3d.removeScript(this.entity, "scripts/Jumping.js");
    }
  },
  onEvent(event, payload) {
  },
});