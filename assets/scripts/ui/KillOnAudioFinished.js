({
  onCreate() {
  },
  onUpdate(dt) {
    if (!hiber3d.hasComponents(this.entity, "Hiber3D::AudioComponent")) {
      hiber3d.print("KillOnAudioFinished - no AudioComponent");
    }
  },
  onEvent(event, payload) {
  }
});