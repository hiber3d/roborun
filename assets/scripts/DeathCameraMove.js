export default class {
    onCreate() {

    }

    update(deltaTime) {
        const x = hiber3d.getComponent(this.entity, "Hiber3D::Transform", "position", "x")
        hiber3d.setComponent(this.entity, "Hiber3D::Transform", "position", "x",x+0.001 )
    }

    onEvent(event, payload) {

    }
}