({
  PLAYER_SCENE: "scenes/Player.scene",
  DELAY: 2,

  timeSinceCreated: 0,
  replaceThisWithPlayer() {
    var playerEntity = regUtils.createChildToParent(regUtils.getParent(regUtils.getParent(regUtils.getParent(this.entity))));

    hiber3d.addComponent(playerEntity, "Hiber3D::Transform");

    hiber3d.addComponent(playerEntity, "Hiber3D::Name");
    hiber3d.setComponent(playerEntity, "Hiber3D::Name", "PlayerSceneRoot");

    hiber3d.addComponent(playerEntity, "Hiber3D::SceneRoot");
    const sceneRoot = hiber3d.getComponent(playerEntity, "Hiber3D::SceneRoot");
    sceneRoot.scene = this.PLAYER_SCENE;
    hiber3d.setComponent(playerEntity, "Hiber3D::SceneRoot", sceneRoot);

    regUtils.destroyEntity(this.entity);
  },
  onCreate() {
  },
  update(dt) {
    if (this.timeSinceCreated >= this.DELAY) {
      this.replaceThisWithPlayer();
    } else {
      this.timeSinceCreated += dt;
    }
  },
  onEvent(event, payload) {
  }
});