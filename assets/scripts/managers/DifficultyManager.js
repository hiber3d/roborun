({
  TIME_TO_DIFFICULTY_1: 60,

  onCreate() {

  },

  update(dt) {
    if (hiber3d.getSingleton("GameState").paused) {
      return;
    }

    const gameState = hiber3d.getSingleton("GameState");
    var difficulty = gameState.difficulty;
    difficulty += dt * (1 / this.TIME_TO_DIFFICULTY_1);
    gameState.difficulty = difficulty;
    hiber3d.setSingleton("GameState", gameState);
  },

  onEvent(event, payload) {
  }
});