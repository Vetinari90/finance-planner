---
type: documentation
audience: [developer]
language: en
links: []
generated_from: 983341781c05105b2104725ca48c43ffa23ea03a
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:d33fdb3f7ae1daded7dd01637bd972ca815ff8d2f5f33a35eed05233d91bc3c2
---

# Database Migration

## _template.md

<!-- SLOT:content brief="Document content (_template.md)" -->
### Summary

This runbook is intended to document the procedure for applying database schema
migrations for the finance-planner application. The available synthesis inputs for
this node (`README.md` and the `overview.md` documents of the `auth`, `plans`,
`planned-items`, `persistence`, and `web-ui` modules) contain almost no concrete
operational detail about migrations, so most sections below are marked
`[NEEDS CLARIFICATION]`. The one grounded fact is that the persistence layer is
built on Prisma: `docs/modules/plans/overview.md` states that plan CRUD operations
go "through the shared Prisma client (`prisma` from `@/lib/db`), owned by the
persistence module." No migration tooling, commands, environments, or schedules are
established by any input available to this node.

## Overview

**Type:** [NEEDS CLARIFICATION] Deployment / rollback / scaling / service-specific classification for this runbook is not stated in any input available to this node.

**Target Environment:** [NEEDS CLARIFICATION] No input available to this node names the deployment or database environments (e.g., production, staging).

**Estimated Duration:** [NEEDS CLARIFICATION] No duration estimate is present in the inputs available to this node.

**Who Can Execute:** [NEEDS CLARIFICATION] No role or ownership information for running database migrations is present in the inputs available to this node.

The only grounded architectural fact for this runbook is that the application's
persistence module owns a shared Prisma client (`prisma` from `@/lib/db`), per
`docs/modules/plans/overview.md`. The dedicated `docs/modules/persistence/overview.md`
document - which would be the authoritative source for persistence-layer operational
detail - is not yet populated (its content slot is `[UNFILLED]` in the current
generated tree), so it could not be used to ground this runbook. Likewise
`docs/modules/auth/overview.md`, `docs/modules/planned-items/overview.md`, and
`docs/modules/web-ui/overview.md` are all `[UNFILLED]` and provided no additional
grounding. `README.md` is the default `create-next-app` bootstrap README and
describes only local dev-server startup and Vercel app deployment; it contains no
database, migration, or Prisma-specific information.

## Pre-Procedure Checklist

[NEEDS CLARIFICATION] No pre-procedure checklist items (approvals, stakeholder
notifications, backup requirements, or maintenance-window scheduling) are present
in `README.md` or in the five module `overview.md` documents available to this
node.

## Procedure Steps

[NEEDS CLARIFICATION] No migration command, script, or tool invocation (for
example, a Prisma CLI migration command) is present in `README.md` or in the
module `overview.md` documents available to this node. Only the fact that the
persistence module uses a Prisma client (`@/lib/db`) is established
(`docs/modules/plans/overview.md`); the actual migration procedure, its ordered
steps, expected output per step, and per-step duration are not established by any
input available to this node.

## Verification

[NEEDS CLARIFICATION] No health-check procedure, smoke test, or metric to confirm
migration success is present in `README.md` or in the module `overview.md`
documents available to this node.

## Rollback/Recovery

[NEEDS CLARIFICATION] No rollback trigger criteria or recovery procedure for a
failed migration is present in `README.md` or in the module `overview.md`
documents available to this node.
<!-- /SLOT:content -->
