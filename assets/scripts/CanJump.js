import * as regUtils from "scripts/utils/RegUtils.js";
import * as roboRunUtils from "scripts/utils/RoboRunUtils.js";

export default class {
  // Pre-jump is the concept of the player queueing up a potential future jump while currently in a state unable to jump.
  // Consider the player falling from a previous jump and then attempting a new jump right before hitting the ground.
  // This effect reduces the perception of missed inputs.
  MAX_PRE_JUMP_TIME = 0.25;

  timeSinceQueuedPreJump = -1; // -1 means no pre-jump queued
  shouldRun() {
    return hiber3d.getSingleton("GameState", "alive") && !hiber3d.getSingleton("GameState", "paused");
  }
  canStartJumping(){
    const isJumping = hiber3d.hasScripts(this.entity, "scripts/Jumping.js");
    const isAutoRunAir = roboRunUtils.isAutoRunAir(this.entity);
    const isInAir = roboRunUtils.isInAir(this.entity, hiber3d.getComponent(this.entity, "Hiber3D_Transform", "position", "y"));
    return !isJumping && !isAutoRunAir && !isInAir;
  }
  onCreate() {
    hiber3d.addEventListener(this, "JumpInput");
  }
  update(dt) {
    if(!this.shouldRun()){
      return;
    }

    if(this.timeSinceQueuedPreJump >= 0 && this.timeSinceQueuedPreJump < this.MAX_PRE_JUMP_TIME){
      if(this.canStartJumping()){
        regUtils.addOrReplaceScript(this.entity, "scripts/Jumping.js");
        this.timeSinceQueuedPreJump = -1;
      }
      this.timeSinceQueuedPreJump += dt;
    } 
  }
  onEvent(event, payload) {
    if (!this.shouldRun()) {
      return;
    }
    if (event === "JumpInput") {
      if (this.canStartJumping()) {
        regUtils.addOrReplaceScript(this.entity, "scripts/Jumping.js");
      } else {
        this.timeSinceQueuedPreJump = 0;
      }
    }
  }
}