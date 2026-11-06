# ADR-0004: Static hosting on Azure with automated pipelines

**Status:** Accepted for hosting on Azure with automated pipelines and deployments (owner decision). Service and pipeline tool below are proposed; confirm in Q-11 ([#89](https://github.com/austinthedeveloper/kids-course/issues/89)).  
**Date:** 2026-11-05

## Context

The app is a local-first Angular application with no backend (ADR-0001). It still has to be served from somewhere so it can be opened on phones and tablets, and every change should reach a real device without manual steps. The owner wants it hosted on Azure with pipelines and deployments set up from the start.

AGENTS.md requires an accepted ADR before any cloud dependency. This ADR is that record, and it is deliberately narrow: it covers serving static files and automating delivery. It does not add any runtime cloud dependency.

## Decision

- Host the built application as **static files on Azure**. Proposed service: **Azure Static Web Apps** (HTTPS by default, per-pull-request preview environments, no servers to run).
- Define the hosting resources as **infrastructure-as-code** in this repository (Bicep proposed).
- Build, test and deploy with **GitHub Actions** (proposed, since the repository and CI already live on GitHub).
- Deliver in three steps: continuous deployment of `main` (M0), a preview per pull request (M1), and gated, versioned production releases with rollback (M5).
- Never deploy a build whose tests failed or were skipped. Hazard fixtures are part of the deployment gate.

## What this does not change

- No API, functions, database, accounts, sync or AI. Rooms, inventory and courses stay in the browser (ADR-0001).
- No analytics or telemetry. Adding any needs its own accepted ADR.
- The app must keep working as a plain static bundle, so the host can be replaced without code changes.

## Consequences

**Pros:** every merge is testable on real devices; previews make touch and layout review practical; hosting cost is expected to be small; infrastructure is reviewable and reproducible.  
**Cons:** an Azure subscription and its secrets must be owned and maintained; the host sees standard web request logs (such as IP addresses), which the privacy notes must say; a cached or stale build is a new failure mode to guard against; plan limits (for example the number of preview environments) need checking against current Azure pricing.

## Revisit when

Hosting cost or plan limits become a constraint, a backend is proposed (see ADR-0001), or the owner prefers Azure Pipelines or another Azure service.

See [DEPLOYMENT.md](../architecture/DEPLOYMENT.md) for environments, pipeline stages and operating notes.
