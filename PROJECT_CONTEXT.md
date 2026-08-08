# Project Context

## Overview

| Field | Value |
|-------|-------|
| **Project name** | Experiment 001 — Dynamic QR |
| **One-line description** | Permanent dynamic QR codes without an expensive subscription |
| **Status** | ACTIVE (Milestone 1 complete) |
| **Primary language(s)** | TypeScript |
| **Repository** | https://github.com/ben3211/experiment-001-dynamic-qr |

## Purpose

Business experiment, not a long-term product (yet).

**Hypothesis:** People already need dynamic QR codes but dislike paying recurring subscriptions for the simple ability to keep a printed QR editable.

**Goal:** Build quickly → put in front of real users → earn the first €1.

**Positioning hypothesis:** Permanent dynamic QR codes without an expensive subscription.

**Pricing hypothesis (not implemented yet):** ~€4.90 one-time per permanent dynamic QR.

## Target Users

- Small businesses and individuals printing QR codes on physical materials
- Anyone who wants a QR destination they can change later without reprinting

## Scope

### In scope (overall experiment)

- Static QR generation (free, no account)
- Paid dynamic QR: permanent redirect URL, editable destination, private management URL, one-time payment (later), basic scan count (maybe later)

### Milestone 1 (done)

- Create dynamic QR from destination URL
- Public redirect `/q/{slug}` → stored destination
- Private management `/manage/{slug}/{token}` → edit destination
- Client-side QR encodes redirect URL, not destination directly

### Out of scope — NOT NOW

**Do not implement without explicit approval:**

- User accounts, OAuth, teams, organizations
- Subscriptions, Stripe/payments (Milestone 3)
- Advanced analytics, folders, bulk generation
- Public API, custom domains, mobile app
- Sophisticated admin dashboard, AI features, design system
- CI/CD, unnecessary architecture, speculative abstractions

Manual operations are acceptable. Features must earn their way in through evidence.

## Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Frontend | React + TypeScript + Vite | Functional UI only for M1 |
| QR generation | `qrcode` npm package | Client-side, no server rendering |
| Backend | Cloudflare Workers | Redirects + JSON API |
| Database | Cloudflare D1 | SQLite at the edge |
| Hosting (later) | Cloudflare | Not deployed yet |
| Payments (later) | Stripe Checkout | Milestone 3 |
| CI/CD | None | Deliberately deferred |

## Prerequisites

```bash
node --version   # >= 20
npm --version
```

Optional for remote deploy: Cloudflare account + `wrangler login`.

Environment variables (see `.env.example`):

| Variable | Required | Description |
|----------|----------|-------------|
| `BASE_URL` | No (worker default) | Public API/redirect origin |
| `FRONTEND_URL` | No (worker default) | Origin for management page links |

## Key Commands

```bash
# Install (from repo root, run in worker/ and web/ separately)
cd worker && npm install
cd web && npm install

# Local development
npm run dev:worker    # Worker on :8787
npm run dev:web       # UI on :5173

# Database
npm run db:migrate:local

# Tests
npm test              # Worker integration tests (Vitest + Miniflare)

# Build
npm run build:web
```

## Repository Layout

```
experiment-001-dynamic-qr/
├── web/                      # React UI
│   └── src/                  # Create page, manage page, API client
├── worker/                   # Cloudflare Worker
│   ├── src/index.ts          # Routes: /api/qr, /q/:slug, /api/manage/...
│   ├── migrations/           # D1 schema
│   └── test/                 # Vitest integration tests
├── docs/                     # Architecture, ADRs
└── [project docs]            # README, ROADMAP, CURRENT_STATE, etc.
```

## Conventions

- **Branch naming:** `feature/`, `fix/`, `chore/`
- **Default branch:** `main`
- **Speed-first:** smallest credible implementation; document exceptions to generic guidelines rather than adding layers

## Contacts and Ownership

| Role | Name | Contact |
|------|------|---------|
| Owner | Benoit | ben3211 (GitHub) |

## Related Resources

- Architecture: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Decisions: [docs/DECISIONS.md](docs/DECISIONS.md)
- Current status: [CURRENT_STATE.md](CURRENT_STATE.md)
- Roadmap: [ROADMAP.md](ROADMAP.md)
- Engineering rules: [DEVELOPMENT_GUIDELINES.md](DEVELOPMENT_GUIDELINES.md) (apply with speed-first exceptions)
