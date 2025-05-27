import * as regUtils from "scripts/utils/RegUtils.js";

export default class {
    onCreate() {}

    update() {
        const children = regUtils.getChildren(this.entity);
        if (children === undefined || Object.keys(children).length === 0) {
            hiber3d.writeEvent("BroadcastPerfectCollectiblePickup", {})
            regUtils.destroyEntity(this.entity);
            return;
        }
    }

    onEvent(event, payload) {

    }
}