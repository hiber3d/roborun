({
    onCreate() {},

    update() {
        const children = hiber3d.getChildren(this.entity);
        if (children === undefined || Object.keys(children).length === 0) {
            hiber3d.writeEvent("BroadcastPerfectCollectiblePickup", {})
            hiber3d.destroyEntity(this.entity);
            return;
        }
    },

    onEvent(event, payload) {

    }
});