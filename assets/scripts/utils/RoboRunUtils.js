export function getSplineHeight(entity) {
    return hiber3d.hasComponents(entity, "SplineData") ? hiber3d.getComponent(entity, "SplineData", "position").y : 0;
  }

export function isInAir(entity, height) {
    return height > getSplineHeight(entity);
}

export function isAutoRunAir(entity){
  if(hiber3d.hasScripts(entity, "scripts/powerups/AutoRun.js")) {
    const autoRunScript = hiber3d.getScript(entity, "scripts/powerups/AutoRun.js");
    if(autoRunScript !== undefined && autoRunScript.stage !== undefined) {
      return autoRunScript.stage < 4;
    }
  }
  return false;
}

export function isAutoRunGround(entity){
  if(hiber3d.hasScripts(entity, "scripts/powerups/AutoRun.js")) {
    const autoRunScript = hiber3d.getScript(entity, "scripts/powerups/AutoRun.js");
    if(autoRunScript !== undefined && autoRunScript.stage !== undefined) {
      return autoRunScript.stage == 4;
    }
  }
  return false;
}

export function getOtherEntityInCollision(entity, collisionEventPayload) {
  if (collisionEventPayload.entity1 === entity) {
    return collisionEventPayload.entity2;
  }
  if (collisionEventPayload.entity2 === entity) {
    return collisionEventPayload.entity1;
  }
  return undefined;
}

export function isPlayerCollision(entity, collisionEventPayload) {
  const playerEntity = hiber3d.getSingleton("GameState", "playerEntity");
  const otherEntityInCollision = getOtherEntityInCollision(entity, collisionEventPayload);
  return playerEntity !== undefined && playerEntity === otherEntityInCollision;
}
