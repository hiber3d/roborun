({
  onCreate() {
    hiber3d.addEventListener(this.entity, "SlideInput");
    hiber3d.addEventListener(this.entity, "AnimationFinished");
  },
  update(dt) {
  },
  onEvent(event, payload) {
    // Start sliding
    if (event === "SlideInput" && !hiber3d.hasComponents(this.entity, "Jumping")) {
      hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "slide", loop: false });
      hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "run", loop: true });
      regUtils.addComponentIfNotPresent(this.entity, "Sliding");
    }

    // Stop sliding
    if (event === "AnimationFinished" && payload.name === "slide") {
      regUtils.removeComponentIfPresent(this.entity, "Sliding");
    }
  }
});