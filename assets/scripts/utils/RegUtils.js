import * as vectorUtils from "scripts/utils/VectorUtils.js";
import * as quatUtils from "scripts/utils/QuatUtils.js";
import * as hierarchy from "hiber3d:hierarchy";
import * as registry from "hiber3d:registry";

export function isAncestorOf(ancestor, entity) {
  if (!registry.isValid(ancestor) || !registry.isValid(entity)) {
    return false;
  }
  if (ancestor === entity) {
    return true;
  }
  var parent = hierarchy.getParent(entity);
  if (!registry.isValid(parent)) {
    return false;
  } else if (parent === ancestor) {
    return true;
  } else {
    return isAncestorOf(ancestor, parent);
  }
}

export function getSiblings(entity) {
  const parent = hierarchy.getParent(entity);
  if (!registry.isValid(parent)) {
    hiber3d.print("getChildIndexOf() - entity:'" + entity + "' has no parent");
    return undefined;
  }
  if (hiber3d.hasComponents(parent, "Hiber3D::Children") !== true) {
    hiber3d.print("getChildIndexOf() - parent:'" + parent + "' has no children");
    return undefined;
  }
  return hiber3d.getComponent(parent, "Hiber3D::Children", "entities");
}

export function getChildIndexOf(entity) {
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

export function isLastChild(entity) {
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

export function findEntityWithNameAmongAncestors(entity, name) {
  if (!registry.isValid(entity)) {
    return undefined;
  }
  if (hiber3d.hasComponents(entity, "Hiber3D::Name") === true) {
    if (hiber3d.getComponent(entity, "Hiber3D::Name") === name) {
      return entity;
    }
  }
  const parent = hierarchy.getParent(entity);
  if (registry.isValid(parent)) {
    const ancestor = findEntityWithNameAmongAncestors(parent, name);
    return ancestor;
  }
  return undefined;
}

export function findEntityWithComponentInHierarchy(entity, component) {
  if (!registry.isValid(entity)) {
    return undefined;
  }
  if (hiber3d.hasComponents(entity, component) === true) {
    return entity;
  }
  if (hiber3d.hasComponents(entity, "Hiber3D::Children") === true) {
    const children = hiber3d.getComponent(entity, "Hiber3D::Children", "entities");
    for (var i = 0; i < children.length; i++) {
      const recursiveResult = findEntityWithComponentInHierarchy(children[i], component);
      if (registry.isValid(recursiveResult)) {
        return recursiveResult;
      }
    }
  }
  return undefined;
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
  if (!registry.isValid(entity) || worldPos === undefined) {
    return worldPos;
  }

  // Get the entity's parent
  var parent = undefined;
  if (hiber3d.hasComponents(entity, "Hiber3D::Parent")) {
    parent = hiber3d.getComponent(entity, "Hiber3D::Parent", "parent");
  }

  if (!registry.isValid(parent)) {
    // No parent, just return the world position
    return worldPos;
  }

  // Get the parent's world transform
  const parentWorldPos = hiber3d.getComponent(parent, "Hiber3D::ComputedWorldTransform", "position");
  const parentWorldRot = hiber3d.getComponent(parent, "Hiber3D::ComputedWorldTransform", "rotation");

  // Calculate position relative to parent in world space
  const relativePos = vectorUtils.subtractVectors(worldPos, parentWorldPos);

  // Apply inverse of parent's world rotation to get the position in parent's local space
  const inverseParentRot = quatUtils.inverseQuaternion(parentWorldRot);
  const posInParentSpace = quatUtils.rotateVectorByQuaternion(relativePos, inverseParentRot);

  return posInParentSpace;
}
