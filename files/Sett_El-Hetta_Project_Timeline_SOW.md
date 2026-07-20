# SETT EL-HETTA — PROJECT TIMELINE & STATEMENT OF WORK

**Document Version:** 1.0 — Draft for Review
**Date:** July 19, 2026
**Companion documents:** All prior planning documents (PRD, SRS, Brief, Backend/Frontend Implementation Plans, Feature Plan, Content & SEO Plan, Catalog & Data Migration Plan, Admin Manual, Design System Spec, Legal & Policy Drafts, QA & Test Plan)

> The PRD commits to "MVP delivered within 3 months of build start" (§13) and names four phases (§11), but no document breaks that into actual weeks, names dependencies between workstreams, or estimates cost/effort. This document does that — not as a rigid contract, but as the coordination layer that makes the other eleven documents actually executable against a real calendar, with the cross-team dependencies made explicit (this project has more non-engineering dependencies than most, given the content/catalog/legal workstreams that sit outside the dev team entirely).

---

## 1. How to Read This Plan

Three workstreams run in parallel, not sequentially, and the biggest schedule risk in this project isn't engineering — it's the **non-technical workstreams (content, catalog audit, legal, owner availability) becoming the bottleneck** while engineering waits on them. This plan is structured to surface that risk early rather than let it appear as a surprise in month 3.

| Workstream | Owned by | Key documents |
|---|---|---|
| **Engineering** | Dev team | Backend & Frontend Implementation Plans, Feature Plan |
| **Content & Catalog** | Business owner + content lead | Content & SEO Plan, Catalog Inventory & Data Migration Plan |
| **Business/Legal readiness** | Business owner (+ legal reviewer) | Legal & Policy Documents, Admin Manual, QA UAT |

---

## 2. Timeline — 3 Months to MVP (per PRD §13), Mapped to the Existing 4 Phases

Assumes a **12-week build window** starting once this planning stage is signed off, matching the PRD's own 3-month commitment. Weeks are relative to project start (Week 1), not calendar dates, so this can be dropped onto an actual calendar once a kickoff date is confirmed.

### Phase 1 — Discovery & Design (Weeks 1–2)
| Workstream | Activities |
|---|---|
| Engineering | Finalize schema against approved data model (Backend Plan §4); confirm hosting/DB provider (Backend Plan §12); draft OpenAPI spec v0.1 |
| Content & Catalog | Voice/tone guidelines finalized; SKU naming convention agreed (Catalog Plan §4, Step 2); begin physical stock count |
| Business/Legal | Legal reviewer identified; return-window and refund-mechanism decisions made (Legal Docs §7) — these need to happen early since they affect both policy pages and backend refund handling |
| **Design** | Figma wireframes/mockups produced against the Design System Specification's component checklist (§9 there) |

**Phase 1 exit criteria:** approved wireframes, finalized schema, hosting decision made, SKU naming agreed.

### Phase 2 — MVP Build (Weeks 3–9, the longest phase)
| Workstream | Activities |
|---|---|
| Engineering | Storefront + Admin Console build per Feature Plan modules; catalog, cart/checkout, order state machine, payment-proof review, notifications (Backend Plan §11 Phase 2 scope) |
| Content & Catalog | Full catalog content audit completed (Catalog Plan §4 Steps 1–7); **data freeze** by end of Week 8 (Catalog Plan §7) so engineering has real data to test against, not placeholders, for the final weeks of build |
| Business/Legal | Legal & policy page copy finalized (pending legal review); Admin Manual walkthrough drafted |
| QA | Unit/integration tests written continuously alongside features (QA Plan §8) |

**Critical dependency to flag explicitly:** the data freeze (Catalog Plan §7) needs to land by roughly Week 8, not Week 9, so the last week of this phase and all of Phase 3 can test against real catalog data instead of fake seed data — testing checkout, search, and bundle pricing against placeholder products hides real-world bugs that only show up with actual Arabic product names, actual photo aspect ratios, and actual pricing.

**Phase 2 exit criteria:** MVP feature-complete on staging; catalog data loaded and verified (Catalog Plan §7 Step 9); Must-priority features from PRD §6 all functional.

