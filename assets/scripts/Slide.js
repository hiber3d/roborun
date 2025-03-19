({
  SLIDE_DURATION: 0.5,
  timeSpentSliding: 0,
  onCreate() {
    hiber3d.addEventListener(this.entity, "SlideInput");
    hiber3d.addEventListener(this.entity, "AnimationFinished");
  },
  update(dt) {
    if (hiber3d.hasComponents(this.entity, "Sliding")) {
      this.timeSpentSliding += dt;
    } else {
      this.timeSpentSliding = 0;
    }

    // Stop sliding
    if (this.timeSpentSliding >= this.SLIDE_DURATION) {
      hiber3d.writeEvent("CancelAnimation", { entity: this.entity, name: "slide" });
      regUtils.removeComponentIfPresent(this.entity, "Sliding");
    }
  },
  onEvent(event, payload) {
    // Start sliding
    if (event === "SlideInput" && !hiber3d.hasComponents(this.entity, "Jumping") && !hiber3d.hasComponents(this.entity, "AutoRun")) {
      hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "slide", layer: ANIMATION_LAYER.ROLL, loop: true });
      regUtils.addComponentIfNotPresent(this.entity, "Sliding");
    }
  }
});