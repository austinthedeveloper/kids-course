# Course generation and geometric validation

## Contract

```ts
generateCourse(input: {
  room: Room;
  inventory: InventoryItem[];
  settings: CourseSettings;
  lockedStations?: Station[];
  seed: number;
}): GenerationResult;

type GenerationResult =
  | { ok: true; course: Course; report: ValidationReport }
  | { ok: false; reasonCodes: string[]; suggestions: string[] };
```

Generator output is a **candidate that passes software checks**, not a guarantee of physical safety.

## Pipeline

1. **Normalize inputs:** validate schemas/units; resolve rectangle to polygon; snapshot room, inventory and template versions.
2. **Filter templates:** approved only; age/readiness, requested goals, gear availability, duration, known dimensions and safe usage.
3. **Build station candidates:** footprint + clearance polygon per template and inventory variant; limit station count by gear and estimated duration.
4. **Place locked items first:** revalidate them under current room; never quietly move them.
5. **Generate candidate placements:** grid/sample positions and allowed rotations; use polygon containment and collision rules; prune invalid candidates early.
6. **Build route:** connect station entry/exit points through unobstructed traversable space; forbid crossing no-go zones and narrow/blocked transitions. A simple grid-based A* is sufficient initially.
7. **Score candidates:** feasible station count, variety, goal match, travel simplicity, setup effort, proximity to prior poses, and adequate margin around obstacles.
8. **Validate full result:** run separate independent validation on every candidate and again after manual edits; choose best valid candidate with seeded tie-breaking.
9. **Explain:** output numbered setup and activity instructions, warnings and limitations; or structured no-solution reasons.

## Geometry notes

- Polygon containment must validate **the entire rotated clearance shape**, not just its center.
- Inflate/offset footprints using reviewed clearance margins. For rotated equipment, transform corners before testing intersection.
- Use robust epsilon handling and consistent boundary-touching policy: touching a wall or hazard with required clearance is a collision.
- Obstacle segments and polygons must never be crossed by the route; station routes have practical width, not infinitely thin lines.
- Separate station footprint and movement corridor; visually display both when troubleshooting.
- Unlimited mode may choose a conceptual sequence, but must **not** claim spatial feasibility or assign authoritative distances.

## Optimization approach

Start with bounded stochastic placement with seed and greedy scoring, then improve with backtracking/beam search only when test fixtures show failures. Keep performance budget and deterministic replay. Avoid claiming globally optimal packing: use *best candidate found within search budget*.

### Hard vs soft

**Hard:** bounds, intersections, known dimensions, stock quantity, approved templates, circulation, no-go zones, safety restrictions. **Soft:** fewer furniture moves, less repositioning, novelty, balance of station types, aesthetic layout. No weight can trade against a hard constraint.

## No-solution taxonomy

`INVALID_ROOM`, `NO_APPROVED_ACTIVITIES`, `MISSING_DIMENSIONS`, `INSUFFICIENT_EQUIPMENT`, `INSUFFICIENT_CLEARANCE`, `BLOCKED_ROUTE`, `LOCKED_STATION_INVALID`, `TIME_BUDGET_CONFLICT`, `SEARCH_EXHAUSTED`.

Map codes to clear user advice. Search exhaustion is not proof no solution exists.

## Critical test fixtures

- Rectangle with ample space: valid route, multiple stations.
- Narrow L-shaped room with couch: use separated zones without cutting corners.
- Concave polygon: no equipment crossing re-entrant wall.
- Self-intersecting polygon: validation failure before generation.
- Large gear + small room: no layout; meaningful reason.
- Obstacles blocking a hallway: never route across blocked passage.
- Exact boundary contact and tiny numeric errors: conservative rejection.
- Locked items conflict: fail with explicit conflict; never move lock.
- Duplicate items: use at most inventory quantity.
- Same seed: structurally identical output, with stable ordering.
- Unlimited mode: thematic station list without safety-of-fit claim.

## Incremental delivery

First: fixed candidate templates + rectangular spaces. Next: concave rooms/obstacles. Then route checking + locking. Only after that: scoring improvements and no-rearrangement regeneration.
