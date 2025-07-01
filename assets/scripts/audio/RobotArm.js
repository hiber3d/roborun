export default class {
  transform = null;

  onCreate() {
    this.transform = hiber3d.getComponent(this.entity, "Hiber3D::Transform");
    hiber3d.addComponent(this.entity ,"Hiber3D::AudioSource");
    hiber3d.setComponent(this.entity, "Hiber3D::AudioSource", "asset", "audio/sfx/a_fx_forcefield_01.ogg");
    hiber3d.setComponent(this.entity, "Hiber3D::AudioSource", "playbackMode", 1);
    hiber3d.setComponent(this.entity, "Hiber3D::AudioSource", "playSpeedFadeTime", 0.3);
    hiber3d.setComponent(this.entity, "Hiber3D::AudioSource", "volumeFadeTime", 0.3);
    hiber3d.addComponent(this.entity, "Hiber3D::SpatialAudio");
    hiber3d.setComponent(this.entity, "Hiber3D::SpatialAudio", "volumeAttenuationModel", 1);
    hiber3d.setComponent(this.entity, "Hiber3D::SpatialAudio", "maxAttenuationDistance", 100);
    hiber3d.setComponent(this.entity, "Hiber3D::SpatialAudio", "minAttenuationDistance", 1);
    hiber3d.setComponent(this.entity, "Hiber3D::SpatialAudio", "rolloffFactor", 1);
  }

  onReload() {

  }

  onUpdate(deltaTime) {
    const transform = hiber3d.getComponent(this.entity, "Hiber3D::Transform");
    const angularVelocity = ((this.transform.rotation.x - transform.rotation.x) + (this.transform.rotation.y - transform.rotation.y) + (this.transform.rotation.z - transform.rotation.z) + (this.transform.rotation.w - transform.rotation.w)) / deltaTime;
    hiber3d.print("Angular Velocity: " + angularVelocity);
    const audio = hiber3d.getComponent(this.entity, "Hiber3D::AudioSource");
    audio.volume = 0.5 + Math.abs(angularVelocity) * 10;
    audio.playSpeed = 0 + Math.abs(angularVelocity) * 6;
    hiber3d.setComponent(this.entity, "Hiber3D::AudioSource", "volume", audio.volume);
    hiber3d.setComponent(this.entity, "Hiber3D::AudioSource", "playSpeed", audio.playSpeed);
    this.transform = transform;
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