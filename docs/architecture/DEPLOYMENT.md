# Hosting, pipelines and deployment

> **Status:** planned, nothing is provisioned yet. Decision: [ADR-0004](../decisions/ADR-0004-AZURE-STATIC-HOSTING.md). Details marked *proposed* are confirmed in Q-11 ([#89](https://github.com/austinthedeveloper/kids-course/issues/89)). Replace placeholders in this file with real names, URLs and commands as each backlog item lands.

## Principles

1. **Static only.** The deployed artifact is the built Angular bundle. No server code, database or user data in Azure.
2. **Nothing ships red.** A deployment needs a green pipeline with no skipped or focused tests. Hazard fixtures are part of the gate.
3. **Everything in code.** Infrastructure and workflows are versioned in this repository and changed by pull request.
4. **No long-lived secrets in the repository.** Prefer OIDC federation from GitHub to Azure; any token lives in GitHub environment secrets.
5. **Updates never strand data.** A release must pass migration tests from every shipped schema version, because household data lives in the browser.
6. **The same disclaimers everywhere.** Preview, staging and production builds all carry the adult-review and not-a-certification wording.

## Environments

| Environment | Source | Purpose | Introduced by |
| --- | --- | --- | --- |
| Preview | Each pull request from a branch in this repository | Review UI changes on real devices; removed when the PR closes | EN-035 ([#92](https://github.com/austinthedeveloper/kids-course/issues/92)) |
| Continuous | `main` after CI passes | Always-current build for the owner to try | EN-034 ([#91](https://github.com/austinthedeveloper/kids-course/issues/91)) |
| Production | Tagged release with manual approval | What households use | EN-041 ([#98](https://github.com/austinthedeveloper/kids-course/issues/98)) |

Until EN-041 lands there is no production audience; the continuous environment is the only long-lived site. Pull requests from forks are built and tested but receive no secrets and no deployment.

## Pipeline stages

| Stage | Runs on | Contents |
| --- | --- | --- |
| Verify | Every push and pull request | Install, lint, unit and property tests with coverage, build, Playwright smoke, check for skipped/focused tests, copy-claims guard |
| End-to-end | Pull requests and `main` | Playwright suite on phone and tablet/desktop projects; traces uploaded on failure |
| Deploy preview | Pull requests | Publish preview, comment URL on the PR |
| Deploy continuous | `main`, only after Verify and End-to-end pass | Publish, then post-deploy smoke test against the deployed URL |
| Release | Version tag + approval | Full gate including migration tests, publish to production, smoke test, record version |

Workflow files live in `.github/workflows/`. CI itself is EN-001 ([#11](https://github.com/austinthedeveloper/kids-course/issues/11)); the Playwright harness is EN-037 ([#94](https://github.com/austinthedeveloper/kids-course/issues/94)).

## Infrastructure

- Proposed: one Azure Static Web Apps resource in a dedicated resource group, defined in Bicep under `infra/` (EN-033, [#90](https://github.com/austinthedeveloper/kids-course/issues/90)).
- Not provisioned, by design: APIs or functions, databases, storage accounts for user data, Application Insights or any analytics.
- A cost alert is set on the resource group. Check current plan limits (bandwidth, number of preview environments, custom domains) when choosing the plan.
- To be recorded here once provisioned: subscription, resource group, region, resource names, hostname, and the teardown command.

## Application requirements for hosting

- **Routing:** unknown paths fall back to the app's entry document so deep links work.
- **Caching:** content-hashed assets are cached long-term; the entry document is not cached, so users are not held on an old build. Caching must agree with the offline decision in Q-05 ([#19](https://github.com/austinthedeveloper/kids-course/issues/19)).
- **Security headers:** a content security policy with no third-party origins, plus standard hardening headers (EN-042, [#99](https://github.com/austinthedeveloper/kids-course/issues/99)).
- **Version stamp:** the running app shows its version (commit or tag). Bug reports about generated layouts also need the generator version, catalog version and seed.
- **Privacy:** the host receives ordinary web request logs. It never receives rooms, inventory, courses or anything about a child.

## Releases and rollback

Planned in EN-041 ([#98](https://github.com/austinthedeveloper/kids-course/issues/98)): semantic version tags, a GitHub environment with required approval for production, a post-deploy smoke test, and rollback by redeploying the previous tagged version. Rehearse one rollback before the first real release. A rollback must not be attempted across a schema migration without checking that the older build can still read the stored data.

## Operating notes (fill in as built)

- Deployed URLs:
- How to re-run a deployment:
- How to roll back:
- Who owns the Azure subscription and secrets:
- How to rotate credentials:
