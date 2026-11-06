import type { Cm, Point } from '../domain';

/** Default display and snap grid: 15 cm, about 6 in (docs/product/UX_FLOWS.md). */
export const DEFAULT_GRID_CM: Cm = 15;

export function snapToGrid(value: Cm, gridCm: Cm = DEFAULT_GRID_CM): Cm {
  if (!(gridCm > 0) || !Number.isFinite(gridCm)) {
    throw new RangeError('Grid size must be finite and greater than zero.');
  }
  const snapped = Math.round(value / gridCm) * gridCm;
  return snapped === 0 ? 0 : snapped;
}

export function snapPointToGrid(point: Point, gridCm: Cm = DEFAULT_GRID_CM): Point {
  return { x: snapToGrid(point.x, gridCm), y: snapToGrid(point.y, gridCm) };
}
