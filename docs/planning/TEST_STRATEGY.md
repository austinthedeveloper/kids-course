# Testing and quality strategy

## Test pyramid

**Pure unit/property tests** (most): units, polygon validity, intersection, rotations, clearance offsets, station compatibility, equipment counts, seeded generator, scoring and route correctness.

**Integration tests:** editor command/state/persistence pipeline, migrations, template versioning, save/reopen courses, no-solution error propagation.

**End-to-end Playwright:** first-user configuration, L-shaped room edit, inventory entry, generate, reject unsafe placement, lock/regenerate, save/reopen, print view.

**Manual/device:** pinch zoom vs drag, touch handles, performance, screen reader/keyboard flow, color/contrast, print output, offline/local storage behavior.

## Named fixtures

- `room-rectangle-open`: normal course.
- `room-l-narrow-couch`: concave room with fixed couch.
- `room-hallway-blocked`: narrow passage with obstacle.
- `room-no-space`: insufficient free area.
- `room-self-intersecting`: rejected invalid boundary.
- `room-touching-edge`: conservative boundary behavior.
- `gear-duplicate-stones`: same gear quantity tracked correctly.
- `gear-unknown-size`: cannot silently place.
- `course-locked-conflict`: conflicting lock fails visibly.
- `course-seeded-replay`: deterministic output.

## Properties to assert

1. Every station clearance fits inside the boundary (unless unlimited, which cannot claim fit).
2. No station clearance intersects an obstacle/no-go zone.
3. Inventory usage never exceeds quantity available.
4. Every route segment stays in traversable region and is sufficiently wide.
5. Every template is approved and compatible with selected settings.
6. Applying a valid move then its inverse recovers previous pose within numeric tolerance.
7. Saving/loading a versioned course preserves geometry, inventory references, and seed.
8. Generation returns either a fully validated layout or an explicit failure.

## Suggested quality gates

- All named geometry hazard fixtures in CI.
- All P0 user stories verified by functional acceptance tests.
- Zero open critical/known safety regressions before beta.
- Manual review on one phone-sized and one tablet/desktop viewport.
- Basic accessibility audit and keyboard alternative for canvas-only actions.

## Risk-focused testing

Test concave shapes, narrow corridors, near-zero gaps, floating-point boundaries, nested obstacles, duplicated vertices, rotation by arbitrary angles, overlapping clearances, and user-entered extreme sizes. Include reduced-motion and zoomed browser settings.
