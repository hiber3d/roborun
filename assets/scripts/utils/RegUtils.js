const module = module || {};
module.exports = module.exports || {};

const NULL_ENTITY = 4294967295;

function isNullEntity(entity) {
  return entity === NULL_ENTITY || entity === undefined || entity === null;
}
module.exports.isNullEntity = isNullEntity;

function isAncestorOf(ancestor, entity) {
  if (ancestor === undefined || entity === undefined) {
    return false;
  }
  if (ancestor === entity) {
    return true;
  }
  var parent = getParent(entity);
  if (parent === undefined) {
    return false;
  } else if (parent === ancestor) {
    return true;
  } else {
    return isAncestorOf(ancestor, parent);
  }
}
module.exports.isAncestorOf = isAncestorOf;

function getParent(entity) {
  if (hiber3d.hasComponents(entity, "Hiber3D::Parent") !== true) {
    return undefined;
  }
  return hiber3d.getValue(entity, "Hiber3D::Parent", "parent");
}
module.exports.getParent = getParent;

function getChildren(entity) {
  if (hiber3d.hasComponents(entity, "Hiber3D::Children") !== true) {
    return undefined;
  }
  return hiber3d.getValue(entity, "Hiber3D::Children", "entities");
}
module.exports.getChildren = getChildren;

function getSiblings(entity) {
  const parent = getParent(entity);
  if (parent === undefined) {
    hiber3d.print("getChildIndexOf() - entity:'" + entity + "' has no parent");
    return undefined;
  }
  if (hiber3d.hasComponents(parent, "Hiber3D::Children") !== true) {
    hiber3d.print("getChildIndexOf() - parent:'" + parent + "' has no children");
    return undefined;
  }
  return hiber3d.getValue(parent, "Hiber3D::Children", "entities");
}
module.exports.getSiblings = getSiblings;

