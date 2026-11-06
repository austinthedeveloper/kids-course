import fc from 'fast-check';
import type { Polygon } from '../domain';
import {
  roomConcaveNotch,
  roomHallwayBlocked,
  roomLNarrowCouch,
  roomNestedObstacles,
  roomTouchingEdge,
} from '../fixtures';
import {
  distanceToSegment,
  locatePoint,
  polygonContains,
  polygonsIntersect,
  segmentIntersectsPolygon,
} from './collision';
import { rectangleCorners } from './edit';
import { rectangleToPolygon } from './polygon';
import { GEOMETRY_EPSILON_CM } from './primitives';
import { rotatePolygon, translatePolygon } from './transform';

const box = (minX: number, minY: number, maxX: number, maxY: number): Polygon => ({
  vertices: [
    { x: minX, y: minY },
    { x: maxX, y: minY },
    { x: maxX, y: maxY },
    { x: minX, y: maxY },
  ],
});
const lRoom = roomLNarrowCouch.boundary!;
const notchRoom = roomConcaveNotch.boundary!;

describe('distanceToSegment', () => {
  it('measures to the nearest point, clamped to the ends', () => {
    const a = { x: 0, y: 0 };
    const b = { x: 10, y: 0 };
    expect(distanceToSegment({ x: 5, y: 3 }, a, b)).toBe(3);
    expect(distanceToSegment({ x: 14, y: 3 }, a, b)).toBe(5);
    expect(distanceToSegment({ x: -3, y: 4 }, a, b)).toBe(5);
    expect(distanceToSegment({ x: 3, y: 4 }, a, a)).toBe(5);
  });
});

describe('locatePoint', () => {
  it.each([
    [{ x: 100, y: 100 }, 'inside'],
    [{ x: 100, y: 400 }, 'inside'],
    [{ x: 400, y: 400 }, 'outside'], // The part cut out of the L.
    [{ x: 700, y: 100 }, 'outside'],
    [{ x: 240, y: 300 }, 'boundary'], // On the re-entrant wall.
    [{ x: 240, y: 240 }, 'boundary'], // On the re-entrant corner.
    [{ x: 600, y: 100 }, 'boundary'],
  ] as const)('locates %j as %s in the L-shaped room', (point, expected) => {
    expect(locatePoint(point, lRoom)).toBe(expected);
  });

  it('counts correctly when the ray runs through corners and along a wall', () => {
    expect(locatePoint({ x: 100, y: 240 }, lRoom)).toBe('inside');
    expect(locatePoint({ x: -50, y: 240 }, lRoom)).toBe('outside');
    expect(locatePoint({ x: 100, y: 210 }, notchRoom)).toBe('inside');
  });

  it('treats a point within the tolerance of a wall as on it', () => {
    const room = rectangleToPolygon(100, 100);
    expect(locatePoint({ x: 100 - GEOMETRY_EPSILON_CM / 2, y: 50 }, room)).toBe('boundary');
    expect(locatePoint({ x: 100 + GEOMETRY_EPSILON_CM / 2, y: 50 }, room)).toBe('boundary');
    expect(locatePoint({ x: 99.99, y: 50 }, room)).toBe('inside');
    expect(locatePoint({ x: 100.01, y: 50 }, room)).toBe('outside');
  });

  it('handles floating-point boundary values', () => {
    const room = rectangleToPolygon(0.1 + 0.2, 1); // 0.30000000000000004 wide.
    expect(locatePoint({ x: 0.3, y: 0.5 }, room)).toBe('boundary');
  });
});

describe('segmentIntersectsPolygon', () => {
  const obstacle = box(100, 100, 200, 200);

  it.each([
    ['crossing with both ends outside', { x: 0, y: 150 }, { x: 300, y: 150 }, true],
    ['one end inside', { x: 150, y: 150 }, { x: 300, y: 150 }, true],
    ['wholly inside', { x: 120, y: 120 }, { x: 180, y: 180 }, true],
    ['running along an edge', { x: 0, y: 200 }, { x: 300, y: 200 }, true],
    ['touching a corner', { x: 200, y: 200 }, { x: 300, y: 300 }, true],
    ['a gap within the tolerance', { x: 0, y: 200 + 1e-9 }, { x: 300, y: 200 + 1e-9 }, true],
    ['a clear gap', { x: 0, y: 200.01 }, { x: 300, y: 200.01 }, false],
    ['diagonal, boxes overlap, no contact', { x: 0, y: 90 }, { x: 95, y: 300 }, false],
    ['far away', { x: 500, y: 500 }, { x: 600, y: 600 }, false],
  ] as const)('%s', (_name, a, b, expected) => {
    expect(segmentIntersectsPolygon(a, b, obstacle)).toBe(expected);
  });

  it('room-hallway-blocked: a straight line down the hallway hits the cabinet', () => {
    const cabinet = roomHallwayBlocked.obstacles[0]!.shape;
    expect(segmentIntersectsPolygon({ x: 280, y: 165 }, { x: 470, y: 165 }, cabinet)).toBe(true);
  });
});

