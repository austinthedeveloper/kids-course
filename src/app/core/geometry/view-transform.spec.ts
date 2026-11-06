import fc from 'fast-check';
import {
  DEFAULT_SCALE_LIMITS,
  type ViewTransform,
  fitToView,
  panBy,
  screenToWorld,
  worldToScreen,
  zoomAt,
} from './view-transform';

const coordinate = fc.double({ min: -100_000, max: 100_000, noNaN: true });
const view = fc.record({
  scale: fc.double({
    min: DEFAULT_SCALE_LIMITS.min,
    max: DEFAULT_SCALE_LIMITS.max,
    noNaN: true,
  }),
  offsetX: coordinate,
  offsetY: coordinate,
});

describe('view transform', () => {
  it('round-trips world to screen and back within tolerance', () => {
    fc.assert(
      fc.property(view, coordinate, coordinate, (v: ViewTransform, x, y) => {
        const back = screenToWorld(v, worldToScreen(v, { x, y }));
        expect(back.x).toBeCloseTo(x, 5);
        expect(back.y).toBeCloseTo(y, 5);
      }),
    );
  });

  it('keeps the point under the anchor fixed while zooming', () => {
    fc.assert(
      fc.property(
        view,
        coordinate,
        coordinate,
        fc.double({ min: 0.1, max: 10, noNaN: true }),
        (v: ViewTransform, x, y, factor) => {
          const anchor = { x, y };
          const before = screenToWorld(v, anchor);
          const after = screenToWorld(zoomAt(v, anchor, factor), anchor);
          expect(after.x).toBeCloseTo(before.x, 4);
          expect(after.y).toBeCloseTo(before.y, 4);
        },
      ),
    );
  });

  it('clamps zoom and ignores an unusable factor', () => {
    const start = { scale: 1, offsetX: 0, offsetY: 0 };
    expect(zoomAt(start, { x: 0, y: 0 }, 1000).scale).toBe(DEFAULT_SCALE_LIMITS.max);
    expect(zoomAt(start, { x: 0, y: 0 }, 0.0001).scale).toBe(DEFAULT_SCALE_LIMITS.min);
    expect(zoomAt(start, { x: 0, y: 0 }, 0)).toBe(start);
    expect(zoomAt(start, { x: 0, y: 0 }, NaN)).toBe(start);
  });

  it('pans without changing scale', () => {
    expect(panBy({ scale: 2, offsetX: 1, offsetY: 1 }, 3, -1)).toEqual({
      scale: 2,
      offsetX: 4,
      offsetY: 0,
    });
  });

  it('fits a box inside the viewport, centred', () => {
    const box = { minX: 100, minY: 100, maxX: 700, maxY: 580 };
    const viewport = { width: 400, height: 800 };
    const fitted = fitToView(box, viewport);
    const topLeft = worldToScreen(fitted, { x: box.minX, y: box.minY });
    const bottomRight = worldToScreen(fitted, { x: box.maxX, y: box.maxY });
    expect(topLeft.x).toBeCloseTo(24, 6);
    expect(bottomRight.x).toBeCloseTo(376, 6);
    expect(topLeft.y + bottomRight.y).toBeCloseTo(800, 6);
  });
});
