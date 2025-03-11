const module = module || {};
module.exports = module.exports || {};
function collidesWithPlayer(entity, radius) {
  const playerEntity = hiber3d.getValue("GameState", "playerEntity");
  const position = hiber3d.getValue(entity, "Hiber3D::ComputedWorldTransform", "position");
  const playerBottomPosition = hiber3d.getValue(playerEntity, "Hiber3D::ComputedWorldTransform", "position");
  if (vectorUtils.inRange(position, playerBottomPosition, radius)) {
    return true;
  }

  const playerHeight = 1.0; // TODO: This should all be replaced once we have the collision module
  const playerTopPosition = vectorUtils.addVectors(playerBottomPosition, { x: 0, y: playerHeight, z: 0 });
  const playerIsSliding = hiber3d.hasComponents(playerEntity, "Sliding");
  return !playerIsSliding && vectorUtils.inRange(position, playerTopPosition, radius);
}
module.exports.collidesWithPlayer = collidesWithPlayer;