describe('polygonsIntersect', () => {
  it('detects shapes that cross with no corner inside the other', () => {
    expect(polygonsIntersect(box(0, 40, 100, 60), box(40, 0, 60, 100))).toBe(true);
  });

  it('room-nested-obstacles: detects one shape wholly inside the other, either way round', () => {
    const [table, hazard] = roomNestedObstacles.obstacles;
    expect(polygonsIntersect(table!.shape, hazard!.shape)).toBe(true);
    expect(polygonsIntersect(hazard!.shape, table!.shape)).toBe(true);
  });

  it('room-touching-edge: touching is a collision, and so is a near-zero gap', () => {
    const shelf = roomTouchingEdge.obstacles[0]!.shape; // Ends at y=30.
    expect(polygonsIntersect(shelf, box(0, 30, 100, 90))).toBe(true);
    expect(polygonsIntersect(shelf, box(0, 30 + 1e-9, 100, 90))).toBe(true);
    expect(polygonsIntersect(shelf, box(0, 30.01, 100, 90))).toBe(false);
  });

  it('touching only at a corner is a collision', () => {
    expect(polygonsIntersect(box(0, 0, 10, 10), box(10, 10, 20, 20))).toBe(true);
  });

  it('keeps apart a shape sitting in the cut-out of an L', () => {
    expect(polygonsIntersect(lRoom, box(300, 300, 400, 400))).toBe(false);
  });

  it('is not fooled by overlapping bounding boxes', () => {
    const diagonal: Polygon = {
      vertices: [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 0, y: 10 },
      ],
    };
    expect(polygonsIntersect(diagonal, box(8, 8, 12, 12))).toBe(false);
  });
});

describe('polygonContains', () => {
  it('accepts a shape clearly inside, in convex and concave rooms', () => {
    expect(polygonContains(rectangleToPolygon(300, 300), box(10, 10, 20, 20))).toBe(true);
    expect(polygonContains(lRoom, box(10, 10, 100, 100))).toBe(true);
    expect(polygonContains(notchRoom, box(90, 50, 390, 150))).toBe(true);
  });

  it('rejects a shape whose corners are all inside but whose middle crosses a notch', () => {
    const bridge: Polygon = { vertices: rectangleCorners(360, 30, { x: 240, y: 315 }, 0) };
    for (const corner of bridge.vertices) {
      expect(locatePoint(corner, notchRoom)).toBe('inside');
    }
    expect(polygonContains(notchRoom, bridge)).toBe(false);
  });

  it('rejects a shape cutting across the re-entrant corner of the L', () => {
    const across: Polygon = {
      vertices: [
        { x: 100, y: 400 },
        { x: 500, y: 100 },
        { x: 480, y: 80 },
        { x: 80, y: 380 },
      ],
    };
    expect(polygonContains(lRoom, across)).toBe(false);
  });

  it('checks the whole rotated shape, not its centre', () => {
    const room = rectangleToPolygon(300, 300);
    const center = { x: 150, y: 150 };
    expect(polygonContains(room, { vertices: rectangleCorners(240, 240, center, 0) })).toBe(true);
    // At 45° the corners reach about 170 cm from the centre, past the walls at 150 cm.
    expect(locatePoint(center, room)).toBe('inside');
    expect(polygonContains(room, { vertices: rectangleCorners(240, 240, center, 45) })).toBe(false);
  });

  it('room-touching-edge: touching a wall, or nearly touching it, is not contained', () => {
    const room = roomTouchingEdge.boundary!;
    expect(polygonContains(room, roomTouchingEdge.obstacles[0]!.shape)).toBe(false);
    expect(polygonContains(room, box(1e-9, 10, 50, 50))).toBe(false);
    expect(polygonContains(room, box(0.01, 10, 50, 50))).toBe(true);
    expect(polygonContains(room, box(10, 10, 300, 50))).toBe(false);
  });

  it('rejects a shape filling the room exactly, a larger one, and one outside', () => {
    const room = rectangleToPolygon(100, 100);
    expect(polygonContains(room, rectangleToPolygon(100, 100))).toBe(false);
    expect(polygonContains(room, box(-10, -10, 110, 110))).toBe(false);
    expect(polygonContains(room, box(200, 200, 210, 210))).toBe(false);
  });

  it('does not treat a room inside the shape as the shape inside the room', () => {
    expect(polygonContains(box(40, 40, 60, 60), box(0, 0, 100, 100))).toBe(false);
  });
});