function getChildIndexOf(entity) {
  const siblings = getSiblings(entity);
  if (siblings === undefined) {
    hiber3d.print("getChildIndexOf() - entity:'" + entity + "' has no siblings");
    return undefined;
  }
  for (var i = 0; i < Object.keys(siblings).length; i++) {
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
  return childIndex === Object.keys(siblings).length - 1;
}
module.exports.isLastChild = isLastChild;

function findEntityWithNameAmongAncestors(entity, name) {
  if (entity === undefined) {
    return undefined;
  }
  if (hiber3d.hasComponents(entity, "Hiber3D::Name") === true) {
    if (hiber3d.getValue(entity, "Hiber3D::Name") == name) {
      return entity;
    }
  }
  const parent = regUtils.getParent(entity);
  if(parent !== undefined) {
    const ancestor = findEntityWithNameAmongAncestors(parent, name);
    return ancestor;
  }
  return undefined;
}
module.exports.findEntityWithNameAmongAncestors = findEntityWithNameAmongAncestors;

function findEntityWithNameAmongDescendants(entity, name) {
  if (entity === undefined) {
    return undefined;
  }
  if (hiber3d.hasComponents(entity, "Hiber3D::Name") === true) {
    if (hiber3d.getValue(entity, "Hiber3D::Name") == name) {
      return entity;
    }
  }
  if (hiber3d.hasComponents(entity, "Hiber3D::Children")) {
    const children = hiber3d.getValue(entity, "Hiber3D::Children", "entities");
    for (var i = 0; i < Object.keys(children).length; i++) {
      const recursiveResult = findEntityWithNameAmongDescendants(children[i], name);
      if (recursiveResult !== undefined) {
        return recursiveResult;
      }
    }
  }
  return undefined;
}
module.exports.findEntityWithNameAmongDescendants = findEntityWithNameAmongDescendants;

function findEntityWithComponentInHierarchy(entity, component) {
  if (entity === undefined) {
    return undefined;
  }
  if (hiber3d.hasComponents(entity, component) === true) {
    return entity;
  }
  if (hiber3d.hasComponents(entity, "Hiber3D::Children") === true) {
    const children = hiber3d.getValue(entity, "Hiber3D::Children", "entities");
    for (var i = 0; i < Object.keys(children).length; i++) {
      const recursiveResult = findEntityWithComponentInHierarchy(children[i], component);
      if (recursiveResult !== undefined) {
        return recursiveResult;
      }
    }
  }
  return undefined;
}
module.exports.findEntityWithComponentInHierarchy = findEntityWithComponentInHierarchy;

function createChildToParent(parent) {
  const child = hiber3d.createEntity();
  hiber3d.addComponent(child, "Hiber3D::Parent");
  hiber3d.setValue(child, "Hiber3D::Parent", "parent", parent);
  if (hiber3d.hasComponents(parent, "Hiber3D::Children") !== true) {
    hiber3d.addComponent(parent, "Hiber3D::Children");
  }
  var entities = hiber3d.getValue(parent, "Hiber3D::Children", "entities");
  if (entities === undefined) {
    hiber3d.setValue(parent, "Hiber3D::Children", "entities", [child]);
  } else {
    entities.push(child);
    hiber3d.setValue(parent, "Hiber3D::Children", "entities", entities);
  }
  return child;
}
module.exports.createChildToParent = createChildToParent;

function destroyEntity(entity) {
  if (!entity) {
    return null;
  }
  if (hiber3d.hasComponents(entity, "Hiber3D::Parent")) {
    const parent = hiber3d.getValue(entity, "Hiber3D::Parent", "parent");
    if (hiber3d.hasComponents(parent, "Hiber3D::Children")) {
      const siblings = hiber3d.getValue(parent, "Hiber3D::Children", "entities");
      for (var i = 0; i < Object.keys(siblings).length; i++) {
        if (siblings[i] === entity) {
          siblings.splice(i, 1);
          hiber3d.setValue(parent, "Hiber3D::Children", "entities", siblings);
          break;
        }
      }
    }
  }
  function destroyRecursive(currentEntity) {
    if (!currentEntity) {
      return;
    }
    if (hiber3d.hasComponents(currentEntity, "Hiber3D::Children")) {
      const children = hiber3d.getValue(currentEntity, "Hiber3D::Children", "entities");
      for (var i = 0; i < Object.keys(children).length; i++) {
        destroyRecursive(children[i]);
      }
    }
    hiber3d.destroyEntity(currentEntity);
  }
  return destroyRecursive(entity);
}
module.exports.destroyEntity = destroyEntity;

function addComponentIfNotPresent(entity, component) {
  if (hiber3d.hasComponents(entity, component) === false) {
    hiber3d.addComponent(entity, component);
  }
  return hiber3d.getValue(entity, component);
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
  if (entity === undefined || worldPos === undefined) {
    return worldPos;
  }

  // Get the entity's parent
  var parent = undefined;
  if (hiber3d.hasComponents(entity, "Hiber3D::Parent")) {
    parent = hiber3d.getValue(entity, "Hiber3D::Parent", "parent");
  }

  if (parent === undefined) {
    // No parent, just return the world position
    return worldPos;
  }

  // Get the parent's world transform
  const parentWorldPos = hiber3d.getValue(parent, "Hiber3D::ComputedWorldTransform", "position");
  const parentWorldRot = hiber3d.getValue(parent, "Hiber3D::ComputedWorldTransform", "rotation");

  // Calculate position relative to parent in world space
  const relativePos = vectorUtils.subtractVectors(worldPos, parentWorldPos);

  // Apply inverse of parent's world rotation to get the position in parent's local space
  const inverseParentRot = quatUtils.inverseQuaternion(parentWorldRot);
  const posInParentSpace = quatUtils.rotateVectorByQuaternion(relativePos, inverseParentRot);

  return posInParentSpace;
}
module.exports.worldToLocalPosition = worldToLocalPosition;
