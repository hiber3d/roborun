export function formatVector(v) {
  if (!v) return 'null';
  return '{' +
    '"x":' + v.x.toFixed(2) + ',' +
    '"y":' + v.y.toFixed(2) + ',' +
    '"z":' + v.z.toFixed(2) +
    '}';
}

export function stripY(v) {
  return {x:v.x, y: 0, z: v.z };
}

export function getVectorLength(v) {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

export function getVectorDistance(v1, v2) {
  return Math.sqrt(getVectorDistance2(v1, v2));
}

export function getVectorDistance2(v1, v2) {
  const dx = v2.x - v1.x;
  const dy = v2.y - v1.y;
  const dz = v2.z - v1.z;
  return dx * dx + dy * dy + dz * dz;
}

export function normalizeVector(vector) {
  const length = getVectorLength(vector);
  return divideVector(vector, length);
}

export function addVectors(v1, v2) {
  return { x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z};
}

export function subtractVectors(v1, v2) {
  return { x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z};
}

export function multiplyVector(v, s) {
  return { x: v.x * s, y: v.y * s, z: v.z * s };
}

export function divideVector(v, s) {
  if (s === 0) {
    hiber3d.print("divideVector() - division by zero");
    return { x: 0, y: 0, z: 0 };
  }
  return { x: v.x / s, y: v.y / s, z: v.z / s };
}

export function lerpVector(v1, v2, t) {
  return { x: v1.x + t * (v2.x - v1.x), y: v1.y + t * (v2.y - v1.y), z: v1.z + t * (v2.z - v1.z)};
}

export function lerpVectorWithDistance(v1, v2, d) {
  const distance = getVectorDistance(v1, v2);

  if (distance <= d || distance === 0) {
    return v2;
  }

  const ratio = d / distance;
  const direction = subtractVectors(v2, v1);
  const scaledDirection = multiplyVector(direction, ratio);
  return addVectors(v1, scaledDirection);
}

export function vectorEquality(v1, v2) {
  return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
}

export function dotProduct(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

export function crossProduct(v1, v2) {
  return {x: v1.y * v2.z - v1.z * v2.y, y: v1.z * v2.x - v1.x * v2.z, z: v1.x * v2.y - v1.y * v2.x};
}

export function inRange(v1, v2, r) {
  return getVectorDistance2(v1, v2) <= r * r;
}

export function inRangeOfPoints(v, p1, p2) {
  const p1p2 = subtractVectors(p2, p1);
  const p1v = subtractVectors(v, p1);
  const p1p2Normalized = normalizeVector(p1p2);
  const projection = dotProduct(p1v, p1p2Normalized);
  const p1p2Length = getVectorLength(p1p2);
  return projection >= 0 && projection <= p1p2Length;
}

export function rotateVectorAroundY(direction, degrees) {
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