describe('unusable input', () => {
  const good = box(0, 0, 10, 10);
  const nan: Polygon = {
    vertices: [
      { x: 0, y: 0 },
      { x: NaN, y: 0 },
      { x: 10, y: 10 },
    ],
  };
  const tooFew: Polygon = {
    vertices: [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ],
  };
  const a = { x: 0, y: 0 };

  it.each([
    ['NaN corner', nan],
    ['too few corners', tooFew],
  ])('%s throws instead of reading as no collision', (_name, bad) => {
    expect(() => locatePoint(a, bad)).toThrow(RangeError);
    expect(() => segmentIntersectsPolygon(a, { x: 1, y: 1 }, bad)).toThrow(RangeError);
    expect(() => polygonsIntersect(good, bad)).toThrow(RangeError);
    expect(() => polygonsIntersect(bad, good)).toThrow(RangeError);
    expect(() => polygonContains(good, bad)).toThrow(RangeError);
    expect(() => polygonContains(bad, good)).toThrow(RangeError);
  });

  it.each([NaN, Infinity, -Infinity])('a point at %d throws', (bad) => {
    expect(() => locatePoint({ x: bad, y: 0 }, good)).toThrow(RangeError);
    expect(() => segmentIntersectsPolygon({ x: bad, y: 0 }, a, good)).toThrow(RangeError);
    expect(() => segmentIntersectsPolygon(a, { x: 0, y: bad }, good)).toThrow(RangeError);
  });

  it('gives the same answers with a duplicated corner', () => {
    const doubled: Polygon = {
      vertices: [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 10 },
        { x: 10, y: 10 },
        { x: 0, y: 10 },
      ],
    };
    expect(locatePoint({ x: 5, y: 5 }, doubled)).toBe('inside');
    expect(locatePoint({ x: 0, y: 0 }, doubled)).toBe('boundary');
    expect(locatePoint({ x: 20, y: 5 }, doubled)).toBe('outside');
    expect(polygonContains(doubled, box(2, 2, 8, 8))).toBe(true);
    expect(polygonsIntersect(doubled, box(20, 20, 30, 30))).toBe(false);
  });
});

describe('properties', () => {
  const size = fc.integer({ min: 1, max: 400 });
  const position = fc.integer({ min: -100, max: 500 });
  const rect = fc
    .record({ x: position, y: position, w: size, h: size })
    .map(({ x, y, w, h }) => ({ minX: x, minY: y, maxX: x + w, maxY: y + h }));
  const toBox = (r: { minX: number; minY: number; maxX: number; maxY: number }) =>
    box(r.minX, r.minY, r.maxX, r.maxY);
  const angle = fc.double({ min: -720, max: 720, noNaN: true });
  const shift = fc.integer({ min: -5000, max: 5000 });
  const ROOM = { minX: 0, minY: 0, maxX: 400, maxY: 300 };

  it('containment matches plain arithmetic for axis-aligned rectangles', () => {
    fc.assert(
      fc.property(rect, (r) => {
        const expected = r.minX > 0 && r.minY > 0 && r.maxX < ROOM.maxX && r.maxY < ROOM.maxY;
        expect(polygonContains(toBox(ROOM), toBox(r))).toBe(expected);
      }),
    );
  });

  it('intersection matches plain arithmetic, in either order', () => {
    fc.assert(
      fc.property(rect, rect, (a, b) => {
        const expected =
          a.minX <= b.maxX && b.minX <= a.maxX && a.minY <= b.maxY && b.minY <= a.maxY;
        expect(polygonsIntersect(toBox(a), toBox(b))).toBe(expected);
        expect(polygonsIntersect(toBox(b), toBox(a))).toBe(expected);
      }),
    );
  });

  it('turning and moving everything together never changes an answer', () => {
    fc.assert(
      fc.property(rect, rect, angle, shift, shift, (a, b, degrees, dx, dy) => {
        const move = (polygon: Polygon) =>
          translatePolygon(rotatePolygon(polygon, { x: 0, y: 0 }, degrees), dx, dy);
        const [first, second] = [toBox(a), toBox(b)];
        expect(polygonsIntersect(move(first), move(second))).toBe(polygonsIntersect(first, second));
        expect(polygonContains(move(first), move(second))).toBe(polygonContains(first, second));
      }),
    );
  });

  it('a shape reported as contained really is inside at every sampled point', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 600 }),
        fc.integer({ min: 0, max: 480 }),
        fc.integer({ min: 5, max: 400 }),
        fc.integer({ min: 5, max: 400 }),
        angle,
        (x, y, w, d, degrees) => {
          const shape: Polygon = { vertices: rectangleCorners(w, d, { x, y }, degrees) };
          if (!polygonContains(lRoom, shape)) return;
          const corners = shape.vertices;
          corners.forEach((corner, index) => {
            const next = corners[(index + 1) % corners.length]!;
            for (let t = 0; t <= 1; t += 0.05) {
              const sample = {
                x: corner.x + t * (next.x - corner.x),
                y: corner.y + t * (next.y - corner.y),
              };
              expect(locatePoint(sample, lRoom)).toBe('inside');
            }
          });
        },
      ),
      { numRuns: 500 },
    );
  });

  it('a contained shape always counts as intersecting its container', () => {
    fc.assert(
      fc.property(rect, (r) => {
        if (polygonContains(lRoom, toBox(r))) {
          expect(polygonsIntersect(lRoom, toBox(r))).toBe(true);
        }
      }),
    );
  });
});
