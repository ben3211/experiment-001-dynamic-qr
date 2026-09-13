# Current State

**Last updated:** 2026-09-13  
**Last verified by:** Owner / Agent  
**Status:** **STOPPED / KILLED**  
**Environment:** Local dev only; never deployed to production

---

## Summary

Experiment 001 is **closed** after Milestone 3. Milestones 1–3 were successfully completed: the core dynamic QR mechanism worked, the minimal product UI shipped, and the Stripe Sandbox payment → provisioning → management flow worked end-to-end locally.

Production deployment (Milestone 4) was **intentionally not pursued**. No domain was purchased and **no real customer payments** were accepted (Stripe test mode only).

**Why stopped:** The generic dynamic-QR market is highly commoditized. Multiple competitors offer free dynamic/editable QR codes, so a €4.90 one-time generic offer was **insufficiently differentiated**.

**Main lesson:** Technical execution was fast and successful, but **market attractiveness should be validated earlier** — before completing several implementation milestones (including payment infrastructure).

---

## Experiment outcome

| Item | Result |
|------|--------|
| Milestone 1 — Core mechanism | ✅ Completed & accepted |
| Milestone 2 — Minimal product | ✅ Completed & accepted |
| Milestone 3 — Monetization (Stripe) | ✅ Completed (Sandbox E2E verified) |
| Milestone 4 — Production | ❌ Not pursued |
| Milestone 5 — Distribution | ❌ Not pursued |
| Revenue > €0 (real money) | ❌ Not attempted (no production launch) |
| Repository / code | ✅ Preserved as reference |

---

## What Works (historical — local dev)

| Area | Status | Notes |
|------|--------|-------|
| Dynamic QR redirect + edit | ✅ | Same QR, new destination |
| Static QR (free, client-side) | ✅ | No backend |
| Stripe Checkout + fulfillment | ✅ | Sandbox; unpaid path blocked |
| Management via private URL | ✅ | No accounts |
| Worker tests | ✅ | 6/6 at last run |

This codebase remains runnable locally for reference; it is not an active product.

---

## In Progress

None. Experiment closed.

---

## Lessons learned

1. **Cursor can autonomously build a complete small product** — from repository setup through Stripe integration — with minimal manual file editing.
2. **ChatGPT → Cursor workflow worked well** and avoided manual code-copying between tools.
3. **A working product is not enough.** Competitive research should happen **before** deep implementation, not after Milestone 3.
4. **Existing demand ≠ attractive entry opportunity.** Many players already offer free dynamic/editable QR; subscription fatigue alone did not justify a weakly differentiated one-time price.
5. **For future experiments:** validate **competition, pricing, and distribution** early — ideally **before** implementing payment infrastructure where possible.

---

## Recent Changes

| Date | Change | Author |
|------|--------|--------|
| 2026-09-13 | Experiment stopped; documentation closed | Owner / Agent |
| 2026-08-09 | Stripe checkout fix (Managed Payments); Sandbox E2E verified | Agent |
| 2026-08-08 | Milestone 3: Stripe Checkout | Agent |
| 2026-08-08 | Milestones 1–2 accepted | Owner |

---

## Next Steps

**None.** Do not extend this experiment unless explicitly restarted as a new hypothesis with prior market validation.

For historical local run instructions, see [README.md](README.md).
