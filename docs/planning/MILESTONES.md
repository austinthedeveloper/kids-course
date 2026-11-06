# Milestones — ordered implementation checklist

Use checkboxes as living project progress. Each milestone has a **demo** and an **exit gate**. Do not start sophisticated AI or search optimizers before foundational geometry works.

## M0 — Repository and architecture foundation

**Goal:** reproducible local app and test setup; shared conventions.

- [ ] Choose Angular version, package manager, Node version, and lockfile; record in README.
- [ ] Scaffold Angular application with strict TypeScript, routing, and lint/format conventions.
- [ ] Establish test runner and Playwright smoke test; run CI on pushes/PRs.
- [ ] Create feature/module skeleton (domain, geometry, persistence, UI).
- [ ] Define units, coordinates, polygon validity, IDs, and persisted schema version.
- [ ] Implement responsive shell and accessibility baseline.
- [ ] Add example fixtures: rectangular and L-shaped rooms, common gear.
- [ ] Decide canvas library after a quick drag/zoom/rotate prototype; record ADR update.

**Demo:** starts locally, CI green, sample room visible. **Exit:** clean setup, automated smoke test and domain type tests pass.

## M1 — Equipment inventory + approved activity catalog

**Goal:** parents can accurately describe what they own.

- [ ] Seed a small reviewed catalog (floor mats, stable cushions, low balance equipment, stepping markers, floor tape/rope line as permitted).
- [ ] Define equipment footprints, quantities, labels, and usage restrictions.
- [ ] Build browse/select/add/edit/delete inventory UI.
- [ ] Allow custom dimensions for supported equipment types; validate units and ranges.
- [ ] Define approved activity templates and adult-facing instructions.
- [ ] Persist inventory locally; test save/load and invalid data.
- [ ] Add clear empty/error states.

**Demo:** configure a realistic household inventory and reload unchanged. **Exit:** no unspecified dimension silently becomes zero; only approved activities can be selected.

## M2 — Top-down room editor

**Goal:** make awkward rooms representable without CAD complexity.

- [ ] Implement rectangle creation (feet/inches in UI, cm in model).
- [ ] Implement editable polygon vertices, add/remove handles, and grid snapping.
- [ ] Validate self-intersections, area, overlapping walls, and invalid edits.
- [ ] Add obstacles/keep-clear zones with drag/resize/rotation.
- [ ] Add zoom, pan, fit-to-view, mobile touch controls and numeric inspector.
- [ ] Save/load/rename/duplicate/delete room profiles.
- [ ] Add unlimited-space mode with explicit feasibility limitation.
- [ ] Create at least three saved irregular-room fixtures for testing.

**Demo:** draw an L-shaped living room, add couch/table, reload. **Exit:** geometry and UI agree; no invalid polygon can be persisted.

## M3 — Feasible generator v1

**Goal:** produce a correct, modest course without AI.

- [ ] Implement geometry tests: containment, rotations, polygon overlap, clearance expansion.
- [ ] Filter approved activity templates by inventory, age band, and preferences.
- [ ] Place 2–4 stations in open rectangles using deterministic seeded search.
- [ ] Extend placement to concave polygons and obstacles.
- [ ] Validate usable route between stations; reject blocked transitions.
- [ ] Build independent full-layout validator and reason codes.
- [ ] Score feasible candidates for goal match and variety.
- [ ] Return honest no-solution results and alternatives.
- [ ] Add unit and property-based regression fixtures.

**Demo:** generate and reject appropriate layouts in rectangular/L-shaped spaces. **Exit:** all critical geometry/safety fixtures pass; no knowingly invalid layout is returned.

## M4 — Course review, play, persistence

**Goal:** make generated plans usable in a real home.

- [ ] Render numbered station layout, arrows, clearance regions, and equipment legend.
- [ ] Show setup checklist and short per-station adult/child instructions.
- [ ] Add move/rotate station, live validation, lock/unlock, regenerate unlocked.
- [ ] Save/reopen/duplicate course with snapshots and version metadata.
- [ ] Add adult pre-play safety checklist, warnings and explicit review gate.
- [ ] Create printable view with a textual fallback and a clear disclaimer.
- [ ] Verify tablet/mobile usability and keyboard/text-only accessibility.
- [ ] Add local JSON export/import or communicate data-retention limits clearly.

**Demo:** build, review, adjust, print, replay a course. **Exit:** all P0 requirements and MVP E2E paths pass; safety review completed.

## M5 — MVP stabilization and release

- [ ] Run usability tests using actual odd-shaped rooms and real gear measurements.
- [ ] Fix critical failures, confusing terms, and touch interaction issues.
- [ ] Measure editor and generator performance on target devices.
- [ ] Test persisted-data migration, malformed imports, and version mismatch.
- [ ] Review accessibility and instructions; verify all claims and warnings.
- [ ] Record known limitations, changelog, and release checklist.

**Demo:** fresh install through saved course on phone/tablet. **Exit:** agreed beta quality gate reached; no critical safety defects.

## Post-MVP milestones (not commitments)

- **M6:** smarter no-rearrangement regeneration, room zones and alternative courses.
- **M7:** thematic story cards, multiple child profiles without personal identifiers, richer equipment catalog.
- **M8:** optional AI themes and photo-assisted room drafting (always manually validated).
