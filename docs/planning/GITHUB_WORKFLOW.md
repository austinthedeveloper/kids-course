# GitHub workflow

How the plan in this repository maps onto GitHub, and how to pick up work. GitHub holds live status; the docs hold intent, rules and decisions.

| Where | What it holds |
| --- | --- |
| [Issues](https://github.com/austinthedeveloper/kids-course/issues) | Every epic, story, enabler, spike and open question |
| [Milestones](https://github.com/austinthedeveloper/kids-course/milestones) | M0–M8, mirroring [MILESTONES.md](MILESTONES.md) with goal, demo and exit gate |
| [Project board](https://github.com/users/austinthedeveloper/projects/6) | Status, Priority and Size for every issue |
| [BACKLOG.md](BACKLOG.md) | Stable-ID index, requirement traceability, open-question register |
| [Wiki](https://github.com/austinthedeveloper/kids-course/wiki) | Reader-friendly overview that links back here; the repository docs are the source of truth |

## Issue types and IDs

| Label | ID | Use for |
| --- | --- | --- |
| `type:epic` | Epic M*n* | One per milestone; stories are attached as sub-issues |
| `type:story` | `US-xxx` | Observable value for a parent, caregiver or maintainer |
| `type:enabler` | `EN-xxx` | Foundations, fixtures, quality and review work |
| `type:spike` | `SP-xxx` | Time-boxed investigation ending in a decision or ADR |
| `type:open-question` | `Q-xx` | A product or safety decision only the owner can make |

Issue titles start with the ID (`US-005: Model an L-shaped space by dragging corners`). IDs are stable: never reuse or renumber one. When adding an issue, take the next free number for its prefix and add a row to [BACKLOG.md](BACKLOG.md).

## Other labels

- **Priority:** `P0` required for MVP, `P1` first polish, `P2` future. Same meaning as in [REQUIREMENTS.md](../product/REQUIREMENTS.md).
- **Area:** `area:infra`, `area:domain`, `area:geometry`, `area:generator`, `area:editor`, `area:equipment`, `area:catalog`, `area:courses`, `area:persistence`, `area:safety`, `area:ux`, `area:testing`, plus the default `accessibility` and `documentation`.
- **`safety-critical`:** the change touches a hard rule in [SAFETY.md](../product/SAFETY.md). It needs named-fixture coverage, and a failing safety test is never skipped or weakened to get it merged.
- **`needs-human-review`:** code alone cannot close it. The owner or an informed reviewer must sign off (catalog content, clearance values, age bands, usability findings, release gates).
- **`post-mvp`:** M6–M8. Ideas, not commitments; reprioritise on user evidence.

## Project board fields

- **Status:** Todo → In progress → Done.
- **Priority:** mirrors the priority label.
- **Size:** XS–XL planning estimate. Re-estimate when picking a story up.
- **Iteration, Start date, Target date, Estimate:** left empty on purpose. No dates have been committed; set them when a cadence is chosen. A Roadmap view grouped by Milestone works without dates.

## Picking up work

1. Work milestones in order. Inside a milestone, start with issues whose *Blocked by* list is closed (GitHub shows blocked issues on the board and in the issue sidebar).
2. Check the issue's open questions. A `Q-xx` blocker means a decision is missing: ask the owner, or build against a clearly labelled placeholder and leave the issue open.
3. Branch as `<id>-short-slug` (for example `us-005-polygon-editor`).
4. Reference the ID and issue in commits and the PR (`US-005: reject self-intersecting edits`, `Closes #36`).
5. Tick acceptance criteria in the issue as they are demonstrably met. Tick the epic's milestone checklist item, and the matching box in [MILESTONES.md](MILESTONES.md), only after tests and the demo criteria pass.
6. If behaviour or a technical decision changed, update the requirement or add/update an ADR in the same PR.

## Definition of ready

Behaviour is testable; measurements, constraints and failure states are defined; any content or safety approval needed is identified (as a `Q-xx` or `needs-human-review` issue).

## Definition of done

Implementation + unit/integration tests + manual UI check + error feedback + updated documentation where behaviour changed. For `safety-critical` work, add: named fixture added or extended, independent validation runs after every course mutation, and no copy claims a plan is safe or certified.

## Reporting bugs

Use the bug form. Tick *safety defect* if the app produced, displayed or failed to reject a layout that breaks a hard rule in [SAFETY.md](../product/SAFETY.md), or made a safety claim. Safety defects are `P0`, get a named regression fixture, and block release ([TEST_STRATEGY.md](TEST_STRATEGY.md) quality gates).
