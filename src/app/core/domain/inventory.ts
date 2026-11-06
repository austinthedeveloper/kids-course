import type { Footprint } from './geometry-types';
import type { Id } from './ids';

export interface InventoryItem {
  readonly id: Id;
  readonly equipmentDefinitionId: Id;
  /** Non-negative integer count the household owns. */
  readonly quantity: number;
  /** Measured size of this household's item, when it differs from the catalog definition. */
  readonly footprintOverride?: Footprint;
  /** False when the item is owned but should not be used right now. */
  readonly available: boolean;
}
