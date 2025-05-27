import * as vectorUtils from "scripts/utils/VectorUtils.js";
import * as quatUtils from "scripts/utils/QuatUtils.js";

export const NULL_ENTITY = 4294967295; // TODO: Move to some new "Constants.js"

export function isNullEntity(entity) {
  return entity === NULL_ENTITY || entity === undefined || entity === null;
}

export function isAncestorOf(ancestor, entity) {
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

export function getParent(entity) {
  if (hiber3d.hasComponents(entity, "Hiber3D_Parent") !== true) {
    return undefined;
  }
  return hiber3d.getComponent(entity, "Hiber3D_Parent", "parent");
}

export function getChildren(entity) {
  if (hiber3d.hasComponents(entity, "Hiber3D_Children") !== true) {
    return undefined;
  }
  return hiber3d.getComponent(entity, "Hiber3D_Children", "entities");
}

export function getSiblings(entity) {
  const parent = getParent(entity);
  if (parent === undefined) {
    hiber3d.print("getChildIndexOf() - entity:'" + entity + "' has no parent");
    return undefined;
  }
  if (hiber3d.hasComponents(parent, "Hiber3D_Children") !== true) {
    hiber3d.print("getChildIndexOf() - parent:'" + parent + "' has no children");
    return undefined;
  }
  return hiber3d.getComponent(parent, "Hiber3D_Children", "entities");
}

export function getChildIndexOf(entity) {
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

export function isLastChild(entity) {
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

export function findEntityWithNameAmongAncestors(entity, name) {
  if (entity === undefined) {
    return undefined;
  }
  if (hiber3d.hasComponents(entity, "Hiber3D_Name") === true) {
    if (hiber3d.getComponent(entity, "Hiber3D_Name") == name) {
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

export function findEntityWithNameAmongDescendants(entity, name) {
  if (entity === undefined) {
    return undefined;
  }
  if (hiber3d.hasComponents(entity, "Hiber3D_Name") === true) {
    if (hiber3d.getComponent(entity, "Hiber3D_Name") == name) {
      return entity;
    }
  }
  if (hiber3d.hasComponents(entity, "Hiber3D_Children")) {
    const children = hiber3d.getComponent(entity, "Hiber3D_Children", "entities");
    for (var i = 0; i < Object.keys(children).length; i++) {
      const recursiveResult = findEntityWithNameAmongDescendants(children[i], name);
      if (recursiveResult !== undefined) {
        return recursiveResult;
      }
    }
  }
  return undefined;
}

export function findEntityWithComponentInHierarchy(entity, component) {
  if (entity === undefined) {
    return undefined;
  }
  if (hiber3d.hasComponents(entity, component) === true) {
    return entity;
  }
  if (hiber3d.hasComponents(entity, "Hiber3D_Children") === true) {
    const children = hiber3d.getComponent(entity, "Hiber3D_Children", "entities");
    for (var i = 0; i < Object.keys(children).length; i++) {
      const recursiveResult = findEntityWithComponentInHierarchy(children[i], component);
      if (recursiveResult !== undefined) {
        return recursiveResult;
      }
    }
  }
  return undefined;
}

export function createChildToParent(parent) {
  const child = hiber3d.createEntity();
  hiber3d.addComponent(child, "Hiber3D_Parent");
  hiber3d.setComponent(child, "Hiber3D_Parent", "parent", parent);
  if (hiber3d.hasComponents(parent, "Hiber3D_Children") !== true) {
    hiber3d.addComponent(parent, "Hiber3D_Children");
  }
  var entities = hiber3d.getComponent(parent, "Hiber3D_Children", "entities");
  if (entities === undefined) {
    hiber3d.setComponent(parent, "Hiber3D_Children", "entities", [child]);
  } else {
    entities.push(child);
    hiber3d.setComponent(parent, "Hiber3D_Children", "entities", entities);
  }
  return child;
}

export function destroyEntity(entity) {
  if (!entity) {
    return null;
  }
  hiber3d.destroyEntity(entity);
}

export function addComponentIfNotPresent(entity, component) {
  if (hiber3d.hasComponents(entity, component) === false) {
    hiber3d.addComponent(entity, component);
  }
  return hiber3d.getComponent(entity, component);
}

export function removeComponentIfPresent(entity, component) {
  if (hiber3d.hasComponents(entity, component) === true) {
    hiber3d.removeComponent(entity, component);
  }
}

export function addOrReplaceComponent(entity, component) {
  if (hiber3d.hasComponents(entity, component) === true) {
    hiber3d.removeComponent(entity, component);
  }
  hiber3d.addComponent(entity, component);
}

export function removeScriptIfPresent(entity, script) {
  if (hiber3d.hasScripts(entity, script) === true) {
    hiber3d.removeScript(entity, script);
  }
}

export function addOrReplaceScript(entity, script) {
  if (hiber3d.hasScripts(entity, script) === true) {
    hiber3d.removeScript(entity, script);
  }
  return hiber3d.addScript(entity, script);
}

export function worldToLocalPosition(entity, worldPos) {
  if (entity === undefined || worldPos === undefined) {
    return worldPos;
  }

  // Get the entity's parent
  var parent = undefined;
  if (hiber3d.hasComponents(entity, "Hiber3D_Parent")) {
    parent = hiber3d.getComponent(entity, "Hiber3D_Parent", "parent");
  }

  if (parent === undefined) {
    // No parent, just return the world position
    return worldPos;
  }

  // Get the parent's world transform
  const parentWorldPos = hiber3d.getComponent(parent, "Hiber3D_ComputedWorldTransform", "position");
  const parentWorldRot = hiber3d.getComponent(parent, "Hiber3D_ComputedWorldTransform", "rotation");

  // Calculate position relative to parent in world space
  const relativePos = vectorUtils.subtractVectors(worldPos, parentWorldPos);

  // Apply inverse of parent's world rotation to get the position in parent's local space
  const inverseParentRot = quatUtils.inverseQuaternion(parentWorldRot);
  const posInParentSpace = quatUtils.rotateVectorByQuaternion(relativePos, inverseParentRot);

  return posInParentSpace;
}
