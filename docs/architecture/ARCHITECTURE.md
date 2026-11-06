# Proposed architecture

## Design goals

Local-first, responsive, testable, deterministic, modular, and safe by construction. Favor a small TypeScript application over microservices, AI APIs, or a premature backend.

## Stack proposal

- **Angular + TypeScript** for application/screen architecture.
- **Konva.js** (or Angular-friendly wrapper if maintained) for room drawing, hit-testing, drag handles and layers. Verify current compatibility before selection.
- **Pure TypeScript geometry module** for coordinate transforms, polygon validation, inflated shapes/clearance, containment and intersection.
- **Pure TypeScript generation module** for candidate selection, placement, path validation, scoring and seeded randomness.
- **IndexedDB** (typed repository adapter) for local profiles/courses; localStorage only for tiny preferences.
- **Unit/property tests + Playwright** for geometry, persistence and complete editor flows.
- **No mandatory backend or AI** in MVP. Optional story/theme AI is behind an abstraction later.

## Logical modules

```text
src/app/
  features/
    home/                # profiles and recent courses
    spaces/              # room list, editing, obstacles
    equipment/           # inventory and catalog
    courses/             # settings, generation, review, play
  core/
    domain/              # types, schemas, IDs, units
    geometry/            # polygons, transforms, clearances, routing
    generator/           # templates, placement, scoring
    persistence/         # IndexedDB, migrations, import/export
    safety/              # policy validation and review metadata
  shared/
    ui/                  # reusable controls, empty states
    drawing/             # canvas/editor components
```

This is an organizational sketch, not a requirement to create all directories immediately.

## Data flow

User edits → typed domain commands → schema validation → state update → persistence. Generation requests use immutable snapshots (room + inventory + settings + template catalog version + seed), returning either a candidate layout with validation report or structured no-solution reasons. UI renders the result without embedding generation rules.

## Domain boundaries

- Room editor owns coordinates and persisted room geometry.
- Equipment catalog owns measured dimensions and allowed usages.
- Activity catalog owns required gear, steps, age/readiness metadata, and review status.
- Generator owns feasible arrangements and transit path.
- Validator owns non-negotiable geometry/safety rules and runs after **every** edit.
- Presentation layer owns drawing only; never sole source of truth.

## Local data and migration

Store versioned snapshots with stable IDs, created/updated timestamps, and catalog/generator versions. Validate on load and migrate old versions. Add JSON export/import before relying on local-only storage for important household setups. Do not store identifiable child information by default.

## Future seams

`ThemeProvider` (static in MVP; optional AI), `StorageRepository` (IndexedDB → optional cloud), `CourseScorer` (manual weights), `RoomImporter` (future photo assistance). Keep these seams simple until needed.

## Engineering conventions

Strict TS; isolated pure logic; do not use pixel coordinates for geometry; meaningful error types; seed all randomness; unit labels mandatory; feature flags for experimental templates. Capture decisions in ADRs.
