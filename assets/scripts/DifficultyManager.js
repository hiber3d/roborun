({
  TIME_TO_DIFFICULTY_1: 60,

  onCreate() {
    //hiber3d.setValue("GameState", "difficulty", 1); // For debugging "late-game"
  },

  update(dt) {
    if (hiber3d.getValue("GameState", "paused")) {
      return;
    }

    var difficulty = hiber3d.getValue("GameState", "difficulty");
    difficulty += dt * (1 / this.TIME_TO_DIFFICULTY_1);
    hiber3d.setValue("GameState", "difficulty", difficulty);
  },

  onEvent(event, payload) {
  }
});