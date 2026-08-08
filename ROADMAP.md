# Roadmap

**Last reviewed:** 2026-08-08  
**Horizon:** Fast experiment — weeks, not quarters

---

## Vision

Validate that people will pay a one-time ~€4.90 for a permanent editable dynamic QR. If revenue > €0, iterate; if not, stop cheaply.

---

## Guiding Principles

1. **Speed over sophistication** — smallest credible implementation per milestone
2. **Evidence before features** — nothing from the NOT NOW list without proof
3. **Manual is fine** — no admin dashboard, no automation theater
4. **One KPI** — revenue > €0

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Done |
| 🚧 | In progress |
| 📋 | Planned |
| ⏸️ | On hold |
| ❌ | Cancelled |

---

## Milestone 1 — Core mechanism ✅

**Goal:** Prove dynamic QR redirect + edit without regenerating QR.

| Item | Status | Notes |
|------|--------|-------|
| D1 schema (slug, destination, token) | ✅ | |
| `POST /api/qr` create | ✅ | |
| `GET /q/{slug}` redirect | ✅ | |
| `GET/PUT /api/manage/{slug}/{token}` | ✅ | |
| Minimal React UI (create + manage) | ✅ | Functional only |
| Worker integration tests | ✅ | |

**Exit criteria:**

- [x] QR points to our URL, not destination directly
- [x] Redirect works to destination A
- [x] Management URL changes destination to B
- [x] Same QR redirects to B without regeneration
- [x] Human physical scan test (owner)

---

## Milestone 2 — Minimal product ✅

**Goal:** Smallest credible product a non-technical user can understand and use.

| Item | Status | Notes |
|------|--------|-------|
| Product landing + value prop | ✅ | |
| Static QR (free, client-side) | ✅ | |
| Dynamic QR result UX (3 concepts) | ✅ | Destination / QR / management link |
| QR PNG download | ✅ | |
| Management page redesign | ✅ | |
| Pricing presentation (no fake checkout) | ✅ | Static free / Dynamic €4.90 |
| Responsive polish | ✅ | Simple CSS, no UI framework |

**Exit criteria:**

- [x] Value proposition visible without reading docs
- [x] Static and dynamic flows work with download
- [x] Management workflow understandable without technical terms
- [ ] Human acceptance (owner)

---

## Milestone 3 — Monetization 📋

**Goal:** Accept one-time payment for a dynamic QR.

| Item | Status | Notes |
|------|--------|-------|
| Stripe Checkout integration | 📋 | ~€4.90 one-time |
| Gate dynamic QR creation on payment | 📋 | |
| Post-payment delivery of QR + management URL | 📋 | |

**Exit criteria:**

- [ ] Test payment completes end-to-end
- [ ] Paid user receives working dynamic QR + management link

---

## Milestone 4 — Production 📋

**Goal:** Deploy on Cloudflare for real users.

| Item | Status | Notes |
|------|--------|-------|
| Cloudflare D1 provisioning | 📋 | |
| Worker + static assets deploy | 📋 | |
| Custom domain (if needed) | 📋 | Evaluate only if required |
| Basic error monitoring | 📋 | Minimal |

---

## Milestone 5 — Distribution 📋

**Goal:** Put in front of real users and measure revenue.

| Item | Status | Notes |
|------|--------|-------|
| Launch channel(s) TBD | 📋 | |
| Measure revenue > €0 | 📋 | Primary KPI |
| Iterate or kill based on data | 📋 | |

---

## NOT NOW (explicit non-goals)

**Do not build these unless the experiment succeeds and a milestone explicitly adds them:**

- User accounts / login / OAuth
- Teams / organizations
- Subscriptions (we sell one-time, not recurring)
- Advanced analytics dashboards
- Folders, bulk QR, CSV import
- Public API
- Custom domains (unless proven necessary)
- Mobile app
- Admin back-office
- AI features
- Elaborate design system
- CI/CD pipelines
- Multi-layer clean architecture
- Scan funnels, A/B testing infrastructure

---

## Dependencies and Risks

| Risk / dependency | Impact | Mitigation |
|-------------------|--------|------------|
| Nobody pays | High | Kill fast; total sunk cost kept low |
| QR spam/abuse | Medium | Rate limit later if needed |
| Lost management URL = lost edit access | Medium | Clear UX warning; acceptable for M1 |

---

## Review Cadence

- After each milestone: update [CURRENT_STATE.md](CURRENT_STATE.md)
- After any payment attempt: record outcome in CURRENT_STATE
