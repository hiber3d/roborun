({
  shouldRun() {
    return hiber3d.getValue("GameState", "alive") && !hiber3d.getValue("GameState", "paused");
  },
  canStartJumping(){
    const isJumping = hiber3d.hasScripts(this.entity, "scripts/Jumping.js");
    const isAutoRunAir = roboRunUtils.isAutoRunAir(this.entity);
    const isInAir = roboRunUtils.isInAir(this.entity, hiber3d.getValue(this.entity, "Hiber3D::Transform", "position", "y"));
    return !isJumping && !isAutoRunAir && !isInAir;
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