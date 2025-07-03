export function playAudio(parent, name, asset, playSpeed, volume) {
  const audioEntity = hiber3d.call("createEntityAsChild", parent);
  hiber3d.addComponent(audioEntity, "Hiber3D::AudioSource");
  hiber3d.addComponent(audioEntity, "Hiber3D::Name"); // This is just to make it easier to trace which sounds have been added

  hiber3d.setComponent(audioEntity, "Hiber3D::Name", name);
  hiber3d.setComponent(audioEntity, "Hiber3D::AudioSource", "asset", asset);
  hiber3d.setComponent(audioEntity, "Hiber3D::AudioSource", "playSpeed", playSpeed);
  hiber3d.setComponent(audioEntity, "Hiber3D::AudioSource", "volume", volume);

  hiber3d.setComponent(audioEntity, "Hiber3D::AudioSource", "playbackMode", 3);
}
