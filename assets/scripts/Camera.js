({
  FOV_LERP_SPEED: 0.05,
  FOV_FACTOR_AUTO_RUN: 1.5,

  ZOOM_LERP_SPEED: 0.05,
  ZOOM_FACTOR_AUTO_RUN: 0.5,

  fovStart: 0,
  fovGoal: 0,

  zoomCurrent: 1,
  zoomStart: 1,
  zoomGoal: 1,

  shouldRun() {
    const playerEntity = hiber3d.getValue("GameState", "playerEntity");
    return playerEntity !== undefined &&
      hiber3d.hasComponents(playerEntity, "Hiber3D::Transform") &&
      hiber3d.hasComponents(this.entity, "Hiber3D::Transform");
  },
  onCreate() {

    this.fovStart = hiber3d.getValue(this.entity, "Hiber3D::Camera", "fovDegrees");
    this.fovGoal = this.fovStart;

    this.offsetStart = hiber3d.getValue(this.entity, "Hiber3D::Transform", "position");
  },
  update(dt) {
    if (this.shouldRun() === false) {
      return;
    }
    const playerEntity = hiber3d.getValue("GameState", "playerEntity");
    const hasAutoRun = hiber3d.hasComponents(playerEntity, "AutoRun") && hiber3d.getValue(playerEntity, "AutoRun", "stage") < 5;

    // FoV
    if (hasAutoRun) {
      this.fovGoal = this.fovStart * this.FOV_FACTOR_AUTO_RUN;
    } else {
      this.fovGoal = this.fovStart;
    }
    const fov = hiber3d.getValue(this.entity, "Hiber3D::Camera", "fovDegrees");
    if (fov !== this.fovGoal) {
      const newFov = scalarUtils.lerpScalar(fov, this.fovGoal, this.FOV_LERP_SPEED);
      hiber3d.setValue(this.entity, "Hiber3D::Camera", "fovDegrees", newFov);
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
      const position = hiber3d.getValue(this.entity, "Hiber3D::Transform", "position");
      const newPosition = vectorUtils.multiplyVector(position, newZoomFactor);
      hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", newPosition);
      this.zoomCurrent = newZoom;
    }
  },
  onEvent(event, payload) {
  },
});