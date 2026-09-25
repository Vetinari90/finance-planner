---
type: api-spec
audience: [developer]
language: en
links: [overview.md, use-cases/register-account.md, use-cases/sign-in.md, use-cases/sign-out.md]
generated_from: c463ecf1207700db0662008d5c205be97027b77e
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# API: Auth

## Overview

The auth API provides account registration and a NextAuth-managed session lifecycle. It is not a conventional CRUD resource API: it consists of one custom registration endpoint, the NextAuth catch-all route (sign-in, sign-out, session, CSRF, callback), and a convenience redirect for sign-out.

**Base Path:** Not applicable — endpoints are `/api/auth/register`, `/api/auth/[...nextauth]` (NextAuth's own sub-routes), and `/logout`.

**OpenAPI Spec:** [NEEDS CLARIFICATION] No OpenAPI spec file was present in this dispatch's inputs.

## Authentication

| Requirement | Details |
|-------------|---------|
| Method | Session-based, via the NextAuth `credentials` provider. The provider id `"credentials"` is confirmed by the two call sites `signIn("credentials", ...)` in `src/app/login/LoginClient.tsx` and `src/app/register/page.tsx`. |
| Required Scopes | [NEEDS CLARIFICATION] No scope/role model was found in the reviewed files; `authOptions` (the file that would configure this) is out of scope for this dispatch. |

## Endpoints

| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| POST | `/api/auth/register` | Create a new user account | No |
| GET, POST | `/api/auth/[...nextauth]` | NextAuth catch-all: sign-in, sign-out, session, CSRF, callback, etc. (handled by `NextAuth(authOptions)`) | Varies per NextAuth sub-route; [NEEDS CLARIFICATION] exact per-sub-route behavior is defined inside `authOptions`, which is out of scope here |
| GET | `/logout` | Redirects to NextAuth's built-in `/api/auth/signout?callbackUrl=/login` | No |

## Common Patterns

### Pagination

Not applicable — no list endpoints exist in this module.

### Error Response

The template's generic `{ "error": { "code": ..., "message": ... } }` shape does **not** match what the code actually returns. `POST /api/auth/register` returns:

```json
{
  "error": "Invalid input",
  "details": { }
}
```

for a 400, or:

```json
{
  "error": "Email already exists"
}
```

for a 409. Both are flat strings (`error` is a string, not an object with `code`/`message`).

## Key Endpoints

### POST /api/auth/register

**Purpose:** Create a new user account (`src/app/api/auth/register/route.ts`).

**Request Example:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "at-least-8-chars", "name": "Optional Name"}'
```

Request body is validated by a Zod schema:
- `email`: string, must be a valid email (`z.string().email()`)
- `password`: string, minimum 8 characters (server-side message in the code is the Czech string `"Minimálně 8 znaků"`)
- `name`: string, optional, 1–80 characters

**Response Example (201):**

```json
{
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "Optional Name"
  }
}
```

**Error Codes:**

| Status | Code | When |
|--------|------|------|
| 400 | (returned as `error: "Invalid input"` with a `details` object from `parsed.error.flatten()`) | Request body fails Zod validation |
| 409 | (returned as `error: "Email already exists"`) | `prisma.user.findUnique({ where: { email } })` finds an existing row for the lowercased/trimmed email |

[NEEDS CLARIFICATION] The handler has no explicit `try/catch` around the `prisma.user.create` call; behavior on an unhandled database error (e.g. resulting HTTP status) is not established by the reviewed code.

---

### GET /logout

**Purpose:** Convenience redirect to NextAuth's built-in sign-out flow (`src/app/logout/route.ts`).

**Request Example:**

```bash
curl -i http://localhost:3000/logout
```

**Response Example:**

A redirect response to `http://localhost:3000/api/auth/signout?callbackUrl=/login`. The base URL is hard-coded in the source as the literal string `"http://localhost:3000"`, not derived from the incoming request. [NEEDS CLARIFICATION] Whether this hard-coded base URL is intentional (e.g. local-only helper) or a defect for non-local deployments is not established by the code itself.

**Error Codes:** None — the handler is an unconditional redirect with no branching.
