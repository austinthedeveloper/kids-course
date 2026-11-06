import { type Footprint, type Point, type Polygon, type Pose, degreesToRadians } from '../domain';
import { rectangleCorners } from './edit';

/**
 * Sides of the polygon that stands in for a circle. It is circumscribed, so it fully covers the
 * circle: this can only overstate the space an item needs, never understate it.
 */
export const CIRCLE_APPROXIMATION_SIDES = 32;

/** Rotates a point clockwise on screen around `pivot`. */
export function rotatePoint(point: Point, pivot: Point, rotationDeg: number): Point {
  const radians = degreesToRadians(rotationDeg);
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const dx = point.x - pivot.x;
  const dy = point.y - pivot.y;
  return { x: pivot.x + dx * cos - dy * sin, y: pivot.y + dx * sin + dy * cos };
}

export function rotatePolygon(polygon: Polygon, pivot: Point, rotationDeg: number): Polygon {
  return { vertices: polygon.vertices.map((vertex) => rotatePoint(vertex, pivot, rotationDeg)) };
}

export function translatePolygon(polygon: Polygon, dx: number, dy: number): Polygon {
  return { vertices: polygon.vertices.map(({ x, y }) => ({ x: x + dx, y: y + dy })) };
}

function assertPositive(value: number, name: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${name} must be finite and greater than zero.`);
  }
}

/** The world-space outline of a footprint at a pose. An unusable size throws; it is never zero. */
export function footprintToPolygon(footprint: Footprint, pose: Pose): Polygon {
  const { center, rotationDeg } = pose;
  if (![center.x, center.y, rotationDeg].every(Number.isFinite)) {
    throw new RangeError('A pose needs a finite position and rotation.');
  }

  if (footprint.kind === 'rect') {
    assertPositive(footprint.widthCm, 'widthCm');
    assertPositive(footprint.depthCm, 'depthCm');
    return {
      vertices: rectangleCorners(footprint.widthCm, footprint.depthCm, center, rotationDeg),
    };
  }

  assertPositive(footprint.diameterCm, 'diameterCm');
  const sides = CIRCLE_APPROXIMATION_SIDES;
  const circumradius = footprint.diameterCm / 2 / Math.cos(Math.PI / sides);
  const vertices = Array.from({ length: sides }, (_unused, index) => {
    const angle = (2 * Math.PI * index) / sides;
    return {
      x: center.x + circumradius * Math.cos(angle),
      y: center.y + circumradius * Math.sin(angle),
    };
  });
  return { vertices };
}
