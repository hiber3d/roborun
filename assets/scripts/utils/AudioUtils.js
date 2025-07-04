import * as audio from "hiber3d:audio";
import * as registry from "hiber3d:registry";

function addAudioSource(audioEntity, asset, playSpeed, volume) {
  hiber3d.addComponent(audioEntity, "Hiber3D::AudioSource");
  hiber3d.setComponent(audioEntity, "Hiber3D::AudioSource", "asset", asset);
  hiber3d.setComponent(audioEntity, "Hiber3D::AudioSource", "playSpeed", playSpeed);
  hiber3d.setComponent(audioEntity, "Hiber3D::AudioSource", "volume", volume);

  hiber3d.setComponent(audioEntity, "Hiber3D::AudioSource", "playbackMode", audio.AudioPlaybackMode.ONCE);
}

function addSpatialAudio(audioEntity) {
  hiber3d.addComponent(audioEntity, "Hiber3D::Transform"); // Required for spatial audio to work
  hiber3d.addComponent(audioEntity, "Hiber3D::SpatialAudio");
  hiber3d.setComponent(
    audioEntity,
    "Hiber3D::SpatialAudio",
    "volumeAttenuationModel",
    audio.AudioAttenuationModel.INVERSE_DISTANCE
  );

  hiber3d.setComponent(audioEntity, "Hiber3D::SpatialAudio", "inaudibleBehavior", audio.InaudibleBehavior.KEEP_PLAYING);
  hiber3d.setComponent(audioEntity, "Hiber3D::SpatialAudio", "minAttenuationDistance", 1);
  hiber3d.setComponent(audioEntity, "Hiber3D::SpatialAudio", "maxAttenuationDistance", 1000);
  hiber3d.setComponent(audioEntity, "Hiber3D::SpatialAudio", "rolloffFactor", 0.1);
}

export function playAudio(parent, name, asset, playSpeed, volume) {
  const audioEntity = registry.isValid(parent) ? hiber3d.call("createEntityAsChild", parent) : registry.createEntity();

  hiber3d.addComponent(audioEntity, "Hiber3D::Name"); // This is just to make it easier to trace which sounds have been added
  hiber3d.setComponent(audioEntity, "Hiber3D::Name", name);

  addAudioSource(audioEntity, asset, playSpeed, volume);

  return audioEntity;
}

export function playAudio3D(parent, name, asset, playSpeed, volume) {
  const audioEntity = registry.isValid(parent) ? hiber3d.call("createEntityAsChild", parent) : registry.createEntity();

  hiber3d.addComponent(audioEntity, "Hiber3D::Name");
  hiber3d.setComponent(audioEntity, "Hiber3D::Name", name);

  addSpatialAudio(audioEntity);
  addAudioSource(audioEntity, asset, playSpeed, volume);

  return audioEntity;
}
