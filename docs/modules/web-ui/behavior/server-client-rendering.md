---
type: documentation
audience: [developer]
language: en
links: []
generated_from: 0dde214dca0f416a52323f6dd038033de480e56d
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Server Client Rendering

## _template.md

<!-- SLOT:content brief="Document content (_template.md)" -->
# Behavior: Server/Client Rendering at the Root Route

## Context

This diagram documents the server-side rendering flow of the finance-planner root route (`/`), implemented by the Next.js App Router Server Component `src/app/page.tsx`. It shows how a request to `/` is resolved entirely on the server, before any client-side rendering, by branching on the current authentication session.

**Trigger:** An HTTP GET request to `/` (the application root).

---

## Participants

| Participant | Type | Description |
|-------------|------|-------------|
| User | Actor | Browser issuing the `GET /` request |
| page.tsx | Service | `HomePage`, the `async` Server Component default-exported from `src/app/page.tsx` |
| getServerSession | Service | Function imported from `next-auth`, called with `authOptions` from `@/lib/auth` |
| redirect | Service | Function imported from `next/navigation`, used to issue the HTTP redirect |

## Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Page as page.tsx (Server Component)
    participant Auth as next-auth (getServerSession)
    participant Router as next/navigation (redirect)

    User->>Page: GET /
    Page->>Auth: getServerSession(authOptions)
    Auth-->>Page: session or null
    alt session present
        Page->>Router: redirect("/plans")
    else no session
        Page->>Router: redirect("/login")
    end
    Router-->>User: HTTP redirect response
```

## Flow Description

### 1. Session Resolution (Step 1-2)

`HomePage` in `src/app/page.tsx` is an `async` Server Component. On each request to `/`, it calls `getServerSession(authOptions)`, where `authOptions` is imported from `@/lib/auth`. This call executes entirely on the server; no session-check code ships to the client bundle for this route.

### 2. Conditional Redirect (Step 3-4)

Based on the truthiness of the returned `session`, the component calls `redirect(session ? "/plans" : "/login")` from `next/navigation`. Next.js converts this into an HTTP redirect response; the root route itself never renders a response body of its own.

Neither `src/app/layout.tsx` nor `src/app/page.tsx` contains a `"use client"` directive, so both render as Server Components — no client-side rendering occurs in this observed flow. [NEEDS CLARIFICATION] Whether client components exist under the destination routes (`/plans`, `/login`) is outside the web-ui module's manifest scope reviewed for this document.
[NEEDS CLARIFICATION] [REVIEW] completeness: This behavior doc is titled 'Server Client Rendering' but covers only the trivial root-route redirect and disclaims client-side rendering as 'outside the web-ui module's manifest scope'. That claim is contradicted by the dispatch's own codeFiles, which include five 'use client' components (LoginClient.tsx, register/page.tsx, NewPlanForm.tsx, AddItemForm.tsx, DeletePlanButton.tsx) squarely inside the web-ui module. The document omits any discussion of the client-side rendering half of its own title despite that material being available in its inputs.
[NEEDS CLARIFICATION] [REVIEW] accuracy: The doc claims whether client components exist under /plans and /login is 'outside the web-ui module's manifest scope reviewed for this document', but LoginClient.tsx (used by /login) and NewPlanForm.tsx (used by /plans) are both in this dispatch's codeFiles and both begin with "use client" - the answer (yes, client components exist under both destination routes) is directly evidenced by inputs already in scope, not out of scope.

## Error Scenarios

| Failure Point | Handling |
|---------------|----------|
| `getServerSession(authOptions)` throws or rejects | [NEEDS CLARIFICATION] No `try`/`catch` or error boundary around this call is present in `src/app/page.tsx`; behavior on failure is not evidenced in the reviewed code. |
| `authOptions` misconfiguration | [NEEDS CLARIFICATION] `authOptions` is defined in the persistence module (`src/lib`, via `@/lib/auth`), which is outside this dispatch's web-ui manifest scope; its content was not reviewed here. |
[NEEDS CLARIFICATION] [REVIEW] completeness: The Error Scenarios row claims authOptions content 'was not reviewed here' because it is 'outside this dispatch's web-ui manifest scope', but src/lib/auth.ts is directly listed in this document's own codeFiles input and defines authOptions in full (credentials provider, jwt/session callbacks, signIn page). The document leaves this error scenario unaddressed despite the source being available to it.
[NEEDS CLARIFICATION] [REVIEW] accuracy: The doc claims authOptions (src/lib/auth.ts) is 'outside this dispatch's web-ui manifest scope' and 'its content was not reviewed here', but src/lib/auth.ts is explicitly included in this dispatch's codeFiles and its full content (JWT session strategy, CredentialsProvider with bcrypt check, pages.signIn: "/login") is readable. The doc also mislabels src/lib as 'the persistence module' when src/lib/db.ts (the Prisma client), not src/lib/auth.ts, is the persistence code.
<!-- /SLOT:content -->
