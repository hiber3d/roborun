export default class {
  TIME_TO_DIFFICULTY_1 = 60;

  onCreate() {
    //hiber3d.setSingleton("GameState", "difficulty", 1); // For debugging "late-game"
  }

  onUpdate(dt) {
    if (hiber3d.getSingleton("GameState", "paused")) {
      return;
    }

    var difficulty = hiber3d.getSingleton("GameState", "difficulty");
    difficulty += dt * (1 / this.TIME_TO_DIFFICULTY_1);
    hiber3d.setSingleton("GameState", "difficulty", difficulty);
  }

  onEvent(event, payload) {
  }
}