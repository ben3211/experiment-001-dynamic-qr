# Architectural Decision Records (ADRs)

---

## Index

| ID | Title | Status | Date |
|----|-------|--------|------|
| ADR-001 | Cloudflare Workers + D1 stack | Accepted | 2026-08-08 |
| ADR-002 | URL token auth instead of accounts | Accepted | 2026-08-08 |
| ADR-003 | Skip clean-architecture layering for M1 | Accepted | 2026-08-08 |
| ADR-004 | Client-side QR generation | Accepted | 2026-08-08 |

---

## ADR-001: Cloudflare Workers + D1 stack

**Status:** Accepted  
**Date:** 2026-08-08  
**Tags:** infrastructure, database

### Context

Need the smallest stack that supports HTTP redirects at the edge, persistent storage, and low operating cost for a business experiment.

### Decision

Use **Cloudflare Workers** for API + redirect handling and **Cloudflare D1** for storage. React + Vite for UI.

### Alternatives considered

| Option | Pros | Cons |
|--------|------|------|
| Workers + D1 | Low cost, fast redirects, minimal ops | Cloudflare-specific |
| Supabase + Vercel | Familiar DX | More moving parts, higher idle cost |
| Single Node server + SQLite | Simple mental model | Requires hosting, scaling overhead |

### Consequences

**Positive:** Near-zero idle cost; redirect latency suitable for QR scans.

**Negative:** Requires Cloudflare account for production; local dev uses Wrangler/Miniflare.

---

## ADR-002: URL token auth instead of accounts

**Status:** Accepted  
**Date:** 2026-08-08  
**Tags:** security, auth

### Context

Dynamic QR owners must edit destinations without building login, password reset, email verification, etc.

### Decision

Generate a **64-character hex management token** at creation. The URL `/manage/{slug}/{token}` (and matching API paths) is the sole credential.

### Alternatives considered

| Option | Pros | Cons |
|--------|------|------|
| URL token | Zero auth infrastructure | Lost URL = lost access |
| Email magic links | Recoverable | Requires email infra |
| Full accounts | Familiar SaaS pattern | Too slow for experiment |

### Consequences

**Positive:** Ships in hours, not weeks.

**Negative:** Users must save management URL; no recovery flow in M1.

---

## ADR-003: Skip clean-architecture layering for M1

**Status:** Accepted  
**Date:** 2026-08-08  
**Tags:** architecture

### Context

Template `DEVELOPMENT_GUIDELINES.md` recommends domain/application/infrastructure layers. This experiment prioritizes speed.

### Decision

Single Worker file with route handlers + D1 SQL. Flat React components. **Revisit only if** the codebase becomes hard to change.

### Consequences

**Positive:** Minimal files, fast iteration.

**Negative:** May require refactor if experiment succeeds and scope grows.

---

## ADR-004: Client-side QR generation

**Status:** Accepted  
**Date:** 2026-08-08  
**Tags:** frontend

### Context

Need PNG QR in browser for create flow.

### Decision

Use the `qrcode` npm package in the browser. Encode the **redirect URL** returned by the API.

### Alternatives considered

| Option | Pros | Cons |
|--------|------|------|
| Client `qrcode` | No server rendering; instant preview | Large bundle acceptable for M1 |
| Server-generated PNG | Consistent output | Extra Worker code |

### Consequences

**Positive:** Worker stays thin; QR updates automatically if `redirectUrl` changes.

**Negative:** Bundle size (~85KB gzip) acceptable for now.

---

## How to Add a New ADR

1. Copy an existing entry.
2. Assign next ID.
3. Add to index.
4. Set status to `Proposed` until reviewed, then `Accepted`.
