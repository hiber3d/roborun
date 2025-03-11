const module = module || {};
module.exports = module.exports || {};

// TODO: This file all be removed once we have the collision module
function collidesWithPlayer(entity, radius) {
  const playerEntity = hiber3d.getValue("GameState", "playerEntity");
  const position = hiber3d.getValue(entity, "Hiber3D::ComputedWorldTransform", "position");
  const playerBottomPosition = hiber3d.getValue(playerEntity, "Hiber3D::ComputedWorldTransform", "position");
  if (vectorUtils.inRange(position, playerBottomPosition, radius)) {
    return true;
  }

  const playerHeight = 1.0; 
  const playerTopPosition = vectorUtils.addVectors(playerBottomPosition, { x: 0, y: playerHeight, z: 0 });
  const playerIsSliding = hiber3d.hasComponents(playerEntity, "Sliding");
  const playerIsDiving = hiber3d.hasComponents(playerEntity, "Diving");
  return !playerIsSliding && !playerIsDiving && vectorUtils.inRange(position, playerTopPosition, radius);
}
module.exports.collidesWithPlayer = collidesWithPlayer;