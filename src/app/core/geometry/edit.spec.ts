import { rectangleToPolygon } from './polygon';
import { moveVertex, rectangleCorners, rotationTowards } from './edit';

describe('moveVertex', () => {
  const square = rectangleToPolygon(300, 300);

  it('snaps to the grid and returns a new polygon', () => {
    const result = moveVertex(square, 2, { x: 322, y: 338 }, 15);
    expect(result.ok && result.value.vertices[2]).toEqual({ x: 315, y: 345 });
    expect(square.vertices[2]).toEqual({ x: 300, y: 300 });
  });

  it('moves freely without a grid', () => {
    const result = moveVertex(square, 2, { x: 322.5, y: 338.25 }, null);
    expect(result.ok && result.value.vertices[2]).toEqual({ x: 322.5, y: 338.25 });
  });

  it('rejects a move that crosses walls', () => {
    const result = moveVertex(square, 1, { x: 150, y: 450 }, 15);
    expect(result.ok ? [] : result.error.map((problem) => problem.code)).toContain(
      'SELF_INTERSECTION',
    );
  });

  it('rejects snapping a corner onto its neighbour', () => {
    const result = moveVertex(square, 1, { x: 4, y: 4 }, 15);
    expect(result.ok ? [] : result.error.map((problem) => problem.code)).toContain(
      'DUPLICATE_ADJACENT_VERTEX',
    );
  });

  it.each([-1, 4, 1.5])('refuses corner index %d', (index) => {
    expect(() => moveVertex(square, index, { x: 0, y: 0 }, 15)).toThrow(RangeError);
  });
});

describe('rectangleCorners', () => {
  it('returns the axis-aligned corners at 0°', () => {
    expect(rectangleCorners(20, 10, { x: 100, y: 100 }, 0)).toEqual([
      { x: 90, y: 95 },
      { x: 110, y: 95 },
      { x: 110, y: 105 },
      { x: 90, y: 105 },
    ]);
  });

  it('rotates clockwise on screen: the right-hand end moves down at 90°', () => {
    const corners = rectangleCorners(20, 10, { x: 0, y: 0 }, 90);
    const topRight = corners[1]!;
    expect(topRight.x).toBeCloseTo(5, 10);
    expect(topRight.y).toBeCloseTo(10, 10);
  });
});

describe('rotationTowards', () => {
  const center = { x: 0, y: 0 };

  it.each([
    [{ x: 0, y: -10 }, 0],
    [{ x: 10, y: 0 }, 90],
    [{ x: 0, y: 10 }, 180],
    [{ x: -10, y: 0 }, 270],
  ])('points at %j with %d degrees', (pointer, expected) => {
    expect(rotationTowards(center, pointer, null)).toBeCloseTo(expected, 8);
  });

  it('snaps to the step and wraps at a full turn', () => {
    expect(rotationTowards(center, { x: 10, y: -9 }, 15)).toBe(45);
    expect(rotationTowards(center, { x: -0.01, y: -10 }, 15)).toBe(0);
  });
});
