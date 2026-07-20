# SETT EL-HETTA — QA & TEST PLAN

**Document Version:** 1.0 — Draft for Review
**Date:** July 19, 2026
**Companion documents:** PRD v1.0 · SRS v1.0 · Backend Implementation Plan v1.0 (§8) · Frontend Implementation Plan v1.0

> The Backend Implementation Plan (§8) and Frontend Implementation Plan both mention testing at the engineering level (unit/integration coverage targets, CI pipelines). Neither answers the questions a client or QA lead actually needs answered before sign-off: what gets tested end-to-end, who tests it, against what pass/fail criteria, and — critically — who does User Acceptance Testing given the business owner is non-technical (PRD §3). This plan is that layer: it turns the PRD's own success criteria (§13: "≥95% test pass rate," "MVP delivered with all Must features working") into an actual test plan someone can execute and sign off against.

---

## 1. Test Levels & Ownership

| Level | Who runs it | What it covers |
|---|---|---|
| Unit tests | Dev team (per-PR, in CI) | Individual functions/components — already scoped in Backend Plan §8 and the frontend's Vitest setup. |
| Integration tests | Dev team (per-PR/nightly, in CI) | Cross-module flows (checkout → order creation → notification), API contract checks. |
| End-to-end (E2E) tests | Dev team, automated (Playwright, per Frontend Quick Reference tooling) | Full user journeys through the actual UI — see §3. |
| Manual QA | QA lead or a dedicated team member | Exploratory testing, edge cases automation misses, visual/RTL correctness. |
| User Acceptance Testing (UAT) | **Business owner**, guided | Confirms the system actually does what the business needs — see §6, this is the step most likely to be skipped without a plan. |

---

## 2. Test Environment Strategy

Aligned with the Frontend Implementation Plan's deploy pipeline (develop → staging → production):

| Environment | Purpose | Data |
|---|---|---|
| Local | Developer testing during build | Seeded fake data |
| Staging | QA, E2E automation, UAT | Anonymized copy of production-shaped data, or the real catalog once loaded (per Catalog Inventory & Data Migration Plan) — never real customer PII |
| Production | Live | Real data — smoke tests only, no destructive testing |

