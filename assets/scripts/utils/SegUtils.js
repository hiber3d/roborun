const module = module || {};
module.exports = module.exports || {};

const regUtils = require("scripts/utils/RegUtils.js");

function getStepEntity(segmentSceneEntity, stepIndex) {
  const stepsEntity = regUtils.findEntityWithNameInHierarchy(segmentSceneEntity, "steps");
  if (stepsEntity == undefined) {
    //hiber3d.print("getStepEntity() - stepsEntity is undefined");
    return undefined;
  }
  if (hiber3d.hasComponents(stepsEntity, "Hiber3D::Children") === false) {
    //hiber3d.print("getStepEntity() - stepsEntity has no children");
    return undefined;
  }
  const stepChildren = hiber3d.getValue(stepsEntity, "Hiber3D::Children", "entities");
  var index = stepIndex;
  if (stepIndex === -1) {
    index = stepChildren.length - 1;
  } else {
    if (stepIndex >= stepChildren.length) {
      return getStepEntity(segmentSceneEntity, stepIndex - stepChildren.length);
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
  const segmentSceneEntity = hiber3d.getValue("SegmentsState", "currentSegmentSceneEntity");
  const stepIndex = hiber3d.getValue("SegmentsState", "currentStepIndex");
  return getStepEntity(segmentSceneEntity, stepIndex);
}
module.exports.getCurrentStepEntity = getCurrentStepEntity;

function getNextStepEntity() {
  const segmentSceneEntity = hiber3d.getValue("SegmentsState", "currentSegmentSceneEntity");
  const stepIndex = hiber3d.getValue("SegmentsState", "currentStepIndex") + 1;
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
  if (currentStepEntity === undefined) {
    hiber3d.print("isPlayerAtTurn() - currentStepEntity is undefined");
    return false;
  }
  return hiber3d.getValue(currentStepEntity, "Step", "indexForward") >= 0;
}
module.exports.isPlayerAtForward = isPlayerAtForward;
function isPlayerAtLeftTurn() {
  const currentStepEntity = getCurrentStepEntity();
  if (currentStepEntity === undefined) {
    hiber3d.print("isPlayerAtTurn() - currentStepEntity is undefined");
    return false;
  }
  return hiber3d.getValue(currentStepEntity, "Step", "indexLeft") >= 0;
}
module.exports.isPlayerAtLeftTurn = isPlayerAtLeftTurn;
function isPlayerAtRightTurn() {
  const currentStepEntity = getCurrentStepEntity();
  if (currentStepEntity === undefined) {
    hiber3d.print("isPlayerAtTurn() - currentStepEntity is undefined");
    return false;
  }
  return rightIndex = hiber3d.getValue(currentStepEntity, "Step", "indexRight") >= 0;
}
module.exports.isPlayerAtRightTurn = isPlayerAtRightTurn;

function takeTurn(left) {
  const currentStepEntity = getCurrentStepEntity();
  if (currentStepEntity === undefined) {
    hiber3d.print("isPlayerAtTurn() - currentStepEntity is undefined");
    return;
  }
  const newIndex = hiber3d.getValue(currentStepEntity, "Step", (left ? "indexLeft" : "indexRight"));
  if (newIndex < 0) {
    hiber3d.print("takeTurn() - illegal newIndex value:'" + newIndex + "'");
    return;
  }
  hiber3d.setValue("SegmentsState", "currentStepIndex", newIndex);
  hiber3d.setValue("SegmentsState", "distanceFromCurrentStep", 0);

  // Progress to next segment
  if (newIndex == 0) {
    const currentSegmentSceneEntity = hiber3d.getValue("SegmentsState", "currentSegmentSceneEntity");
    if (hiber3d.hasComponents(currentSegmentSceneEntity, "SegmentScene")) {
      hiber3d.print("takeTurn() - currentSegmentSceneEntity:'" + currentSegmentSceneEntity + "' misses SegmentScene component");
      return;
    }
    const nextSegmentSceneEntity = hiber3d.getValue(currentSegmentSceneEntity, "SegmentScene", "next");

    hiber3d.setValue("SegmentsState", "currentSegmentSceneEntity", nextSegmentSceneEntity);
  }
}
module.exports.takeTurn = takeTurn;

function getNumberOfSegments() {
  const segmentsSceneEntity = hiber3d.getValue("SegmentsState", "segmentsSceneEntity");
  if(hiber3d.hasComponents(segmentsSceneEntity, "Hiber3D::Children") === false) {
    hiber3d.print("getNumberOfSegments() - segmentsSceneEntity:'" + segmentsSceneEntity + "' has no children");
    return 0;
  }
  var segments = 0;
  var children = hiber3d.getValue(segmentsSceneEntity, "Hiber3D::Children", "entities");
  for (var i = 0; i < children.length; i++) {
    if (hiber3d.hasComponents(children[i], "SegmentScene")) {
      segments++;
    }
  }

  return segments;
}
module.exports.getNumberOfSegments = getNumberOfSegments;