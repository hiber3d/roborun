const module = module || {};
module.exports = module.exports || {};

/**
 * Returns the position and rotation of an object travelling along a spline.
 * @param {Object} p1 - The starting position of the spline (vec3)
 * @param {Object} p2 - The ending position of the spline (vec3)
 * @param {Object} q1 - The starting rotation of the spline (quat)
 * @param {Object} q2 - The ending rotation of the spline (quat)
 * @param {number} distanceTravelled - The distance in meters travelled along the spline
 * @param {number} curveFactor - The curve factor in the interval [0, 1]
 * @returns {Object} The position and rotation of the object
 */
function getSpline(p1, p2, q1, q2, distanceTravelled, curveFactor) {
  // Calculate the direction vector from p1 to p2
  const direction = {
    x: p2.x - p1.x,
    y: p2.y - p1.y,
    z: p2.z - p1.z
  };

  // Calculate the total length of the direct path
  const directLength = Math.sqrt(
    direction.x * direction.x +
    direction.y * direction.y +
    direction.z * direction.z
  );

  // Normalize the direction vector
  const normalizedDir = {
    x: direction.x / directLength,
    y: direction.y / directLength,
    z: direction.z / directLength
  };

  // Convert starting rotation to forward vector (0, 0, -1 is forward)
  const forwardVec = rotateVector({ x: 0, y: 0, z: -1 }, q1);

  // Calculate cross product to get the axis of rotation for the curve
  const crossProduct = {
    x: forwardVec.y * normalizedDir.z - forwardVec.z * normalizedDir.y,
    y: forwardVec.z * normalizedDir.x - forwardVec.x * normalizedDir.z,
    z: forwardVec.x * normalizedDir.y - forwardVec.y * normalizedDir.x
  };

  // Normalize the cross product vector
  const crossLength = Math.sqrt(
    crossProduct.x * crossProduct.x +
    crossProduct.y * crossProduct.y +
    crossProduct.z * crossProduct.z
  );

  // Check if vectors are parallel (cross product is near zero)
  const isParallel = crossLength < 0.001;

  // Normalize the cross product (if not parallel)
  const normalizedCross = isParallel ?
    { x: 0, y: 1, z: 0 } : // Default up vector if parallel
    {
      x: crossProduct.x / crossLength,
      y: crossProduct.y / crossLength,
      z: crossProduct.z / crossLength
    };

  // Get dot product between forward and normalized direction
  const dotProduct = forwardVec.x * normalizedDir.x +
    forwardVec.y * normalizedDir.y +
    forwardVec.z * normalizedDir.z;

  // Clamp dot product to [-1, 1] range to avoid precision errors
  const clampedDot = Math.max(-1, Math.min(1, dotProduct));

  // Calculate the angle between forward and target direction
  const angle = Math.acos(clampedDot);

  // Calculate the curve length based on the direct length and curve factor
  // For a 90-degree curve (curveFactor = 1), the path is π/2 times longer
  const curveLengthRatio = 1.0 + (Math.PI / 2 - 1.0) * curveFactor;
  const totalCurveLength = directLength * curveLengthRatio;

  // Normalize the distance travelled
  const normalizedDistance = Math.min(1.0, distanceTravelled / totalCurveLength);

  // For flat spline checking, find which dimension is shared
  const flatDimension = getFlatDimension(p1, p2, q1, q2);

  // Calculate position based on the curve
  var position;
  if (curveFactor < 0.001 || isParallel) {
    // For zero curve factor or parallel vectors, use linear interpolation
    position = {
      x: p1.x + normalizedDistance * direction.x,
      y: p1.y + normalizedDistance * direction.y,
      z: p1.z + normalizedDistance * direction.z
    };
  } else {
    // Construct a quadratic Bezier curve for the path
    const controlPoint = calculateControlPoint(p1, p2, forwardVec, curveFactor, directLength);

    // Apply quadratic Bezier formula: B(t) = (1-t)²p1 + 2(1-t)tp2 + t²p3
    const t = normalizedDistance;
    const oneMinusT = 1 - t;
    position = {
      x: oneMinusT * oneMinusT * p1.x + 2 * oneMinusT * t * controlPoint.x + t * t * p2.x,
      y: oneMinusT * oneMinusT * p1.y + 2 * oneMinusT * t * controlPoint.y + t * t * p2.y,
      z: oneMinusT * oneMinusT * p1.z + 2 * oneMinusT * t * controlPoint.z + t * t * p2.z
    };

    // If there's a flat dimension, ensure it stays flat
    if (flatDimension !== null) {
      position[flatDimension] = p1[flatDimension];
    }
  }

  // Calculate rotation by spherical linear interpolation (slerp)
  // For curved paths, calculate the tangent and use it to determine orientation
  var rotation;
  if (curveFactor < 0.001 || isParallel) {
    // For zero curve factor or parallel vectors, just use slerp
    rotation = slerpQuaternion(q1, q2, normalizedDistance);
  } else {
    // Calculate the tangent to the curve at the current point
    const tangent = calculateCurveTangent(p1, p2, normalizedDistance, curveFactor, forwardVec, directLength);

    // Create an intermediate rotation that aligns with the tangent
    const intermediateRotation = calculateRotationFromDirection(tangent);

    // Then interpolate between start rotation, intermediate rotation, and end rotation
    if (normalizedDistance < 0.5) {
      // First half: interpolate from q1 to intermediate
      const t = normalizedDistance * 2; // Rescale to [0, 1]
      rotation = slerpQuaternion(q1, intermediateRotation, t);
    } else {
      // Second half: interpolate from intermediate to q2
      const t = (normalizedDistance - 0.5) * 2; // Rescale to [0, 1]
      rotation = slerpQuaternion(intermediateRotation, q2, t);
    }
  }

  return { position, rotation };
}

