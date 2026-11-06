import {
  boundingBox,
  boxesOverlap,
  polygonArea,
  segmentsIntersect,
  signedArea,
} from './primitives';

const p = (x: number, y: number) => ({ x, y });

describe('segmentsIntersect', () => {
  it('detects a crossing', () => {
    expect(segmentsIntersect(p(0, 0), p(10, 10), p(0, 10), p(10, 0))).toBe(true);
  });

  it('counts touching at an endpoint or a T-junction as intersecting', () => {
    expect(segmentsIntersect(p(0, 0), p(10, 0), p(10, 0), p(10, 10))).toBe(true);
    expect(segmentsIntersect(p(0, 0), p(10, 0), p(5, 0), p(5, 10))).toBe(true);
  });

  it('counts collinear overlap as intersecting', () => {
    expect(segmentsIntersect(p(0, 0), p(10, 0), p(5, 0), p(15, 0))).toBe(true);
  });

  it('treats a gap inside the tolerance as touching (conservative)', () => {
    expect(segmentsIntersect(p(0, 0), p(10, 0), p(5, 1e-9), p(5, 10))).toBe(true);
  });

  it('keeps clearly separate segments apart', () => {
    expect(segmentsIntersect(p(0, 0), p(10, 0), p(0, 1), p(10, 1))).toBe(false);
    expect(segmentsIntersect(p(0, 0), p(10, 0), p(11, 0), p(20, 0))).toBe(false);
    expect(segmentsIntersect(p(0, 0), p(10, 0), p(5, 0.01), p(5, 10))).toBe(false);
  });
});

describe('area', () => {
  const clockwiseOnScreen = [p(0, 0), p(10, 0), p(10, 5), p(0, 5)];

  it('is positive for clockwise-on-screen winding and independent of it when absolute', () => {
    expect(signedArea(clockwiseOnScreen)).toBe(50);
    expect(signedArea([...clockwiseOnScreen].reverse())).toBe(-50);
    expect(polygonArea([...clockwiseOnScreen].reverse())).toBe(50);
  });
});

describe('boxes', () => {
  it('computes a bounding box and refuses an empty list', () => {
    expect(boundingBox([p(1, 5), p(-2, 3)])).toEqual({ minX: -2, minY: 3, maxX: 1, maxY: 5 });
    expect(() => boundingBox([])).toThrow(RangeError);
  });

  it('counts touching boxes as overlapping', () => {
    const a = { minX: 0, minY: 0, maxX: 1, maxY: 1 };
    expect(boxesOverlap(a, { minX: 1, minY: 0, maxX: 2, maxY: 1 })).toBe(true);
    expect(boxesOverlap(a, { minX: 2, minY: 0, maxX: 3, maxY: 1 })).toBe(false);
  });
});
