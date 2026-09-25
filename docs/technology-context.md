---
type: documentation
audience: [developer]
language: en
links: []
generated_from: c463ecf1207700db0662008d5c205be97027b77e
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Technology Context

## technology-context.md

<!-- SLOT:content brief="Document content (technology-context.md)" -->
## Summary

The finance-planner application is a [Next.js](https://nextjs.org) project bootstrapped with `create-next-app` (`README.md`). It is deployed on the Vercel platform (`README.md`, "Deploy on Vercel" section). At the module level, request-body validation across the reviewed modules is performed with Zod, and the plans module's data-access errors indicate use of the Prisma ORM. Several other technology-context inputs (the persistence module's technical concerns and deployment docs, the planned-items module's technical concerns doc, and the web-ui module's technical concerns doc) were not yet generated at the time this document was produced and are marked below.

## Technology Stack

### Application Framework

- **Framework:** Next.js, bootstrapped via `create-next-app` (`README.md`).
- **Font optimization:** `next/font`, loading the Geist font family (`README.md`).
- Routing mode: App Router. This is evidenced by the file-system layout of the `route.ts` handlers under `src/app/api/**` (e.g. `src/app/api/auth/[...nextauth]/route.ts`, `src/app/api/auth/register/route.ts`, `src/app/api/plans/route.ts`, `src/app/api/plans/[planId]/route.ts`, `src/app/api/plans/[planId]/items/route.ts`) and the root `src/app/layout.tsx` exporting a `RootLayout`, both of which are App Router conventions (a Pages Router project would instead use a `pages/` directory with `pages/api/*.ts` handlers). The specific Next.js and React package version numbers are not present in any of the files supplied to this node (no `package.json` is among them).

### Request Validation

- **Library:** Zod.
  - Auth module: `RegisterSchema` validates the registration request body in `POST /api/auth/register` (`docs/modules/auth/technical-concerns.md`).
  - Plans module: `CreatePlanSchema` validates `title`, `year`, `month`, and `currency` on `POST /api/plans` (`docs/modules/plans/technical-concerns.md`).
- Yes — the planned-items module's API boundary also uses Zod: `POST /api/plans/[planId]/items` defines a `CreateItemSchema` (`z.object({ title: z.string().min(1).max(120), amountCents: z.number().int().min(0), categoryId: z.string().optional().nullable(), note: z.string().max(400).optional().nullable() })`) and calls `CreateItemSchema.safeParse(body)` before persisting (`src/app/api/plans/[planId]/items/route.ts`). The web-ui module's client-side form component (`src/app/plans/[planId]/AddItemForm.tsx`) does not use Zod; it validates the amount field with a hand-written regex-based `toCents()` helper instead of a schema library.

### Persistence / Data Access

- **ORM:** Prisma is used for data access in the plans module; the `POST /api/plans` handler's `409` response is described as resulting from "Prisma create failed (inferred unique constraint)" (`docs/modules/plans/technical-concerns.md`).
- The database engine is PostgreSQL: `src/lib/db.ts` builds a `PrismaClient` using a `PrismaPg` adapter (`@prisma/adapter-pg`) constructed from a Postgres `connectionString` read from `process.env.DATABASE_URL` (the module throws `"DATABASE_URL is not set"` at load time if that variable is absent). Connection reuse across hot reloads is handled by caching the `PrismaClient` and `PrismaPg` adapter instances on `globalThis` when `NODE_ENV !== "production"`. No backup tooling or migration-runner invocation is present in the available code.

### Authentication / Session Handling

- The plans module's route handlers call a `requireUserId()` helper to establish the current user and return `401 Unauthorized` when it yields no user (`docs/modules/plans/technical-concerns.md`).
- The auth module's registration flow validates credentials via Zod and references an `authOptions` object described as containing "credential-verification logic" (`docs/modules/auth/technical-concerns.md`), but that doc explicitly notes the object itself is outside its dispatch's reviewed files.
- The authentication technology is NextAuth.js (`next-auth`): `src/lib/auth.ts` defines `authOptions: NextAuthOptions` with a `CredentialsProvider` (email/password, verified via `bcrypt.compare` against `prisma.user`) and `session: { strategy: "jwt" }`. `requireUserId()` (`src/lib/requireUser.ts`) calls `getServerSession(authOptions)` from `next-auth` to resolve the current user's id, and `src/app/api/auth/[...nextauth]/route.ts` wires `authOptions` into the `NextAuth()` handler for both `GET` and `POST`.

### Caching

- Neither of the two available technical-concerns docs found a caching layer: the auth module doc states no Redis client, in-memory cache, or CDN header was found in its reviewed files, and the plans module doc likewise found no caching layer, `Cache-Control` header, or in-memory/Redis client, noting instead that `NewPlanForm.tsx` and `DeletePlanButton.tsx` call `router.refresh()` to re-fetch server data after a mutation (`docs/modules/auth/technical-concerns.md`, `docs/modules/plans/technical-concerns.md`).
- None of the available web-ui or persistence-layer code introduces a caching layer: `src/app/plans/page.tsx`, `src/app/plans/[planId]/page.tsx`, `src/app/login/page.tsx`, `src/app/login/LoginClient.tsx`, `src/app/register/page.tsx`, `src/app/page.tsx`, and the API routes under `src/app/api/**` set no `Cache-Control` header, no Next.js `revalidate`/`fetchCache` option, and import no caching client; `src/lib/db.ts` only caches the `PrismaClient`/`PrismaPg` adapter *instance* on `globalThis` in non-production to avoid exhausting database connections across hot reloads, which is connection reuse rather than query/result caching. As with the auth and plans modules, `NewPlanForm.tsx`, `AddItemForm.tsx`, and `DeletePlanButton.tsx` call `router.refresh()` after mutations to re-fetch server data rather than relying on a cache.

### Internationalization

- Both available technical-concerns docs flag inconsistent, rather than deliberate, language handling: the auth module doc notes English UI copy alongside one Czech-language server-side validation message ("Minimálně 8 znaků"), and the plans module doc similarly notes hardcoded English UI strings alongside Czech-language source comments. Neither doc found an i18n framework import (e.g. `next-intl`, `react-i18next`) (`docs/modules/auth/technical-concerns.md`, `docs/modules/plans/technical-concerns.md`).
- Consistent with the auth and plans modules, none of the additional available code establishes a default locale or i18n strategy: no import of an i18n library (e.g. `next-intl`, `react-i18next`) appears in any reviewed file, `src/app/layout.tsx` hardcodes `<html lang="en">`, and all user-facing UI copy in `src/app/page.tsx`, `src/app/login/LoginClient.tsx`, `src/app/register/page.tsx`, `src/app/plans/page.tsx`, `src/app/plans/[planId]/page.tsx`, `src/app/plans/NewPlanForm.tsx`, and `src/app/plans/[planId]/AddItemForm.tsx` is hardcoded English. As with the auth module's Czech validation message, scattered Czech-language source comments continue to appear (e.g. `// v UI jako text/decimal` and `// jednoduchý převod...` in `AddItemForm.tsx`, `// unikát (userId, year, month)` in `src/app/api/plans/route.ts`, and `// NextAuth signOut je klientská funkce...` in `src/app/logout/route.ts`), but these are developer comments, not a locale/i18n mechanism.

## Deployment Platform

- The recommended deployment target is the Vercel platform, per the README's "Deploy on Vercel" section, which points to the Vercel "Next.js deployment documentation" (`README.md`).
- [NEEDS CLARIFICATION] Whether this project is actually deployed to Vercel in practice (as opposed to the README's generic `create-next-app` boilerplate guidance), and any project-specific deployment configuration, cannot be confirmed: `docs/modules/persistence/deployment.md` is unfilled at the time of this generation, and no other deployment-specific reference was supplied to this node.

## External Systems and Dependencies

No additional external system, third-party API, or managed service is evidenced beyond the PostgreSQL database (see the database-engine note above) and the Vercel/`next/font` items already noted: none of `src/app/api/auth/[...nextauth]/route.ts`, `src/app/api/auth/register/route.ts`, `src/app/api/plans/route.ts`, `src/app/api/plans/[planId]/route.ts`, `src/app/api/plans/[planId]/items/route.ts`, `src/lib/auth.ts`, `src/lib/db.ts`, `src/lib/requireUser.ts`, or any of the reviewed client components issues an outbound `fetch()`/SDK call to a third-party service or references an external API key. The only `fetch()` calls in the reviewed client components (`AddItemForm.tsx`, `NewPlanForm.tsx`, `DeletePlanButton.tsx`) target this application's own same-origin `/api/...` routes.

## Inputs Not Yet Available

The following module-docs named as inputs to this synthesis node had not been generated (they remain unfilled `[UNFILLED]` skeletons) at the time this document was produced, and their content could therefore not be incorporated:

- `docs/modules/persistence/technical-concerns.md`
- `docs/modules/persistence/deployment.md`
- `docs/modules/planned-items/technical-concerns.md`
- `docs/modules/web-ui/technical-concerns.md`

[NEEDS CLARIFICATION] Regenerate or re-run this synthesis node once the modules above have been generated, so their content can be incorporated into the technology context.
<!-- /SLOT:content -->
