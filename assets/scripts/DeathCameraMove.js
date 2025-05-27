export default class {
    onCreate() {

    }

    update(deltaTime) {
        const x = hiber3d.getComponent(this.entity, "Hiber3D_Transform", "position", "x")
        hiber3d.setComponent(this.entity, "Hiber3D_Transform", "position", "x",x+0.001 )
    }

    onEvent(event, payload) {

    }
}