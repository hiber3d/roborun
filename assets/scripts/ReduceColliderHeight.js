({
  DEFAULT_COLLIDER_HEIGHT: 0.75,
  REDUCED_COLLIDER_HEIGHT: -0.4,

  wasReducedLastTick: false,
  shouldRun() {
    if(hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform") === false) {
      return false;
    }
    return true;
  },
  modifyColliderHeight(shouldReduce) {
    const colliderEntity = regUtils.findEntityWithNameAmongDescendants(this.entity, "Shape");
    if (regUtils.isNullEntity(colliderEntity) ) {
      hiber3d.print("ReduceColliderHeight.js - ERROR: No 'Shape' found in hierarchy");
    }
    const transform = hiber3d.getComponent(colliderEntity, "Hiber3D::Transform");
    if (shouldReduce === true) {
      transform.position.y = this.REDUCED_COLLIDER_HEIGHT;
    } else {
      transform.position.y = this.DEFAULT_COLLIDER_HEIGHT;
    }
    hiber3d.setComponent(colliderEntity, "Hiber3D::Transform", transform);
  },
  onCreate() {

  },
  update(dt) {
    if (!this.shouldRun()) {
      return;
    }

    const isReduced = hiber3d.hasScripts(this.entity, "scripts/Sliding.js") ||
      hiber3d.hasScripts(this.entity, "scripts/Diving.js");

    if (this.wasReducedLastTick === false && isReduced === true) {
      this.modifyColliderHeight(true);
    } else if (this.wasReducedLastTick === true && isReduced === false) {
      this.modifyColliderHeight(false);
    }

    this.wasReducedLastTick = isReduced;
  },
  onEvent(event, payload) {
  },
});