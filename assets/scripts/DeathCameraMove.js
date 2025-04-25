({
    onCreate() {

    },

    update(deltaTime) {
        const transform = hiber3d.getComponent(this.entity, "Hiber3D::Transform");
        transform.position.x = transform.position.x + 0.001;
        hiber3d.setComponent(this.entity, "Hiber3D::Transform", transform);
    },

    onEvent(event, payload) {

    }
});
