# Backlog and user stories

GitHub is the live tracker: [issues](https://github.com/austinthedeveloper/kids-course/issues), [milestones](https://github.com/austinthedeveloper/kids-course/milestones) and the [Kids course planner project board](https://github.com/users/austinthedeveloper/projects/6). This file is the stable-ID index into it. Status lives on GitHub, not here. See [GITHUB_WORKFLOW.md](GITHUB_WORKFLOW.md) for labels, board fields and how to pick up work.

Use stable IDs in issues, branches, commits and PRs. P0 = MVP, P1 = after MVP/core polish, P2 = future.

| Prefix | Meaning |
| --- | --- |
| `US-xxx` | User story: observable value for a parent, caregiver or maintainer |
| `EN-xxx` | Enabler: technical foundation, fixtures, quality or review work a story depends on |
| `SP-xxx` | Spike: time-boxed investigation that ends in a decision |
| `Q-xx` | Open question: a product or safety decision the owner must make |

IDs are never reused or renumbered. `US-001`–`US-021` are the original stories; `US-022` onward and all `EN`/`SP`/`Q` items were added when the backlog was broken down for GitHub. The original `US-001` ("run app/tests locally and in CI") is delivered by `US-001` plus `EN-001`.

Sizes are rough planning estimates (XS–XL), to be re-estimated when work is picked up.

## M0 — Repository and architecture foundation

Epic: [#1](https://github.com/austinthedeveloper/kids-course/issues/1)

| ID | Issue | Priority | Size | Summary | Blocked by |
| --- | --- | --- | --- | --- | --- |
| US-001 | [#10](https://github.com/austinthedeveloper/kids-course/issues/10) | P0 | M | Scaffold the Angular workspace so the app runs locally | — |
| EN-001 | [#11](https://github.com/austinthedeveloper/kids-course/issues/11) | P0 | M | Unit test runner, Playwright smoke test and CI on pushes/PRs | US-001 |
| EN-002 | [#12](https://github.com/austinthedeveloper/kids-course/issues/12) | P0 | S | Module skeleton and enforced dependency boundaries | US-001 |
| EN-003 | [#13](https://github.com/austinthedeveloper/kids-course/issues/13) | P0 | M | Domain primitives: units, coordinates, geometry types, IDs and schema version | EN-002 |
| EN-004 | [#14](https://github.com/austinthedeveloper/kids-course/issues/14) | P0 | M | Schema validators for polygon, room, obstacle and inventory | EN-003 |
| EN-005 | [#15](https://github.com/austinthedeveloper/kids-course/issues/15) | P0 | S | Named fixtures v1: rectangular room, L-shaped room with couch, common gear | EN-003 |
| EN-006 | [#16](https://github.com/austinthedeveloper/kids-course/issues/16) | P0 | M | Responsive app shell and accessibility baseline | US-001 |
| SP-001 | [#17](https://github.com/austinthedeveloper/kids-course/issues/17) | P0 | M | Spike: canvas library prototype — drag, zoom and rotate on touch | US-001, EN-003, EN-005 |
| EN-007 | [#18](https://github.com/austinthedeveloper/kids-course/issues/18) | P0 | S | Decide persistence adapter and schema-validation approach; settle ADR-0001 and ADR-0003 | US-001 |
| Q-05 | [#19](https://github.com/austinthedeveloper/kids-course/issues/19) | P0 | XS | Must the MVP work fully offline after first load? | — |
| Q-11 | [#89](https://github.com/austinthedeveloper/kids-course/issues/89) | P0 | XS | Confirm Azure hosting details: service, subscription, pipeline tool and domain | — |
| EN-033 | [#90](https://github.com/austinthedeveloper/kids-course/issues/90) | P0 | M | Provision Azure static hosting as infrastructure-as-code | US-001, Q-11 |
| EN-034 | [#91](https://github.com/austinthedeveloper/kids-course/issues/91) | P0 | M | Continuous deployment of main to Azure | EN-001, EN-033 |
| EN-036 | [#93](https://github.com/austinthedeveloper/kids-course/issues/93) | P0 | S | Unit test conventions and coverage reporting for core modules | EN-001 |

## M1 — Equipment inventory + approved activity catalog

Epic: [#2](https://github.com/austinthedeveloper/kids-course/issues/2)

| ID | Issue | Priority | Size | Summary | Blocked by |
| --- | --- | --- | --- | --- | --- |
| Q-01 | [#20](https://github.com/austinthedeveloper/kids-course/issues/20) | P0 | XS | Which equipment does the initial household own, in what sizes and quantities? | — |
| Q-02 | [#21](https://github.com/austinthedeveloper/kids-course/issues/21) | P0 | S | Which activity templates are approved for the first catalog, and who reviews them? | — |
| Q-03 | [#22](https://github.com/austinthedeveloper/kids-course/issues/22) | P0 | S | Which age bands are supported, and what readiness prompts does the adult see? | — |
| Q-04 | [#23](https://github.com/austinthedeveloper/kids-course/issues/23) | P0 | S | What clearance values and minimum route width does the app enforce? | — |
| Q-09 | [#24](https://github.com/austinthedeveloper/kids-course/issues/24) | P0 | S | How does a multi-item station define its footprint (station envelope)? | — |
| Q-10 | [#25](https://github.com/austinthedeveloper/kids-course/issues/25) | P0 | S | Data model gaps: entry/exit points, inventory snapshot on Course, goal vocabulary | — |
| EN-008 | [#26](https://github.com/austinthedeveloper/kids-course/issues/26) | P0 | M | Equipment definition schema and seed catalog | EN-003, Q-01 |
| EN-009 | [#27](https://github.com/austinthedeveloper/kids-course/issues/27) | P0 | M | Activity template schema with review metadata and versioning | EN-003, EN-008, Q-09 |
| EN-010 | [#28](https://github.com/austinthedeveloper/kids-course/issues/28) | P0 | M | Seed approved activity templates with adult-facing instructions | EN-009, Q-02, Q-03, Q-04 |
| EN-011 | [#29](https://github.com/austinthedeveloper/kids-course/issues/29) | P0 | L | Typed IndexedDB repository with versioned schemas and validation on load | EN-007, EN-004 |
| US-002 | [#30](https://github.com/austinthedeveloper/kids-course/issues/30) | P0 | L | Add available gear with quantities and measured sizes | EN-008, EN-011, EN-006 |
| US-003 | [#31](https://github.com/austinthedeveloper/kids-course/issues/31) | P0 | S | See activity restrictions for my gear | US-002, EN-010 |
| US-022 | [#32](https://github.com/austinthedeveloper/kids-course/issues/32) | P0 | S | Get started from an empty inventory with a sample gear set | US-002 |
| EN-012 | [#33](https://github.com/austinthedeveloper/kids-course/issues/33) | P0 | S | Automated guard against "safe" / "certified" claims in copy and templates | EN-001 |
| EN-035 | [#92](https://github.com/austinthedeveloper/kids-course/issues/92) | P0 | S | Preview deployment for every pull request | EN-034 |
| EN-037 | [#94](https://github.com/austinthedeveloper/kids-course/issues/94) | P0 | M | Playwright foundation: device projects, data seeding, traces and accessibility checks | EN-001, EN-011 |
| EN-038 | [#95](https://github.com/austinthedeveloper/kids-course/issues/95) | P0 | S | End-to-end tests: equipment inventory flows | EN-037, US-002, US-022 |

## M2 — Top-down room editor

Epic: [#3](https://github.com/austinthedeveloper/kids-course/issues/3)

| ID | Issue | Priority | Size | Summary | Blocked by |
| --- | --- | --- | --- | --- | --- |
| EN-013 | [#34](https://github.com/austinthedeveloper/kids-course/issues/34) | P0 | L | Editor canvas foundation: layers, world↔screen transform, grid, zoom/pan/fit | SP-001, EN-003 |
| US-004 | [#35](https://github.com/austinthedeveloper/kids-course/issues/35) | P0 | M | Enter a rectangular space quickly | EN-013, EN-004 |
| US-005 | [#36](https://github.com/austinthedeveloper/kids-course/issues/36) | P0 | L | Model an L-shaped space by dragging corners | US-004 |
| US-006 | [#37](https://github.com/austinthedeveloper/kids-course/issues/37) | P0 | L | Mark furniture and blocked areas | US-005 |
| US-007 | [#38](https://github.com/austinthedeveloper/kids-course/issues/38) | P0 | M | Reuse named room profiles | US-004, EN-011 |
| US-023 | [#39](https://github.com/austinthedeveloper/kids-course/issues/39) | P0 | S | Choose unlimited space with a clear feasibility limitation | US-007 |
| US-024 | [#40](https://github.com/austinthedeveloper/kids-course/issues/40) | P0 | M | Edit room geometry with a numeric inspector | US-005, US-006 |
| EN-014 | [#41](https://github.com/austinthedeveloper/kids-course/issues/41) | P0 | S | Irregular-room fixtures: hallway-blocked, no-space, touching-edge | EN-005 |
| EN-039 | [#96](https://github.com/austinthedeveloper/kids-course/issues/96) | P0 | M | End-to-end tests: room editor flows | EN-037, US-006, US-007, US-024 |

## M3 — Feasible generator v1

Epic: [#4](https://github.com/austinthedeveloper/kids-course/issues/4)

| ID | Issue | Priority | Size | Summary | Blocked by |
| --- | --- | --- | --- | --- | --- |
| Q-07 | [#42](https://github.com/austinthedeveloper/kids-course/issues/42) | P0 | XS | Is course flow one-direction only at launch, or are loops allowed? | — |
| EN-015 | [#43](https://github.com/austinthedeveloper/kids-course/issues/43) | P0 | L | Geometry kernel: transforms, containment, intersection and epsilon policy | EN-004, EN-014 |
| EN-016 | [#44](https://github.com/austinthedeveloper/kids-course/issues/44) | P0 | M | Clearance geometry: station envelope from footprint and clearance spec | EN-015, EN-009, Q-09 |
| EN-017 | [#45](https://github.com/austinthedeveloper/kids-course/issues/45) | P0 | M | Generator contract, input normalization and seeded randomness | EN-004, EN-009 |
| US-025 | [#46](https://github.com/austinthedeveloper/kids-course/issues/46) | P0 | M | Set course preferences: age band, goal, challenge and duration | US-007, US-002, Q-03 |
| US-008 | [#47](https://github.com/austinthedeveloper/kids-course/issues/47) | P0 | M | Get only compatible activities from owned gear | EN-017, EN-010 |
| US-009 | [#48](https://github.com/austinthedeveloper/kids-course/issues/48) | P0 | L | Receive layouts that respect walls and clearance | US-008, EN-016 |
| EN-018 | [#49](https://github.com/austinthedeveloper/kids-course/issues/49) | P0 | L | Extend placement to concave rooms and obstacles | US-009, EN-014 |
| EN-019 | [#50](https://github.com/austinthedeveloper/kids-course/issues/50) | P0 | L | Route building and validation between stations | EN-018, Q-04, Q-07 |
| EN-020 | [#51](https://github.com/austinthedeveloper/kids-course/issues/51) | P0 | L | Independent full-layout validator and validation report | EN-016, EN-019 |
| EN-021 | [#52](https://github.com/austinthedeveloper/kids-course/issues/52) | P0 | M | Candidate scoring for goal match and variety (soft rules only) | EN-020 |
| US-010 | [#53](https://github.com/austinthedeveloper/kids-course/issues/53) | P0 | M | Receive a clear explanation when nothing fits | EN-020, US-025 |
| US-011 | [#54](https://github.com/austinthedeveloper/kids-course/issues/54) | P0 | S | Replay a layout from seed and versions | EN-017, US-009 |
| EN-022 | [#55](https://github.com/austinthedeveloper/kids-course/issues/55) | P0 | S | Unlimited-mode generation: station sequence without fit claims | US-008, US-023 |
| EN-023 | [#56](https://github.com/austinthedeveloper/kids-course/issues/56) | P0 | L | Property-based tests and critical-fixture regression suite | EN-020, EN-021 |
| EN-040 | [#97](https://github.com/austinthedeveloper/kids-course/issues/97) | P0 | M | End-to-end tests: generate a course and see no-solution results | EN-037, US-010, US-011 |

## M4 — Course review, play, persistence

Epic: [#5](https://github.com/austinthedeveloper/kids-course/issues/5)

| ID | Issue | Priority | Size | Summary | Blocked by |
| --- | --- | --- | --- | --- | --- |
| Q-06 | [#57](https://github.com/austinthedeveloper/kids-course/issues/57) | P0 | XS | Is print required for the first alpha, and does MVP need a black-and-white mode? | — |
| Q-08 | [#58](https://github.com/austinthedeveloper/kids-course/issues/58) | P0 | XS | Are setup instructions primarily read on a phone or on a larger screen? | — |
| US-012 | [#59](https://github.com/austinthedeveloper/kids-course/issues/59) | P0 | L | See station numbering and directions | US-010, EN-013 |
| US-026 | [#60](https://github.com/austinthedeveloper/kids-course/issues/60) | P0 | M | Inspect a station: footprint, clearance, route, gear and instructions | US-012 |
| US-013 | [#61](https://github.com/austinthedeveloper/kids-course/issues/61) | P0 | L | Move, rotate and lock a station and see conflicts | US-012, EN-020 |
| US-027 | [#62](https://github.com/austinthedeveloper/kids-course/issues/62) | P0 | M | Regenerate around locked stations | US-013 |
| US-014 | [#63](https://github.com/austinthedeveloper/kids-course/issues/63) | P0 | M | Save a modified course for later | US-013, EN-011 |
| US-028 | [#64](https://github.com/austinthedeveloper/kids-course/issues/64) | P0 | S | See which saved courses are affected when gear changes | US-014 |
| US-015 | [#65](https://github.com/austinthedeveloper/kids-course/issues/65) | P0 | M | Follow a printable / textual setup guide | US-012, Q-06 |
| US-016 | [#66](https://github.com/austinthedeveloper/kids-course/issues/66) | P0 | M | Review hazards before starting | US-012 |
| US-029 | [#67](https://github.com/austinthedeveloper/kids-course/issues/67) | P0 | M | Play the course station by station | US-016, Q-08 |
| US-030 | [#68](https://github.com/austinthedeveloper/kids-course/issues/68) | P0 | M | Back up and restore my data | EN-011, US-014 |
| US-031 | [#69](https://github.com/austinthedeveloper/kids-course/issues/69) | P0 | M | Start from Home: welcome notice, saved profiles and recent courses | US-007, US-014 |
| EN-024 | [#70](https://github.com/austinthedeveloper/kids-course/issues/70) | P0 | M | Keyboard and text-only alternatives for course editing | US-013 |
| EN-025 | [#71](https://github.com/austinthedeveloper/kids-course/issues/71) | P0 | L | End-to-end suite for MVP paths | US-014, US-015, US-027, EN-040 |
| EN-026 | [#72](https://github.com/austinthedeveloper/kids-course/issues/72) | P0 | S | Safety review sign-off for catalog, clearances and copy | EN-010, US-016, Q-02 |

## M5 — MVP stabilization and release

Epic: [#6](https://github.com/austinthedeveloper/kids-course/issues/6)

| ID | Issue | Priority | Size | Summary | Blocked by |
| --- | --- | --- | --- | --- | --- |
| EN-027 | [#73](https://github.com/austinthedeveloper/kids-course/issues/73) | P0 | L | Household usability tests and discovery experiments | — |
| EN-028 | [#74](https://github.com/austinthedeveloper/kids-course/issues/74) | P0 | M | Measure editor and generator performance on target devices | — |
| EN-029 | [#75](https://github.com/austinthedeveloper/kids-course/issues/75) | P0 | M | Data resilience: migrations, malformed imports, version mismatch, untrusted input | US-030 |
| EN-030 | [#76](https://github.com/austinthedeveloper/kids-course/issues/76) | P0 | M | Accessibility audit and verification of all claims and warnings | — |
| EN-031 | [#77](https://github.com/austinthedeveloper/kids-course/issues/77) | P0 | S | Release readiness: known limitations, changelog, privacy notes and release checklist | — |
| EN-032 | [#78](https://github.com/austinthedeveloper/kids-course/issues/78) | P0 | M | Offline use after first load (only if Q-05 says yes) | Q-05 |
| EN-041 | [#98](https://github.com/austinthedeveloper/kids-course/issues/98) | P0 | M | Release pipeline: gated production deployments, versioning and rollback | EN-034, EN-029 |
| EN-042 | [#99](https://github.com/austinthedeveloper/kids-course/issues/99) | P0 | S | Hosting hardening: security headers, caching, routing and domain | EN-034 |

## M6 — Smarter regeneration, zones, alternatives (post-MVP)

Epic: [#7](https://github.com/austinthedeveloper/kids-course/issues/7)

| ID | Issue | Priority | Size | Summary | Blocked by |
| --- | --- | --- | --- | --- | --- |
| US-017 | [#79](https://github.com/austinthedeveloper/kids-course/issues/79) | P1 | L | Regenerate without rearranging locked gear | US-027 |
| US-018 | [#80](https://github.com/austinthedeveloper/kids-course/issues/80) | P1 | M | Explore 2–3 alternative arrangements | EN-021 |
| US-019 | [#81](https://github.com/austinthedeveloper/kids-course/issues/81) | P1 | M | Undo and redo accidental edits | US-013 |
| US-032 | [#82](https://github.com/austinthedeveloper/kids-course/issues/82) | P1 | M | Label zones within a room | — |
| US-033 | [#83](https://github.com/austinthedeveloper/kids-course/issues/83) | P1 | S | Save equipment kits | — |

## M7 — Story cards, child profiles, richer catalog (post-MVP)

Epic: [#8](https://github.com/austinthedeveloper/kids-course/issues/8)

| ID | Issue | Priority | Size | Summary | Blocked by |
| --- | --- | --- | --- | --- | --- |
| US-034 | [#84](https://github.com/austinthedeveloper/kids-course/issues/84) | P2 | M | Thematic story cards from reviewed static themes | — |
| US-035 | [#85](https://github.com/austinthedeveloper/kids-course/issues/85) | P2 | M | Multiple child profiles without personal identifiers | — |
| US-036 | [#86](https://github.com/austinthedeveloper/kids-course/issues/86) | P2 | M | Richer reviewed equipment catalog | — |

## M8 — Optional AI themes and photo-assisted drafting (post-MVP)

Epic: [#9](https://github.com/austinthedeveloper/kids-course/issues/9)

| ID | Issue | Priority | Size | Summary | Blocked by |
| --- | --- | --- | --- | --- | --- |
| US-020 | [#87](https://github.com/austinthedeveloper/kids-course/issues/87) | P2 | L | Apply a dinosaur/pirate/space theme to instructions (optional AI) | US-034 |
| US-021 | [#88](https://github.com/austinthedeveloper/kids-course/issues/88) | P2 | XL | Use a photo as a draft room, confirming geometry manually | — |

## Requirement traceability

Every requirement in [REQUIREMENTS.md](../product/REQUIREMENTS.md) maps to at least one backlog item.

| Requirement | Priority | Backlog items |
| --- | --- | --- |
| R-01 | P0 | US-007 ([#38](https://github.com/austinthedeveloper/kids-course/issues/38)) |
| R-02 | P0 | US-004 ([#35](https://github.com/austinthedeveloper/kids-course/issues/35)), US-023 ([#39](https://github.com/austinthedeveloper/kids-course/issues/39)), EN-022 ([#55](https://github.com/austinthedeveloper/kids-course/issues/55)) |
| R-03 | P0 | US-005 ([#36](https://github.com/austinthedeveloper/kids-course/issues/36)) |
| R-04 | P0 | US-006 ([#37](https://github.com/austinthedeveloper/kids-course/issues/37)) |
| R-05 | P0 | US-002 ([#30](https://github.com/austinthedeveloper/kids-course/issues/30)), US-008 ([#47](https://github.com/austinthedeveloper/kids-course/issues/47)) |
| R-06 | P0 | US-025 ([#46](https://github.com/austinthedeveloper/kids-course/issues/46)), US-008 ([#47](https://github.com/austinthedeveloper/kids-course/issues/47)) |
| R-07 | P0 | US-008 ([#47](https://github.com/austinthedeveloper/kids-course/issues/47)), US-009 ([#48](https://github.com/austinthedeveloper/kids-course/issues/48)), EN-018 ([#49](https://github.com/austinthedeveloper/kids-course/issues/49)), EN-019 ([#50](https://github.com/austinthedeveloper/kids-course/issues/50)), EN-020 ([#51](https://github.com/austinthedeveloper/kids-course/issues/51)) |
| R-08 | P0 | EN-019 ([#50](https://github.com/austinthedeveloper/kids-course/issues/50)), US-012 ([#59](https://github.com/austinthedeveloper/kids-course/issues/59)), US-029 ([#67](https://github.com/austinthedeveloper/kids-course/issues/67)) |
| R-09 | P0 | US-013 ([#61](https://github.com/austinthedeveloper/kids-course/issues/61)), US-027 ([#62](https://github.com/austinthedeveloper/kids-course/issues/62)) |
| R-10 | P0 | US-010 ([#53](https://github.com/austinthedeveloper/kids-course/issues/53)) |
| R-11 | P0 | US-014 ([#63](https://github.com/austinthedeveloper/kids-course/issues/63)) |
| R-12 | P0 | US-015 ([#65](https://github.com/austinthedeveloper/kids-course/issues/65)) |
| R-13 | P0 | EN-020 ([#51](https://github.com/austinthedeveloper/kids-course/issues/51)), US-012 ([#59](https://github.com/austinthedeveloper/kids-course/issues/59)), US-016 ([#66](https://github.com/austinthedeveloper/kids-course/issues/66)) |
| R-14 | P1 | US-017 ([#79](https://github.com/austinthedeveloper/kids-course/issues/79)) |
| R-15 | P1 | US-019 ([#81](https://github.com/austinthedeveloper/kids-course/issues/81)) |
| R-16 | P2 | US-034 ([#84](https://github.com/austinthedeveloper/kids-course/issues/84)), US-020 ([#87](https://github.com/austinthedeveloper/kids-course/issues/87)) |

## Open questions

Decisions the owner needs to make. Each one names what it blocks; blocked work may be built against clearly labelled placeholders but cannot be marked done.

| ID | Issue | Milestone | Question | Blocks |
| --- | --- | --- | --- | --- |
| Q-05 | [#19](https://github.com/austinthedeveloper/kids-course/issues/19) | M0 | Must the MVP work fully offline after first load? | EN-032 |
| Q-01 | [#20](https://github.com/austinthedeveloper/kids-course/issues/20) | M1 | Which equipment does the initial household own, in what sizes and quantities? | EN-008 |
| Q-02 | [#21](https://github.com/austinthedeveloper/kids-course/issues/21) | M1 | Which activity templates are approved for the first catalog, and who reviews them? | EN-010, EN-026 |
| Q-03 | [#22](https://github.com/austinthedeveloper/kids-course/issues/22) | M1 | Which age bands are supported, and what readiness prompts does the adult see? | EN-010, US-025 |
| Q-04 | [#23](https://github.com/austinthedeveloper/kids-course/issues/23) | M1 | What clearance values and minimum route width does the app enforce? | EN-010, EN-019 |
| Q-09 | [#24](https://github.com/austinthedeveloper/kids-course/issues/24) | M1 | How does a multi-item station define its footprint (station envelope)? | EN-009, EN-016 |
| Q-10 | [#25](https://github.com/austinthedeveloper/kids-course/issues/25) | M1 | Data model gaps: entry/exit points, inventory snapshot on Course, goal vocabulary | — |
| Q-07 | [#42](https://github.com/austinthedeveloper/kids-course/issues/42) | M3 | Is course flow one-direction only at launch, or are loops allowed? | EN-019 |
| Q-06 | [#57](https://github.com/austinthedeveloper/kids-course/issues/57) | M4 | Is print required for the first alpha, and does MVP need a black-and-white mode? | US-015 |
| Q-08 | [#58](https://github.com/austinthedeveloper/kids-course/issues/58) | M4 | Are setup instructions primarily read on a phone or on a larger screen? | US-029 |
| Q-11 | [#89](https://github.com/austinthedeveloper/kids-course/issues/89) | M0 | Confirm Azure hosting details: service, subscription, pipeline tool and domain | EN-033 |

## First sprint candidate

1. US-001 workspace scaffolding ([#10](https://github.com/austinthedeveloper/kids-course/issues/10)) and EN-001 tests + CI ([#11](https://github.com/austinthedeveloper/kids-course/issues/11)).
2. Types and validators for `Point`, `Polygon`, `Room`, `Obstacle`, and inventory: EN-003 ([#13](https://github.com/austinthedeveloper/kids-course/issues/13)), EN-004 ([#14](https://github.com/austinthedeveloper/kids-course/issues/14)).
3. Two fixture rooms, including one concave L-shape with a fixed couch: EN-005 ([#15](https://github.com/austinthedeveloper/kids-course/issues/15)).
4. Small proof of concept: display/edit polygon corner in Konva; convert screen ↔ world coordinates: SP-001 ([#17](https://github.com/austinthedeveloper/kids-course/issues/17)).
5. Decide persistence strategy and document ADR: EN-007 ([#18](https://github.com/austinthedeveloper/kids-course/issues/18)).
6. Agree unit test conventions and coverage reporting: EN-036 ([#93](https://github.com/austinthedeveloper/kids-course/issues/93)).
7. Provision Azure hosting and deploy `main` automatically: EN-033 ([#90](https://github.com/austinthedeveloper/kids-course/issues/90)), EN-034 ([#91](https://github.com/austinthedeveloper/kids-course/issues/91)), once Q-11 ([#89](https://github.com/austinthedeveloper/kids-course/issues/89)) is answered.

Answering Q-01 to Q-04 and Q-09 during this sprint unblocks M1.

## Issue templates

New issues use the forms in [`.github/ISSUE_TEMPLATE/`](../../.github/ISSUE_TEMPLATE/): user story, enabler, open question, and bug (with a safety-defect flag). Every story carries: user story, acceptance criteria, test cases (normal, edge, accessibility/touch) and dependencies.

## Definition of ready

Behavior is testable; measurements, constraints, and failure states are defined; any content/safety approval needed is identified.

## Definition of done

Implementation + unit/integration tests + manual UI check + error feedback + updated documentation where behavior changed.
