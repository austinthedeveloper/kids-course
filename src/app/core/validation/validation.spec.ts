import { SCHEMA_VERSION } from '../domain';
import {
  gearDuplicateStones,
  gearFloorMat,
  gearUnknownSize,
  roomLNarrowCouch,
  roomRectangleOpen,
  roomSelfIntersecting,
} from '../fixtures';
import { validateFootprint } from './footprint';
import { validateInventoryItem } from './inventory';
import { validateObstacle, validateRoom } from './room';

const codesOf = (result: { ok: boolean; issues?: readonly { code: string }[] }) =>
  result.ok ? [] : (result.issues ?? []).map((problem) => problem.code);

describe('validateRoom', () => {
  it('accepts the valid named fixtures unchanged', () => {
    for (const room of [roomRectangleOpen, roomLNarrowCouch]) {
      const result = validateRoom(room);
      expect(result).toEqual({ ok: true, value: room });
    }
  });

  it('rejects room-self-intersecting', () => {
    expect(codesOf(validateRoom(roomSelfIntersecting))).toContain('SELF_INTERSECTION');
  });

  it('requires a boundary unless unlimited', () => {
    const { boundary: _unused, ...withoutBoundary } = roomRectangleOpen;
    expect(_unused).toBeDefined();
    expect(codesOf(validateRoom(withoutBoundary))).toEqual(['MISSING_BOUNDARY']);
  });

  it('accepts an unlimited room without a boundary and rejects one with', () => {
    const { boundary, ...rest } = roomRectangleOpen;
    expect(validateRoom({ ...rest, mode: 'unlimited' }).ok).toBe(true);
    expect(codesOf(validateRoom({ ...rest, mode: 'unlimited', boundary }))).toEqual([
      'UNEXPECTED_BOUNDARY',
    ]);
  });

  it('rejects a rectangle-mode room that is not a rectangle', () => {
    const room = { ...roomLNarrowCouch, mode: 'rectangle' };
    expect(codesOf(validateRoom(room))).toEqual(['NOT_A_RECTANGLE']);
  });

  it('rejects a document from a newer schema version', () => {
    const room = { ...roomRectangleOpen, schemaVersion: SCHEMA_VERSION + 1 };
    expect(codesOf(validateRoom(room))).toEqual(['UNSUPPORTED_SCHEMA_VERSION']);
  });

  it('reports every problem with a path', () => {
    const result = validateRoom({ id: '', name: ' ', mode: 'cave', obstacles: 'none' });
    expect(codesOf(result)).toEqual(
      expect.arrayContaining([
        'INVALID_ID',
        'INVALID_NAME',
        'INVALID_ROOM_MODE',
        'INVALID_OBSTACLES',
      ]),
    );
    expect(result.ok ? [] : result.issues.map((problem) => problem.path)).toContain('name');
  });

  it('locates a bad obstacle inside the room', () => {
    const obstacle = { id: 'x', label: 'Couch', type: 'furniture', shape: { vertices: [] } };
    const result = validateRoom({ ...roomRectangleOpen, obstacles: [obstacle] });
    expect(result.ok ? [] : result.issues[0]?.path).toBe('obstacles[0].shape');
  });

  it('drops unknown fields instead of carrying them along', () => {
    const result = validateRoom({ ...roomRectangleOpen, extra: '<script>' });
    expect(result.ok && 'extra' in result.value).toBe(false);
  });

  it.each([null, 3, 'room', []])('rejects non-room %j', (input) => {
    expect(codesOf(validateRoom(input))).toEqual(['NOT_A_ROOM']);
  });
});

describe('validateObstacle', () => {
  it('rejects unknown types and blank labels', () => {
    const shape = roomLNarrowCouch.obstacles[0]?.shape;
    expect(codesOf(validateObstacle({ id: 'a', label: 'x', type: 'lava', shape }))).toEqual([
      'INVALID_OBSTACLE_TYPE',
    ]);
    expect(codesOf(validateObstacle({ id: 'a', label: ' ', type: 'hazard', shape }))).toEqual([
      'INVALID_LABEL',
    ]);
  });

  it('keeps a label containing markup as plain text', () => {
    const shape = roomLNarrowCouch.obstacles[0]?.shape;
    const label = '<img src=x onerror=alert(1)>';
    const result = validateObstacle({ id: 'a', label, type: 'hazard', shape });
    expect(result.ok && result.value.label).toBe(label);
  });
});

describe('validateFootprint', () => {
  it('accepts rect and circle', () => {
    expect(validateFootprint({ kind: 'rect', widthCm: 1, depthCm: 2 }).ok).toBe(true);
    expect(validateFootprint({ kind: 'circle', diameterCm: 1 }).ok).toBe(true);
  });

  it('reports missing dimensions as missing, never as zero', () => {
    expect(codesOf(validateFootprint({ kind: 'rect', widthCm: 1 }))).toEqual(['MISSING_DIMENSION']);
    expect(codesOf(validateFootprint({ kind: 'circle', diameterCm: null }))).toEqual([
      'MISSING_DIMENSION',
    ]);
  });

  it.each([0, -1, NaN, Infinity, '30'])('rejects dimension %s', (bad) => {
    expect(codesOf(validateFootprint({ kind: 'circle', diameterCm: bad }))).toEqual([
      'INVALID_DIMENSION',
    ]);
  });

  it('rejects unknown kinds', () => {
    expect(codesOf(validateFootprint({ kind: 'blob' }))).toEqual(['UNKNOWN_FOOTPRINT_KIND']);
    expect(codesOf(validateFootprint(null))).toEqual(['NOT_A_FOOTPRINT']);
  });
});

describe('validateInventoryItem', () => {
  it('accepts valid gear fixtures', () => {
    expect(validateInventoryItem(gearDuplicateStones)).toEqual({
      ok: true,
      value: gearDuplicateStones,
    });
    expect(validateInventoryItem(gearFloorMat).ok).toBe(true);
  });

  it('rejects gear-unknown-size with a located reason', () => {
    const result = validateInventoryItem(gearUnknownSize);
    expect(codesOf(result)).toEqual(['MISSING_DIMENSION']);
    expect(result.ok ? '' : result.issues[0]?.path).toBe('footprintOverride.depthCm');
  });

  it.each([1.5, -1, NaN, Infinity, '2', null, undefined])('rejects quantity %s', (quantity) => {
    expect(codesOf(validateInventoryItem({ ...gearFloorMat, quantity }))).toEqual([
      'INVALID_QUANTITY',
    ]);
  });

  it('allows a quantity of zero and an item with no size override', () => {
    const { footprintOverride: _unused, ...rest } = gearFloorMat;
    expect(_unused).toBeDefined();
    expect(validateInventoryItem({ ...rest, quantity: 0 }).ok).toBe(true);
  });

  it('requires availability and references', () => {
    const { available: _available, ...rest } = gearFloorMat;
    expect(_available).toBe(true);
    expect(codesOf(validateInventoryItem(rest))).toEqual(['INVALID_AVAILABLE']);
    expect(codesOf(validateInventoryItem({ ...gearFloorMat, equipmentDefinitionId: '' }))).toEqual([
      'INVALID_ID',
    ]);
    expect(codesOf(validateInventoryItem('mat'))).toEqual(['NOT_AN_INVENTORY_ITEM']);
  });
});
