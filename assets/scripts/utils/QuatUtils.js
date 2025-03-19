const module = module || {};
module.exports = module.exports || {};
function formatQuaternion(q) {
  if (!q) return 'null';
  return '{' +
    '"x":' + q.x.toFixed(2) + ',' +
    '"y":' + q.y.toFixed(2) + ',' +
    '"z":' + q.z.toFixed(2) + ',' +
    '"w":' + q.w.toFixed(2) +
    '}';
}
module.exports.formatQuaternion = formatQuaternion;
function getQuaternionLength(q) {
  return Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w);
}
module.exports.getQuaternionLength = getQuaternionLength;
function getQuaternionDistance(q1, q2) {
  const dx = q2.x - q1.x;
  const dy = q2.y - q1.y;
  const dz = q2.z - q1.z;
  const dw = q2.w - q1.w;
  return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
}
module.exports.getQuaternionDistance = getQuaternionDistance;
function normalizeQuaternion(q) {
  const length = getQuaternionLength(q);
  return divideQuaternion(q, length);
}
module.exports.normalizeQuaternion = normalizeQuaternion;
function absQuaternion(q) {
  return { x: Math.abs(q.x), y: Math.abs(q.y), z: Math.abs(q.z), w: Math.abs(q.w) };
}
module.exports.absQuaternion = absQuaternion;
function addQuaternions(q1, q2) {
  return { x: q1.x + q2.x, y: q1.y + q2.y, z: q1.z + q2.z, w: q1.w + q2.w };
}
module.exports.addQuaternions = addQuaternions;
function subtractQuaternions(q1, q2) {
  return { x: q1.x - q2.x, y: q1.y - q2.y, z: q1.z - q2.z, w: q1.w - q2.w };
}
module.exports.subtractQuaternions = subtractQuaternions;
function divideQuaternion(q, s) {
  if (s === 0) {
    hiber3d.print("divideVector() - division by zero");
    return { x: 0, y: 0, z: 0, w: 0 };
  }
  return { x: q.x / s, y: q.y / s, z: q.z / s, w: q.w / s };
}
module.exports.divideQuaternion = divideQuaternion;
function multiplyQuaternion(q1, s) {
  return { w: q1.w * s, x: q1.w * s, y: q1.w * s, z: q1.w * s, };
}
module.exports.multiplyQuaternion = multiplyQuaternion;
function multiplyQuaternions(q1, q2) {
  return {
    w: q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z,
    x: q1.w * q2.x + q1.x * q2.w + q1.y * q2.z - q1.z * q2.y,
    y: q1.w * q2.y - q1.x * q2.z + q1.y * q2.w + q1.z * q2.x,
    z: q1.w * q2.z + q1.x * q2.y - q1.y * q2.x + q1.z * q2.w,
  };
}
module.exports.multiplyQuaternions = multiplyQuaternions;

function dotProductQuaternion(q1, q2) {
  return q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;
}
module.exports.dotProductQuaternion = dotProductQuaternion;
function quaternionElementWiseMultiplication(q1, q2) {
  return { x: q1.x * q2.x, y: q1.y * q2.y, z: q1.z * q2.z, w: q1.w * q2.w }
}
module.exports.quaternionElementWiseMultiplication = quaternionElementWiseMultiplication;

function lerpQuaternionWithDistance(q1, q2, d) {
  const dot = q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;
  const q2Adjusted = dot < 0 ? { x: -q2.x, y: -q2.y, z: -q2.z, w: -q2.w } : q2;
  
  const angle = Math.acos(Math.min(Math.abs(dot < 0 ? -dot : dot), 1.0));
  
  if (angle <= d) {
    return q2Adjusted;
  }
  
  const t = d / angle;
  
  if (dot > 0.9995) {
    return normalizeQuaternion({
      x: q1.x + t * (q2Adjusted.x - q1.x),
      y: q1.y + t * (q2Adjusted.y - q1.y),
      z: q1.z + t * (q2Adjusted.z - q1.z),
      w: q1.w + t * (q2Adjusted.w - q1.w)
    });
  } else {
    const sinAngle = Math.sin(angle);
    const invSinAngle = 1.0 / sinAngle;
    
    const s0 = Math.sin((1.0 - t) * angle) * invSinAngle;
    const s1 = Math.sin(t * angle) * invSinAngle;
    
    return {
      x: s0 * q1.x + s1 * q2Adjusted.x,
      y: s0 * q1.y + s1 * q2Adjusted.y,
      z: s0 * q1.z + s1 * q2Adjusted.z,
      w: s0 * q1.w + s1 * q2Adjusted.w
    };
  }
}
module.exports.lerpQuaternionWithDistance = lerpQuaternionWithDistance;

