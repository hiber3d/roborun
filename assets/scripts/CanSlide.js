({
  shouldRun() {
    const gameState = hiber3d.getSingleton("GameState");
    return gameState.alive && !gameState.paused;
  },
  canStartSliding(){
    const isJumping = hiber3d.hasScripts(this.entity, "scripts/Jumping.js");
    const isAutoRunning = hiber3d.hasScripts(this.entity, "scripts/powerups/AutoRun.js");
    const isDiving = hiber3d.hasScripts(this.entity, "scripts/Diving.js");
    return !isJumping && !isAutoRunning && !isDiving;
  },
  onCreate() {
    hiber3d.addEventListener(this.entity, "SlideInput");
  },
  update(dt) {
  },
  onEvent(event, payload) {
    if (!this.shouldRun()) {
      return;
    }
    if (event === "SlideInput") {
      if(this.canStartSliding()){
        regUtils.addOrReplaceScript(this.entity, "scripts/Sliding.js");
      }
    }
  }
});