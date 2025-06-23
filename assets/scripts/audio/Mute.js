export default class {
  shouldRun() {
    return hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform");
  }

  onCreate() {
    hiber3d.addEventListener(this, "MuteAudio");
    hiber3d.writeEvent("BroadcastRequestMuteState", {});
  }

  onEvent(event, payload) {
    if (!this.shouldRun()) {
      return;
    }
    if (event === "MuteAudio") {
      hiber3d.setSingleton("Hiber3D::AudioSettings", "mainVolume", payload.doMute ? 0.0 : 1.0);
    }
  }
}
