# Roadmap

**Last reviewed:** 2026-09-13  
**Experiment status:** **STOPPED / KILLED** (closed after Milestone 3)

---

## Vision (original)

Validate that people will pay a one-time ~€4.90 for a permanent editable dynamic QR. If revenue > €0, iterate; if not, stop cheaply.

**Outcome:** Stopped before production. Hypothesis not pursued to real customers. Market deemed too commoditized for this generic offer.

---

## Guiding Principles (unchanged — for reference)

1. **Speed over sophistication**
2. **Evidence before features**
3. **Manual is fine**
4. **One KPI** — revenue > €0 (never measured with real payments)

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Done |
| 🚧 | In progress |
| 📋 | Planned |
| ⏸️ | On hold |
| ❌ | Cancelled / not pursued |

---

## Milestone 1 — Core mechanism ✅

**Goal:** Prove dynamic QR redirect + edit without regenerating QR.

**Result:** Completed and accepted.

---

## Milestone 2 — Minimal product ✅

**Goal:** Smallest credible product a non-technical user can understand and use.

**Result:** Completed and accepted.

---

## Milestone 3 — Monetization ✅

**Goal:** Accept one-time €4.90 payment for a dynamic QR.

**Result:** Completed. Stripe Sandbox checkout → payment → QR delivery → redirect → management edit verified locally. No live/production payments.

---

## Milestone 4 — Production ❌

**Goal:** Deploy on Cloudflare for real users.

**Status:** **Not pursued** — experiment killed before this milestone.

---

## Milestone 5 — Distribution ❌

**Goal:** Put in front of real users and measure revenue.

**Status:** **Not pursued** — no domain, no production launch, no real customer payments.

---

## Lessons learned (experiment closure)

1. **Cursor can autonomously build a complete small product** from repo setup through Stripe integration.
2. **ChatGPT → Cursor** was an effective workflow; it avoided manual code-copying.
3. **Working software ≠ viable business.** Validate competition and differentiation **early**.
4. **Commoditized markets** (free dynamic QR from many vendors) undermine a generic €4.90 one-time pitch without a sharper wedge.
5. **Process improvement for future experiments:** research **competition, pricing, and distribution** before building payment infrastructure when the risk is market fit, not technical feasibility.

---

## NOT NOW (permanent for this repo)

All items below remain out of scope unless this repository is forked for a **new** experiment with a validated hypothesis:

- Production deployment, custom domain, real-money launch
- Accounts, subscriptions, analytics dashboards, API, etc. (see original NOT NOW list in git history)

---

## Dependencies and Risks (retrospective)

| Risk | What happened |
|------|----------------|
| Nobody pays | Not tested in production; stopped on market grounds first |
| Commoditized offer | **Primary kill reason** — insufficient differentiation vs free alternatives |
| Over-building before validation | Payment stack built before competitive position was strong enough |

---

## Review Cadence

**No further roadmap reviews.** This document is frozen as Experiment 001 evidence.
