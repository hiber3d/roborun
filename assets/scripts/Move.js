import * as vectorUtils from "scripts/utils/VectorUtils.js";

export default class {
  DIRECTION = { x: 1, y: 0, z: 0 };
  SPEED = 1.5;

  shouldRun() {
    return hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform");
  }
  onCreate() {
  }
  update(dt) {
    if(!this.shouldRun()) {
      return;
    }
    const position = hiber3d.getComponent(this.entity, "Hiber3D::Transform", "position");
    const newPosition = vectorUtils.addVectors(position, vectorUtils.multiplyVector(this.DIRECTION, this.SPEED * dt)); 
    hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", newPosition);
  }
  onEvent(event, payload) {
  }
}