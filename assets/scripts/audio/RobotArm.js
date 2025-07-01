import * as input from "hiber3d:input";

export default class {
  transform = null;
  name = "";

  onCreate() {
    this.transform = hiber3d.getComponent(this.entity, "Hiber3D::Transform");
    hiber3d.addComponent(this.entity ,"Hiber3D::AudioSource");
    hiber3d.setComponent(this.entity, "Hiber3D::AudioSource", "asset", "audio/sfx/a_fx_forcefield_01.ogg");
    hiber3d.setComponent(this.entity, "Hiber3D::AudioSource", "playbackMode", 1);
    hiber3d.setComponent(this.entity, "Hiber3D::AudioSource", "playSpeedFadeTime", 0.1);
    hiber3d.setComponent(this.entity, "Hiber3D::AudioSource", "volumeFadeTime", 0.1);
    hiber3d.addComponent(this.entity, "Hiber3D::SpatialAudio");
    hiber3d.setComponent(this.entity, "Hiber3D::SpatialAudio", "volumeAttenuationModel", 1);
    hiber3d.setComponent(this.entity, "Hiber3D::SpatialAudio", "maxAttenuationDistance", 100);
    hiber3d.setComponent(this.entity, "Hiber3D::SpatialAudio", "minAttenuationDistance", 1);
    hiber3d.setComponent(this.entity, "Hiber3D::SpatialAudio", "rolloffFactor", 1);
    this.name = hiber3d.getComponent(this.entity, "Hiber3D::Name");
  }

  onReload() {

  }

  onUpdate(deltaTime) {
    const transform = hiber3d.getComponent(this.entity, "Hiber3D::Transform");

    if (this.name == "Base") {
      if (input.keyIsPressed(input.Key.LEFT_ARROW)) {
        transform.rotation.rotateAroundAxis({x: 0, y: 1, z: 0}, deltaTime * Math.PI / 2);
      }
      if (input.keyIsPressed(input.Key.RIGHT_ARROW)) {
        transform.rotation.rotateAroundAxis({x: 0, y: 1, z: 0}, -deltaTime * Math.PI / 2);
      }
    }

    if (this.name == "Bottom") {
      if (input.keyIsPressed(input.Key.UP_ARROW)) {
        transform.rotation.rotateAroundAxis({x: 1, y: 0, z: 0}, deltaTime * Math.PI / 2);
      }
      if (input.keyIsPressed(input.Key.DOWN_ARROW)) {
        transform.rotation.rotateAroundAxis({x: 1, y: 0, z: 0}, -deltaTime * Math.PI / 2);
      }
    }

    if (this.name == "Middle") {
      if (input.keyIsPressed(input.Key.J)) {
        transform.rotation.rotateAroundAxis({x: 1, y: 0, z: 0}, deltaTime * Math.PI / 2);
      }
      if (input.keyIsPressed(input.Key.L)) {
        transform.rotation.rotateAroundAxis({x: 1, y: 0, z: 0}, -deltaTime * Math.PI / 2);
      }
    }

    if (this.name == "Top") {
      if (input.keyIsPressed(input.Key.I)) {
        transform.rotation.rotateAroundAxis({x: 1, y: 0, z: 0}, deltaTime * Math.PI / 2);
      }
      if (input.keyIsPressed(input.Key.K)) {
        transform.rotation.rotateAroundAxis({x: 1, y: 0, z: 0}, -deltaTime * Math.PI / 2);
      }
    }

    if (this.name == "Hand") {
      if (input.keyIsPressed(input.Key.A)) {
        transform.rotation.rotateAroundAxis({x: 0, y: 1, z: 0}, deltaTime * Math.PI / 2);
      }
      if (input.keyIsPressed(input.Key.D)) {
        transform.rotation.rotateAroundAxis({x: 0, y: 1, z: 0}, -deltaTime * Math.PI / 2);
      }
    }

    if (this.name == "Claw1") {
      if (input.keyIsPressed(input.Key.W)) {
        transform.rotation.rotateAroundAxis({x: 1, y: 0, z: 0}, deltaTime * Math.PI / 2);
      }
      if (input.keyIsPressed(input.Key.S)) {
        transform.rotation.rotateAroundAxis({x: 1, y: 0, z: 0}, -deltaTime * Math.PI / 2);
      }
    }

    if (this.name == "Claw2") {
      if (input.keyIsPressed(input.Key.W)) {
        transform.rotation.rotateAroundAxis({x: 1, y: 0, z: 0}, -deltaTime * Math.PI / 2);
      }
      if (input.keyIsPressed(input.Key.S)) {
        transform.rotation.rotateAroundAxis({x: 1, y: 0, z: 0}, deltaTime * Math.PI / 2);
      }
    }

    const oldEulerRotation = this.transform.rotation.toEulerRollPitchYaw();
    const newEulerRotation = transform.rotation.toEulerRollPitchYaw();
    const rotationDelta = {
      x: (newEulerRotation.x - oldEulerRotation.x) % (2 * Math.PI),
      y: (newEulerRotation.y - oldEulerRotation.y) % (2 * Math.PI),
      z: (newEulerRotation.z - oldEulerRotation.z) % (2 * Math.PI)
    };

    // TODO: This bugs out badly when the old and new rotation are on different sides of 360 degrees,
    // resulting in very strange sounds. Find some way to "normalize" the rotationDelta first!
    const angularVelocity = Math.sqrt(rotationDelta.x**2 + rotationDelta.y**2 + rotationDelta.z**2) / deltaTime;

    const audio = hiber3d.getComponent(this.entity, "Hiber3D::AudioSource");
    audio.volume = 0.5 + Math.abs(angularVelocity) * 10;
    audio.playSpeed = 0 + Math.abs(angularVelocity) * 3;
    hiber3d.setComponent(this.entity, "Hiber3D::AudioSource", "volume", audio.volume);
    hiber3d.setComponent(this.entity, "Hiber3D::AudioSource", "playSpeed", audio.playSpeed);

    this.transform = transform;
    hiber3d.setComponent(this.entity, "Hiber3D::Transform", "rotation", transform.rotation);

    // Base: Only Y
    // Bottom: Only X
    // Middle: Only X
    // Top: Only X
    // Hand: Only Y
    // Claw1: Only X
    // Claw2: Only -X
  }

