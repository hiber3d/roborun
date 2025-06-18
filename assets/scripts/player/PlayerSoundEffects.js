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

  playSound(parent, name, asset, playSpeed, volume) {
    const sfxEntity = hiber3d.call("createEntityAsChild", parent);
    hiber3d.addComponent(sfxEntity, "Hiber3D::AudioSource");
    hiber3d.addComponent(sfxEntity, "Hiber3D::Name"); // This is just to make it easier to trace which sounds have been added

    hiber3d.setComponent(sfxEntity, "Hiber3D::Name", name);
    hiber3d.setComponent(sfxEntity, "Hiber3D::AudioSource", "asset", asset);
    hiber3d.setComponent(sfxEntity, "Hiber3D::AudioSource", "playSpeed", playSpeed);
    hiber3d.setComponent(sfxEntity, "Hiber3D::AudioSource", "volume", volume);

    hiber3d.setComponent(sfxEntity, "Hiber3D::AudioSource", "playbackMode", 3);
  }

  onEvent(event, payload) {
    if (!this.shouldRun()) {
      return;
    }
    if (event === "JumpedEvent") {
      this.playSound(this.entity, "Jumped", "audio/sfx/jump_01.mp3", 1, 0.6);
    }
    else if (event === "LandedEvent") {
      this.playSound(this.entity, "Landed", "audio/sfx/land_01.mp3", 1, 0.6);
    }
    else if (event === "BroadcastPowerupPickup") {
      this.playSound(this.entity, "PowerupPickup", "audio/sfx/rocket_01.mp3", 1, 0.6);
    }
    else if (event === "BroadcastSlided") {
      this.playSound(this.entity, "Slided", "audio/sfx/roll_01.mp3", 1, 0.9);
    }
    else if (event === "BroadcastTilted") {
      this.playSound(this.entity, "Tilted", "audio/sfx/tilt_01.mp3", 0.9 + Math.random() * 0.2, 0.6);
    }
    else if (event === "BroadcastTurned") {
      this.playSound(this.entity, "Turned", "audio/sfx/turn_0" + Math.floor(1 + Math.random() * 2) + ".mp3", 1, 0.2);
    }
  }
}