const module = module || {};
module.exports = module.exports || {};
function formatVector(v) {
  if (!v) return 'null';
  return '{' +
    '"x":' + v.x.toFixed(2) + ',' +
    '"y":' + v.y.toFixed(2) + ',' +
    '"z":' + v.z.toFixed(2) +
    '}';
}
module.exports.formatVector = formatVector;
function stripY(v) {
  return {x:v.x, y: 0, z: v.z };
}
module.exports.stripY = stripY;
function getVectorLength(v) {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}
module.exports.getVectorLength = getVectorLength;

function getVectorDistance(v1, v2) {
  return Math.sqrt(getVectorDistance2(v1, v2));
}
module.exports.getVectorDistance = getVectorDistance;
function getVectorDistance2(v1, v2) {
  const dx = v2.x - v1.x;
  const dy = v2.y - v1.y;
  const dz = v2.z - v1.z;
  return dx * dx + dy * dy + dz * dz;
}
module.exports.getVectorDistance2 = getVectorDistance2;
function normalizeVector(vector) {
  const length = getVectorLength(vector);
  return divideVector(vector, length);
}
module.exports.normalizeVector = normalizeVector;

function addVectors(v1, v2) {
  return { x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z};
}
module.exports.addVectors = addVectors;
function subtractVectors(v1, v2) {
  return { x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z};
}
module.exports.subtractVectors = subtractVectors;
function multiplyVector(v, s) {
  return { x: v.x * s, y: v.y * s, z: v.z * s };
}
module.exports.multiplyVector = multiplyVector;
function divideVector(v, s) {
  if (s === 0) {
    hiber3d.print("divideVector() - division by zero");
    return { x: 0, y: 0, z: 0 };
  }
  return { x: v.x / s, y: v.y / s, z: v.z / s };
}
module.exports.divideVector = divideVector;
function lerpVector(v1, v2, t) {
  return { x: v1.x + t * (v2.x - v1.x), y: v1.y + t * (v2.y - v1.y), z: v1.z + t * (v2.z - v1.z)};
}
module.exports.lerpVector = lerpVector;

function lerpVectorWithDistance(v1, v2, d) {
  const distance = getVectorDistance(v1, v2);

  if (distance <= d || distance === 0) {
    return v2;
  }

  const ratio = d / distance;
  const direction = subtractVectors(v2, v1);
  const scaledDirection = multiplyVector(direction, ratio);
  return addVectors(v1, scaledDirection);
}

module.exports.lerpVectorWithDistance = lerpVectorWithDistance;
function vectorEquality(v1, v2) {
  return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
}
module.exports.vectorEquality = vectorEquality;
function dotProduct(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}
module.exports.dotProduct = dotProduct;
function crossProduct(v1, v2) {
  return {x: v1.y * v2.z - v1.z * v2.y, y: v1.z * v2.x - v1.x * v2.z, z: v1.x * v2.y - v1.y * v2.x};
}
module.exports.crossProduct = crossProduct;

function inRange(v1, v2, r) {
  return getVectorDistance2(v1, v2) <= r * r;
}
module.exports.inRange = inRange;
function inRangeOfPlane(v1, v2, q, r) {
  const forward = quatUtils.forwardVectorFromQuaternion(q);
  const normal = normalizeVector(forward);
  const toPoint = subtractVectors(v1, v2);
  const signedDistance = dotProduct(toPoint, normal);
  return Math.abs(signedDistance) <= r;
}
module.exports.inRangeOfPlane = inRangeOfPlane;

function inRangeOfPoints(v, p1, p2) {
  const p1p2 = subtractVectors(p2, p1);
  const p1v = subtractVectors(v, p1);
  const p1p2Normalized = normalizeVector(p1p2);
  const projection = dotProduct(p1v, p1p2Normalized);
  const p1p2Length = getVectorLength(p1p2);
  return projection >= 0 && projection <= p1p2Length;
}
module.exports.inRangeOfPoints = inRangeOfPoints;

function rotateVectorAroundY(direction, degrees) {
  var rotated = {
    x: 0,
    y: direction.y, // y-component stays the same
    z: 0
  };
  const radians = (degrees * Math.PI) / 180;
  rotated.x = direction.x * Math.cos(radians) - direction.z * Math.sin(radians);
  rotated.z = direction.x * Math.sin(radians) + direction.z * Math.cos(radians);

  return rotated;
}

module.exports.rotateVectorAroundY = rotateVectorAroundY;
