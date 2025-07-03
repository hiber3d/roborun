export default class {
  shouldRun() {
    return hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform");
  }

  onCreate() {
    hiber3d.addEventListener(this, "ToggleMuteAudio");
    hiber3d.writeEvent("RequestMuteState", {});
  }

  onEvent(event, payload) {
    if (!this.shouldRun()) {
      return;
    }
    if (event === "ToggleMuteAudio") {
      hiber3d.setSingleton("Hiber3D::AudioSettings", "mainVolume", payload.mute ? 0.0 : 1.0);
    }
  }
}
