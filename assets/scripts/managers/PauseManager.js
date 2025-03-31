({
  hasStarted: false,
  onCreate() {
    hiber3d.addEventListener(this.entity, "StartInput");
    hiber3d.addEventListener(this.entity, "PauseInput");
    hiber3d.addEventListener(this.entity, "UnpauseInput");
  },
  update() {
  },
  onEvent(event, payload) {
    if (event === "StartInput" && !this.hasStarted){
      hiber3d.setValue("GameState", "paused", false);
      hiber3d.writeEvent("BroadcastGameStarted", {})
      this.hasStarted = true;
    } else if (event === "PauseInput") {
      hiber3d.setValue("GameState", "paused", true);
    } else if (event === "UnpauseInput") {
      hiber3d.setValue("GameState", "paused", false);
    }
  },
});