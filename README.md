# Experiment 001 — Dynamic QR

Fast business experiment: prove people will pay a one-time fee (~€4.90) for a **permanent editable dynamic QR** instead of a recurring subscription.

**Primary KPI:** revenue > €0.

**Repository:** https://github.com/ben3211/experiment-001-dynamic-qr

---

## Current status

**Milestone 2 complete** — minimal product UI with static (free) and dynamic QR flows.

Open http://localhost:5173 (requires `npm run dev:web` + `npm run dev:worker`).

---

## Stack (intentionally minimal)

| Layer | Choice |
|-------|--------|
| Frontend | React + TypeScript + Vite |
| QR generation | `qrcode` (client-side) |
| Backend / redirects | Cloudflare Workers |
| Database | Cloudflare D1 |
| Payments (later) | Stripe Checkout |
| Hosting (later) | Cloudflare |

---

## Local development

Prerequisites: Node.js 20+, npm.

```bash
# Terminal 1 — API + redirects (port 8787)
npm run dev:worker

# Terminal 2 — UI (port 5173, proxies /api and /q to worker)
npm run dev:web
```

Open http://localhost:5173

Apply D1 migrations locally (first time or after schema changes):

```bash
npm run db:migrate:local
```

Run worker tests:

```bash
npm test
```

---

## Repository layout

```
.
├── web/                 # React UI (create + manage pages)
├── worker/              # Cloudflare Worker + D1 migrations + tests
├── docs/                # Architecture and ADRs
├── PROJECT_CONTEXT.md   # Experiment scope and commands
├── CURRENT_STATE.md     # What works today
└── ROADMAP.md           # Milestones 1–5
```

---

## NOT NOW (do not build without evidence)

No user accounts, OAuth, teams, subscriptions, advanced analytics, bulk QR, public API, custom domains, mobile app, admin dashboard, AI features, elaborate design, or unnecessary architecture.

See [ROADMAP.md](ROADMAP.md) and [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md).

---

## Development philosophy

Speed and learning beat engineering sophistication for this experiment. `DEVELOPMENT_GUIDELINES.md` applies where it helps; where it conflicts with speed-first delivery, we document the exception instead of adding complexity.

---

## Related documents

- [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md)
- [CURRENT_STATE.md](CURRENT_STATE.md)
- [ROADMAP.md](ROADMAP.md)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/DECISIONS.md](docs/DECISIONS.md)
