const module = module || {};
module.exports = module.exports || {};

function isPlayer(entity) {
  return regUtils.isAncestorOf(hiber3d.getValue("GameState", "playerEntity"), entity);
}
module.exports.isPlayer = isPlayer;