function flattenQuaternion(q) {
  const forward = forwardVectorFromQuaternion(q);

  const flatForward = {
    x: forward.x,
    y: 0,
    z: forward.z
  };

  const epsilon = 0.0001;
  const lengthSq = flatForward.x * flatForward.x + flatForward.z * flatForward.z;

  if (lengthSq < epsilon) {
    return { x: 0, y: 0, z: 0, w: 1 };
  }

  const yRotation = Math.atan2(flatForward.x, flatForward.z);
  const halfAngle = yRotation / 2;

  return {
    x: 0,
    y: Math.sin(halfAngle),
    z: 0,
    w: Math.cos(halfAngle)
  };
}
module.exports.flattenQuaternion = flattenQuaternion;

function rotateQuaternionAroundY(q, progress) {
  const angle = progress * 2 * Math.PI;
  const halfAngle = angle / 2;
  const rotationQ = { x: 0, y: Math.sin(halfAngle), z: 0, w: Math.cos(halfAngle) };
  return {
    x: rotationQ.w * q.x + rotationQ.y * q.z,
    y: rotationQ.w * q.y + rotationQ.y * q.w,
    z: rotationQ.w * q.z - rotationQ.y * q.x,
    w: rotationQ.w * q.w - rotationQ.y * q.y
  };
};
module.exports.rotateQuaternionAroundY = rotateQuaternionAroundY;

function rotateVectorByQuaternion(v, q) {
  const qNorm = normalizeQuaternion(q);

  const qx = qNorm.x, qy = qNorm.y, qz = qNorm.z, qw = qNorm.w;
  const vx = v.x, vy = v.y, vz = v.z;

  const v4 = { x: vx, y: vy, z: vz, w: 0 };
  const temp = multiplyQuaternions(qNorm, v4);

  const inv = { x: -qx, y: -qy, z: -qz, w: qw };
  const result = multiplyQuaternions(temp, inv);

  return result;
}
module.exports.rotateVectorByQuaternion = rotateVectorByQuaternion;

