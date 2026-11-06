import { DEFAULT_GRID_CM, snapPointToGrid, snapToGrid } from './grid';

describe('grid snapping', () => {
  it('snaps to the 15 cm default', () => {
    expect(DEFAULT_GRID_CM).toBe(15);
    expect(snapToGrid(22)).toBe(15);
    expect(snapToGrid(23)).toBe(30);
    expect(snapPointToGrid({ x: 7, y: 8 })).toEqual({ x: 0, y: 15 });
  });

  it('never produces negative zero', () => {
    expect(Object.is(snapToGrid(-1), -0)).toBe(false);
  });

  it.each([0, -5, NaN, Infinity])('refuses grid size %d', (grid) => {
    expect(() => snapToGrid(10, grid)).toThrow(RangeError);
  });
});
