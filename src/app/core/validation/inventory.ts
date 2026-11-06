import {
  type InventoryItem,
  type Validated,
  type ValidationIssue,
  invalid,
  isId,
  isRecord,
  issue,
  valid,
} from '../domain';
import { validateFootprint } from './footprint';

export function validateInventoryItem(input: unknown, path = ''): Validated<InventoryItem> {
  if (!isRecord(input)) {
    return invalid([issue('NOT_AN_INVENTORY_ITEM', 'Expected an inventory item.', path)]);
  }
  const at = (field: string) => `${path}${path ? '.' : ''}${field}`;
  const issues: ValidationIssue[] = [];

  if (!isId(input['id'])) issues.push(issue('INVALID_ID', 'Item id is missing.', at('id')));
  if (!isId(input['equipmentDefinitionId'])) {
    issues.push(
      issue('INVALID_ID', 'Equipment reference is missing.', at('equipmentDefinitionId')),
    );
  }

  const quantity = input['quantity'];
  if (typeof quantity !== 'number' || !Number.isSafeInteger(quantity) || quantity < 0) {
    issues.push(
      issue('INVALID_QUANTITY', 'Quantity must be a whole number, zero or more.', at('quantity')),
    );
  }

  if (typeof input['available'] !== 'boolean') {
    issues.push(issue('INVALID_AVAILABLE', 'Availability must be true or false.', at('available')));
  }

  let footprintOverride: InventoryItem['footprintOverride'];
  if (input['footprintOverride'] !== undefined) {
    const footprint = validateFootprint(input['footprintOverride'], at('footprintOverride'));
    if (footprint.ok) footprintOverride = footprint.value;
    else issues.push(...footprint.issues);
  }

  if (issues.length > 0) return invalid(issues);

  return valid({
    id: input['id'] as string,
    equipmentDefinitionId: input['equipmentDefinitionId'] as string,
    quantity: quantity as number,
    available: input['available'] as boolean,
    ...(footprintOverride ? { footprintOverride } : {}),
  });
}
