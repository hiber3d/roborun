import * as registry from "hiber3d:registry";
import * as hierarchy from "hiber3d:hierarchy";

export default class {
  PLAYER_SCENE = "scenes/Player.scene";
  DELAY = 2;

  timeSinceCreated = 0;
  replaceThisWithPlayer() {
    var playerEntity = hierarchy.createEntityAsChild(hierarchy.getParent(hierarchy.getParent(hierarchy.getParent(this.entity))));

    hiber3d.addComponent(playerEntity, "Hiber3D::Transform");

    hiber3d.addComponent(playerEntity, "Hiber3D::Name");
    hiber3d.setComponent(playerEntity, "Hiber3D::Name", "PlayerSceneInstance");

    hiber3d.addScript(playerEntity, "scripts/audio/PlayerSoundEffects.js");

    hiber3d.addComponent(playerEntity, "Hiber3D::SceneInstance");
    hiber3d.setComponent(playerEntity, "Hiber3D::SceneInstance", "scene", this.PLAYER_SCENE);

    registry.destroyEntity(this.entity);
  }
  onCreate() {
  }
  onUpdate(dt) {
    if (this.timeSinceCreated >= this.DELAY) {
      this.replaceThisWithPlayer();
    } else {
      this.timeSinceCreated += dt;
    }
  }
  onEvent(event, payload) {
  }
}