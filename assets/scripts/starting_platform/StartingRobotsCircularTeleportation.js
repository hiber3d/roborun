import * as regUtils from "scripts/utils/RegUtils.js";

export default class {
  SENDER_X = 12;
  RECEIVER_X = -9;
  shouldRun() {
    return hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform");
  }
  teleport() {
    const worldTransform = hiber3d.getComponent(this.entity, "Hiber3D::ComputedWorldTransform", "position");
    const newPosition = { x: this.RECEIVER_X, y: worldTransform.y, z: worldTransform.z };
    hiber3d.setComponent(this.entity, "Hiber3D::Transform", "position", regUtils.worldToLocalPosition(this.entity, newPosition));
  }
  onCreate() {
  }
  update(dt) {
    if (!this.shouldRun()) {
      return;
    }
    const currentX = hiber3d.getComponent(this.entity, "Hiber3D::ComputedWorldTransform", "position", "x");
    if (currentX >= this.SENDER_X) {
      this.teleport();
    }
  }

  onEvent(event, payload) {
  }
}