/**
 * Checks if the spline is flat in any dimension and returns that dimension
 * @param {Object} p1 - Start position
 * @param {Object} p2 - End position
 * @param {Object} q1 - Start rotation
 * @param {Object} q2 - End rotation
 * @returns {string|null} - The flat dimension ('x', 'y', 'z') or null if not flat
 */
function getFlatDimension(p1, p2, q1, q2) {
  // Check if positions are the same in any dimension
  const dimensions = ['x', 'y', 'z'];

  for (var i=0; i<dimensions.length; i++) {
    if (Math.abs(p1[dimensions[i]] - p2[dimensions[i]]) < 0.001) {
      const forwardVec1 = rotateVector({ x: 0, y: 0, z: -1 }, q1);
      const forwardVec2 = rotateVector({ x: 0, y: 0, z: -1 }, q2);

      if (Math.abs(forwardVec1[dimensions[i]]) < 0.001 && Math.abs(forwardVec2[dimensions[i]]) < 0.001) {
        return dimensions[i];
      }
    }
  }

  return null;
}

/**
 * Calculates the control point for the quadratic Bezier curve
 * @param {Object} p1 - Start position
 * @param {Object} p2 - End position
 * @param {Object} forwardVec - Forward vector from start rotation
 * @param {number} curveFactor - Curve factor [0, 1]
 * @param {number} directLength - Direct length between p1 and p2
 * @returns {Object} - Control point position
 */
function calculateControlPoint(p1, p2, forwardVec, curveFactor, directLength) {
  // Calculate control point by projecting from p1 in the forward direction
  const controlDistance = directLength * curveFactor;

  return {
    x: p1.x + forwardVec.x * controlDistance,
    y: p1.y + forwardVec.y * controlDistance,
    z: p1.z + forwardVec.z * controlDistance
  };
}

/**
 * Calculates the tangent vector to the curve at a given point
 * @param {Object} p1 - Start position
 * @param {Object} p2 - End position
 * @param {number} t - Normalized distance [0, 1]
 * @param {number} curveFactor - Curve factor [0, 1]
 * @param {Object} forwardVec - Forward vector from start rotation
 * @param {number} directLength - Direct length between p1 and p2
 * @returns {Object} - Normalized tangent vector
 */
function calculateCurveTangent(p1, p2, t, curveFactor, forwardVec, directLength) {
  const controlPoint = calculateControlPoint(p1, p2, forwardVec, curveFactor, directLength);

  // Derivative of quadratic Bezier: B'(t) = 2(1-t)(p2-p1) + 2t(p3-p2)
  const tangent = {
    x: 2 * (1 - t) * (controlPoint.x - p1.x) + 2 * t * (p2.x - controlPoint.x),
    y: 2 * (1 - t) * (controlPoint.y - p1.y) + 2 * t * (p2.y - controlPoint.y),
    z: 2 * (1 - t) * (controlPoint.z - p1.z) + 2 * t * (p2.z - controlPoint.z)
  };

  // Normalize the tangent
  const length = Math.sqrt(
    tangent.x * tangent.x +
    tangent.y * tangent.y +
    tangent.z * tangent.z
  );

  return {
    x: tangent.x / length,
    y: tangent.y / length,
    z: tangent.z / length
  };
}

/**
 * Creates a quaternion rotation from a direction vector
 * @param {Object} direction - Direction vector
 * @returns {Object} - Quaternion rotation
 */
