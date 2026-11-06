# Kids Course Builder

Design safe, imaginative at-home movement courses using equipment you already own and the space you actually have.

> **Status:** Early implementation (Milestone 0). The app shell, core geometry and validators, and a room-drawing prototype exist; courses cannot be generated yet. This repository's documentation defines the proposed product, MVP, implementation order, and acceptance gates. Technology and scope decisions marked *proposed* may be revisited through ADRs.

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
| [Deployment](docs/architecture/DEPLOYMENT.md) | Azure hosting, pipelines, environments, release and rollback |
| [Data model](docs/architecture/DATA_MODEL.md) | Entities, geometry, schemas, units |
| [Generation design](docs/architecture/GENERATOR.md) | Deterministic layout algorithm and validation |
| [Milestones](docs/planning/MILESTONES.md) | Ordered delivery checklist and exit gates |
| [Backlog](docs/planning/BACKLOG.md) | Story/enabler/open-question index with GitHub issue links and requirement traceability |
| [GitHub workflow](docs/planning/GITHUB_WORKFLOW.md) | Labels, IDs, project board and how to pick up work |
| [Testing](docs/planning/TEST_STRATEGY.md) | Test layers, fixtures, and release criteria |
| [Roadmap](docs/planning/ROADMAP.md) | MVP vs later ideas; risks |
| [ADRs](docs/decisions/) | Decisions and tradeoffs |

## Project tracking

Work is tracked in [GitHub issues](https://github.com/austinthedeveloper/kids-course/issues) grouped by [milestones](https://github.com/austinthedeveloper/kids-course/milestones) (M0–M5 are the MVP) and on the [project board](https://github.com/users/austinthedeveloper/projects/6). Each milestone has an epic issue; open product and safety decisions are `Q-xx` issues. The [wiki](https://github.com/austinthedeveloper/kids-course/wiki) is a reader-friendly overview; the docs in this repository are the source of truth.

## Proposed stack

Angular + TypeScript, Konva.js for canvas interactions, lightweight geometry utilities, deterministic course generation, IndexedDB for local persistence, Vitest/Jest unit tests and Playwright end-to-end tests. **No AI backend is required for MVP.** Confirm library compatibility at project setup. The built app is hosted as static files on Azure and deployed by GitHub Actions ([ADR-0004](docs/decisions/ADR-0004-AZURE-STATIC-HOSTING.md)); household data stays in the browser.

## Local development

| Tool | Version |
| --- | --- |
| Node | 22 (see `.nvmrc`; `^22.22.3` or `^24.15.0`, enforced on install) |
| npm | 10 or later (lockfile committed) |
| Angular | 22.2 |

```bash
nvm use
```

```bash
npm ci
```

```bash
npx playwright install chromium
```

| Task | Command |
| --- | --- |
| Run the app at http://localhost:4200 | `npm start` |
| Unit and property tests | `npm test` |
| Unit tests in watch mode | `npm run test:watch` |
| Unit tests with coverage | `npm run test:coverage` |
| End-to-end tests | `npm run e2e` |
| Lint, boundaries, skipped-test and copy-claims checks | `npm run lint` |
| Format | `npm run format` |
| Production build | `npm run build` |
| Everything CI runs | `npm run check` |

The app runs entirely locally; nothing is deployed yet. See [Deployment](docs/architecture/DEPLOYMENT.md) for the plan.

## Guiding principles

- **Safety before density:** reject unsafe layouts, even if that means placing fewer stations.
- **Parents remain in control:** dimensions, clearance, editing, and explicit approval.
- **Useful without AI:** repeatable results and transparent explanations.
- **Fast to reuse:** save a room once; generate multiple courses with minimal physical rearrangement.
- **Approachable UI:** plain instructions, clear numbering, accessible controls.

## Disclaimer

This is a planning document for a play-planning tool, **not a safety certification**. Generated plans require adult inspection and supervision; the app cannot verify physical conditions, structural stability, child capabilities, or correct equipment use.
