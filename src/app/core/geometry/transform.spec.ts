import fc from 'fast-check';
import { locatePoint } from './collision';
import { polygonArea } from './primitives';
import {
  CIRCLE_APPROXIMATION_SIDES,
  footprintToPolygon,
  rotatePoint,
  rotatePolygon,
  translatePolygon,
} from './transform';

const origin = { x: 0, y: 0 };

describe('rotatePoint', () => {
  it('turns clockwise on screen: right moves to down', () => {
    const turned = rotatePoint({ x: 10, y: 0 }, origin, 90);
    expect(turned.x).toBeCloseTo(0, 10);
    expect(turned.y).toBeCloseTo(10, 10);
  });

  it('turns around the pivot and leaves the pivot alone', () => {
    const pivot = { x: 5, y: 5 };
    expect(rotatePoint(pivot, pivot, 123)).toEqual(pivot);
    const turned = rotatePoint({ x: 15, y: 5 }, pivot, 180);
    expect(turned.x).toBeCloseTo(-5, 10);
    expect(turned.y).toBeCloseTo(5, 10);
  });
});

describe('moving polygons', () => {
  const square = {
    vertices: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
    ],
  };

  it('translates every corner without changing the original', () => {
    expect(translatePolygon(square, 5, -5).vertices[2]).toEqual({ x: 15, y: 5 });
    expect(square.vertices[2]).toEqual({ x: 10, y: 10 });
  });

  it('keeps area at any rotation', () => {
    fc.assert(
      fc.property(fc.double({ min: -3600, max: 3600, noNaN: true }), (degrees) => {
        expect(polygonArea(rotatePolygon(square, origin, degrees).vertices)).toBeCloseTo(100, 6);
      }),
    );
  });
});

describe('footprintToPolygon', () => {
  const center = { x: 100, y: 50 };

  it('places a rectangle at its pose', () => {
    const polygon = footprintToPolygon(
      { kind: 'rect', widthCm: 20, depthCm: 10 },
      { center, rotationDeg: 0 },
    );
    expect(polygon.vertices).toEqual([
      { x: 90, y: 45 },
      { x: 110, y: 45 },
      { x: 110, y: 55 },
      { x: 90, y: 55 },
    ]);
  });

  it('keeps a rectangle area and centre at any rotation', () => {
    fc.assert(
      fc.property(fc.double({ min: -720, max: 720, noNaN: true }), (rotationDeg) => {
        const { vertices } = footprintToPolygon(
          { kind: 'rect', widthCm: 120, depthCm: 60 },
          { center, rotationDeg },
        );
        expect(polygonArea(vertices)).toBeCloseTo(7200, 6);
        expect(vertices.reduce((sum, v) => sum + v.x, 0) / 4).toBeCloseTo(center.x, 8);
        expect(vertices.reduce((sum, v) => sum + v.y, 0) / 4).toBeCloseTo(center.y, 8);
      }),
    );
  });

  it('covers the whole circle, so a circle is never understated', () => {
    const polygon = footprintToPolygon(
      { kind: 'circle', diameterCm: 30 },
      { center, rotationDeg: 0 },
    );
    expect(polygon.vertices).toHaveLength(CIRCLE_APPROXIMATION_SIDES);
    for (let i = 0; i < 360; i += 1) {
      const radians = (i * Math.PI) / 180;
      const onCircle = {
        x: center.x + 15 * Math.cos(radians),
        y: center.y + 15 * Math.sin(radians),
      };
      expect(locatePoint(onCircle, polygon)).not.toBe('outside');
    }
  });

  it('stays close to the true circle', () => {
    const { vertices } = footprintToPolygon(
      { kind: 'circle', diameterCm: 30 },
      { center, rotationDeg: 0 },
    );
    expect(polygonArea(vertices)).toBeLessThan(Math.PI * 15 * 15 * 1.01);
  });

  it.each([
    [{ kind: 'rect', widthCm: 0, depthCm: 10 }],
    [{ kind: 'rect', widthCm: 10, depthCm: -1 }],
    [{ kind: 'rect', widthCm: NaN, depthCm: 10 }],
    [{ kind: 'circle', diameterCm: 0 }],
    [{ kind: 'circle', diameterCm: Infinity }],
  ] as const)('refuses unusable size %j instead of treating it as zero', (footprint) => {
    expect(() => footprintToPolygon(footprint, { center, rotationDeg: 0 })).toThrow(RangeError);
  });

  it.each([
    [{ center: { x: NaN, y: 0 }, rotationDeg: 0 }],
    [{ center: { x: 0, y: Infinity }, rotationDeg: 0 }],
    [{ center: { x: 0, y: 0 }, rotationDeg: NaN }],
  ])('refuses unusable pose %j', (pose) => {
    expect(() => footprintToPolygon({ kind: 'circle', diameterCm: 10 }, pose)).toThrow(RangeError);
  });
});
