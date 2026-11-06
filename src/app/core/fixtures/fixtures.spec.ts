import { pointsCoincide, polygonArea } from '../geometry';
import { validateRoom } from '../validation';
import {
  FIXTURE_CATALOG,
  gearDuplicateStones,
  gearFloorMat,
  gearUnknownSize,
  roomConcaveNotch,
  roomHallwayBlocked,
  roomLNarrowCouch,
  roomNestedObstacles,
  roomNoSpace,
  roomRectangleOpen,
  roomSelfIntersecting,
  roomTouchingEdge,
} from './index';

const validRooms = [
  roomRectangleOpen,
  roomLNarrowCouch,
  roomHallwayBlocked,
  roomNoSpace,
  roomTouchingEdge,
  roomConcaveNotch,
  roomNestedObstacles,
];

describe('named fixtures', () => {
  it.each(validRooms.map((room) => [room.id, room] as const))('%s is a valid room', (_id, room) => {
    expect(validateRoom(room)).toEqual({ ok: true, value: room });
  });

  it('catalog lists exactly the fixtures that exist', () => {
    const ids = [
      ...validRooms.map((room) => room.id),
      (roomSelfIntersecting as { id: string }).id,
      gearDuplicateStones.id,
      gearFloorMat.id,
      (gearUnknownSize as { id: string }).id,
    ];
    expect(FIXTURE_CATALOG.map((entry) => entry.name).sort()).toEqual([...ids].sort());
  });

  it('room-hallway-blocked: the cabinet spans the whole passage', () => {
    const ys = roomHallwayBlocked.obstacles[0]!.shape.vertices.map((vertex) => vertex.y);
    // The passage runs from y=120 to y=210.
    expect(Math.min(...ys)).toBeLessThanOrEqual(120);
    expect(Math.max(...ys)).toBeGreaterThanOrEqual(210);
  });

  it('room-touching-edge: the shelf really shares a corner with the wall', () => {
    const corner = roomTouchingEdge.boundary!.vertices[0]!;
    const shelf = roomTouchingEdge.obstacles[0]!.shape.vertices;
    expect(shelf.some((vertex) => pointsCoincide(vertex, corner))).toBe(true);
  });

  it('room-no-space: is smaller than the floor mat with no clearance at all', () => {
    expect(polygonArea(roomNoSpace.boundary!.vertices)).toBeLessThan(120 * 60);
  });

  it('room-nested-obstacles: the hazard sits entirely inside the table', () => {
    const [table, hazard] = roomNestedObstacles.obstacles;
    const xs = table!.shape.vertices.map((vertex) => vertex.x);
    const ys = table!.shape.vertices.map((vertex) => vertex.y);
    for (const vertex of hazard!.shape.vertices) {
      expect(vertex.x).toBeGreaterThan(Math.min(...xs));
      expect(vertex.x).toBeLessThan(Math.max(...xs));
      expect(vertex.y).toBeGreaterThan(Math.min(...ys));
      expect(vertex.y).toBeLessThan(Math.max(...ys));
    }
  });
});
