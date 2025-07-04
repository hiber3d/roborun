import * as audio from "hiber3d:audio";
import * as audioUtils from "scripts/utils/AudioUtils.js";

const multipliers = {
  Base: 0.2,
  Bottom: 0.4,
  Middle: 0.8,
  Top: 0.7,
  Hand: 0.6,
  Claw1: 0.7,
  Claw2: 0.8,
};

const assets = {
  Base: "audio/sfx/a_fx_mechanical_whirr_01.mp3",
  Bottom: "audio/sfx/a_fx_steam_01.mp3",
  Middle: "audio/sfx/a_fx_metal_door_squeak_01.mp3",
  Top: "audio/sfx/a_fx_mechanical_whirr_01.mp3",
  Hand: "audio/sfx/a_fx_steam_01.mp3",
  Claw1: "audio/sfx/a_fx_mechanical_whirr_01.mp3",
  Claw2: "audio/sfx/a_fx_mechanical_whirr_01.mp3",
};

export default class {
  transform = null;
  angularVelocity = 0;
  moving = false;
  name = null;
  multiplier = 1;

  onCreate() {
    this.name = hiber3d.getComponent(this.entity, "Hiber3D::Name");
    this.transform = hiber3d.getComponent(this.entity, "Hiber3D::Transform");
    hiber3d.addComponent(this.entity, "Hiber3D::SpatialAudio");
    //hiber3d.setComponent(this.entity, "Hiber3D::SpatialAudio", "inaudibleBehavior", audio.InaudibleBehavior.KEEP_PLAYING);
    hiber3d.setComponent(
      this.entity,
      "Hiber3D::SpatialAudio",
      "volumeAttenuationModel",
      audio.AudioAttenuationModel.INVERSE_DISTANCE
    );
    hiber3d.setComponent(this.entity, "Hiber3D::SpatialAudio", "maxAttenuationDistance", 100);
    hiber3d.setComponent(this.entity, "Hiber3D::SpatialAudio", "minAttenuationDistance", 1);
    hiber3d.setComponent(this.entity, "Hiber3D::SpatialAudio", "rolloffFactor", 0.2);
    this.multiplier = multipliers[this.name] || 1;

    if (this.name != "Middle") {
      hiber3d.addComponent(this.entity, "Hiber3D::AudioSource");
      hiber3d.addComponent(this.entity, "Hiber3D::AudioSource", "volume", 0);
      hiber3d.setComponent(this.entity, "Hiber3D::AudioSource", "playbackMode", audio.AudioPlaybackMode.LOOP);
      hiber3d.setComponent(this.entity, "Hiber3D::AudioSource", "playSpeedFadeTime", 0.5);
      hiber3d.setComponent(this.entity, "Hiber3D::AudioSource", "volumeFadeTime", 0.5);
      hiber3d.setComponent(this.entity, "Hiber3D::AudioSource", "asset", assets[this.name]);
    }
  }

  onReload() {}

  computeAngularVelocity(firstRotation, secondRotation, deltaTime) {
    const oldRotation = firstRotation.toEulerRollPitchYaw();
    const newRotation = secondRotation.toEulerRollPitchYaw();

    const deltaRotation = {
      x: newRotation.x - oldRotation.x,
      y: newRotation.y - oldRotation.y,
      z: newRotation.z - oldRotation.z,
    };
    const angularVelocity =
      Math.sqrt(
        deltaRotation.x * deltaRotation.x + deltaRotation.y * deltaRotation.y + deltaRotation.z * deltaRotation.z
      ) / deltaTime;
    return angularVelocity;
  }

  onUpdate(deltaTime) {
    const transform = hiber3d.getComponent(this.entity, "Hiber3D::Transform");
    const angularVelocity = this.computeAngularVelocity(this.transform.rotation, transform.rotation, deltaTime);
    const moving = this.angularVelocity != angularVelocity;
    if (this.moving != moving) {
      // Only update if the moving state has changed
      if (this.name == "Middle") {
        if (moving) {
          audioUtils.playAudio3D(
            this.entity,
            "RobotArmMoving",
            assets[this.name],
            this.multiplier * (moving ? 1.5 : 0.5),
            1.0
          );
        }
      } else {
        const audio = hiber3d.getComponent(this.entity, "Hiber3D::AudioSource");
        audio.volume = moving ? 1 : 0;
        audio.playSpeed = this.multiplier * (moving ? 1.5 : 0.5);
        hiber3d.setComponent(this.entity, "Hiber3D::AudioSource", "volume", audio.volume);
        hiber3d.setComponent(this.entity, "Hiber3D::AudioSource", "playSpeed", audio.playSpeed);
      }
    }
    this.transform = transform;
    this.angularVelocity = angularVelocity;
    this.moving = moving;
  }

  onEvent(event, payload) {}
}
