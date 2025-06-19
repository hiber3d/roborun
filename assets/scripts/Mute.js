export default class {
  name = "";

  shouldRun() {
    return hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform");
  }

  onCreate() {
    this.name = hiber3d.getComponent(this.entity, "Hiber3D::Name");
    hiber3d.addEventListener(this, "MuteAudio");
    hiber3d.writeEvent("BroadcastRequestMuteState", {});
  }

  onEvent(event, payload) {
    if (!this.shouldRun()) {
      return;
    }
    if (event === "MuteAudio") {
      hiber3d.print("MuteAudio event received for entity: " + payload.doMute);
      hiber3d.setSingleton("Hiber3D::AudioSettings", "mainVolume", payload.doMute ? 0.0 : 1.0);
    }
  }
}
