({
  DIVE_DURATION: 0.5,
  DIVE_SPEED_BASE: 1,
  DIVE_SPEED_ACCELERATION: 20,

  diveStartHeight: 0,
  timeSpentDivingInAir: 0,
  timeSpentDivingOnGround: 0,
  shouldRun() {
    const gameState = hiber3d.getSingleton("GameState");
    return hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform") &&
      gameState.alive &&
      !gameState.paused &&
      !regUtils.isNullEntity(segUtils.getCurrentStepEntity()) ;
  },
  getDeltaHeight() {
    return Math.min(1, 1 - Math.pow(1 + this.DIVE_SPEED_BASE, this.timeSpentDivingInAir * this.DIVE_SPEED_ACCELERATION));
  },
  onCreate() {
    hiber3d.addEventListener(this.entity, "DiveInput");

    regUtils.removeScriptIfPresent(this.entity, "scripts/Jumping.js");
    regUtils.removeScriptIfPresent(this.entity, "scripts/powerups/AutoRun.js");

    this.diveStartHeight = hiber3d.getComponent(this.entity, "Hiber3D::Transform").position.y;

    const cancelAnimation = new CancelAnimation();
    cancelAnimation.entity = this.entity; cancelAnimation.jump = "jump";
    hiber3d.writeEvent("CancelAnimation", cancelAnimation);

    const playAnimation = new PlayAnimation();
    playAnimation.entity = this.entity; playAnimation.name = "dive"; playAnimation.layer = ANIMATION_LAYER.ROLL; playAnimation.loop = true;
    hiber3d.writeEvent("PlayAnimation", playAnimation);

    const divedEvent = new DivedEvent();
    divedEvent.entity = this.entity;
    hiber3d.writeEvent("DivedEvent", divedEvent);
  },
  update(dt) {
    if (!this.shouldRun()) {
      return;
    }

    const transform = hiber3d.getComponent(this.entity, "Hiber3D::Transform");
    if (roboRunUtils.isInAir(this.entity, transform.position.y)) {
      const newDeltaHeight = this.getDeltaHeight();
      const newDiveHeight = this.diveStartHeight + newDeltaHeight;

      if (roboRunUtils.isInAir(this.entity, newDiveHeight)) {
        transform.position.y = newDiveHeight;
        hiber3d.setComponent(this.entity, "Hiber3D::Transform", transform);
      } else {
        // landed
        const landedEvent = new LandedEvent();
        landedEvent.entity = this.entity;
        hiber3d.writeEvent("LandedEvent", landedEvent);
        transform.position.y = roboRunUtils.getSplineHeight(this.entity);
        hiber3d.setComponent(this.entity, "Hiber3D::Transform", transform);
      }

      this.timeSpentDivingInAir += dt;
    } else {
      this.timeSpentDivingOnGround += dt;
      transform.position.y = roboRunUtils.getSplineHeight(this.entity);
      hiber3d.setComponent(this.entity, "Hiber3D::Transform", transform);
      if (this.timeSpentDivingOnGround >= this.DIVE_DURATION) {
        const cancelAnimation = new CancelAnimation();
        cancelAnimation.entity = this.entity; cancelAnimation.name = "dive";
        hiber3d.writeEvent("CancelAnimation", cancelAnimation);
        hiber3d.removeScript(this.entity, "scripts/Diving.js");
      }
    }

  },
  onEvent(event, payload) {
  },
});