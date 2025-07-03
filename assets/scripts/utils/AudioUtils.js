import * as audio from "hiber3d:audio";

export function playAudio(parent, name, asset, playSpeed, volume) {
  const audioEntity = hiber3d.call("createEntityAsChild", parent);
  hiber3d.addComponent(audioEntity, "Hiber3D::AudioSource");
  hiber3d.addComponent(audioEntity, "Hiber3D::Name"); // This is just to make it easier to trace which sounds have been added

  hiber3d.setComponent(audioEntity, "Hiber3D::Name", name);
  hiber3d.setComponent(audioEntity, "Hiber3D::AudioSource", "asset", asset);
  hiber3d.setComponent(audioEntity, "Hiber3D::AudioSource", "playSpeed", playSpeed);
  hiber3d.setComponent(audioEntity, "Hiber3D::AudioSource", "volume", volume);

  hiber3d.setComponent(audioEntity, "Hiber3D::AudioSource", "playbackMode", audio.AudioPlaybackMode.ONCE);
}

export function playAudio3D(parent, name, asset, playSpeed, volume) {
  const audioEntity = hiber3d.call("createEntityAsChild", parent);

  hiber3d.addComponent(audioEntity, "Hiber3D::Transform");
  hiber3d.addComponent(audioEntity, "Hiber3D::SpatialAudio");
  hiber3d.setComponent(
    audioEntity,
    "Hiber3D::SpatialAudio",
    "volumeAttenuationModel",
    audio.AudioAttenuationModel.INVERSE_DISTANCE
  );
  hiber3d.setComponent(audioEntity, "Hiber3D::SpatialAudio", "inaudibleBehavior", audio.InaudibleBehavior.KEEP_PLAYING);
  hiber3d.setComponent(audioEntity, "Hiber3D::SpatialAudio", "minAttenuationDistance", 2);
  hiber3d.setComponent(audioEntity, "Hiber3D::SpatialAudio", "maxAttenuationDistance", 1000);
  hiber3d.setComponent(audioEntity, "Hiber3D::SpatialAudio", "rolloffFactor", 0.1);

  hiber3d.addComponent(audioEntity, "Hiber3D::AudioSource");
  hiber3d.addComponent(audioEntity, "Hiber3D::Name"); // This is just to make it easier to trace which sounds have been added

  hiber3d.setComponent(audioEntity, "Hiber3D::Name", name);
  hiber3d.setComponent(audioEntity, "Hiber3D::AudioSource", "asset", asset);
  hiber3d.setComponent(audioEntity, "Hiber3D::AudioSource", "playSpeed", playSpeed);
  hiber3d.setComponent(audioEntity, "Hiber3D::AudioSource", "volume", volume);

  hiber3d.setComponent(audioEntity, "Hiber3D::AudioSource", "playbackMode", audio.AudioPlaybackMode.ONCE);
}
