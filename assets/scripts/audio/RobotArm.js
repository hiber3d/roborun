import * as audio from "hiber3d:audio";

const multipliers = {
  "Base": 0.2,
  "Bottom": 0.4,
  "Middle": 0.5,
  "Top": 0.7,
  "Hand": 0.6,
  "Claw1": 0.7,
  "Claw2": 0.8,
};

const assets = {
  "Base": "audio/sfx/liftservo-77999.mp3",
  "Bottom": "audio/sfx/a_fx_steam_01.mp3",
  "Middle": "audio/sfx/liftservo-77999.mp3",
  "Top": "audio/sfx/liftservo-77999.mp3",
  "Hand": "audio/sfx/a_fx_steam_01.mp3",
  "Claw1": "audio/sfx/liftservo-77999.mp3",
  "Claw2": "audio/sfx/liftservo-77999.mp3",
};

const cc = {
  "Base": 1,
  "Bottom": 2,
  "Middle": 3,
  "Top": 4,
  "Hand": 5,
  "Claw1": 6,
  "Claw2": 6,
};

const rotateKeys1 = {
  "Base": 1,
  "Bottom": 3,
  "Middle": 5,
  "Top": 7,
  "Hand": 9,
  "Claw1": 11,
  "Claw2": 11,
}

const rotateKeys2 = {
  "Base": 2,
  "Bottom": 4,
  "Middle": 6,
  "Top": 8,
  "Hand": 10,
  "Claw1": 12,
  "Claw2": 12,
}

const axes = {
  "Base": {x: 0, y: 1, z: 0},
  "Bottom": {x: 1, y: 0, z: 0},
  "Middle": {x: 1, y: 0, z: 0},
  "Top": {x: 1, y: 0, z: 0},
  "Hand": {x: 0, y: 1, z: 0},
  "Claw1": {x: 1, y: 0, z: 0},
  "Claw2": {x: -1, y: 0, z: 0},
}

export default class {
  transform = null;
  angularVelocity = 0;
  moving = false;
  name = null;
  multiplier = 1;

  onCreate() {
    this.transform = hiber3d.getComponent(this.entity, "Hiber3D::Transform");
    hiber3d.addComponent(this.entity ,"Hiber3D::AudioSource");
    hiber3d.addComponent(this.entity ,"Hiber3D::AudioSource", "volume", 0);
    hiber3d.setComponent(this.entity, "Hiber3D::AudioSource", "playbackMode", audio.AudioPlaybackMode.LOOP);
    hiber3d.setComponent(this.entity, "Hiber3D::AudioSource", "playSpeedFadeTime", 0.5);
    hiber3d.setComponent(this.entity, "Hiber3D::AudioSource", "volumeFadeTime", 0.5);
    hiber3d.addComponent(this.entity, "Hiber3D::SpatialAudio");
    //hiber3d.setComponent(this.entity, "Hiber3D::SpatialAudio", "inaudibleBehavior", audio.InaudibleBehavior.KEEP_PLAYING);
    hiber3d.setComponent(this.entity, "Hiber3D::SpatialAudio", "volumeAttenuationModel", audio.AudioAttenuationModel.INVERSE_DISTANCE);
    hiber3d.setComponent(this.entity, "Hiber3D::SpatialAudio", "maxAttenuationDistance", 100);
    hiber3d.setComponent(this.entity, "Hiber3D::SpatialAudio", "minAttenuationDistance", 1);
    hiber3d.setComponent(this.entity, "Hiber3D::SpatialAudio", "rolloffFactor", 0.2);
    this.name = hiber3d.getComponent(this.entity, "Hiber3D::Name");
    this.multiplier = multipliers[this.name] || 1;
    hiber3d.setComponent(this.entity, "Hiber3D::AudioSource", "asset", assets[this.name] || "audio/sfx/liftservo-77999.mp3");
  }

  onReload() {

  }

  computeAngularVelocity(firstRotation, secondRotation, deltaTime) {
    const oldRotation = firstRotation.toEulerRollPitchYaw();
    const newRotation = secondRotation.toEulerRollPitchYaw();

    const deltaRotation = {
      x: newRotation.x - oldRotation.x,
      y: newRotation.y - oldRotation.y,
      z: newRotation.z - oldRotation.z,
    };
    const angularVelocity = Math.sqrt(deltaRotation.x * deltaRotation.x + deltaRotation.y * deltaRotation.y + deltaRotation.z * deltaRotation.z) / deltaTime;
    return angularVelocity;
  }

  onUpdate(deltaTime) {
    const transform = hiber3d.getComponent(this.entity, "Hiber3D::Transform");
    const inputChannel = hiber3d.getSingleton("MidiState", "input", "channels", 1);
    if (inputChannel.notes[rotateKeys1[this.name] + 36] > 0) {
      transform.rotation.rotateAroundAxis(axes[this.name], deltaTime * Math.PI / 2);
    }
    if (inputChannel.notes[rotateKeys2[this.name]+ 36] > 0) {
      transform.rotation.rotateAroundAxis(axes[this.name], -deltaTime * Math.PI / 2);
    }
    const normalizedCC = (inputChannel.cc[cc[this.name]] / 127) - 0.5;
    transform.rotation.rotateAroundAxis(axes[this.name], deltaTime * normalizedCC * Math.PI / 2);

    hiber3d.setComponent(this.entity, "Hiber3D::Transform", "rotation", transform.rotation);
    const angularVelocity = this.computeAngularVelocity(this.transform.rotation, transform.rotation, deltaTime);
    const audio = hiber3d.getComponent(this.entity, "Hiber3D::AudioSource");
    const moving = this.angularVelocity != angularVelocity;
    if (this.moving != moving) {
      audio.volume = moving ? 1 : 0;
      audio.playSpeed = this.multiplier * (moving ? 1.2 : 0.5);
      hiber3d.setComponent(this.entity, "Hiber3D::AudioSource", "volume", audio.volume);
      hiber3d.setComponent(this.entity, "Hiber3D::AudioSource", "playSpeed", audio.playSpeed);
    }
    this.transform = transform;
    this.angularVelocity = angularVelocity;
    this.moving = moving;
  }

  onEvent(event, payload) {

  }
}
