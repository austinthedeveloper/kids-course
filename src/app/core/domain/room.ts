import type { Polygon } from './geometry-types';
import type { Id } from './ids';

export const ROOM_MODES = ['unlimited', 'rectangle', 'polygon'] as const;
export type RoomMode = (typeof ROOM_MODES)[number];

export const OBSTACLE_TYPES = ['furniture', 'hazard', 'keep-clear'] as const;
export type ObstacleType = (typeof OBSTACLE_TYPES)[number];

export interface Obstacle {
  readonly id: Id;
  /** User-entered. Untrusted text: always render as text, never as HTML. */
  readonly label: string;
  /** World-space footprint of the furniture or blocked area. */
  readonly shape: Polygon;
  readonly type: ObstacleType;
}

export interface Room {
  readonly id: Id;
  /** User-entered. Untrusted text. */
  readonly name: string;
  readonly mode: RoomMode;
  /** Absent only for `unlimited`, where the app cannot check spatial fit. */
  readonly boundary?: Polygon;
  readonly obstacles: readonly Obstacle[];
  readonly schemaVersion: number;
}
