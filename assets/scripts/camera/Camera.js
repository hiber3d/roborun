import * as vectorUtils from "scripts/utils/VectorUtils.js";
import * as scalarUtils from "scripts/utils/ScalarUtils.js";
import * as regUtils from "scripts/utils/RegUtils.js";

export default class {
  FOV_LERP_SPEED = 0.05;
  FOV_FACTOR_AUTO_RUN = 1.5;

  ZOOM_LERP_SPEED = 0.05;
  ZOOM_FACTOR_AUTO_RUN = 1;

  fovStart = 0;
  fovGoal = 0;

  zoomCurrent = 1;
  zoomStart = 1;
  zoomGoal = 1;

  shouldRun() {
    const playerEntity = hiber3d.getSingleton("GameState", "playerEntity");
    return !regUtils.isNullEntity(playerEntity) &&
      hiber3d.hasComponents(playerEntity, "Hiber3D::Transform") &&
      hiber3d.hasComponents(this.entity, "Hiber3D::Transform");
  }
  onCreate() {

    this.fovStart = hiber3d.getComponent(this.entity, "Hiber3D::Camera", "fovDegrees");
    this.fovGoal = this.fovStart;

    this.offsetStart = hiber3d.getComponent(this.entity, "Hiber3D::Transform", "position");
  }
  update(dt) {
    if (this.shouldRun() === false) {
      return;
    }
    const playerEntity = hiber3d.getSingleton("GameState", "playerEntity");
    const hasAutoRun = hiber3d.hasScripts(playerEntity, "scripts/powerups/AutoRun.js") && hiber3d.getScript(playerEntity, "scripts/powerups/AutoRun.js").stage < 4;

    // FoV
    if (hasAutoRun) {
      this.fovGoal = this.fovStart * this.FOV_FACTOR_AUTO_RUN;
    } else {
      this.fovGoal = this.fovStart;
    }
    const fov = hiber3d.getComponent(this.entity, "Hiber3D::Camera", "fovDegrees");
    if (fov !== this.fovGoal) {
      const newFov = scalarUtils.lerpScalar(fov, this.fovGoal, this.FOV_LERP_SPEED);
      hiber3d.setComponent(this.entity, "Hiber3D::Camera", "fovDegrees", newFov);
    }
    // Zoom
    if (hasAutoRun) {
      this.zoomGoal = this.zoomStart * this.ZOOM_FACTOR_AUTO_RUN;
    } else {
      this.zoomGoal = this.zoomStart;
    }
    if (this.zoomCurrent !== this.zoomGoal) {

      const newZoom = scalarUtils.lerpScalar(this.zoomCurrent, this.zoomGoal, this.ZOOM_LERP_SPEED);
      const newZoomFactor = newZoom / this.zoomCurrent;
      const position = hiber3d.getComponent(this.entity, "Hiber3D::Transform", "position");
      const newPosition = vectorUtils.multiplyVector(position, newZoomFactor);
      hiber3d.setComponent(this.entity, "Hiber3D::Transform", "position", newPosition);
      if (!hiber3d.getSingleton("GameState", "paused")) {
      hiber3d.print(
        "zoomCurrent: " + this.zoomCurrent +
        " zoomGoal: " + this.zoomGoal +
        " newZoom: " + newZoom +
        " newZoomFactor: " + newZoomFactor +
        "");
      }

      this.zoomCurrent = newZoom;
    }
  }
  onEvent(event, payload) {
  }
}