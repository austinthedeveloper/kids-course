# Kids Course Builder

Design safe, imaginative at-home movement courses using equipment you already own and the space you actually have.

> **Status:** Planning / pre-implementation. This repository's documentation defines the proposed product, MVP, implementation order, and acceptance gates. Technology and scope decisions marked *proposed* may be revisited through ADRs.

## The problem

Parents can find obstacle-course ideas, but generic plans rarely fit an L-shaped room, fixed furniture, narrow passages, or an incomplete equipment collection. Repeatedly setting up and rearranging courses takes time.

## The solution

A mobile-friendly, top-down room editor and course generator. Parents save room layouts and an equipment inventory, choose an age range and activity goal, generate a feasible course, and follow simple station-by-station setup/play instructions. Courses should be re-usable, editable, and printable.

### Main workflow

1. **Create a space:** unlimited/open space, approximate rectangle, or traced polygon; mark furniture and blocked areas.
2. **Add gear:** select equipment, quantities, dimensions, and safety constraints.
3. **Set preferences:** child age band, goal, challenge level, duration, and adult supervision.
4. **Generate:** choose compatible activity stations, position gear, and connect stations without blocked routes.
5. **Review and customize:** move/rotate/lock items; validate layout; regenerate unlocked items; follow setup instructions.
6. **Save and replay:** use saved courses, rooms, and equipment collections.

## Read this first

| Document | Purpose |
| --- | --- |
| [Product brief](docs/product/PRODUCT_BRIEF.md) | Problem, audience, outcomes, MVP boundaries |
| [Requirements](docs/product/REQUIREMENTS.md) | Features, nonfunctional requirements, acceptance rules |
| [UX flows](docs/product/UX_FLOWS.md) | Screens, interactions, and error states |
| [Safety policy](docs/product/SAFETY.md) | Hazard prevention and explicit limitations |
| [Architecture](docs/architecture/ARCHITECTURE.md) | Technical direction and modules |
| [Data model](docs/architecture/DATA_MODEL.md) | Entities, geometry, schemas, units |
| [Generation design](docs/architecture/GENERATOR.md) | Deterministic layout algorithm and validation |
| [Milestones](docs/planning/MILESTONES.md) | Ordered delivery checklist and exit gates |
| [Backlog](docs/planning/BACKLOG.md) | User stories and priorities |
| [Testing](docs/planning/TEST_STRATEGY.md) | Test layers, fixtures, and release criteria |
| [Roadmap](docs/planning/ROADMAP.md) | MVP vs later ideas; risks |
| [ADRs](docs/decisions/) | Decisions and tradeoffs |

## Proposed stack

Angular + TypeScript, Konva.js for canvas interactions, lightweight geometry utilities, deterministic course generation, IndexedDB for local persistence, Vitest/Jest unit tests and Playwright end-to-end tests. **No AI backend is required for MVP.** Confirm library compatibility at project setup.

## Local development

Not scaffolded yet. Start at [Milestone 0](docs/planning/MILESTONES.md). Once scaffolded, add exact Node/tool versions and the install, dev, test, build, and lint commands here.

## Guiding principles

- **Safety before density:** reject unsafe layouts, even if that means placing fewer stations.
- **Parents remain in control:** dimensions, clearance, editing, and explicit approval.
- **Useful without AI:** repeatable results and transparent explanations.
- **Fast to reuse:** save a room once; generate multiple courses with minimal physical rearrangement.
- **Approachable UI:** plain instructions, clear numbering, accessible controls.

## Disclaimer

This is a planning document for a play-planning tool, **not a safety certification**. Generated plans require adult inspection and supervision; the app cannot verify physical conditions, structural stability, child capabilities, or correct equipment use.
