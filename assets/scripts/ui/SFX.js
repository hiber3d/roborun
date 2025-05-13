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
  createAudioEntity(parent, name, asset, playSpeed, volume) {
    const sfxEntity = hiber3d.call("createEntityAsChild", parent);
    hiber3d.addComponent(sfxEntity, "Hiber3D::AudioSource");
    hiber3d.addComponent(sfxEntity, "Hiber3D::Name"); // This is just to make it easier to trace which sounds have been added

    hiber3d.setValue(sfxEntity, "Hiber3D::Name", name);
    hiber3d.setValue(sfxEntity, "Hiber3D::AudioSource", "asset", asset);
    hiber3d.setValue(sfxEntity, "Hiber3D::AudioSource", "playSpeed", playSpeed);
    hiber3d.setValue(sfxEntity, "Hiber3D::AudioSource", "volume", volume);

    hiber3d.setValue(sfxEntity, "Hiber3D::AudioSource", "playbackMode", 3);
    hiber3d.setValue(sfxEntity, "Hiber3D::AudioSource", "inaudibleBehavior", 2);

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
      
      this.createAudioEntity(this.entity, "Collectible" + this.pickupsInARow, "audio/sfx/collectible.mp3", 0.8 + this.pickupsInARow * 0.04, 0.6);
    }
    else if (event === "BroadcastGameStarted") {
      this.createAudioEntity(this.entity, "GameStarted", "audio/sfx/tilt_01.mp3", 1, 0.6);
    }
    else if (event === "BroadcastPerfectCollectiblePickup") {
      this.createAudioEntity(this.entity, "PerfectPickup", "audio/sfx/success_01.mp3", 1, 0.7);
    }
  }
});