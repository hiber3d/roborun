const module = module || {};
module.exports = module.exports || {};

function lerpScalar(s1, s2, t) {
  return s1 + t * (s2 - s1);
}
module.exports.lerpScalar = lerpScalar;