function quaternionFromVector(direction) {
  // Input validation
  if (!direction || typeof direction !== 'object') {
    throw new Error('Vector must be an object');
  }
  if (typeof direction.x !== 'number' ||
    typeof direction.y !== 'number' ||
    typeof direction.z !== 'number') {
    throw new Error('Vector must have numeric x, y, z components');
  }

  // Normalize the direction vector
  var length = Math.sqrt(
    direction.x * direction.x +
    direction.y * direction.y +
    direction.z * direction.z
  );

  var normalizedDir = {
    x: direction.x / length,
    y: direction.y / length,
    z: direction.z / length
  };

  // Handle special cases where the direction is along the Y axis
  if (Math.abs(normalizedDir.x) < 0.000001 && Math.abs(normalizedDir.z) < 0.000001) {
    // Direction is pointing straight up or down
    if (normalizedDir.y > 0) {
      // Pointing up (+Y), 90 degree rotation around X
      return { x: Math.sin(Math.PI / 4), y: 0, z: 0, w: Math.cos(Math.PI / 4) };
    } else {
      // Pointing down (-Y), -90 degree rotation around X
      return { x: -Math.sin(Math.PI / 4), y: 0, z: 0, w: Math.cos(Math.PI / 4) };
    }
  }

  // Project the direction onto the XZ plane
  var horizontalDir = {
    x: normalizedDir.x,
    y: 0,
    z: normalizedDir.z
  };

  // Normalize the horizontal direction
  var horizontalLength = Math.sqrt(horizontalDir.x * horizontalDir.x + horizontalDir.z * horizontalDir.z);
  var normalizedHorizontal = {
    x: horizontalDir.x / horizontalLength,
    y: 0,
    z: horizontalDir.z / horizontalLength
  };

  // Calculate yaw (rotation around Y axis) based on horizontal direction
  // For -Z as forward, we need to adjust our atan2 calculation
  // When looking at -Z, the angle should be 0
  var yawAngle = Math.atan2(-normalizedHorizontal.x, -normalizedHorizontal.z);
  var halfYawAngle = yawAngle / 2;
  var yawQuat = {
    x: 0,
    y: Math.sin(halfYawAngle),
    z: 0,
    w: Math.cos(halfYawAngle)
  };

  // Calculate pitch (rotation around X axis) based on the angle between
  // horizontal direction and the full direction
  var pitchAngle = Math.atan2(normalizedDir.y,
    Math.sqrt(normalizedDir.x * normalizedDir.x + normalizedDir.z * normalizedDir.z));
  var halfPitchAngle = pitchAngle / 2;
  var pitchQuat = {
    x: Math.sin(halfPitchAngle),
    y: 0,
    z: 0,
    w: Math.cos(halfPitchAngle)
  };

  // Combine the rotations: first yaw, then pitch
  // Using quaternion multiplication: result = yaw * pitch
  var result = {
    x: yawQuat.w * pitchQuat.x + yawQuat.x * pitchQuat.w + yawQuat.y * pitchQuat.z - yawQuat.z * pitchQuat.y,
    y: yawQuat.w * pitchQuat.y - yawQuat.x * pitchQuat.z + yawQuat.y * pitchQuat.w + yawQuat.z * pitchQuat.x,
    z: yawQuat.w * pitchQuat.z + yawQuat.x * pitchQuat.y - yawQuat.y * pitchQuat.x + yawQuat.z * pitchQuat.w,
    w: yawQuat.w * pitchQuat.w - yawQuat.x * pitchQuat.x - yawQuat.y * pitchQuat.y - yawQuat.z * pitchQuat.z
  };

  return result;
} module.exports.quaternionFromVector = quaternionFromVector;

function vectorFromQuaternion(quaternion) {
  // Input validation
  if (!quaternion || typeof quaternion !== 'object') {
    throw new Error('Quaternion must be an object');
  }
  if (typeof quaternion.x !== 'number' ||
    typeof quaternion.y !== 'number' ||
    typeof quaternion.z !== 'number' ||
    typeof quaternion.w !== 'number') {
    throw new Error('Quaternion must have numeric x, y, z, w components');
  }

  // Normalize the quaternion to ensure unit length
  const normalizedQ = normalizeQuaternion(quaternion);

  // Forward vector that we're rotating
  const forward = { x: 0, y: 0, z: -1 };

  // Calculate the rotated vector using quaternion rotation formula:
  // v' = q * v * q^-1
  // For a unit quaternion, q^-1 is the conjugate (x,y,z components negated)

  // First, create a quaternion from our vector (w = 0 for pure vectors)
  const vectorQuaternion = {
    x: forward.x,
    y: forward.y,
    z: forward.z,
    w: 0
  };

  // Calculate q * v
  const firstMult = multiplyQuaternions(normalizedQ, vectorQuaternion);

  // Calculate (q * v) * q^-1
  const conjugate = {
    x: -normalizedQ.x,
    y: -normalizedQ.y,
    z: -normalizedQ.z,
    w: normalizedQ.w
  };

  const result = multiplyQuaternions(firstMult, conjugate);

  // The result quaternion's x,y,z components are our rotated vector
  return vectorUtils.normalizeVector({
    x: result.x,
    y: result.y,
    z: result.z
  });
};
module.exports.vectorFromQuaternion = vectorFromQuaternion;
function forwardVectorFromQuaternion(q) {
  const x = 2 * (q.x * q.z + q.w * q.y);
  const y = 2 * (q.y * q.z - q.w * q.x);
  const z = 1 - 2 * (q.x * q.x + q.y * q.y);
  return { x: x, y: y, z: z };
}
module.exports.forwardVectorFromQuaternion = forwardVectorFromQuaternion;