**Rule:** payment-proof image uploads and order creation should never be load/stress-tested against a real WhatsApp/SMS/email provider account in staging — use provider sandbox modes or mocked notification channels (per Backend Plan §7's abstraction layer) to avoid sending fake order confirmations to real phone numbers.

---

## 3. Critical End-to-End Test Scenarios

These map directly to the PRD's own "aهم قرار تصميمي" (most consequential design decision) and should be the highest-priority, most-repeated tests in the suite — not just one test case among many.

### 3.1 Order & Payment Flow (highest priority — test every branch)
- [ ] Guest places a COD order → order created with status `Pending Review`, never `Confirmed`.
- [ ] Guest places a Vodafone Cash order **without** uploading a proof image → order creation is blocked (per Backend Plan §5.2, this should be a hard `400`, not a soft warning).
- [ ] Guest places a Vodafone Cash order **with** a proof image → order created as `Pending Review`, proof attached and visible to admin.
- [ ] Admin confirms a COD order → status becomes `Confirmed`, customer notified.
- [ ] Admin attempts to confirm a Vodafone Cash order **without opening/reviewing the proof** → this exact scenario is what the Backend Plan's state machine is designed to make impossible; verify the UI doesn't offer a "confirm" action that bypasses viewing the image, and that a direct API call attempting this is rejected.
- [ ] Admin confirms a Vodafone Cash order after viewing proof → status becomes `Confirmed`.
- [ ] Admin rejects a Vodafone Cash order with a reason → status becomes `Rejected`, customer notified with the reason.
- [ ] Attempting any disallowed status transition (per Backend Plan §5.7's table, e.g. `Delivered → Pending Review`) → rejected with `409`.
- [ ] Order status progression: `Confirmed → Shipped → Delivered`, each step notifying the customer.
- [ ] Order cancellation at each valid stage (before shipping).
- [ ] **Visual check, not just functional:** "Pending Review" and "Confirmed" are visually unmistakable from each other in both the customer order-tracker and the admin order list (per Design System Specification §3) — this needs a human/visual QA pass, not just an automated status-field assertion.

### 3.2 Inventory & Stock
- [ ] Placing an order reduces stock by the ordered quantity immediately (reservation model per Backend Plan §6).
- [ ] Rejecting or cancelling an order restores the reserved stock.
- [ ] **Concurrency test:** two near-simultaneous orders for the last unit of a low-stock item — only one should succeed; the other should see accurate "out of stock" feedback, not a false success.
- [ ] Manual stock adjustment by admin is logged in the inventory history with a reason.
- [ ] Low-stock alert triggers at the configured threshold.

### 3.3 Catalog & Discovery
- [ ] Category browsing returns only products in that category, correctly excluding retired products.
- [ ] Search returns relevant results for Arabic-language keyword queries — including partial matches and common misspellings, given this is a real-world usage pattern, not just exact-match testing.
- [ ] Filtering by category, price range, and material (combined, not just individually) returns correct results.
- [ ] Bundle pricing calculates correctly when a qualifying combination is in the cart, and stops applying when it's removed.
- [ ] Stock-status badges (`in_stock` / `low_stock` / `out_of_stock`) reflect the live admin-set thresholds, not a hardcoded frontend assumption.

### 3.4 Admin Console Access Control
- [ ] Owner role can access every admin function.
- [ ] Staff role is blocked from user-management functions.
- [ ] Delivery Coordinator role can update shipping status only, and specifically **cannot** view payment-proof images or confirm/reject payments — this is a security-relevant boundary, not just a UI convenience, and deserves a direct negative test (attempt the action, confirm it's rejected server-side, not just hidden in the UI).

### 3.5 Notifications
- [ ] Each of the 5 order events (submitted, confirmed, rejected, shipped, delivered) fires the correct notification with correct content.
- [ ] Notification copy for "submitted" never implies confirmation (cross-check against the Content & SEO Plan §5's explicit rule on this).
- [ ] A slow/failing notification provider does not block the admin's confirm/reject action (per Backend Plan §7's async queue design) — verify the order status updates successfully even if the notification send fails, and that the failure is logged/retried rather than silently dropped.

---

## 4. Cross-Cutting / Non-Functional Test Coverage

Directly against the NFR table in SRS §5:

| NFR | Test approach |
|---|---|
| Performance (sub-3s on 4G) | Lighthouse audits on staging, throttled to simulated 4G, on homepage/catalog/product/checkout pages specifically (already listed in the Frontend Quick Reference's deployment checklist — this plan just confirms it's tracked as a formal pass/fail gate, not an informal check). |
| Responsiveness | Manual pass across the four defined breakpoints (320–479 / 480–767 / 768–1024 / 1025+), on real devices where possible, not only browser emulation. |
| Security | HTTPS enforced everywhere; payment-proof images inaccessible without admin auth (attempt direct URL access while logged out — should fail); rate limiting verified on `POST /orders`, `POST /media/payment-proof`, `POST /contact`. |
| RTL correctness | Manual visual QA pass specifically for the issues flagged in Design System Spec §6 — directional icons, mixed Arabic/Latin text, form field alignment. |
| Accessibility | Keyboard navigation through checkout and admin order-review flow; screen-reader pass on the payment-proof review screen specifically, since it's the highest-stakes admin action. |
| Auditability | Every order status change and payment confirm/reject produces an `OrderStatusEvent` row with the correct actor and timestamp — verify this is written even when the action is taken quickly in succession (no race condition dropping an event). |

---

## 5. Bug Severity & Exit Criteria

| Severity | Definition | Launch gate |
|---|---|---|
| **Blocker** | Breaks the order/payment state machine, allows an unconfirmed order to appear confirmed, allows data loss, or breaks checkout entirely | Zero tolerance — must be fixed before launch |
| **Critical** | Major feature broken but with a workaround (e.g. bulk media upload fails but single upload works) | Must be fixed or explicitly accepted by the business owner before launch |
| **Major** | Feature works but with significant friction or an incorrect-but-non-destructive result | Fix before launch if feasible; otherwise logged for Phase 3/4 |
| **Minor** | Cosmetic, copy, or edge-case issues with no functional impact | Can ship and fix post-launch |

**Launch exit criteria** (derived from PRD §13): ≥95% of test cases passing, zero open Blocker or Critical bugs in the order/payment/inventory flows specifically, Lighthouse score ≥90, and a completed UAT sign-off (§6) from the business owner.

---

## 6. User Acceptance Testing (UAT) — the step most at risk of being skipped

Given the business owner is non-technical and time-constrained (PRD §3), UAT needs to be structured, not left as an open-ended "take a look and let us know" request — that format reliably produces either silence or superficial feedback from a busy, non-technical stakeholder.

**Recommended UAT format:**
1. Guided session (not a document to review alone), ideally the same session as the Admin Manual training walkthrough (per Admin User Manual §13) — reviewing payment proofs and confirming/rejecting an order is both a training moment and the single most important UAT scenario.
2. A short, concrete script of 8–10 tasks for the owner to actually perform themselves on staging: place a test order as a guest, review and confirm a Vodafone Cash proof, reject one with a note, add a product, adjust stock, check a low-stock alert. Watching them do it themselves surfaces friction that a demo doesn't.
3. A simple sign-off form: pass/fail per task, plus open comments — kept short enough that it doesn't become its own burden.
4. UAT sign-off is a named exit criterion for launch (§5), not an informal nice-to-have — this is what "رضا العميل: موافقة رسمية" in PRD §13 should actually mean in practice.

---

## 7. Test Data Requirements

- A realistic (but not necessarily complete) subset of the real catalog, once available from the Catalog Inventory & Data Migration Plan — testing against obviously fake placeholder products misses real-world issues (long Arabic product names wrapping oddly, actual photo aspect ratios, real price values).
- At least one product deliberately set to low stock and one to zero stock, to exercise the stock-status and alert logic.
- At least one configured bundle, to exercise bundle pricing.
- Test accounts for each admin role (Owner, Staff, Delivery Coordinator).
- Sample Vodafone Cash proof images, including at least one deliberately invalid one (wrong amount, blurry), to test the rejection path realistically rather than only the happy path.

---

## 8. Timeline Placement

Aligned to the phases already defined across the PRD, Backend Plan, and Content Plan:

| Phase | QA activity |
|---|---|
| Phase 2 — MVP Build | Unit/integration tests written alongside features (dev-owned, continuous); test environment and test data (§2, §7) prepared in parallel |
| Phase 2 (late) / Phase 3 (early) | Full E2E and manual QA pass against §3–§4; bug triage against severity levels (§5) |
| Phase 3 — Beta Launch | UAT session with business owner (§6); exit-criteria review; go/no-go decision |
| Phase 4 — Expansion | Regression suite re-run before each new integration (payment gateway, courier API) to confirm the existing order/payment state machine still behaves correctly with new code around it |
