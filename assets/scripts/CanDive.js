({
  shouldRun() {
    const gameState = hiber3d.getSingleton("GameState");
    return gameState.alive && !gameState.paused;
  },
  canStartDiving(){
    const isJumping = hiber3d.hasScripts(this.entity, "scripts/Jumping.js");
    const isAutoRunning = hiber3d.hasScripts(this.entity, "scripts/powerups/AutoRun.js");
    const isDiving = hiber3d.hasScripts(this.entity, "scripts/Diving.js");
    return (isJumping || isAutoRunning) && !isDiving;
  },
  onCreate() {
    hiber3d.addEventListener(this.entity, "DiveInput");
  },
  update(dt) {
  },
  onEvent(event, payload) {
    if (!this.shouldRun()) {
      return;
    }
    if (event === "DiveInput") {
      if (this.canStartDiving()) {
        regUtils.addOrReplaceScript(this.entity, "scripts/Diving.js");
      }
    }
  },
});