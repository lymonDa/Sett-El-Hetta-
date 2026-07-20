# SETT EL-HETTA — DESIGN SYSTEM & UI SPECIFICATION

**Document Version:** 1.0 — Draft for Review
**Date:** July 19, 2026
**Companion documents:** Platform Design Map (site map & inspiration) · Frontend Implementation Plan v1.0 · Frontend Quick Reference

> The Platform Design Map gives brand-color tokens, breakpoints, and a visual-inspiration reference (Azza Fahmy Jewellery). The Frontend Implementation Plan lists the same tokens under "Design Tokens" and names Headless UI + Tailwind as the component approach. Neither document specifies the actual components, states, and interaction patterns a developer needs to build a consistent interface — that gap is what causes a storefront to end up looking like it was assembled by three different people. This document is that missing layer: a components-and-states specification, not new visual exploration. It does not replace actual Figma mockups (still recommended, see §9) — it defines what those mockups need to contain.

---

## 1. Foundation (carried from existing docs — repeated here for a single source of truth)

### Color tokens
```
--color-primary-gold:   #FF9C1F
--color-secondary-sand: #CCBBA0
--color-success:        #10B981
--color-error:          #EF4444
--color-warning:        #F59E0B
```
**Gap identified:** no neutral/grayscale scale or a background/surface/text-color set is defined anywhere yet. Recommend adding, at minimum: a background color, a surface/card color, primary/secondary text colors, and a border color — every UI component below depends on these existing before build starts.

### Typography
```
Font family: Cairo, Tajawal (Arabic-first)
Sizes: xs (0.75rem) → 4xl (2.25rem)
Line height: 1.5 (base)
```
**Gap identified:** no defined type scale mapping (which size is a product name vs. a body paragraph vs. a section heading), and no font-weight scale. Recommend a scale such as: Display / H1 / H2 / H3 / Body / Small / Caption, each with a fixed size+weight+line-height pairing, so "heading" isn't reinvented per page.

### Spacing & breakpoints
Carried directly from the Frontend Quick Reference — no changes needed:
```
Mobile: 320–479px · Tablet: 480–767px · Desktop: 768–1024px · Wide: 1025px+
Spacing scale: xs 0.5rem – xl 3rem (Tailwind p-2 → p-12)
```

### Visual direction
Per the Design Map (§02): clean lines, generous white space, large photography-led layouts, minimal but confident typography — inspired by Azza Fahmy Jewellery's structural approach, adapted with Sett El-Hetta's own material story (stainless steel / gold-plated craftsmanship) rather than copied wholesale.

---

## 2. Component Inventory

