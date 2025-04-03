({
  shouldRun() {
    return hiber3d.getValue("GameState", "alive") && !hiber3d.getValue("GameState", "paused");
  },
  canStartJumping(){
    const isJumping = hiber3d.hasScripts(this.entity, "scripts/Jumping.js");
    const isAutoRunAir = hiber3d.hasScripts(this.entity, "scripts/powerups/AutoRun.js") && hiber3d.getScript(this.entity, "scripts/powerups/AutoRun.js").stage < 4;
    const isInAir = this.getIsInAir(hiber3d.getValue(this.entity, "Hiber3D::Transform", "position", "y"));
    return !isJumping && !isAutoRunAir && !isInAir;
  },
  getGroundHeight(){
    return hiber3d.hasComponents(this.entity, "SplineData") ? hiber3d.getValue(this.entity, "SplineData", "position").y : 0;
  },
  getIsInAir(height){
      return height > this.getGroundHeight();
  },
  onCreate() {
    hiber3d.addEventListener(this.entity, "JumpInput");
  },
  update(dt) {
  },
  onEvent(event, payload) {
    if (!this.shouldRun()) {
      return;
    }
    if (event === "JumpInput") {
      if (this.canStartJumping()) {
        regUtils.addOrReplaceScript(this.entity, "scripts/Jumping.js");
      }
    }
  },
});