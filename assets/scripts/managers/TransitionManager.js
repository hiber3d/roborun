({
  TRANSITION_DURATION: 0.1,

  transitionDirection: -1,
  transitionValue: 1,
  passing(valueToPass, base, delta){
    if(base > valueToPass && base + delta < valueToPass){
      return true;
    }
    if(base < valueToPass && base + delta > valueToPass){
      return true;
    }
    return false;
  },
  onCreate() {
    hiber3d.addEventListener(this.entity, "FadeToBlack");
    hiber3d.addEventListener(this.entity, "FadeFromBlack");
    hiber3d.addEventListener(this.entity, "FadeToAndFromBlack");
    
    hiber3d.call("rmlCreateDataModel", "transition_model");
    this.transitionDirection = -1;
  },
  update(dt) {
    if (this.transitionDirection !== 0) {
      const normalizedDirection = this.transitionDirection > 0 ? 1 : -1;
      const delta = dt * normalizedDirection / this.TRANSITION_DURATION;
      const doneTransitioning = this.passing(0, this.transitionValue, delta) || this.passing(1, this.transitionValue, delta)
      if (doneTransitioning) {
        if (this.transitionDirection === 2) {
          this.transitionDirection = -1;
        } else {
          this.transitionDirection = 0;
        }
      }

      this.transitionValue += delta;
      this.transitionValue = scalarUtils.clampScalar(this.transitionValue, 0, 1);

      hiber3d.call("rmlSetDataModelString", "transition_model", "transitionValue", this.transitionValue.toString());
    }
  },
  onEvent(event, payload) {
    if (event === "FadeToBlack") {
      this.transitionDirection = 1;
    }
    if (event === "FadeFromBlack") {
      this.transitionDirection = -1;
    }
    if (event === "FadeToAndFromBlack") {
      this.transitionDirection = 2;
    }
  },
});