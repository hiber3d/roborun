export default class {
  hasStarted = false;
  onCreate() {
    hiber3d.addEventListener(this.entity, "StartInput");
    hiber3d.addEventListener(this.entity, "PauseInput");
    hiber3d.addEventListener(this.entity, "UnpauseInput");
    hiber3d.addEventListener(this.entity, "RestartInput");

    hiber3d.addEventListener(this.entity, "GameRestarted");
  }
  update() {
  }
  onEvent(event, payload) {

    if (event === "RestartInput") {
      hiber3d.writeEvent("RestartGame", {});
    } else if (event === "StartInput" && !this.hasStarted){
      hiber3d.setValue("GameState", "paused", false);
      hiber3d.writeEvent("BroadcastGameStarted", {})
      this.hasStarted = true;
    } else if (event === "PauseInput") {
      hiber3d.setValue("GameState", "paused", true);
    } else if (event === "UnpauseInput") {
      hiber3d.setValue("GameState", "paused", false);
    }

    if (event === "GameRestarted") {
      this.hasStarted = false;
    }
  }
}