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
  onEvent(event, payload) {
    if (!this.shouldRun()) {
      return;
    }
    if (event === "JumpedEvent") {
      const sfxEntity = hiber3d.call("createEntityAsChild", this.entity);
      hiber3d.addComponent(sfxEntity, "Hiber3D::AudioComponent");
      hiber3d.addComponent(sfxEntity, "Hiber3D::Name");
      hiber3d.addComponent(sfxEntity, "Hiber3D::Transform");
      
      hiber3d.setValue(sfxEntity, "Hiber3D::Name", "Jumped");
      hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "asset", "audio/sfx/jump_01.mp3");
      hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "removeOnFinished", false);
      hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "volume", 0.6);
      hiber3d.addScript(sfxEntity, "scripts/ui/KillOnAudioFinished.js");
    }
    else if (event === "LandedEvent") {
      const sfxEntity = hiber3d.call("createEntityAsChild", this.entity);
      hiber3d.addComponent(sfxEntity, "Hiber3D::AudioComponent");
      hiber3d.addComponent(sfxEntity, "Hiber3D::Name");
      hiber3d.addComponent(sfxEntity, "Hiber3D::Transform");
      
      hiber3d.setValue(sfxEntity, "Hiber3D::Name", "Landed");
      hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "asset", "audio/sfx/land_01.mp3");
      hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "removeOnFinished", false);
      hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "volume", 0.6);
      hiber3d.addScript(sfxEntity, "scripts/ui/KillOnAudioFinished.js");
    }
    else if (event === "BroadcastPowerupPickup") {
      const sfxEntity = hiber3d.call("createEntityAsChild", this.entity);
      hiber3d.addComponent(sfxEntity, "Hiber3D::AudioComponent");
      hiber3d.addComponent(sfxEntity, "Hiber3D::Name");
      hiber3d.addComponent(sfxEntity, "Hiber3D::Transform");
      
      hiber3d.setValue(sfxEntity, "Hiber3D::Name", "PowerupPickup");
      hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "asset", "audio/sfx/rocket_01.mp3");
      hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "removeOnFinished", false);
      hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "volume", 0.6);
      hiber3d.addScript(sfxEntity, "scripts/ui/KillOnAudioFinished.js");
    }
    else if (event === "BroadcastSlided") {
      const sfxEntity = hiber3d.call("createEntityAsChild", this.entity);
      hiber3d.addComponent(sfxEntity, "Hiber3D::AudioComponent");
      hiber3d.addComponent(sfxEntity, "Hiber3D::Name");
      hiber3d.addComponent(sfxEntity, "Hiber3D::Transform");
      
      hiber3d.setValue(sfxEntity, "Hiber3D::Name", "Slided");
      hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "asset", "audio/sfx/roll_01.mp3");
      hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "removeOnFinished", false);
      hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "volume", 0.9);
      hiber3d.addScript(sfxEntity, "scripts/ui/KillOnAudioFinished.js");
    }
    else if (event === "BroadcastTilted") {
      const sfxEntity = hiber3d.call("createEntityAsChild", this.entity);
      hiber3d.addComponent(sfxEntity, "Hiber3D::AudioComponent");
      hiber3d.addComponent(sfxEntity, "Hiber3D::Name");
      hiber3d.addComponent(sfxEntity, "Hiber3D::Transform");
      
      hiber3d.setValue(sfxEntity, "Hiber3D::Name", "Tilted");
      hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "asset", "audio/sfx/tilt_01.mp3");
      hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "playSpeed", 0.9 + Math.random() * 0.2); 
      hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "removeOnFinished", false);
      hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "volume", 0.6);
      hiber3d.addScript(sfxEntity, "scripts/ui/KillOnAudioFinished.js");
    }
    else if (event === "BroadcastTurned") {
      const sfxEntity = hiber3d.call("createEntityAsChild", this.entity);
      hiber3d.addComponent(sfxEntity, "Hiber3D::AudioComponent");
      hiber3d.addComponent(sfxEntity, "Hiber3D::Name");
      hiber3d.addComponent(sfxEntity, "Hiber3D::Transform");
      
      hiber3d.setValue(sfxEntity, "Hiber3D::Name", "Turned");
      hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "asset", "audio/sfx/turn_0" + Math.floor(1 + Math.random() * 2) + ".mp3");
      hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "removeOnFinished", false);
      hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "volume", 0.2);
      hiber3d.addScript(sfxEntity, "scripts/ui/KillOnAudioFinished.js");
    }
  }
});