### Phase 3 — Beta Launch (Weeks 10–11)
| Workstream | Activities |
|---|---|
| Engineering | Load/performance testing against NFR targets; monitoring/alerting live; bug fixes from QA pass |
| QA | Full E2E and manual QA pass (QA Plan §3–§4); bug triage against severity levels |
| Business | **UAT session with business owner** (QA Plan §6) — combined with Admin Manual training walkthrough; legal/policy pages published |
| Content | First 1–2 blog articles published if ready (Content Plan §8 — deferrable, doesn't block launch) |

**Phase 3 exit criteria:** UAT sign-off obtained, zero open Blocker/Critical bugs (QA Plan §5), soft launch to existing WhatsApp/social customer base begins.

### Phase 4 — Expansion (Week 12+, ongoing)
| Workstream | Activities |
|---|---|
| Engineering | Payment gateway integration, courier API integration — per Backend Plan §11 Phase 4 |
| Business | Monitor early KPIs against PRD §4 targets (catalog coverage, store-order share, cart-to-checkout rate) |

---

## 3. Dependency Map (the part most likely to cause delay if not tracked explicitly)

```
Legal decisions (return window, refund mechanism)
        │
        ▼
Legal & policy page copy ──────────► Storefront footer/checkout links (Eng)
        │
Return/refund logic ────────────────► Admin Console return-handling UI (Eng)

Physical stock count ──► SKU assignment ──► Content copy + photos ──► Data-entry spreadsheet ──► Data freeze ──► Loaded into system ──► QA/UAT against real data

Hosting/DB decision (Eng, Phase 1) ──► Everything in Phase 2 backend build

Design mockups (Phase 1) ──► Frontend build (Phase 2) — frontend build should not start on a given screen before its mockup is approved, per Design System Spec §9
```

**The single highest-risk dependency chain in the whole project** is the catalog chain (stock count → data freeze), because it depends entirely on the business owner's time — the same constraint the PRD itself names as a risk (§12: "وقت محدود لدى صاحب العمل"). Recommend the project manager check in on catalog-audit progress weekly starting Week 3, not wait until Week 8 to discover it's behind.

---

## 4. Effort & Cost Estimate (Rough Order of Magnitude — Not a Quote)

This is a rough allocation to support budgeting conversations, not a fixed-price quote — actual numbers depend on team rates and whether any roles are filled by the business owner personally versus hired out.

| Workstream | Rough effort (person-weeks over the 12-week window) | Notes |
|---|---|---|
| Backend engineering | 8–10 person-weeks | Core module build per Backend Plan §11 |
| Frontend engineering | 8–10 person-weeks | Storefront + Admin Console, per Frontend Plan |
| Design (UI/UX) | 2–3 person-weeks | Wireframes/mockups against Design System Spec |
| Content/copywriting | 3–4 person-weeks | Spread across Phases 1–3, per Content Plan |
| Photography | 1–2 person-weeks (+ any prior Instagram assets reused) | Depends heavily on how much existing content is reusable |
| QA | 2–3 person-weeks | Concentrated in Phases 2 (late)–3 |
| Project coordination | Ongoing, ~0.25–0.5 FTE across the whole window | Given the cross-workstream dependency risk in §3, this shouldn't be informal |
| Legal review | Fixed fee, not person-weeks | One-time review of the four policy documents |

**Not included in this estimate** (per PRD/SRS explicit out-of-scope, §5.3/§8.3 respectively): payment gateway integration, courier API integration — these belong to Phase 4 budgeting, done separately once Phase 4 is scoped closer to that date.

---

## 5. Client Communication Cadence

Not specified anywhere else in the document set, and needed given the number of workstreams running in parallel:

- **Weekly check-in** (15–30 min) with the business owner during Phases 1–3 — short enough to respect their limited time (PRD §3), but frequent enough to catch the catalog/legal dependency risks in §3 before they become launch blockers.
- **Phase-end review** at the close of each phase in §2, with explicit sign-off against that phase's exit criteria — not just a status update.
- **Single point of contact** on the dev side for the business owner, so questions about content, catalog data entry, or UAT scheduling don't get lost across multiple people.

---

## 6. Open Questions

- Confirmed kickoff date, to convert the relative week numbers in §2 into calendar dates.
- Team composition — how many engineers, whether design/content/QA are in-house, freelance, or the agency's own staff — needed to sanity-check whether the effort estimate in §4 is realistic against actual headcount.
- Budget ceiling, to confirm whether the rough allocation in §4 is in range before detailed statement-of-work contracting begins.
- Confirmed legal reviewer and their expected turnaround time, since it sits on the critical path for Phase 3's policy-page publication.
