const module = module || {};
module.exports = module.exports || {};

function getStepEntity(segmentSceneEntity, stepIndex) {
  const stepsEntity = regUtils.findEntityWithNameAmongDescendants(segmentSceneEntity, "steps");
  if (stepsEntity == undefined) {
    //hiber3d.print("getStepEntity() - stepsEntity is undefined");
    return undefined;
  }
  const stepChildren = hiber3d.getChildren(stepsEntity);
  var index = stepIndex;
  if (stepIndex === -1) {
    index = Object.keys(stepChildren).length - 1;
  } else {
    if (stepIndex >= Object.keys(stepChildren).length) {
      return getStepEntity(segmentSceneEntity, stepIndex - Object.keys(stepChildren).length);
    }
  }
  const stepEntity = stepChildren[index];
  if (hiber3d.hasComponents(stepEntity, "Step") === false) {
    //hiber3d.print("getStepEntity() - stepEntity:'" + stepEntity + "' has no Step component");
    return undefined;
  }
  if (hiber3d.hasComponents(stepEntity, "Hiber3D::Transform") === false) {
    //hiber3d.print("getStepEntity() - stepEntity:'" + stepEntity + "' has no Hiber3D::Transform component");
    return undefined;
  }
  if (hiber3d.hasComponents(stepEntity, "Hiber3D::ComputedWorldTransform") === false) {
    //hiber3d.print("getStepEntity() - stepEntity:'" + stepEntity + "' has no Hiber3D::ComputedWorldTransform component");
    return undefined;
  }
  return stepEntity;
}
module.exports.getStepEntity = getStepEntity;

function getCurrentStepEntity() {
  const segmentsState = hiber3d.getSingleton("SegmentsState");
  const segmentSceneEntity = segmentsState.currentSegmentSceneEntity;
  const stepIndex = segmentsState.currentStepIndex;
  return getStepEntity(segmentSceneEntity, stepIndex);
}
module.exports.getCurrentStepEntity = getCurrentStepEntity;

function getNextStepEntity() {
  const segmentsState = hiber3d.getSingleton("SegmentsState");
  const segmentSceneEntity = segmentsState.currentSegmentSceneEntity;
  const stepIndex = segmentsState.currentStepIndex + 1;
  return getStepEntity(segmentSceneEntity, stepIndex);
}
module.exports.getNextStepEntity = getNextStepEntity;

function getLastStepEntityOf(segmentSceneEntity) {
  return getStepEntity(segmentSceneEntity, -1);
}
module.exports.getLastStepEntityOf = getLastStepEntityOf;

function isLastStepEntity(stepEntity) {
  return regUtils.isLastChild(stepEntity);
}
module.exports.isLastStepEntity = isLastStepEntity;

function isPlayerAtForward() {
  const currentStepEntity = getCurrentStepEntity();
  if (regUtils.isNullEntity(currentStepEntity)) {
    hiber3d.print("isPlayerAtTurn() - currentStepEntity is undefined");
    return false;
  }
  return hiber3d.getComponent(currentStepEntity, "Step").indexForward >= 0;
}
module.exports.isPlayerAtForward = isPlayerAtForward;
function isPlayerAtLeftTurn() {
  const currentStepEntity = getCurrentStepEntity();
  if (regUtils.isNullEntity(currentStepEntity)) {
    hiber3d.print("isPlayerAtTurn() - currentStepEntity is undefined");
    return false;
  }
  return hiber3d.getComponent(currentStepEntity, "Step").indexLeft >= 0;
}
module.exports.isPlayerAtLeftTurn = isPlayerAtLeftTurn;
function isPlayerAtRightTurn() {
  const currentStepEntity = getCurrentStepEntity();
  if (regUtils.isNullEntity(currentStepEntity)) {
    hiber3d.print("isPlayerAtTurn() - currentStepEntity is undefined");
    return false;
  }
  return rightIndex = hiber3d.getComponent(currentStepEntity, "Step").indexRight >= 0;
}
module.exports.isPlayerAtRightTurn = isPlayerAtRightTurn;

function takeTurn(left) {
  const currentStepEntity = getCurrentStepEntity();
  if (regUtils.isNullEntity(currentStepEntity)) {
    hiber3d.print("isPlayerAtTurn() - currentStepEntity is undefined");
    return;
  }
  const newIndex = hiber3d.getComponent(currentStepEntity, "Step")[left ? "indexLeft" : "indexRight"];
  if (newIndex < 0) {
    hiber3d.print("takeTurn() - illegal newIndex value:'" + newIndex + "'");
    return;
  }
  const segmentsState = hiber3d.getSingleton("SegmentsState");
  segmentsState.currentStepIndex = newIndex;
  segmentsState.distanceFromCurrentStep = 0;
  hiber3d.setSingleton("SegmentsState", segmentsState);

  // Progress to next segment
  if (newIndex == 0) {
    const currentSegmentSceneEntity = hiber3d.getSingleton("SegmentsState").currentSegmentSceneEntity;
    if (hiber3d.hasComponents(currentSegmentSceneEntity, "SegmentScene")) {
      hiber3d.print("takeTurn() - currentSegmentSceneEntity:'" + currentSegmentSceneEntity + "' misses SegmentScene component");
      return;
    }
    const nextSegmentSceneEntity = hiber3d.getComponent(currentSegmentSceneEntity, "SegmentScene").next;

    segmentsState.currentSegmentSceneEntity = nextSegmentSceneEntity;
    hiber3d.setSingleton("SegmentsState", segmentsState);
  }
}
module.exports.takeTurn = takeTurn;

function getNumberOfSegments() {
  const segmentsSceneEntity = hiber3d.getSingleton("SegmentsState").segmentsSceneEntity;
  var segments = 0;
  var children = hiber3d.getChildren(segmentsSceneEntity);
  for (var i = 0; i < children.length; i++) {
    if (hiber3d.hasComponents(children[i], "SegmentScene")) {
      segments++;
    }
  }

  return segments;
}
module.exports.getNumberOfSegments = getNumberOfSegments;