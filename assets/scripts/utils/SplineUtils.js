const module = module || {};
module.exports = module.exports || {};

function getSplineDistance(p1, p2, dir1, dir2, curveFactor) {
  const distance = vectorUtils.getVectorDistance(p1, p2);

  const delta = vectorUtils.subtractVectors(p2, p1);
  const sumDirs = vectorUtils.addVectors(dir1, dir2);
  const t = vectorUtils.dotProduct(delta, sumDirs) / vectorUtils.dotProduct(sumDirs, sumDirs);
  const curvedDistance = 2 * t * vectorUtils.getVectorLength(dir1);

  return scalarUtils.lerpScalar(distance, curvedDistance, curveFactor);
}

function getSpline(p1, p2, q1, q2, distanceTravelled, curveFactor) {

  const dir1 = vectorUtils.normalizeVector(quatUtils.vectorFromQuaternion(q1));
  const dir2 = vectorUtils.normalizeVector(quatUtils.vectorFromQuaternion(q2));

  const splineDistance = getSplineDistance(p1, p2, dir1, dir2, curveFactor);
  const lerpFactor = Math.min(1, distanceTravelled / splineDistance);

  const lerpedPosition = vectorUtils.addVectors(
    vectorUtils.lerpVector(p1, p2, lerpFactor),
    vectorUtils.multiplyVector(
      vectorUtils.addVectors(
        vectorUtils.multiplyVector(dir1, (1 - lerpFactor) * lerpFactor),
        vectorUtils.multiplyVector(dir2, -lerpFactor * (1 - lerpFactor))
      ),
      splineDistance * curveFactor
    )
  );
  const lerpedDir = vectorUtils.normalizeVector(vectorUtils.lerpVector(dir1, dir2, lerpFactor));
  const lerpedRotation = quatUtils.quaternionFromVector(lerpedDir);

  const position = lerpedPosition;
  const rotation = lerpedRotation;
  return { position, rotation };
}
module.exports.getSpline = getSpline;