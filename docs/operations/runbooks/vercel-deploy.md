---
type: documentation
audience: [developer]
language: en
links: []
generated_from: f42c2544c64f0a192045ac5c7a007738e9faaa58
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:482e4fdaa7468707c90cbef94244a1e7de37a0f7c489f1a7ebf9bb45578b81f8
---

# Vercel Deploy

## _template.md

<!-- SLOT:content brief="Document content (_template.md)" -->
**Summary:** This runbook covers deploying finance-planner, a Next.js App Router application backed by PostgreSQL via Prisma, to Vercel. The procedure below is grounded only in what `README.md` and the generated module overviews ([auth](../../modules/auth/overview.md), [plans](../../modules/plans/overview.md), [persistence](../../modules/persistence/overview.md), [web-ui](../../modules/web-ui/overview.md)) establish; several Vercel-specific configuration details (project name, environment variable list beyond `DATABASE_URL`, build command, CLI invocation) are not present in the available inputs and are marked below for follow-up.

### Overview

**Type:** Deployment
**Target Environment:** [NEEDS CLARIFICATION] No input identifies which Vercel environment(s) (production, preview, staging) this procedure targets.
**Estimated Duration:** [NEEDS CLARIFICATION] No duration estimate is available in `README.md` or the module overviews.
**Who Can Execute:** [NEEDS CLARIFICATION] No access/authorization policy for who may perform a deploy was found in the available inputs.

finance-planner is a Next.js application ([web-ui overview](../../modules/web-ui/overview.md) describes the root App Router shell and layout). `README.md` states it was bootstrapped with `create-next-app` and that "the easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)," pointing to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for further detail. `README.md` is otherwise unmodified `create-next-app` boilerplate and contains no finance-planner-specific deployment instructions (no project name, no Vercel org/team, no environment variable list, no build command override).

Use this procedure when deploying (or redeploying) the application to Vercel. Before starting, confirm the prerequisites in the checklist below.

### Pre-Procedure Checklist

- [ ] `DATABASE_URL` is set in the target Vercel project's environment variables. The [persistence module overview](../../modules/persistence/overview.md) states the Prisma client "fail[s] fast at module load if `DATABASE_URL` is not set" (`src/lib/db.ts`), so a missing or incorrect `DATABASE_URL` will prevent the deployed application from starting correctly.
- [ ] [NEEDS CLARIFICATION] Whether any additional environment variables (for example a NextAuth session secret or callback URL) are required is not confirmed by the available inputs. The [auth](../../modules/auth/overview.md) and [persistence](../../modules/persistence/overview.md) overviews describe a NextAuth credentials-based session (JWT strategy, `authOptions` in `src/lib/auth.ts`) but neither names a required secret environment variable, and no `package.json` or NextAuth configuration file was in scope to confirm one.
- [ ] [NEEDS CLARIFICATION] Whether `prisma generate` (or an equivalent Prisma client generation step) must run as part of the build is unconfirmed. The persistence overview notes `src/lib/db.ts` imports the generated client from `@/generated/prisma/client`, but the Prisma schema file (`schema.prisma`) was not part of any module's inputs, so the generation step and its trigger point in the build are not established.
- [ ] [NEEDS CLARIFICATION] The target PostgreSQL database (managed provider, migration status, network access from Vercel) is not described in any available input.
- [ ] [NEEDS CLARIFICATION] Build command, install command, output directory, and Node.js version for the Vercel project are not confirmed — no `package.json`, `vercel.json`, or CI/CD configuration file was present in this dispatch's inputs.
- [ ] Notify stakeholders of the deployment window. [NEEDS CLARIFICATION] No notification policy or stakeholder list is present in the available inputs.

### Procedure Steps

[NEEDS CLARIFICATION] No step-by-step Vercel deployment procedure (CLI commands, dashboard actions, CI/CD pipeline trigger, or `vercel.json` configuration) is present in `README.md` or in any of the module overviews available to this node. `README.md`'s only deployment guidance is a link to the generic [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) onboarding flow and the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying); it does not describe finance-planner's specific project linkage, branch-to-environment mapping, or deployment command. Please supply a `vercel.json`, a CI/CD workflow file, or a written deployment procedure so this section can be completed with concrete, cited steps.

### Verification

- [ ] Application starts without a `DATABASE_URL` startup failure (see the persistence module's fail-fast behavior noted above).
- [ ] Manual smoke check of the root route: per the [web-ui module overview](../../modules/web-ui/overview.md), `src/app/page.tsx` is "an `async` Server Component that calls `getServerSession(authOptions)` and calls `redirect(session ? "/plans" : "/login")`." Visiting the deployed application's root URL while unauthenticated should redirect to `/login`; this exercises the session lookup path end-to-end (web-ui → auth's session configuration → persistence's Prisma-backed `authOptions`).
- [ ] [NEEDS CLARIFICATION] Sign-in and registration smoke tests (`/login`, `/register`) are describable in principle from the [auth module overview](../../modules/auth/overview.md) (`POST /api/auth/register`, `signIn("credentials", ...)`), but no input establishes the deployed URLs, test credentials, or expected HTTP responses to specify as concrete verification steps.
- [ ] [NEEDS CLARIFICATION] The [planned-items module overview](../../modules/planned-items/overview.md) named as an input to this node is, as of this generation run, an unfilled skeleton document (`[UNFILLED]`), so no plan-item-related verification step could be grounded here.
- [ ] [NEEDS CLARIFICATION] No metrics, logging, or health-check endpoint was identified in the available inputs to verify post-deploy application health beyond the manual checks above.

### Rollback/Recovery

**Rollback trigger criteria:**
- [NEEDS CLARIFICATION] No rollback trigger criteria (error rate threshold, failed health check, etc.) are defined in the available inputs.

**Recovery steps:**
- [NEEDS CLARIFICATION] No Vercel-specific rollback procedure (e.g., promoting a prior deployment, reverting a branch, restoring a database backup) is documented in `README.md` or the module overviews available to this node. Please supply the project's Vercel rollback procedure and, if a database migration is involved in a deploy, the corresponding backup/restore procedure.

### Troubleshooting

- **Application fails to start / crashes on module load:** Per the [persistence module overview](../../modules/persistence/overview.md), `src/lib/db.ts` fails fast if `DATABASE_URL` is not set. Confirm the environment variable is present and correctly scoped to the target Vercel environment (production/preview) before investigating further.
- [NEEDS CLARIFICATION] Beyond the `DATABASE_URL` fail-fast case above, no other known failure modes or their resolutions are documented in the available inputs.

## Post-Procedure

- [ ] Notify stakeholders
- [ ] Update documentation if needed
- [ ] Close change ticket
<!-- /SLOT:content -->
