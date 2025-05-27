import * as regUtils from "scripts/utils/RegUtils.js";

export class {
  shouldRun() {
    return hiber3d.getSingleton("GameState", "alive") && !hiber3d.getSingleton("GameState", "paused");
  }
  canStartSliding(){
    const isJumping = hiber3d.hasScripts(this.entity, "scripts/Jumping.js");
    const isAutoRunning = hiber3d.hasScripts(this.entity, "scripts/powerups/AutoRun.js");
    const isDiving = hiber3d.hasScripts(this.entity, "scripts/Diving.js");
    return !isJumping && !isAutoRunning && !isDiving;
  }
  onCreate() {
    hiber3d.addEventListener(this.entity, "SlideInput");
  }
  update(dt) {
  }
  onEvent(event, payload) {
    if (!this.shouldRun()) {
      return;
    }
    if (event === "SlideInput") {
      if (this.canStartSliding()) {

        if (hiber3d.hasScripts(this.entity, "scripts/Sliding.js")) {
          // TODO: Remove after [HIB-33909]
          var script = hiber3d.getScript(this.entity, "scripts/Sliding.js");
          script.timeSpentSliding = 0;
        } else {
          regUtils.addOrReplaceScript(this.entity, "scripts/Sliding.js");
        }
      }
    }
  }
}