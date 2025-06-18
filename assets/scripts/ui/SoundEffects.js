const COOL_DOWN_TIMER_MS = 1000;

export default class {
  lastPickup = null;
  pickupsInARow = 0;

  shouldRun() {
    return hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform");
  }

  onCreate() {
    hiber3d.addEventListener(this, "BroadcastCollectiblePickup");
    hiber3d.addEventListener(this, "BroadcastGameStarted");
    hiber3d.addEventListener(this, "BroadcastPerfectCollectiblePickup");
  }

  playAudio(parent, name, asset, playSpeed, volume) {
    // TODO: Move this to the C++ source? Makes it harder to change, because you need to recompile...
    hiber3d.setSingleton("Hiber3D::AudioSettings", "maxActiveVoices", 32);

    const audioEntity = hiber3d.call("createEntityAsChild", parent);
    hiber3d.addComponent(audioEntity, "Hiber3D::AudioSource");
    hiber3d.addComponent(audioEntity, "Hiber3D::Name"); // This is just to make it easier to trace which sounds have been added

    hiber3d.setComponent(audioEntity, "Hiber3D::Name", name);
    hiber3d.setComponent(audioEntity, "Hiber3D::AudioSource", "asset", asset);
    hiber3d.setComponent(audioEntity, "Hiber3D::AudioSource", "playSpeed", playSpeed);
    hiber3d.setComponent(audioEntity, "Hiber3D::AudioSource", "volume", volume);

    hiber3d.setComponent(audioEntity, "Hiber3D::AudioSource", "playbackMode", 3);
  }

  onEvent(event, payload) {
    if (!this.shouldRun()) {
      return;
    }
    if (event === "BroadcastCollectiblePickup") {
      const now = Date.now();
      // if the last pickup was more than 1 second ago, reset the count
      if (this.lastPickup === null || now - this.lastPickup > COOL_DOWN_TIMER_MS) {
        this.pickupsInARow = 0;
      } else {
        // if the last pickup was less than 1 second ago, increment the count
        this.pickupsInARow += 1;
      }

      this.lastPickup = now;

      this.playAudio(
        this.entity,
        "Collectible" + this.pickupsInARow,
        "audio/sfx/collectible.mp3",
        0.8 + this.pickupsInARow * 0.04,
        0.6
      );
    } else if (event === "BroadcastGameStarted") {
      this.playAudio(this.entity, "GameStarted", "audio/sfx/tilt_01.mp3", 1, 0.6);
    } else if (event === "BroadcastPerfectCollectiblePickup") {
      this.playAudio(this.entity, "PerfectPickup", "audio/sfx/success_01.mp3", 1, 0.7);
    }
  }
}
