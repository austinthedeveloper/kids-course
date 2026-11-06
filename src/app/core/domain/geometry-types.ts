import type { Cm } from './units';

/**
 * World coordinates (docs/architecture/DATA_MODEL.md).
 *
 * - 2D, top-down, in centimetres.
 * - Origin (0, 0) at the top-left of the room's bounding box; x grows to the right, y grows down
 *   (the same handedness as the screen, so no axis flip is needed when drawing).
 * - Rotation is in degrees, clockwise as seen on screen.
 * - Screen pixels are derived through a view transform and are never stored.
 */
export interface Point {
  readonly x: Cm;
  readonly y: Cm;
}

/** A closed outline; the last vertex connects back to the first. Must be simple with non-zero area. */
export interface Polygon {
  readonly vertices: readonly Point[];
}

export interface RectFootprint {
  readonly kind: 'rect';
  readonly widthCm: Cm;
  readonly depthCm: Cm;
}

export interface CircleFootprint {
  readonly kind: 'circle';
  readonly diameterCm: Cm;
}

export type Footprint = RectFootprint | CircleFootprint;

export interface Pose {
  readonly center: Point;
  /** Degrees, clockwise. */
  readonly rotationDeg: number;
}

/** Maps any finite angle into [0, 360). */
export function normalizeDegrees(degrees: number): number {
  const wrapped = degrees % 360;
  return wrapped < 0 ? wrapped + 360 : wrapped === 0 ? 0 : wrapped;
}

export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