function calculateRotationFromDirection(direction) {
  // Original forward vector is (0, 0, -1)
  const originalForward = { x: 0, y: 0, z: -1 };

  // Calculate dot product
  const dot = originalForward.x * direction.x +
    originalForward.y * direction.y +
    originalForward.z * direction.z;

  // If vectors are parallel (either same or opposite direction)
  if (Math.abs(dot + 1) < 0.001) {
    // Vectors are opposite, rotate 180 degrees around Y axis
    return { x: 0, y: 1, z: 0, w: 0 };
  }

  if (Math.abs(dot - 1) < 0.001) {
    // Vectors are identical, no rotation needed
    return { x: 0, y: 0, z: 0, w: 1 };
  }

  // Calculate cross product for rotation axis
  const cross = {
    x: originalForward.y * direction.z - originalForward.z * direction.y,
    y: originalForward.z * direction.x - originalForward.x * direction.z,
    z: originalForward.x * direction.y - originalForward.y * direction.x
  };

  // Normalize the cross product
  const crossLength = Math.sqrt(
    cross.x * cross.x +
    cross.y * cross.y +
    cross.z * cross.z
  );

  const normCross = {
    x: cross.x / crossLength,
    y: cross.y / crossLength,
    z: cross.z / crossLength
  };

  // Calculate the rotation angle
  const angle = Math.acos(dot);

  // Convert axis-angle to quaternion
  const halfAngle = angle / 2;
  const s = Math.sin(halfAngle);

  return {
    x: normCross.x * s,
    y: normCross.y * s,
    z: normCross.z * s,
    w: Math.cos(halfAngle)
  };
}

/**
 * Performs spherical linear interpolation between two quaternions
 * @param {Object} q1 - Start quaternion
 * @param {Object} q2 - End quaternion
 * @param {number} t - Interpolation factor [0, 1]
 * @returns {Object} - Interpolated quaternion
 */
function slerpQuaternion(q1, q2, t) {
  // Calculate dot product
  var dot = q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;

  // If dot product is negative, we need to negate one of the quaternions
  // to take the shortest path
  var q2Adj = { x: q2.x, y: q2.y, z: q2.z, w: q2.w };
  if (dot < 0) {
    dot = -dot;
    q2Adj.x = -q2Adj.x;
    q2Adj.y = -q2Adj.y;
    q2Adj.z = -q2Adj.z;
    q2Adj.w = -q2Adj.w;
  }

  // If quaternions are very close, use linear interpolation
  if (dot > 0.9995) {
    return {
      x: q1.x + t * (q2Adj.x - q1.x),
      y: q1.y + t * (q2Adj.y - q1.y),
      z: q1.z + t * (q2Adj.z - q1.z),
      w: q1.w + t * (q2Adj.w - q1.w)
    };
  }

  // Calculate the angle between quaternions
  const angle = Math.acos(dot);
  const sinAngle = Math.sin(angle);

  // Calculate the interpolation factors
  const factor1 = Math.sin((1 - t) * angle) / sinAngle;
  const factor2 = Math.sin(t * angle) / sinAngle;

  // Perform the interpolation
  const result = {
    x: factor1 * q1.x + factor2 * q2Adj.x,
    y: factor1 * q1.y + factor2 * q2Adj.y,
    z: factor1 * q1.z + factor2 * q2Adj.z,
    w: factor1 * q1.w + factor2 * q2Adj.w
  };

  // Normalize the result
  const length = Math.sqrt(
    result.x * result.x +
    result.y * result.y +
    result.z * result.z +
    result.w * result.w
  );

  return {
    x: result.x / length,
    y: result.y / length,
    z: result.z / length,
    w: result.w / length
  };
}

/**
 * Rotates a vector by a quaternion
 * @param {Object} v - The vector to rotate
 * @param {Object} q - The quaternion rotation
 * @returns {Object} - The rotated vector
 */
function rotateVector(v, q) {
  // Calculate quaternion * vector * conjugate of quaternion
  // First, convert vector to pure quaternion with 0 as real part
  const vq = { x: v.x, y: v.y, z: v.z, w: 0 };

  // Calculate quaternion multiplication: q * vq
  const temp = {
    x: q.w * vq.x + q.y * vq.z - q.z * vq.y,
    y: q.w * vq.y + q.z * vq.x - q.x * vq.z,
    z: q.w * vq.z + q.x * vq.y - q.y * vq.x,
    w: -q.x * vq.x - q.y * vq.y - q.z * vq.z
  };

  // Calculate conjugate of q
  const qConj = { x: -q.x, y: -q.y, z: -q.z, w: q.w };

  // Calculate multiplication: temp * qConj
  const result = {
    x: temp.w * qConj.x + temp.x * qConj.w + temp.y * qConj.z - temp.z * qConj.y,
    y: temp.w * qConj.y + temp.y * qConj.w + temp.z * qConj.x - temp.x * qConj.z,
    z: temp.w * qConj.z + temp.z * qConj.w + temp.x * qConj.y - temp.y * qConj.x
  };

  return result;
}

module.exports.getSpline = getSpline;