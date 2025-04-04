({
  DIVE_DURATION: 0.5,
  DIVE_SPEED_BASE: 1,
  DIVE_SPEED_ACCELERATION: 20,

  diveStartHeight: 0,
  timeSpentDivingInAir: 0,
  timeSpentDivingOnGround: 0,
  shouldRun() {
    return hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform") &&
      hiber3d.getValue("GameState", "alive") &&
      !hiber3d.getValue("GameState", "paused") &&
      segUtils.getCurrentStepEntity() !== undefined;
  },
  getDeltaHeight() {
    return Math.min(1, 1 - Math.pow(1 + this.DIVE_SPEED_BASE, this.timeSpentDivingInAir * this.DIVE_SPEED_ACCELERATION));
  },
  onCreate() {
    hiber3d.addEventListener(this.entity, "DiveInput");
    
    regUtils.removeScriptIfPresent(this.entity, "scripts/Jumping.js");
    regUtils.removeScriptIfPresent(this.entity, "scripts/powerups/AutoRun.js");

    this.diveStartHeight = hiber3d.getValue(this.entity, "Hiber3D::Transform", "position", "y");

    hiber3d.writeEvent("CancelAnimation", { entity: this.entity, name: "jump" });
    hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "dive", layer: ANIMATION_LAYER.ROLL, loop: true });
    hiber3d.writeEvent("DivedEvent", { entity: this.entity });
  },
  update(dt) {
    if (!this.shouldRun()) {
      return;
    }

    if (roboRunUtils.isInAir(this.entity, hiber3d.getValue(this.entity, "Hiber3D::Transform", "position", "y"))) {
      const newDeltaHeight = this.getDeltaHeight();
      const newDiveHeight = this.diveStartHeight + newDeltaHeight;

      if (roboRunUtils.isInAir(this.entity, newDiveHeight)) {
        hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", "y", newDiveHeight);
      } else {
        // landed
        hiber3d.writeEvent("LandedEvent", { entity: this.entity });
        hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", "y", roboRunUtils.getSplineHeight(this.entity));
      }

      this.timeSpentDivingInAir += dt;
    } else {
      this.timeSpentDivingOnGround += dt;
        hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", "y", roboRunUtils.getSplineHeight(this.entity));
      if (this.timeSpentDivingOnGround >= this.DIVE_DURATION) {
        hiber3d.writeEvent("CancelAnimation", { entity: this.entity, name: "dive" });
        hiber3d.removeScript(this.entity, "scripts/Diving.js");
      }
    }

  },
  onEvent(event, payload) {
  },
});