  onEvent(event, payload) {

  }
}


/**

// Print to console
hiber3d.print(...) // use JSON.stringify for object

// Create / destroy entity
const newEntity = hiber3d.createEntity()
hiber3d.destroyEntity(entity)

// Add / remove / get other script instance
hiber3d.addScript(entity, "Other.js")
hiber3d.removeScript(entity, this.script)
hiber3d.hasScript(entity, "Other.js")
const otherScript = hiber3d.getScript(entity, "Other.js")

// Add / remove / check if entity has components
hiber3d.addComponent(this.entity, "Hiber3D::Transform")
hiber3d.removeComponent(this.entity, "Hiber3D::Transform")
hiber3d.hasComponents(this.entity, "Hiber3D::Transform", "Hiber3D::Renderable")
hiber3d.findEntitiesWithComponent("Hiber3D::Transform")

// Change component values
hiber3d.getComponent(this.entity, "Hiber3D::Transform", "position", "x")
hiber3d.setComponent(this.entity, "Hiber3D::Transform", "position", "x", 1)

// Get and set singleton values
hiber3d.getSingleton("Hiber3D::ActiveCamera", "position")
hiber3d.setSingleton("Hiber3D::ActiveCamera", "position", {x:1, y:2, z:3})

// Call registered C function
hiber3d.call("myFunction", 1)

// Inputs - find key codes in <Hiber3D/Core/KeyEvent.hpp>
hiber3d.call("keyIsPressed", 1)
hiber3d.call("keyJustPressed", 1)
hiber3d.call("keyJustReleased", 1)

// Events
hiber3d.addEventListener(this, "EventName") // done in onCreate()
hiber3d.writeEvent("EventName", {})

// Imports
import * as utils from "/scripts/Utils.js"
utils.someFunction()

// this
this.entity; // Gets assigned automatically and evaluates to the entity id of the entity that the script is attached to
this.script; // Gets assigned automatically and evaluates to the asset path of the script

*/