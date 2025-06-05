import * as regUtils from "scripts/utils/RegUtils.js";

export default class {
  PLAYER_SCENE = "scenes/starting_platform/StartingPlayer.scene";

  MOST_SUITABLE_LOCATION_X = -1.5;

  tryReplace = false;
  hasReplaceStartingRobotWithStartingPlayer = false;
  getStartingRobotToReplace() {
    const startingRobots = hiber3d.findEntitiesWithScript("scripts/starting_platform/StartingRobotsCircularTeleportation.js");
    var closestEntity = undefined;
    var closestDistance = Number.MAX_VALUE;
    for (var i = 0; i < startingRobots.length; i++) {
      const startingRobot = startingRobots[i];
      if (!hiber3d.hasComponents(startingRobot, "Hiber3D::ComputedWorldTransform")) {
        continue;
      }
      const position = hiber3d.getComponent(startingRobot, "Hiber3D::ComputedWorldTransform", "position");
      const distance = Math.abs(position.x - this.MOST_SUITABLE_LOCATION_X);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestEntity = startingRobot;
      }
    }
    if(closestEntity === undefined) {
      hiber3d.print("ReplaceStartingRobotWithStartingPlayerOnStart.js - No starting robot found");
    }
    return closestEntity;
  }
  replaceStartingRobotWithStartingPlayer() {
    if (this.hasReplaceStartingRobotWithStartingPlayer === true) {
      return;
    }
    const startingRobotEntityToReplace = this.getStartingRobotToReplace();
    if (startingRobotEntityToReplace === undefined) {
      return;
    }
    this.hasReplaceStartingRobotWithStartingPlayer = true;

    const transformToSpawnPlayerAt = hiber3d.getComponent(startingRobotEntityToReplace, "Hiber3D::ComputedWorldTransform");

    var playerEntity = regUtils.createChildToParent(this.entity);

    hiber3d.addComponent(playerEntity, "Hiber3D::Transform");
    hiber3d.setComponent(playerEntity, "Hiber3D::Transform", transformToSpawnPlayerAt);

    hiber3d.addComponent(playerEntity, "Hiber3D::Name");
    hiber3d.setComponent(playerEntity, "Hiber3D::Name", "StartingPlayerSceneInstance");

    hiber3d.addComponent(playerEntity, "Hiber3D::SceneInstance");
    hiber3d.setComponent(playerEntity, "Hiber3D::SceneInstance", "scene", this.PLAYER_SCENE);

    regUtils.destroyEntity(startingRobotEntityToReplace);
  }
  onCreate() {
    hiber3d.addEventListener(this, "StartInput");

    if (hiber3d.getSingleton("GameState", "autoStart") === true) {
      hiber3d.writeEvent("StartInput", {});
    }
  }
  onUpdate(dt) {
    if(this.tryReplace === true && this.hasReplaceStartingRobotWithStartingPlayer === false) {
      this.replaceStartingRobotWithStartingPlayer();
    }
  }
  onEvent(event, payload) {
    if (event === "StartInput") {
      this.tryReplace = true;
    }
  }
}