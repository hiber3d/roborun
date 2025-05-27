import * as regUtils from "scripts/utils/RegUtils.js";

export function getStepEntity(segmentSceneEntity, stepIndex) {
  const stepsEntity = regUtils.findEntityWithNameAmongDescendants(segmentSceneEntity, "steps");
  if (stepsEntity == undefined) {
    //hiber3d.print("getStepEntity() - stepsEntity is undefined");
    return undefined;
  }
  if (hiber3d.hasComponents(stepsEntity, "Hiber3D_Children") === false) {
    //hiber3d.print("getStepEntity() - stepsEntity has no children");
    return undefined;
  }
  const stepChildren = hiber3d.getComponent(stepsEntity, "Hiber3D_Children", "entities");
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
  if (hiber3d.hasComponents(stepEntity, "Hiber3D_Transform") === false) {
    //hiber3d.print("getStepEntity() - stepEntity:'" + stepEntity + "' has no Hiber3D::Transform component");
    return undefined;
  }
  if (hiber3d.hasComponents(stepEntity, "Hiber3D_ComputedWorldTransform") === false) {
    //hiber3d.print("getStepEntity() - stepEntity:'" + stepEntity + "' has no Hiber3D::ComputedWorldTransform component");
    return undefined;
  }
  return stepEntity;
}

export function getCurrentStepEntity() {
  const segmentSceneEntity = hiber3d.getSingleton("SegmentsState", "currentSegmentSceneEntity");
  const stepIndex = hiber3d.getSingleton("SegmentsState", "currentStepIndex");
  return getStepEntity(segmentSceneEntity, stepIndex);
}

export function getNextStepEntity() {
  const segmentSceneEntity = hiber3d.getSingleton("SegmentsState", "currentSegmentSceneEntity");
  const stepIndex = hiber3d.getSingleton("SegmentsState", "currentStepIndex") + 1;
  return getStepEntity(segmentSceneEntity, stepIndex);
}

export function getLastStepEntityOf(segmentSceneEntity) {
  return getStepEntity(segmentSceneEntity, -1);
}

export function isLastStepEntity(stepEntity) {
  return regUtils.isLastChild(stepEntity);
}

export function isPlayerAtForward() {
  const currentStepEntity = getCurrentStepEntity();
  if (currentStepEntity === undefined) {
    hiber3d.print("isPlayerAtTurn() - currentStepEntity is undefined");
    return false;
  }
  return hiber3d.getComponent(currentStepEntity, "Step", "indexForward") >= 0;
}

export function isPlayerAtLeftTurn() {
  const currentStepEntity = getCurrentStepEntity();
  if (currentStepEntity === undefined) {
    hiber3d.print("isPlayerAtTurn() - currentStepEntity is undefined");
    return false;
  }
  return hiber3d.getComponent(currentStepEntity, "Step", "indexLeft") >= 0;
}

export function isPlayerAtRightTurn() {
  const currentStepEntity = getCurrentStepEntity();
  if (currentStepEntity === undefined) {
    hiber3d.print("isPlayerAtTurn() - currentStepEntity is undefined");
    return false;
  }
  return rightIndex = hiber3d.getComponent(currentStepEntity, "Step", "indexRight") >= 0;
}

export function takeTurn(left) {
  const currentStepEntity = getCurrentStepEntity();
  if (currentStepEntity === undefined) {
    hiber3d.print("isPlayerAtTurn() - currentStepEntity is undefined");
    return;
  }
  const newIndex = hiber3d.getComponent(currentStepEntity, "Step", (left ? "indexLeft" : "indexRight"));
  if (newIndex < 0) {
    hiber3d.print("takeTurn() - illegal newIndex value:'" + newIndex + "'");
    return;
  }
  hiber3d.setValue("SegmentsState", "currentStepIndex", newIndex);
  hiber3d.setValue("SegmentsState", "distanceFromCurrentStep", 0);

  // Progress to next segment
  if (newIndex == 0) {
    const currentSegmentSceneEntity = hiber3d.getSingleton("SegmentsState", "currentSegmentSceneEntity");
    if (hiber3d.hasComponents(currentSegmentSceneEntity, "SegmentScene")) {
      hiber3d.print("takeTurn() - currentSegmentSceneEntity:'" + currentSegmentSceneEntity + "' misses SegmentScene component");
      return;
    }
    const nextSegmentSceneEntity = hiber3d.getComponent(currentSegmentSceneEntity, "SegmentScene", "next");

    hiber3d.setValue("SegmentsState", "currentSegmentSceneEntity", nextSegmentSceneEntity);
  }
}

export function getNumberOfSegments() {
  const segmentsSceneEntity = hiber3d.getSingleton("SegmentsState", "segmentsSceneEntity");
  if(hiber3d.hasComponents(segmentsSceneEntity, "Hiber3D_Children") === false) {
    hiber3d.print("getNumberOfSegments() - segmentsSceneEntity:'" + segmentsSceneEntity + "' has no children");
    return 0;
  }
  var segments = 0;
  var children = hiber3d.getComponent(segmentsSceneEntity, "Hiber3D_Children", "entities");
  for (var i = 0; i < children.length; i++) {
    if (hiber3d.hasComponents(children[i], "SegmentScene")) {
      segments++;
    }
  }

  return segments;
}
