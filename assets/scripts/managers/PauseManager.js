({
  hasStarted: false,
  onCreate() {
    hiber3d.addEventListener(this.entity, "StartInput");
    hiber3d.addEventListener(this.entity, "PauseInput");
    hiber3d.addEventListener(this.entity, "UnpauseInput");
    hiber3d.addEventListener(this.entity, "RestartInput");
  },
  update() {
  },
  onEvent(event, payload) {
    const gameState = hiber3d.getSingleton("GameState");
    if (event === "RestartInput") {
      hiber3d.writeEvent("RestartGame", {});
    } else if (event === "StartInput" && !this.hasStarted) {
      gameState.paused = false;
      hiber3d.setSingleton("GameState", gameState);
      hiber3d.writeEvent("BroadcastGameStarted", {})
      this.hasStarted = true;
    } else if (event === "PauseInput") {
      gameState.paused = true;
      hiber3d.setSingleton("GameState", gameState);
    } else if (event === "UnpauseInput") {
      gameState.paused = false;
      hiber3d.setSingleton("GameState", gameState);
    }
  },
});