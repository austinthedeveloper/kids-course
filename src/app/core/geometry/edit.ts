import {
  type Cm,
  type Point,
  type Polygon,
  type Result,
  type ValidationIssue,
  normalizeDegrees,
} from '../domain';
import { snapPointToGrid } from './grid';
import { validatePolygon } from './polygon';

/**
 * Proposes moving one corner. The result is either a fully valid polygon or the reasons it is
 * not; the caller keeps its last valid geometry on failure, so invalid shapes are never held.
 *
 * Pass `gridCm: null` for fine movement without snapping.
 */
export function moveVertex(
  polygon: Polygon,
  index: number,
  target: Point,
  gridCm: Cm | null,
): Result<Polygon, readonly ValidationIssue[]> {
  if (!Number.isInteger(index) || index < 0 || index >= polygon.vertices.length) {
    throw new RangeError(`No corner at index ${index}`);
  }
  const point = gridCm === null ? target : snapPointToGrid(target, gridCm);
  const vertices = polygon.vertices.map((vertex, i) => (i === index ? point : vertex));
  const result = validatePolygon({ vertices });
  return result.ok ? { ok: true, value: result.value } : { ok: false, error: result.issues };
}

/** Corners of a rectangle at a pose, clockwise on screen starting from its top-left. */
export function rectangleCorners(
  widthCm: Cm,
  depthCm: Cm,
  center: Point,
  rotationDeg: number,
): readonly Point[] {
  const radians = (rotationDeg * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const halfW = widthCm / 2;
  const halfD = depthCm / 2;
  // With y pointing down, this standard rotation appears clockwise on screen.
  return [
    [-halfW, -halfD],
    [halfW, -halfD],
    [halfW, halfD],
    [-halfW, halfD],
  ].map(([dx, dy]) => ({
    x: center.x + dx! * cos - dy! * sin,
    y: center.y + dx! * sin + dy! * cos,
  }));
}

/**
 * Rotation that points a shape's top edge towards `pointer`: straight up is 0°, right is 90°.
 * Snaps to `stepDeg` when given.
 */
export function rotationTowards(center: Point, pointer: Point, stepDeg: number | null): number {
  const degrees = (Math.atan2(pointer.y - center.y, pointer.x - center.x) * 180) / Math.PI + 90;
  const snapped = stepDeg === null ? degrees : Math.round(degrees / stepDeg) * stepDeg;
  return normalizeDegrees(snapped);
}
