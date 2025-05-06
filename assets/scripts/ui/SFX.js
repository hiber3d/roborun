const COOL_DOWN_TIMER_MS = 1000;

({
  lastPickup: null,
  pickupsInARow: 0,

  shouldRun() {
    return hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform");
  },
  onCreate() {
    hiber3d.addEventListener(this.entity, "BroadcastCollectiblePickup");
    hiber3d.addEventListener(this.entity, "BroadcastGameStarted");
    hiber3d.addEventListener(this.entity, "BroadcastPerfectCollectiblePickup");
  },
  onEvent(event, payload) {
    if (!this.shouldRun()) {
      return;
    }
    if (event === "BroadcastCollectiblePickup") {
      const now = Date.now(); 
      // if the last pickup was more than 1 second ago, reset the count
      if (this.lastPickup === null || (now - this.lastPickup) > COOL_DOWN_TIMER_MS) {
        this.pickupsInARow = 0;
      } else {
        // if the last pickup was less than 1 second ago, increment the count
        this.pickupsInARow += 1;
      }

      this.lastPickup = now;

      const sfxEntity = hiber3d.call("createEntityAsChild", this.entity);
      hiber3d.addComponent(sfxEntity, "Hiber3D::AudioComponent");
      hiber3d.addComponent(sfxEntity, "Hiber3D::Name");
      hiber3d.addComponent(sfxEntity, "Hiber3D::Transform");
      
      hiber3d.setValue(sfxEntity, "Hiber3D::Name", "Collectible" + this.pickupsInARow);
      hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "asset", "audio/sfx/collectible.wav");
      hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "playSpeed", 0.8 + this.pickupsInARow * 0.04);
      hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "removeOnFinished", false);
      hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "volume", 0.6);
      hiber3d.addScript(sfxEntity, "scripts/ui/KillOnAudioFinished.js");
    }
    else if (event === "BroadcastGameStarted") {
      const sfxEntity = hiber3d.call("createEntityAsChild", this.entity);
      hiber3d.addComponent(sfxEntity, "Hiber3D::AudioComponent");
      hiber3d.addComponent(sfxEntity, "Hiber3D::Name");
      hiber3d.addComponent(sfxEntity, "Hiber3D::Transform");
      
      hiber3d.setValue(sfxEntity, "Hiber3D::Name", "GameStarted");
      hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "asset", "audio/sfx/tilt_01.mp3");
      hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "removeOnFinished", false);
      hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "volume", 0.6);
      hiber3d.addScript(sfxEntity, "scripts/ui/KillOnAudioFinished.js");
    }
    else if (event === "BroadcastPerfectCollectiblePickup") {
      const sfxEntity = hiber3d.call("createEntityAsChild", this.entity);
      hiber3d.addComponent(sfxEntity, "Hiber3D::AudioComponent");
      hiber3d.addComponent(sfxEntity, "Hiber3D::Name");
      hiber3d.addComponent(sfxEntity, "Hiber3D::Transform");
      
      hiber3d.setValue(sfxEntity, "Hiber3D::Name", "PerfectPickup");
      hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "asset", "audio/sfx/success_01.mp3");
      hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "removeOnFinished", false);
      hiber3d.setValue(sfxEntity, "Hiber3D::AudioComponent", "volume", 0.7);
      hiber3d.addScript(sfxEntity, "scripts/ui/KillOnAudioFinished.js");
    }
  }
});