This is the list a developer should be able to check off against Storybook (already planned per the Frontend Quick Reference's tooling table) before any page is considered "built." Grouped by where they're used.

### Global / Shared (`packages/ui`)
- Button (primary, secondary, ghost, disabled, loading states)
- Input field (text, phone, textarea) with label, helper text, and error states
- Select / Dropdown
- Modal / Dialog
- Alert / Toast (success, error, warning, info — maps to the 4 status colors already defined)
- Badge / Tag (used for stock status and order status — see §4)
- Card
- Skeleton loader (for image/content loading states)
- Empty state (used repeatedly — see §5)
- Breadcrumb
- Pagination

### Storefront-specific
- Product Card (image, name, price, stock badge, quick-add)
- Product Gallery / image carousel with zoom
- Category filter panel (checkboxes/chips for category, price range, material — FR-2.4)
- Cart drawer/page line item
- Checkout step indicator
- Payment method selector (COD vs. Vodafone Cash — needs a clear visual distinction since this choice drives very different next steps)
- Vodafone Cash proof-upload widget (file picker + preview + upload progress + validation error state)
- Order status tracker (visual timeline: Pending Review → Confirmed → Shipped → Delivered, with Rejected/Cancelled as distinct branch states)
- "Order via WhatsApp" floating/sticky button (FR-1.6 — needs to be visible at every scroll position per the requirement's own wording)

### Admin-specific
- Data table (sortable, filterable — used for products, orders, inventory logs)
- Order detail panel (payment-proof full-size image viewer is a distinct component, not a generic image tag, since it needs zoom/full-screen for verification per FR-5.3)
- Confirm/Reject action buttons with required-note pattern (reject requires a note; confirm does not — this distinction should be enforced in the component, not just the API)
- Stock quantity inline editor
- Role badge (Owner / Staff / Delivery Coordinator)
- Sales report chart components (best-sellers, revenue by category — can reuse a charting library already compatible with the React 18 stack)

---

## 3. Critical UI Pattern: Pending Review vs. Confirmed

This deserves its own section because it is the single UI distinction the entire project brief calls "the most consequential design decision" (PRD §7) — a generic status badge is not sufficient here.

**Requirement, restated for design:** "Pending Review" and "Confirmed" must be *visually unmistakable from each other* in both the customer-facing order tracker and the admin order list — not just different label text in the same style. Recommend:

| Status | Suggested treatment |
|---|---|
| Pending Review | Warning-amber badge/background, an explicit icon (e.g. clock/hourglass), and copy that says what's actually happening ("We're reviewing your payment") — never a checkmark or anything that visually reads as "done." |
| Confirmed | Success-green badge, checkmark icon |
| Rejected | Error-red badge, with the admin's note surfaced directly under it, not hidden behind a click |
| Shipped / Delivered | Distinct icons progressing along the same order tracker component |
| Cancelled | Neutral/muted treatment, distinct from Rejected (cancelled ≠ something went wrong; rejected = payment issue) |

This table should be treated as a binding constraint on whatever visual design is produced next (Figma mockups, §9) — the design system doesn't dictate exact colors beyond what's already tokenized, but it does dictate that these five states must remain visually distinguishable at a glance, including for a customer scanning quickly on a small mobile screen (per NFR: Accessibility, sufficient color contrast).

---

## 4. States Every Component Needs (not just the "happy path")

The existing documents describe components in their default state only. Each component in §2 should be designed and built with these states in mind — most UI inconsistency comes from these being improvised ad hoc per page instead of specified once:

- **Loading** (skeleton, not just a spinner, for content-heavy areas like product grids)
- **Empty** (no products in this category, empty cart, no orders yet, no search results — each needs distinct, on-brand copy, not one generic "nothing here" message)
- **Error** (failed to load, failed to submit — with a retry action where applicable)
- **Disabled** (e.g. "Add to Cart" when out of stock)
- **Success** (order submitted confirmation, payment-proof upload success)

---

## 5. Empty States — Specific Copy Needs (handoff to Content Plan)

Each of these needs actual copy (owned per the Content & SEO Plan's ownership matrix), not placeholder text at launch:

- Empty cart
- No search results for a query
- No products in a filtered category combination
- Customer has no order history yet (registered accounts)
- Admin: no orders pending review ("You're all caught up" — should feel positive, not blank)
- Admin: no low-stock alerts

---

## 6. RTL-Specific Design Considerations

Beyond "the layout mirrors" (already implied by the Arabic-first requirement across every document), a few patterns need explicit design decisions rather than being left to whatever the mirroring does automatically:

- **Icons with inherent direction** (arrows, back/forward, the order-status timeline's progression direction) need RTL-aware variants — a forward arrow shouldn't literally point right in an RTL layout.
- **Numbers and prices** — Arabic numerals vs. Eastern Arabic numerals is a decision the design system should make explicitly once, not leave to each page.
- **Mixed content** — product names or SKUs that include Latin characters/numbers within Arabic text need a defined text-direction handling rule so they don't render awkwardly mid-sentence.
- **Form field alignment** — inputs, labels, and validation-error placement all need to be confirmed in RTL, not just assumed to mirror correctly from an LTR pattern library.

---

## 7. Accessibility Baseline (NFR requirement, currently unspecified beyond "legible typography, sufficient contrast")

- Minimum tap target size: 44×44px, consistent with the "touch-friendly" NFR already stated.
- Color contrast: WCAG AA minimum (4.5:1 for body text) — should be checked against the final gold/sand palette specifically, since warm, light palettes are a common place contrast fails silently.
- All interactive components in §2 need visible keyboard focus states — not just mouse/touch states, per the Frontend Quick Reference's own deployment checklist ("Accessibility tested: keyboard nav, screen reader").
- Form errors (checkout, payment-proof upload, contact form) need to be announced accessibly, not conveyed by color alone.

---

## 8. What This Document Does Not Cover

- Exact pixel-level layouts per page — that's the job of actual Figma wireframes/mockups (§9).
- Photography direction/art direction — covered in the Content & SEO Plan.
- Illustration or iconography style beyond noting that icons need RTL-aware variants (§6) — a decision for whoever executes the visual design.

---

## 9. Recommended Next Step: Actual Visual Mockups

This document defines *what* needs to exist and in *what states* — it deliberately does not replace real high-fidelity mockups. Recommend producing Figma (or equivalent) wireframes and mockups for the following screens before frontend build begins, using this document as the component/state checklist:

- Homepage
- Category listing + filter panel
- Product detail page
- Cart + checkout flow (all steps, including both payment-method paths)
- Order tracking page (all five status states from §3)
- Admin: order list + order detail with payment-proof review
- Admin: product list + add/edit product form

This keeps the actual visual design work (color application beyond tokens, exact spacing/composition, imagery treatment) in a dedicated design tool where it belongs, while this document ensures nothing gets improvised mid-build for lack of a spec to follow.
