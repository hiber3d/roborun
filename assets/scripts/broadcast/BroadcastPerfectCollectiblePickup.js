import * as hierarchy from "hiber3d:hierarchy";
import * as registry from "hiber3d:registry";

export default class {
    onCreate() {}

    onUpdate() {
        const children = hierarchy.getChildren(this.entity);
        if (children === undefined || children.length === 0) {
            hiber3d.writeEvent("BroadcastPerfectCollectiblePickup", {})
            registry.destroyEntity(this.entity);
            return;
        }
    }

    onEvent(event, payload) {

    }
}