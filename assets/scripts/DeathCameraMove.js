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


/**

// Print to console
hiber3d.print(...) // use JSON.stringify for object

// Create / destroy entity
const newEntity = hiber3d.createEntity()
hiber3d.destroyEntity(entity)

// Add / remove / get other script instance
hiber3d.addScript(entity, "Other.js")
hiber3d.getScript(entity, "Other.js")
hiber3d.removeScript(entity, "Other.js")
hiber3d.hasScript(entity, "Other.js")

// Add / remove / check if entity has components
hiber3d.addComponent(this.entity, "Hiber3D::Transform")
hiber3d.removeComponent(this.entity, "Hiber3D::Transform")
hiber3d.hasComponents(this.entity, "Hiber3D::Transform", "Hiber3D::Renderable")
hiber3d.findEntitiesWithComponent("Hiber3D::Transform")

// Change component values
hiber3d.getComponent(this.entity, "Hiber3D::Transform").position.x
hiber3d.setComponent(this.entity, "Hiber3D::Transform", "position", "x", 1)

// Get and set singleton values
hiber3d.getSingleton("Hiber3D::ActiveCamera", "position")
hiber3d.setSingleton("Hiber3D::ActiveCamera", "position", {x:1, y:2, z:3})

// Call registered C function
hiber3d.call("Foo", 1, "hello")

// Inputs - find key codes in <Hiber3D/Core/KeyEvent.hpp>
hiber3d.call("keyIsPressed", 1)
hiber3d.call("keyJustPressed", 1)
hiber3d.call("keyJustReleased", 1)

// Events
hiber3d.addEventListener(this.entity, "EventName")
hiber3d.writeEvent("EventName", {});

*/