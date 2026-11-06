# Domain and data model (draft)

## Units and coordinates

**Canonical unit:** centimeters. Use a 2D right-handed top-down world coordinate system with a documented origin, for example (0,0) at room bounding-box top-left; x right, y down (screen-compatible). Rotation in degrees clockwise. Screen pixels derived through zoom/pan transforms and never persisted as geometry.

```ts
type Id = string;
type Cm = number; // validated finite positive values as appropriate
interface Point { x: Cm; y: Cm }
interface Polygon { vertices: Point[] } // simple, non-self-intersecting, >= 3
interface RectFootprint { kind: 'rect'; widthCm: Cm; depthCm: Cm }
interface CircleFootprint { kind: 'circle'; diameterCm: Cm }
type Footprint = RectFootprint | CircleFootprint;
interface Pose { center: Point; rotationDeg: number }

interface Room {
  id: Id;
  name: string;
  mode: 'unlimited' | 'rectangle' | 'polygon';
  boundary?: Polygon; // absent only for unlimited
  obstacles: Obstacle[];
  schemaVersion: number;
}
interface Obstacle {
  id: Id;
  label: string;
  shape: Polygon; // world-space footprint; furniture or no-go zone
  type: 'furniture' | 'hazard' | 'keep-clear';
}
interface EquipmentDefinition {
  id: Id;
  label: string;
  footprint: Footprint;
  allowedTemplateIds: Id[];
  manufacturerNotes?: string;
}
interface InventoryItem {
  id: Id;
  equipmentDefinitionId: Id;
  quantity: number;
  footprintOverride?: Footprint;
  available: boolean;
}
interface ActivityTemplate {
  id: Id;
  version: number;
  title: string;
  instructions: string[];
  goalTags: string[];
  ageBands: string[];
  challenge: 'easy' | 'medium' | 'hard';
  equipmentRequirements: { definitionId: Id; quantity: number }[];
  clearance: ClearanceSpec; // validated, not optional
  estimatedDurationMinutes: number;
  reviewStatus: 'draft' | 'approved' | 'rejected';
}
interface ClearanceSpec {
  frontCm: Cm; rearCm: Cm; leftCm: Cm; rightCm: Cm;
}
interface Station {
  id: Id;
  templateId: Id;
  templateVersion: number;
  inventoryAssignments: { inventoryItemId: Id; quantity: number }[];
  pose: Pose;
  locked: boolean;
}
interface Course {
  id: Id;
  roomSnapshot: Room;
  stations: Station[];
  route: Point[]; // generated waypoints (reviewed by validator)
  settings: CourseSettings;
  seed: number;
  generatorVersion: string;
  createdAt: string;
}
interface CourseSettings {
  ageBand: string;
  challenge: 'easy' | 'medium' | 'hard';
  goal: string;
  durationMinutes: number;
  stationCount?: number;
}
```

## Validation invariants

- Polygon is simple, nonzero area; disallow duplicate adjacent vertices and impossible boundaries.
- All dimensions finite, greater than zero where physically applicable; quantities are nonnegative integers.
- Room boundary and obstacles in the same coordinate reference.
- Every station references a catalog-approved template; all equipment assignments exist and fit quantities.
- Clearance geometry is derived from template + specific equipment. Never store an unvalidated freeform clearance override.
- Persist station poses and snapshots so editing equipment/catalog later does not silently alter saved courses.

## Known gaps (undecided)

- Footprint of a station that uses several items (station envelope): Q-09, [#24](https://github.com/austinthedeveloper/kids-course/issues/24).
- Room entry/exit points, an inventory snapshot on `Course`, and a closed vocabulary for `goal`/`goalTags`: Q-10, [#25](https://github.com/austinthedeveloper/kids-course/issues/25).
- Allowed `ageBand` values: Q-03, [#22](https://github.com/austinthedeveloper/kids-course/issues/22).

Do not resolve these by assumption in code; record the decision here first.

## Evolution

Add richer shapes, room zones, equipment condition flags, multiple poses per complex station, child readiness attributes (without identity), and import/export schemas after core fixtures demonstrate need. Never use unversioned arbitrary JSON as the main persistence contract.
