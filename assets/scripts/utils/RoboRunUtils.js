const module = module || {};
module.exports = module.exports || {};


function getSplineHeight(entity) {
    return hiber3d.hasComponents(entity, "SplineData") ? hiber3d.getValue(entity, "SplineData", "position").y : 0;
  }
module.exports.getSplineHeight = getSplineHeight;

function isInAir(entity, height) {
    return height > getSplineHeight(entity);
}
module.exports.isInAir = isInAir;

function isAutoRunAir(entity){
  if(hiber3d.hasScripts(entity, "scripts/powerups/AutoRun.js")) {
    const autoRunScript = hiber3d.getScript(entity, "scripts/powerups/AutoRun.js");
    if(autoRunScript !== undefined && autoRunScript.stage !== undefined) {
      return autoRunScript.stage < 4;
    }
  }
  return false;
}
module.exports.isAutoRunAir = isAutoRunAir;

function isAutoRunGround(entity){
  if(hiber3d.hasScripts(entity, "scripts/powerups/AutoRun.js")) {
    const autoRunScript = hiber3d.getScript(entity, "scripts/powerups/AutoRun.js");
    if(autoRunScript !== undefined && autoRunScript.stage !== undefined) {
      return autoRunScript.stage == 4;
    }
  }
  return false;
}
module.exports.isAutoRunGround = isAutoRunGround;