const COOL_DOWN_TIMER_MS = 1000;

({
  shouldRun() {
    return hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform");
  },
  onCreate() {
    hiber3d.addEventListener(this.entity, "JumpedEvent");
    hiber3d.addEventListener(this.entity, "LandedEvent");
    hiber3d.addEventListener(this.entity, "BroadcastPowerupPickup");
    hiber3d.addEventListener(this.entity, "BroadcastSlided");
    hiber3d.addEventListener(this.entity, "BroadcastTilted");
    hiber3d.addEventListener(this.entity, "BroadcastTurned");
  },
  createAudioEntity(parent, name, asset, playSpeed, volume) {
    const sfxEntity = hiber3d.call("createEntityAsChild", parent);
    hiber3d.addComponent(sfxEntity, "Hiber3D::AudioComponent");
    hiber3d.addComponent(sfxEntity, "Hiber3D::Name"); // This is just to make it easier to trace which sounds have been added
    hiber3d.addComponent(sfxEntity, "Hiber3D::Transform"); // AudioModule expects entities to have both AudioComponent and Transform

    hiber3d.setValue(sfxEntity, "Hiber3D::Name", name);
    hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "asset", asset);
    hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "playSpeed", playSpeed);
    hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "volume", volume);

    hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "removeOnFinished", false); // Does this prevent SoLoud from causing crashes? Stay tuned! (pun intended)

    hiber3d.addScript(sfxEntity, "scripts/audio/KillOnAudioFinished.js");
  },
  onEvent(event, payload) {
    if (!this.shouldRun()) {
      return;
    }
    if (event === "JumpedEvent") {
      this.createAudioEntity(this.entity, "Jumped", "audio/sfx/jump_01.mp3", 1, 0.6);
    }
    else if (event === "LandedEvent") {
      this.createAudioEntity(this.entity, "Landed", "audio/sfx/land_01.mp3", 1, 0.6);
    }
    else if (event === "BroadcastPowerupPickup") {
      this.createAudioEntity(this.entity, "PowerupPickup", "audio/sfx/rocket_01.mp3", 1, 0.6);
    }
    else if (event === "BroadcastSlided") {
      this.createAudioEntity(this.entity, "Slided", "audio/sfx/roll_01.mp3", 1, 0.9);
    }
    else if (event === "BroadcastTilted") {
      this.createAudioEntity(this.entity, "Tilted", "audio/sfx/tilt_01.mp3", 0.9 + Math.random() * 0.2, 0.6);
    }
    else if (event === "BroadcastTurned") {
      this.createAudioEntity(this.entity, "Turned", "audio/sfx/turn_0" + Math.floor(1 + Math.random() * 2) + ".mp3", 1, 0.2);
    }
  }
});