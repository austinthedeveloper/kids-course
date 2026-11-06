import type { Point, Polygon } from '../domain';
import {
  GEOMETRY_EPSILON_CM,
  type BoundingBox,
  boundingBox,
  boxesOverlap,
  distance,
  dot,
  segmentsIntersect,
} from './primitives';

/**
 * Collision and containment (docs/architecture/GENERATOR.md).
 *
 * Boundary policy, used by every function here: shapes are closed, so touching counts as
 * colliding, and any gap of GEOMETRY_EPSILON_CM or less counts as touching. A wrong answer in the
 * "no collision" direction could place gear against a hazard, so ties always go to "collides".
 *
 * Unusable input throws instead of answering. NaN fails every comparison, so without the guard
 * an unknown coordinate would quietly read as "no collision".
 */
export type PointLocation = 'inside' | 'boundary' | 'outside';

function assertUsablePoint(point: Point): void {
  if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
    throw new RangeError('Geometry needs finite coordinates.');
  }
}

function assertUsablePolygon(polygon: Polygon): void {
  if (polygon.vertices.length < 3) {
    throw new RangeError('A polygon needs at least 3 corners.');
  }
  polygon.vertices.forEach(assertUsablePoint);
}

function edgesOf(polygon: Polygon): readonly (readonly [Point, Point])[] {
  const { vertices } = polygon;
  return vertices.map((vertex, index) => [vertex, vertices[(index + 1) % vertices.length]!]);
}

/** Shortest distance from a point to the closed segment a→b. */
export function distanceToSegment(point: Point, a: Point, b: Point): number {
  const lengthSquared = dot(a, b, b);
  if (lengthSquared === 0) return distance(point, a);
  const t = Math.max(0, Math.min(1, dot(a, point, b) / lengthSquared));
  return distance(point, { x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) });
}

/** Where a point lies relative to a polygon, which may be concave. */
export function locatePoint(point: Point, polygon: Polygon): PointLocation {
  assertUsablePoint(point);
  assertUsablePolygon(polygon);

  let inside = false;
  for (const [a, b] of edgesOf(polygon)) {
    if (distanceToSegment(point, a, b) <= GEOMETRY_EPSILON_CM) return 'boundary';
    // Even-odd ray cast. The half-open test counts a ray through a corner exactly once.
    if (a.y > point.y !== b.y > point.y) {
      const crossingX = a.x + ((point.y - a.y) * (b.x - a.x)) / (b.y - a.y);
      if (point.x < crossingX) inside = !inside;
    }
  }
  return inside ? 'inside' : 'outside';
}

/** True when the segment a→b shares any point with the polygon's region, including its edge. */
export function segmentIntersectsPolygon(a: Point, b: Point, polygon: Polygon): boolean {
  assertUsablePoint(a);
  assertUsablePoint(b);
  assertUsablePolygon(polygon);

  if (!boxesOverlap(boundingBox([a, b]), boundingBox(polygon.vertices))) return false;
  if (edgesOf(polygon).some(([p, q]) => segmentsIntersect(a, b, p, q))) return true;
  // No edge is touched, so the segment is either wholly inside or wholly outside.
  return locatePoint(a, polygon) !== 'outside';
}

/** True when two polygon regions share any point: crossing, touching or one inside the other. */
export function polygonsIntersect(first: Polygon, second: Polygon): boolean {
  assertUsablePolygon(first);
  assertUsablePolygon(second);

  if (!boxesOverlap(boundingBox(first.vertices), boundingBox(second.vertices))) return false;
  const secondEdges = edgesOf(second);
  for (const [a, b] of edgesOf(first)) {
    if (secondEdges.some(([p, q]) => segmentsIntersect(a, b, p, q))) return true;
  }
  // No edges meet, so the only way left to overlap is for one to sit wholly inside the other.
  return (
    locatePoint(first.vertices[0]!, second) !== 'outside' ||
    locatePoint(second.vertices[0]!, first) !== 'outside'
  );
}

function boxWithin(outer: BoundingBox, inner: BoundingBox): boolean {
  return (
    inner.minX > outer.minX &&
    inner.minY > outer.minY &&
    inner.maxX < outer.maxX &&
    inner.maxY < outer.maxY
  );
}

/**
 * True when `inner` lies strictly inside `container`, which may be concave.
 *
 * Checks the whole outline, not only its corners or centre: a shape can have all four corners
 * in a room while its middle crosses a re-entrant wall. Touching the container returns false.
 */
export function polygonContains(container: Polygon, inner: Polygon): boolean {
  assertUsablePolygon(container);
  assertUsablePolygon(inner);

  if (!boxWithin(boundingBox(container.vertices), boundingBox(inner.vertices))) return false;
  if (inner.vertices.some((vertex) => locatePoint(vertex, container) !== 'inside')) return false;
  const containerEdges = edgesOf(container);
  return !edgesOf(inner).some(([a, b]) =>
    containerEdges.some(([p, q]) => segmentsIntersect(a, b, p, q)),
  );
}
