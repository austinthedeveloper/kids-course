# Repository instructions for coding agents

## Product boundary

This repository will implement the [Kids Course Builder](README.md): an adult-directed at-home obstacle-course planner. Spatial feasibility and equipment safety outrank novelty or maximum station count.

## Read before implementing

1. `docs/product/SAFETY.md`
2. `docs/product/REQUIREMENTS.md`
3. `docs/architecture/DATA_MODEL.md`
4. `docs/architecture/GENERATOR.md`
5. `docs/planning/MILESTONES.md`

## Working conventions

- Work in milestone order; mark completed checklist items only after tests and demo criteria pass.
- Keep generation and geometric validation as pure, testable TypeScript functions.
- Use centimeters internally; convert only at UI boundaries.
- Do not infer unknown dimensions or clearances; reject or request input.
- Every course mutation must trigger independent validation.
- Prefer reviewed template IDs to freeform generated instructions.
- No AI/cloud dependency in MVP without an accepted ADR.
- Add named fixtures for geometry edge cases; do not suppress safety failing tests.
- Never describe a generated plan as *safe* or *certified*; require adult review.
- Update requirements/ADRs if behavior or a technical decision changes.

## Implementation handoff

Start with **M0** in `docs/planning/MILESTONES.md`. The repository may not yet contain application code. Avoid silently scaffolding unrelated features or skipping to AI integrations.
