export default class {

  name = "";

  shouldRun() {
    return hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform");
  }
  onCreate() {
    this.name = hiber3d.getComponent(this.entity, "Hiber3D::Name");
    hiber3d.addEventListener(this, "BroadcastGameStarted");
    hiber3d.addEventListener(this, "BroadcastPlayerStats");
    hiber3d.addEventListener(this, "GameRestarted");
  }
  onEvent(event, payload) {
    if (!this.shouldRun()) {
      return;
    }
    if (event === "BroadcastGameStarted") {
      const volume = this.name === "drums_02" ? 1.0 : 0.0;
      hiber3d.setComponent(this.entity, "Hiber3D::AudioSource", "volume", volume);
    }
    else if (event === "BroadcastPlayerStats") {
      const meters = payload.stats.meters;
      if (meters > 2500) {
        const volume = this.name === "bass_03" || this.name === "drums_02" ? 1.0 : 0.0;
        hiber3d.setComponent(this.entity, "Hiber3D::AudioSource", "volume", volume);
      }
      else if (meters > 1000) {
        const volume = this.name === "bass_02" || this.name === "drums_02" ? 1.0 : 0.0;
        hiber3d.setComponent(this.entity, "Hiber3D::AudioSource", "volume", volume);
      }
      else if (meters > 200) {
        const volume = this.name === "bass_01" || this.name === "drums_02" ? 1.0 : 0.0;
        hiber3d.setComponent(this.entity, "Hiber3D::AudioSource", "volume", volume);
      }
    }
    else if (event === "GameRestarted") {
      const volume = this.name === "drums_01" ? 1.0 : 0.0;
      hiber3d.setComponent(this.entity, "Hiber3D::AudioSource", "volume", volume);
    }
  }
}