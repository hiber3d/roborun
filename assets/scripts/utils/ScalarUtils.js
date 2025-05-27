export function lerpScalar(s1, s2, t) {
  return s1 + t * (s2 - s1);
}

export function clampScalar(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
