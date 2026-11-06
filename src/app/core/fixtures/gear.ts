import type { InventoryItem } from '../domain';

/** Named gear fixtures. Sizes are TEST PLACEHOLDERS, not reviewed equipment measurements. */

/** Six identical stepping markers: quantity must be tracked, not assumed. */
export const gearDuplicateStones: InventoryItem = {
  id: 'gear-duplicate-stones',
  equipmentDefinitionId: 'equipment-stepping-marker',
  quantity: 6,
  footprintOverride: { kind: 'circle', diameterCm: 30 },
  available: true,
};

/** A floor mat with a measured size. */
export const gearFloorMat: InventoryItem = {
  id: 'gear-floor-mat',
  equipmentDefinitionId: 'equipment-floor-mat',
  quantity: 1,
  footprintOverride: { kind: 'rect', widthCm: 120, depthCm: 60 },
  available: true,
};

/**
 * A mat whose depth was never entered. Typed `unknown` because it must never be a valid
 * `InventoryItem`: an unknown size cannot silently be placed.
 */
export const gearUnknownSize: unknown = {
  id: 'gear-unknown-size',
  equipmentDefinitionId: 'equipment-floor-mat',
  quantity: 1,
  footprintOverride: { kind: 'rect', widthCm: 120 },
  available: true,
};
