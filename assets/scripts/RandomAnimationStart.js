({
  speedFactor: 0,
  speedingTicksLeft: 1,
  setSpeedFactor(increase){
    
    if(increase === true){
      this.speedFactor = 100 + Math.random() * 10000;
    }
    const newFactor = increase === true ? this.speedFactor : 1 / this.speedFactor;

    var animationBlend = hiber3d.getValue(this.entity, "Hiber3D::AnimationBlend");
    animationBlend.layers[0].speed *= newFactor;
    hiber3d.setValue(this.entity, "Hiber3D::AnimationBlend", animationBlend);
  },
  onCreate() {
    this.setSpeedFactor(true);

  },

  update(deltaTime) {
    if(this.speedingTicksLeft >= 0){
      if(this.speedingTicksLeft === 0){
        this.setSpeedFactor(false);
      }

      this.speedingTicksLeft -= 1;
    }
  },

  onEvent(event, payload) {

  }
});