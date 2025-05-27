import * as regUtils from "scripts/utils/RegUtils.js";

export class {
  PLAYER_SCENE = "scenes/Player.scene";
  DELAY = 2;

  timeSinceCreated = 0;
  replaceThisWithPlayer() {
    var playerEntity = regUtils.createChildToParent(regUtils.getParent(regUtils.getParent(regUtils.getParent(this.entity))));

    hiber3d.addComponent(playerEntity, "Hiber3D::Transform");

    hiber3d.addComponent(playerEntity, "Hiber3D::Name");
    hiber3d.setValue(playerEntity, "Hiber3D::Name", "PlayerSceneRoot");

    hiber3d.addComponent(playerEntity, "Hiber3D::SceneRoot");
    hiber3d.setValue(playerEntity, "Hiber3D::SceneRoot", "scene", this.PLAYER_SCENE);

    regUtils.destroyEntity(this.entity);
  }
  onCreate() {
  }
  update(dt) {
    if (this.timeSinceCreated >= this.DELAY) {
      this.replaceThisWithPlayer();
    } else {
      this.timeSinceCreated += dt;
    }
  }
  onEvent(event, payload) {
  }
}