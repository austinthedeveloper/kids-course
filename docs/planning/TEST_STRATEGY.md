# Testing and quality strategy

## Test pyramid

**Pure unit/property tests** (most): units, polygon validity, intersection, rotations, clearance offsets, station compatibility, equipment counts, seeded generator, scoring and route correctness.

**Integration tests:** editor command/state/persistence pipeline, migrations, template versioning, save/reopen courses, no-solution error propagation.

**End-to-end Playwright:** first-user configuration, L-shaped room edit, inventory entry, generate, reject unsafe placement, lock/regenerate, save/reopen, print view.

**Manual/device:** pinch zoom vs drag, touch handles, performance, screen reader/keyboard flow, color/contrast, print output, offline/local storage behavior.

## Unit tests: tooling and conventions

Set up by EN-001 ([#11](https://github.com/austinthedeveloper/kids-course/issues/11)) and EN-036 ([#93](https://github.com/austinthedeveloper/kids-course/issues/93)).

- One runner (Vitest or Jest, chosen in M0) for all unit and property tests; a property-based testing library for geometry and generator invariants.
- Tests sit next to the code they cover. Pure core modules (`domain`, `geometry`, `generator`, `safety`) are tested without Angular, a browser or IndexedDB; persistence is tested against the in-memory repository and, in integration tests, real IndexedDB.
- Fixtures come from the shared fixtures module by name. Do not redefine a room or gear set inside a test.
- Every story adds or updates unit tests for its logic and its error states. A bug fix starts with a failing test.
- Coverage is reported in CI on every run, with core modules visible separately. Thresholds are set from a measured baseline and recorded here; none is assumed in advance.
- Never commit `.skip` or `.only`. CI fails on them, so a safety test cannot be silently switched off.

## Playwright: tooling and conventions

Harness set up by EN-037 ([#94](https://github.com/austinthedeveloper/kids-course/issues/94)); suites grow with each milestone.

- Two projects at minimum: a phone-sized touch viewport and a tablet/desktop viewport.
- Each test starts from a known local state, either empty or seeded (rooms, inventory, courses) through helpers, and cleans up after itself.
- Select by role and label. Do not assert on canvas pixels or click by coordinates as the primary check; assert through the text station list, the numeric inspector or exposed domain state. This also keeps the non-canvas path honest.
- Call the automated accessibility check in each flow.
- Failed runs upload traces, screenshots and video as CI artifacts.
- The suite runs against the local dev server and against a deployed URL (preview and post-deploy smoke).
- Interactions the harness cannot simulate faithfully (pinch-zoom, real touch latency) are listed for manual device testing, not skipped silently.

| Milestone | End-to-end coverage | Backlog |
| --- | --- | --- |
| M0 | Smoke: shell renders | EN-001 ([#11](https://github.com/austinthedeveloper/kids-course/issues/11)) |
| M1 | Inventory add/edit/delete/reload, missing dimensions, empty state | EN-038 ([#95](https://github.com/austinthedeveloper/kids-course/issues/95)) |
| M2 | Rectangle, L-shape, obstacles, invalid polygon rejected, profiles, inspector | EN-039 ([#96](https://github.com/austinthedeveloper/kids-course/issues/96)) |
| M3 | Settings, generate, no-solution, seeded replay | EN-040 ([#97](https://github.com/austinthedeveloper/kids-course/issues/97)) |
| M4 | Full MVP paths incl. lock/regenerate, save/reopen, print | EN-025 ([#71](https://github.com/austinthedeveloper/kids-course/issues/71)) |

## Where tests run

| Stage | When | What |
| --- | --- | --- |
| Local | While developing | Unit tests in watch mode; Playwright against the dev server |
| Verify | Every push and pull request | Lint, unit and property tests with coverage, build, Playwright smoke, copy-claims guard |
| End-to-end | Pull requests and `main` | Full Playwright suite on both projects |
| Post-deploy | After each deployment | Smoke test against the deployed URL |
| Release | Before production | Everything above plus migration tests from every shipped schema version |

Deployment gates are described in [DEPLOYMENT.md](../architecture/DEPLOYMENT.md).

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
- No deployment from a pipeline with failing, skipped or focused tests.

## Risk-focused testing

Test concave shapes, narrow corridors, near-zero gaps, floating-point boundaries, nested obstacles, duplicated vertices, rotation by arbitrary angles, overlapping clearances, and user-entered extreme sizes. Include reduced-motion and zoomed browser settings.
