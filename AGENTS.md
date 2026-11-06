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
- No AI/cloud dependency in MVP without an accepted ADR. ADR-0004 covers static hosting on Azure and deployment pipelines only: no server APIs, storage of household data, analytics or telemetry.
- Every story ships unit tests for its logic and error states, and Playwright coverage for its user flow; follow `docs/planning/TEST_STRATEGY.md`.
- Infrastructure and workflows are code in this repository. Never commit secrets; never deploy from a pipeline with failing or skipped tests.
- Add named fixtures for geometry edge cases; do not suppress safety failing tests.
- Never describe a generated plan as *safe* or *certified*; require adult review.
- Update requirements/ADRs if behavior or a technical decision changes.

## GitHub tracking

- Issues, milestones and the project board are the live tracker; `docs/planning/BACKLOG.md` is the stable-ID index. Follow `docs/planning/GITHUB_WORKFLOW.md`.
- Take the next issue whose milestone is current and whose *Blocked by* issues are closed. Reference its ID (`US-xxx`, `EN-xxx`, `SP-xxx`) in the branch, commits and PR.
- `Q-xx` issues are owner decisions. Do not answer them by assumption; ask, or build against a clearly labelled placeholder and leave the blocked issue open.
- Issues labelled `needs-human-review` cannot be closed by code alone.
- `safety-critical` issues need named-fixture coverage before they are done.
- New work gets an issue with the next free ID and a row in `BACKLOG.md`.

## Implementation handoff

Start with **M0** in `docs/planning/MILESTONES.md` (epic [#1](https://github.com/austinthedeveloper/kids-course/issues/1); first story US-001, [#10](https://github.com/austinthedeveloper/kids-course/issues/10)). The repository may not yet contain application code. Avoid silently scaffolding unrelated features or skipping to AI integrations.
