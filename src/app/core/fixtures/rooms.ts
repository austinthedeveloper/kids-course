import { SCHEMA_VERSION, type Room } from '../domain';
import { rectangleToPolygon } from '../geometry';

/**
 * Named room fixtures (docs/planning/TEST_STRATEGY.md).
 *
 * All sizes are TEST PLACEHOLDERS in centimetres. They exercise geometry; they are not
 * reviewed or empirically validated room, clearance or equipment distances.
 */

/** A plain open rectangle: the normal case for generating a course. */
export const roomRectangleOpen: Room = {
  id: 'room-rectangle-open',
  name: 'Open rectangle',
  mode: 'rectangle',
  boundary: rectangleToPolygon(450, 360),
  obstacles: [],
  schemaVersion: SCHEMA_VERSION,
};

/** A concave L-shaped room with a fixed couch in the narrow arm. */
export const roomLNarrowCouch: Room = {
  id: 'room-l-narrow-couch',
  name: 'L-shaped room with couch',
  mode: 'polygon',
  boundary: {
    vertices: [
      { x: 0, y: 0 },
      { x: 600, y: 0 },
      { x: 600, y: 240 },
      { x: 240, y: 240 },
      { x: 240, y: 480 },
      { x: 0, y: 480 },
    ],
  },
  obstacles: [
    {
      id: 'obstacle-couch',
      label: 'Couch',
      type: 'furniture',
      shape: {
        vertices: [
          { x: 15, y: 300 },
          { x: 105, y: 300 },
          { x: 105, y: 465 },
          { x: 15, y: 465 },
        ],
      },
    },
  ],
  schemaVersion: SCHEMA_VERSION,
};

/**
 * A bow-tie boundary whose walls cross. Typed `unknown` because it must never be a valid `Room`:
 * it exists to prove rejection before generation.
 */
export const roomSelfIntersecting: unknown = {
  id: 'room-self-intersecting',
  name: 'Crossed walls',
  mode: 'polygon',
  boundary: {
    vertices: [
      { x: 0, y: 0 },
      { x: 300, y: 300 },
      { x: 300, y: 0 },
      { x: 0, y: 300 },
    ],
  },
  obstacles: [],
  schemaVersion: SCHEMA_VERSION,
};

/** Two areas joined by a narrow passage that a cabinet blocks. No route may pass through it. */
export const roomHallwayBlocked: Room = {
  id: 'room-hallway-blocked',
  name: 'Two areas with a blocked hallway',
  mode: 'polygon',
  boundary: {
    vertices: [
      { x: 0, y: 0 },
      { x: 300, y: 0 },
      { x: 300, y: 120 },
      { x: 450, y: 120 },
      { x: 450, y: 0 },
      { x: 750, y: 0 },
      { x: 750, y: 300 },
      { x: 450, y: 300 },
      { x: 450, y: 210 },
      { x: 300, y: 210 },
      { x: 300, y: 300 },
      { x: 0, y: 300 },
    ],
  },
  obstacles: [
    {
      id: 'obstacle-hall-cabinet',
      label: 'Cabinet in the hallway',
      type: 'furniture',
      shape: {
        vertices: [
          { x: 360, y: 105 },
          { x: 390, y: 105 },
          { x: 390, y: 225 },
          { x: 360, y: 225 },
        ],
      },
    },
  ],
  schemaVersion: SCHEMA_VERSION,
};

/** Too little free floor for any station. The honest outcome is a no-solution result. */
export const roomNoSpace: Room = {
  id: 'room-no-space',
  name: 'Closet-sized space',
  mode: 'rectangle',
  boundary: rectangleToPolygon(60, 60),
  obstacles: [],
  schemaVersion: SCHEMA_VERSION,
};

/** Furniture flush against a wall, for the rule that touching counts as a collision. */
export const roomTouchingEdge: Room = {
  id: 'room-touching-edge',
  name: 'Shelf flush against the wall',
  mode: 'rectangle',
  boundary: rectangleToPolygon(300, 300),
  obstacles: [
    {
      id: 'obstacle-flush-shelf',
      label: 'Shelf',
      type: 'furniture',
      shape: {
        vertices: [
          { x: 0, y: 0 },
          { x: 150, y: 0 },
          { x: 150, y: 30 },
          { x: 0, y: 30 },
        ],
      },
    },
  ],
  schemaVersion: SCHEMA_VERSION,
};

/** A notch cuts into the room: nothing may cross the re-entrant wall. */
export const roomConcaveNotch: Room = {
  id: 'room-concave-notch',
  name: 'Room with a re-entrant notch',
  mode: 'polygon',
  boundary: {
    vertices: [
      { x: 0, y: 0 },
      { x: 480, y: 0 },
      { x: 480, y: 420 },
      { x: 300, y: 420 },
      { x: 300, y: 210 },
      { x: 180, y: 210 },
      { x: 180, y: 420 },
      { x: 0, y: 420 },
    ],
  },
  obstacles: [],
  schemaVersion: SCHEMA_VERSION,
};

/** A hazard marked on top of a table, and a keep-clear zone by the door. */
export const roomNestedObstacles: Room = {
  id: 'room-nested-obstacles',
  name: 'Overlapping and nested obstacles',
  mode: 'rectangle',
  boundary: rectangleToPolygon(480, 390),
  obstacles: [
    {
      id: 'obstacle-table',
      label: 'Table',
      type: 'furniture',
      shape: {
        vertices: [
          { x: 150, y: 120 },
          { x: 330, y: 120 },
          { x: 330, y: 270 },
          { x: 150, y: 270 },
        ],
      },
    },
    {
      id: 'obstacle-hot-dish',
      label: 'Keep away from this corner',
      type: 'hazard',
      shape: {
        vertices: [
          { x: 180, y: 150 },
          { x: 240, y: 150 },
          { x: 240, y: 210 },
          { x: 180, y: 210 },
        ],
      },
    },
    {
      id: 'obstacle-door-path',
      label: 'Door path',
      type: 'keep-clear',
      shape: {
        vertices: [
          { x: 0, y: 300 },
          { x: 90, y: 300 },
          { x: 90, y: 390 },
          { x: 0, y: 390 },
        ],
      },
    },
  ],
  schemaVersion: SCHEMA_VERSION,
};
