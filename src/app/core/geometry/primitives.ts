import type { Point } from '../domain';

/**
 * Tolerance for geometric predicates, in centimetres.
 *
 * Policy: be conservative. Two things closer than this are treated as touching, and touching
 * counts as intersecting. A gap must be clearly larger than the tolerance to count as a gap.
 */
export const GEOMETRY_EPSILON_CM = 1e-6;

export interface BoundingBox {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
}

export function distance(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function pointsCoincide(a: Point, b: Point, epsilon = GEOMETRY_EPSILON_CM): boolean {
  return distance(a, b) <= epsilon;
}

/** Z component of (a - origin) × (b - origin). */
export function cross(origin: Point, a: Point, b: Point): number {
  return (a.x - origin.x) * (b.y - origin.y) - (a.y - origin.y) * (b.x - origin.x);
}

/** Dot product of (a - origin) · (b - origin). */
export function dot(origin: Point, a: Point, b: Point): number {
  return (a.x - origin.x) * (b.x - origin.x) + (a.y - origin.y) * (b.y - origin.y);
}

/**
 * Which side of the line p→q the point r lies on: 1, -1, or 0 when r is within the tolerance of
 * the line (collinear).
 */
export function orientation(
  p: Point,
  q: Point,
  r: Point,
  epsilon = GEOMETRY_EPSILON_CM,
): -1 | 0 | 1 {
  const value = cross(p, q, r);
  const length = Math.max(distance(p, q), epsilon);
  if (Math.abs(value) <= epsilon * length) return 0;
  return value > 0 ? 1 : -1;
}

/** True when r, already known to be collinear with p→q, lies within the segment (inclusive). */
function withinSegmentBox(p: Point, q: Point, r: Point, epsilon: number): boolean {
  return (
    r.x <= Math.max(p.x, q.x) + epsilon &&
    r.x >= Math.min(p.x, q.x) - epsilon &&
    r.y <= Math.max(p.y, q.y) + epsilon &&
    r.y >= Math.min(p.y, q.y) - epsilon
  );
}

/**
 * True when the closed segments a1→a2 and b1→b2 share at least one point. Crossing, touching at
 * an endpoint, a T-junction and collinear overlap all count.
 */
export function segmentsIntersect(
  a1: Point,
  a2: Point,
  b1: Point,
  b2: Point,
  epsilon = GEOMETRY_EPSILON_CM,
): boolean {
  const o1 = orientation(a1, a2, b1, epsilon);
  const o2 = orientation(a1, a2, b2, epsilon);
  const o3 = orientation(b1, b2, a1, epsilon);
  const o4 = orientation(b1, b2, a2, epsilon);

  if (o1 !== o2 && o3 !== o4) return true;
  if (o1 === 0 && withinSegmentBox(a1, a2, b1, epsilon)) return true;
  if (o2 === 0 && withinSegmentBox(a1, a2, b2, epsilon)) return true;
  if (o3 === 0 && withinSegmentBox(b1, b2, a1, epsilon)) return true;
  if (o4 === 0 && withinSegmentBox(b1, b2, a2, epsilon)) return true;
  return false;
}

/**
 * Shoelace area with sign. With y pointing down, a positive value means the vertices run
 * clockwise on screen. Use {@link polygonArea} unless the winding matters.
 */
export function signedArea(vertices: readonly Point[]): number {
  let twice = 0;
  for (let i = 0; i < vertices.length; i += 1) {
    const a = vertices[i]!;
    const b = vertices[(i + 1) % vertices.length]!;
    twice += a.x * b.y - b.x * a.y;
  }
  return twice / 2;
}

/** Area in square centimetres. */
export function polygonArea(vertices: readonly Point[]): number {
  return Math.abs(signedArea(vertices));
}

export function boundingBox(points: readonly Point[]): BoundingBox {
  if (points.length === 0) {
    throw new RangeError('boundingBox needs at least one point');
  }
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const point of points) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }
  return { minX, minY, maxX, maxY };
}

/** True when the boxes overlap or touch. */
export function boxesOverlap(
  a: BoundingBox,
  b: BoundingBox,
  epsilon = GEOMETRY_EPSILON_CM,
): boolean {
  return (
    a.minX <= b.maxX + epsilon &&
    b.minX <= a.maxX + epsilon &&
    a.minY <= b.maxY + epsilon &&
    b.minY <= a.maxY + epsilon
  );
}
