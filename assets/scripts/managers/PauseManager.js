export default class {
  hasStarted = false;
  onCreate() {
    hiber3d.addEventListener(this, "StartInput");
    hiber3d.addEventListener(this, "PauseInput");
    hiber3d.addEventListener(this, "UnpauseInput");
    hiber3d.addEventListener(this, "RestartInput");

    hiber3d.addEventListener(this, "GameRestarted");
  }
  update() {
  }
  onEvent(event, payload) {

    if (event === "RestartInput") {
      hiber3d.writeEvent("RestartGame", {});
    } else if (event === "StartInput" && !this.hasStarted){
      hiber3d.setSingleton("GameState", "paused", false);
      hiber3d.writeEvent("BroadcastGameStarted", {})
      this.hasStarted = true;
    } else if (event === "PauseInput") {
      hiber3d.setSingleton("GameState", "paused", true);
    } else if (event === "UnpauseInput") {
      hiber3d.setSingleton("GameState", "paused", false);
    }

    if (event === "GameRestarted") {
      this.hasStarted = false;
    }
  }
}