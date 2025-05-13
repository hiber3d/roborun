({
  name: "",

  shouldRun() {
    return hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform");
  },
  onCreate() {
    this.name = hiber3d.getValue(this.entity, "Hiber3D::Name");
    hiber3d.addEventListener(this.entity, "BroadcastGameStarted");
    hiber3d.addEventListener(this.entity, "BroadcastPlayerStats");
    hiber3d.addEventListener(this.entity, "GameRestarted");
  },
  update() {
    const audioStats = hiber3d.getValue("Hiber3D::AudioStats");
    hiber3d.print("Audio Stats: " + JSON.stringify(audioStats));
  },
  onEvent(event, payload) {
    if (!this.shouldRun()) {
      return;
    }
    if (event === "BroadcastGameStarted") {
      const volume = this.name === "drums_02" ? 1.0 : 0.0;
      hiber3d.setValue(this.entity, "Hiber3D::AudioSource", "volume", volume);
    }
    else if (event === "BroadcastPlayerStats") {
      const meters = payload.stats.meters;
      if (meters > 2500) {
        const volume = this.name === "bass_03" || this.name === "drums_02" ? 1.0 : 0.0;
        hiber3d.setValue(this.entity, "Hiber3D::AudioSource", "volume", volume);
      }
      else if (meters > 1000) {
        const volume = this.name === "bass_02" || this.name === "drums_02" ? 1.0 : 0.0;
        hiber3d.setValue(this.entity, "Hiber3D::AudioSource", "volume", volume);
      }
      else if (meters > 200) {
        const volume = this.name === "bass_01" || this.name === "drums_02" ? 1.0 : 0.0;
        hiber3d.setValue(this.entity, "Hiber3D::AudioSource", "volume", volume);
      }
    }
    else if (event === "GameRestarted") {
      const volume = this.name === "drums_01" ? 1.0 : 0.0;
      hiber3d.setValue(this.entity, "Hiber3D::AudioSource", "volume", volume);
    }
  }
});