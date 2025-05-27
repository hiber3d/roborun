import * as regUtils from "scripts/utils/RegUtils.js";

export default class {
  DEFAULT_COLLIDER_HEIGHT = 0.75;
  REDUCED_COLLIDER_HEIGHT = -0.4;

  wasReducedLastTick = false;
  shouldRun() {
    if(hiber3d.hasComponents(this.entity, "Hiber3D_ComputedWorldTransform") === false) {
      return false;
    }
    return true;
  }
  modifyColliderHeight(shouldReduce) {
    const colliderEntity = regUtils.findEntityWithNameAmongDescendants(this.entity, "Shape");
    if (colliderEntity === undefined) {
      hiber3d.print("ReduceColliderHeight.js - ERROR: No 'Shape' found in hierarchy");
    }
    if (shouldReduce === true) {
      hiber3d.setValue(colliderEntity, "Hiber3D_Transform", "position", "y", this.REDUCED_COLLIDER_HEIGHT);
    } else {
      hiber3d.setValue(colliderEntity, "Hiber3D_Transform", "position", "y", this.DEFAULT_COLLIDER_HEIGHT);
    }
  }
  onCreate() {

  }
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
  }
  onEvent(event, payload) {
  }
}