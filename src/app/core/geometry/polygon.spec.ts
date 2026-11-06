import fc from 'fast-check';
import { isAxisAlignedRectangle, rectangleToPolygon, validatePolygon } from './polygon';
import { polygonArea } from './primitives';

const poly = (...coords: [number, number][]) => ({
  vertices: coords.map(([x, y]) => ({ x, y })),
});

const codes = (input: unknown) => {
  const result = validatePolygon(input);
  return result.ok ? [] : result.issues.map((problem) => problem.code);
};

describe('validatePolygon', () => {
  it('accepts a rectangle, a concave L and either winding', () => {
    const l = poly([0, 0], [600, 0], [600, 240], [240, 240], [240, 480], [0, 480]);
    expect(codes(poly([0, 0], [10, 0], [10, 10], [0, 10]))).toEqual([]);
    expect(codes(l)).toEqual([]);
    expect(codes({ vertices: [...l.vertices].reverse() })).toEqual([]);
  });

  it('allows a new corner sitting on a straight wall', () => {
    expect(codes(poly([0, 0], [5, 0], [10, 0], [10, 10], [0, 10]))).toEqual([]);
  });

  it.each([null, 'room', 7, {}, { vertices: 'x' }])('rejects non-polygon %j', (input) => {
    expect(codes(input)).toEqual(['NOT_A_POLYGON']);
  });

  it('needs three corners', () => {
    expect(codes(poly([0, 0], [1, 1]))).toEqual(['TOO_FEW_VERTICES']);
  });

  it.each([NaN, Infinity, -Infinity, '5', null, undefined])(
    'rejects unusable coordinate %s and does not treat it as zero',
    (bad) => {
      expect(
        codes({
          vertices: [
            { x: 0, y: 0 },
            { x: bad, y: 0 },
            { x: 1, y: 1 },
          ],
        }),
      ).toEqual(['NON_FINITE_COORDINATE']);
    },
  );

  it('rejects a duplicated adjacent corner, including last-to-first', () => {
    expect(codes(poly([0, 0], [0, 0], [10, 0], [10, 10]))).toContain('DUPLICATE_ADJACENT_VERTEX');
    expect(codes(poly([0, 0], [10, 0], [10, 10], [0, 0]))).toContain('DUPLICATE_ADJACENT_VERTEX');
  });

  it('rejects a bow-tie', () => {
    expect(codes(poly([0, 0], [300, 300], [300, 0], [0, 300]))).toContain('SELF_INTERSECTION');
  });

  it('rejects a corner touching another wall', () => {
    expect(codes(poly([0, 0], [10, 0], [10, 10], [5, 0], [0, 10]))).not.toEqual([]);
  });

  it('rejects a wall folded back over the previous wall', () => {
    expect(codes(poly([0, 0], [10, 0], [5, 0], [5, 10]))).toContain('OVERLAPPING_EDGES');
  });

  it('rejects a collinear zero-area triangle', () => {
    expect(codes(poly([0, 0], [10, 0], [20, 0]))).not.toEqual([]);
  });

  it('accepts any rectangle at any scale', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1, max: 100_000, noNaN: true }),
        fc.double({ min: 1, max: 100_000, noNaN: true }),
        (width, length) => {
          const polygon = rectangleToPolygon(width, length);
          expect(codes(polygon)).toEqual([]);
          expect(polygonArea(polygon.vertices)).toBeCloseTo(width * length, 3);
        },
      ),
    );
  });

  it('never accepts a bow-tie wherever it is placed', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -10_000, max: 10_000 }),
        fc.integer({ min: -10_000, max: 10_000 }),
        fc.integer({ min: 1, max: 5_000 }),
        fc.integer({ min: 1, max: 5_000 }),
        (x, y, w, h) => {
          const bowTie = poly([x, y], [x + w, y + h], [x + w, y], [x, y + h]);
          expect(validatePolygon(bowTie).ok).toBe(false);
        },
      ),
    );
  });
});

describe('rectangleToPolygon', () => {
  it.each([
    [0, 10],
    [10, -1],
    [NaN, 10],
    [10, Infinity],
  ])('refuses %d x %d', (w, h) => {
    expect(() => rectangleToPolygon(w, h)).toThrow(RangeError);
  });
});

describe('isAxisAlignedRectangle', () => {
  it('recognises rectangles only', () => {
    expect(isAxisAlignedRectangle(rectangleToPolygon(10, 20))).toBe(true);
    expect(isAxisAlignedRectangle(poly([0, 0], [10, 2], [10, 12], [0, 10]))).toBe(false);
    expect(isAxisAlignedRectangle(poly([0, 0], [10, 0], [10, 10]))).toBe(false);
  });
});
