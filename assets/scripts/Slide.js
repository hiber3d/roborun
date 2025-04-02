({
  SLIDE_DURATION: 0.5,
  timeSpentSliding: 0,
    canStartSliding(){
      return !hiber3d.hasComponents(this.entity, "Jumping") &&
      !hiber3d.hasScripts(this.entity, "scripts/powerups/AutoRun.js") &&
      !hiber3d.hasScripts(this.entity, "scripts/Diving.js");
  },
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
    if (event === "SlideInput") {
      if(this.canStartSliding()){
        hiber3d.writeEvent("PlayAnimation", { entity: this.entity, name: "slide", layer: ANIMATION_LAYER.ROLL, loop: true });
        hiber3d.writeEvent("BroadcastSlided", {})
        regUtils.addComponentIfNotPresent(this.entity, "Sliding");
      }
    }
  }
});