# Architecture

**Last updated:** 2026-08-08  
**Applies to:** Milestone 1

---

## System Overview

Minimal dynamic QR service:

1. User enters destination URL in React UI
2. Worker stores `{ slug, destination_url, management_token }` in D1
3. UI generates QR encoding **`{BASE_URL}/q/{slug}`** (not the destination)
4. Scan hits Worker → lookup D1 → HTTP 302 redirect to destination
5. Owner opens **`{FRONTEND_URL}/manage/{slug}/{token}`** → edits destination
6. Same `/q/{slug}` now redirects to new destination

No accounts. Management token in URL is the credential.

```
┌──────────┐    create     ┌─────────────┐    store    ┌────────┐
│  Browser │──────────────▶│ CF Worker   │────────────▶│   D1   │
│  (React) │◀──────────────│  /api/*     │◀────────────│        │
└────┬─────┘   slug+urls   └──────┬──────┘   lookup     └────────┘
     │                            │
     │ QR encodes                 │ GET /q/{slug}
     │ /q/{slug}                  ▼
     │                     302 → destination
     └──────────────── scan ──────┘
```

---

## Goals and Constraints

| Goal | Approach |
|------|----------|
| Fast experiment | Monolith Worker + flat React app, no layers |
| Editable without reprint | Stable public slug; mutable destination in D1 |
| No accounts | Long random management token in URL |
| Low cost | Cloudflare Workers + D1 free tier |

| Constraint | Implication |
|------------|-------------|
| Speed-first | No DI, no domain/application/infrastructure split |
| M1 local dev | Worker :8787, Vite :5173 with proxy |
| Lost token = lost access | Document clearly; no recovery flow in M1 |

---

## Components

| Component | Location | Responsibility |
|-----------|----------|----------------|
| Web UI | `web/src/` | Create QR, show management link, edit destination |
| Worker API | `worker/src/index.ts` | CRUD-ish API + redirect handler |
| D1 | `worker/migrations/` | Persist slug → destination + token |
| QR image | Client (`qrcode` lib) | Render PNG/data URL from redirect URL |

**Deliberate exception:** We skip clean-architecture layering from `DEVELOPMENT_GUIDELINES.md` until complexity demands it.

---

## HTTP Routes

| Method | Path | Auth | Action |
|--------|------|------|--------|
| `POST` | `/api/qr` | None | Create dynamic QR |
| `GET` | `/q/{slug}` | None | 302 redirect to destination |
| `GET` | `/api/manage/{slug}/{token}` | Token in URL | Read current destination |
| `PUT` | `/api/manage/{slug}/{token}` | Token in URL | Update destination |

CORS enabled on `/api/*` for local Vite dev.

---

## Core Flow: Create and edit

1. `POST /api/qr` with `{ destinationUrl }`
2. Worker validates http(s) URL, generates 8-char slug + 64-char hex token
3. Insert into D1; return `redirectUrl`, `manageUrl`, `slug`
4. UI renders QR for `redirectUrl`
5. Owner visits `manageUrl` → React route loads → `GET /api/manage/...`
6. Owner submits new URL → `PUT /api/manage/...`
7. Next `GET /q/{slug}` returns 302 to new destination

---

## Data Model

**Table: `dynamic_qrs`**

| Column | Type | Description |
|--------|------|-------------|
| `slug` | TEXT PK | Public identifier in redirect URL |
| `destination_url` | TEXT | Current redirect target |
| `management_token` | TEXT | Secret; required to edit |
| `created_at` | TEXT | ISO timestamp |

Index on `(slug, management_token)` for management lookups.

---

## Configuration

| Variable | Default (local) | Purpose |
|----------|-----------------|---------|
| `BASE_URL` | `http://localhost:8787` | Origin for `/q/{slug}` in API responses |
| `FRONTEND_URL` | `http://localhost:5173` | Origin for management page links |

Set in `worker/wrangler.toml` `[vars]`. Override per environment on deploy.

---

## Security Notes

- **Management token** = 32 random bytes (hex). URL possession = edit rights.
- **No enumeration protection on slug** — acceptable for experiment; slug is unguessable enough at 8 chars from 36-char alphabet (~2.8T combinations).
- **Create endpoint unauthenticated** — acceptable for M1; rate-limit later if abused.
- **URL validation** — only `http:` and `https:` destinations accepted.

---

## Deployment Topology (future — Milestone 4)

```
User → Cloudflare Worker (API + /q redirects)
     → Cloudflare D1
     → Static assets (Vite build) served from Worker or Pages
```

Not deployed yet.

---

## Related Documents

- [docs/DECISIONS.md](DECISIONS.md)
- [PROJECT_CONTEXT.md](../PROJECT_CONTEXT.md)
- [CURRENT_STATE.md](../CURRENT_STATE.md)
