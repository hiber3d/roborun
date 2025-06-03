import * as regUtils from "scripts/utils/RegUtils.js";

export default class {
  PLAYER_SCENE = "scenes/Player.scene";
  DELAY = 2;

  timeSinceCreated = 0;
  replaceThisWithPlayer() {
    var playerEntity = regUtils.createChildToParent(regUtils.getParent(regUtils.getParent(regUtils.getParent(this.entity))));

    hiber3d.addComponent(playerEntity, "Hiber3D_Transform");

    hiber3d.addComponent(playerEntity, "Hiber3D_Name");
    hiber3d.setComponent(playerEntity, "Hiber3D_Name", "PlayerSceneInstance");

    hiber3d.addComponent(playerEntity, "Hiber3D_SceneInstance");
    hiber3d.setComponent(playerEntity, "Hiber3D_SceneInstance", "scene", this.PLAYER_SCENE);

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