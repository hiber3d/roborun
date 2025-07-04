import * as audioUtils from "scripts/utils/AudioUtils.js";

export default class {
  shouldRun() {
    return hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform");
  }

  onCreate() {
    hiber3d.addEventListener(this, "JumpedEvent");
    hiber3d.addEventListener(this, "LandedEvent");
    hiber3d.addEventListener(this, "BroadcastPowerupPickup");
    hiber3d.addEventListener(this, "BroadcastSlided");
    hiber3d.addEventListener(this, "BroadcastTilted");
    hiber3d.addEventListener(this, "BroadcastTurned");
  }

  onEvent(event, payload) {
    if (!this.shouldRun()) {
      return;
    }
    if (event === "JumpedEvent") {
      audioUtils.playAudio3D(this.entity, "Jumped", "audio/sfx/jump_01.mp3", 1, 0.6);
    }
    else if (event === "LandedEvent") {
      audioUtils.playAudio3D(this.entity, "Landed", "audio/sfx/land_01.mp3", 1, 0.6);
    }
    else if (event === "BroadcastPowerupPickup") {
      audioUtils.playAudio3D(this.entity, "PowerupPickup", "audio/sfx/rocket_01.mp3", 1, 0.6);
    }
    else if (event === "BroadcastSlided") {
      audioUtils.playAudio3D(this.entity, "Slided", "audio/sfx/roll_01.mp3", 1, 0.9);
    }
    else if (event === "BroadcastTilted") {
      audioUtils.playAudio3D(this.entity, "Tilted", "audio/sfx/tilt_01.mp3", 0.9 + Math.random() * 0.2, 0.6);
    }
    else if (event === "BroadcastTurned") {
      audioUtils.playAudio3D(this.entity, "Turned", "audio/sfx/turn_0" + Math.floor(1 + Math.random() * 2) + ".mp3", 1, 0.2);
    }
  }
}