export class {
  DELAY = 3.5;
  SCENE = "scenes/RunningScene.scene";

  sceneChanged = false;
  timeSinceStarted = 0;
  onCreate() {
  }
  update(dt) {
    if (this.timeSinceStarted >= this.DELAY) {
      if (!this.sceneChanged) {
        const changeSceneEvent = { path: this.SCENE };
        hiber3d.writeEvent("ChangeScene", changeSceneEvent);
        hiber3d.writeEvent("GameRestarted", {});
        this.sceneChanged = true;
      }
    } else {
      this.timeSinceStarted += dt;
    }
  }
  onEvent(event, payload) {
  }
}