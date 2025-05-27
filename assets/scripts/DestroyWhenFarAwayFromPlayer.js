import * as vectorUtils from "scripts/utils/VectorUtils.js";
import * as regUtils from "scripts/utils/RegUtils.js";

export default class {
  DISTANCE = 50;
  shouldRun() {
    const playerEntity = hiber3d.getSingleton("GameState", "playerEntity");
    return (playerEntity !== undefined && playerEntity !== regUtils.NULL_ENTITY) &&
      hiber3d.hasComponents(playerEntity, "Hiber3D_ComputedWorldTransform") &&
      hiber3d.hasComponents(this.entity, "Hiber3D_ComputedWorldTransform");
  }
  onCreate() {
  }
  update(dt) {
    if (this.shouldRun() === false) {
      return;
    }
    const playerEntity = hiber3d.getSingleton("GameState", "playerEntity");
    const playerPosition = hiber3d.getComponent(playerEntity, "Hiber3D_ComputedWorldTransform", "position");
    const position = hiber3d.getComponent(this.entity, "Hiber3D_ComputedWorldTransform", "position");
    if (!vectorUtils.inRange(playerPosition, position, this.DISTANCE)) {
      regUtils.destroyEntity(this.entity);
    }
  }
  onEvent(event, payload) {
  }
}