const module = module || {};
module.exports = module.exports || {};

const NULL_ENTITY = 4294967295;

function isNullEntity(entity) {
  return entity === NULL_ENTITY || entity === undefined || entity === null;
}
module.exports.isNullEntity = isNullEntity;

function isAncestorOf(ancestor, entity) {
  if (isNullEntity(ancestor) || isNullEntity(entity)) {
    return false;
  }
  if (ancestor === entity) {
    return true;
  }
  var parent = hiber3d.getParent(entity);
  if (isNullEntity(parent)) {
    return false;
  } else if (parent === ancestor) {
    return true;
  } else {
    return isAncestorOf(ancestor, parent);
  }
}
module.exports.isAncestorOf = isAncestorOf;

function getSiblings(entity) {
  const parent = hiber3d.getParent(entity);
  if (isNullEntity(parent)) {
    hiber3d.print("getChildIndexOf() - entity:'" + entity + "' has no parent");
    return undefined;
  }
  const children = hiber3d.getChildren(parent);
  if (children.length === 0) {
    hiber3d.print("getChildIndexOf() - parent:'" + parent + "' has no children");
    return undefined;
  }
  return children;
}
module.exports.getSiblings = getSiblings;

function getChildIndexOf(entity) {
  const siblings = getSiblings(entity);
  if (siblings === undefined) {
    hiber3d.print("getChildIndexOf() - entity:'" + entity + "' has no siblings");
    return undefined;
  }
  for (var i = 0; i < siblings.length; i++) {
    if (siblings[i] === entity) {
      return i;
    }
  }
  return undefined;
}

module.exports.getChildIndexOf = getChildIndexOf;
function isLastChild(entity) {
  const siblings = getSiblings(entity);
  if (siblings === undefined) {
    return undefined;
  }
  const childIndex = getChildIndexOf(entity);
  if (childIndex === undefined) {
    return undefined;
  }
  return childIndex === siblings.length - 1;
}
module.exports.isLastChild = isLastChild;

function findEntityWithNameAmongAncestors(entity, name) {
  if (isNullEntity(entity)) {
    return undefined;
  }
  if (hiber3d.hasComponents(entity, "Hiber3D::Name") === true) {
    if (hiber3d.getComponent(entity, "Hiber3D::Name") == name) {
      return entity;
    }
  }
  const parent = hiber3d.getParent(entity);
  if (parent !== undefined) {
    const ancestor = findEntityWithNameAmongAncestors(parent, name);
    return ancestor;
  }
  return undefined;
}
module.exports.findEntityWithNameAmongAncestors = findEntityWithNameAmongAncestors;

function findEntityWithNameAmongDescendants(entity, name) {
  if (isNullEntity(entity)) {
    return undefined;
  }
  if (hiber3d.hasComponents(entity, "Hiber3D::Name") === true) {
    if (hiber3d.getComponent(entity, "Hiber3D::Name") == name) {
      return entity;
    }
  }
  const children = hiber3d.getChildren(entity);
  for (var i = 0; i < children.length; i++) {
    const recursiveResult = findEntityWithNameAmongDescendants(children[i], name);
    if (recursiveResult !== undefined) {
      return recursiveResult;
    }
  }
  return undefined;
}
module.exports.findEntityWithNameAmongDescendants = findEntityWithNameAmongDescendants;

function findEntityWithComponentInHierarchy(entity, component) {
  if (isNullEntity(entity)) {
    return undefined;
  }
  if (hiber3d.hasComponents(entity, component) === true) {
    return entity;
  }
  const children = hiber3d.getChildren(entity);
  for (var i = 0; i < children.length; i++) {
    const recursiveResult = findEntityWithComponentInHierarchy(children[i], component);
    if (recursiveResult !== undefined) {
      return recursiveResult;
    }
  }
  return undefined;
}
module.exports.findEntityWithComponentInHierarchy = findEntityWithComponentInHierarchy;

function addComponentIfNotPresent(entity, component) {
  if (hiber3d.hasComponents(entity, component) === false) {
    hiber3d.addComponent(entity, component);
  }
  return hiber3d.getComponent(entity, component);
}
module.exports.addComponentIfNotPresent = addComponentIfNotPresent;

function removeComponentIfPresent(entity, component) {
  if (hiber3d.hasComponents(entity, component) === true) {
    hiber3d.removeComponent(entity, component);
  }
}
module.exports.removeComponentIfPresent = removeComponentIfPresent;

function addOrReplaceComponent(entity, component) {
  if (hiber3d.hasComponents(entity, component) === true) {
    hiber3d.removeComponent(entity, component);
  }
  hiber3d.addComponent(entity, component);
}
module.exports.addOrReplaceComponent = addOrReplaceComponent;

function removeScriptIfPresent(entity, script) {
  if (hiber3d.hasScripts(entity, script) === true) {
    hiber3d.removeScript(entity, script);
  }
}
module.exports.removeScriptIfPresent = removeScriptIfPresent;

function addOrReplaceScript(entity, script) {
  if (hiber3d.hasScripts(entity, script) === true) {
    hiber3d.removeScript(entity, script);
  }
  return hiber3d.addScript(entity, script);
}
module.exports.addOrReplaceScript = addOrReplaceScript;

function worldToLocalPosition(entity, worldPos) {
  if (isNullEntity(entity) || worldPos === undefined) {
    return worldPos;
  }

  // Get the entity's parent
  var parent = hiber3d.getParent(entity);

  if (isNullEntity(parent)) {
    // No parent, just return the world position
    return worldPos;
  }

  // Get the parent's world transform
  const computedWorldTransform = hiber3d.getComponent(parent, "Hiber3D::ComputedWorldTransform");
  const parentWorldPos = computedWorldTransform.position;
  const parentWorldRot = computedWorldTransform.rotation;

  // Calculate position relative to parent in world space
  const relativePos = vectorUtils.subtractVectors(worldPos, parentWorldPos);

  // Apply inverse of parent's world rotation to get the position in parent's local space
  const inverseParentRot = quatUtils.inverseQuaternion(parentWorldRot);
  const posInParentSpace = quatUtils.rotateVectorByQuaternion(relativePos, inverseParentRot);

  return posInParentSpace;
}
module.exports.worldToLocalPosition = worldToLocalPosition;
