---
type: technical
audience: [developer]
language: en
links: [docs/modules/app/technical.md]
generated_from: 0b7a27903123c3dfbbd218b19f18de5be68d5d28
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:458bf88c80431f3d037bd6cc625590bac268ac93527295dbdd7f2b62ac372b58
---

# Technical: lib

## API Endpoints

The `lib` module exposes no HTTP endpoints of its own. It supplies the `authOptions` object consumed by the NextAuth route handler wired up in the `app` module; see [modules/app/technical.md](../app/technical.md) for the actual routes.

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string used to construct the `PrismaPg` adapter in `src/lib/db.ts`; the module throws `"DATABASE_URL is not set"` if it is missing. |

### Secrets

| Secret | Description |
|--------|-------------|
| `DATABASE_URL` | Contains database credentials. |

No signing secret environment variable (e.g. `NEXTAUTH_SECRET`) is referenced anywhere in `src/lib/auth.ts` or the NextAuth route handler (`src/app/api/auth/[...nextauth]/route.ts`); the `authOptions` object passed to `NextAuth()` does not set a `secret` option either. NextAuth will auto-generate an ephemeral secret in development but requires `NEXTAUTH_SECRET` to be set explicitly in production, so this must be provisioned as part of deployment configuration.

## Testing

No test files or test framework configuration (e.g. Jest, Vitest) exist for `auth.ts`, `db.ts`, or `requireUser.ts` in this codebase; these modules currently have no automated test coverage.
