# SETT EL-HETTA — CONTENT & SEO PLAN

**Document Version:** 1.0 — Draft for Review
**Date:** July 19, 2026
**Companion documents:** PRD v1.0 · SRS v1.0 · Feature Plan v1.0 · Frontend Implementation Plan v1.0 · Backend Implementation Plan v1.0

> This plan exists to close a gap none of the other documents own: every FR that says "display product copy," "story page," or "blog article" assumes the words already exist. They don't yet. This document defines what content is needed, who produces it, in what format, and how it's optimized for discovery — so content isn't the thing that blocks launch after the engineering is done.

---

## 1. Why This Document Exists

The PRD identifies the business owner as **non-technical with limited time** (§3, Personas) and flags "inventory data is currently informal" as a launch risk (§12). The same is true of content: there is currently no structured product copy, no brand story write-up, and no blog backlog — everything today lives as scattered WhatsApp captions and Instagram posts. If content production isn't planned and assigned as deliberately as the engineering work, it becomes the actual critical path to launch, regardless of how ready the storefront and admin console are.

This plan covers two things:
1. **Content inventory** — what needs to be written/shot, for which page, by whom, and by when.
2. **SEO foundation** — how that content is structured so it's actually discoverable (PRD FR-6.4, SRS §3.6).

---

## 2. Content Ownership Matrix

| Content type | Primary owner | Support | Notes |
|---|---|---|---|
| Brand story ("our story") | Business owner (Sameh El-Abyad) | Copywriter to edit/structure | Owner's voice and history are the asset — should not be ghostwritten from scratch, only shaped. |
| Product names, descriptions, materials, dimensions | Business owner / catalog audit team | Copywriter for consistency | Feeds directly into the catalog-audit process (§4) and `Product.description` field in the backend schema. |
| Homepage hero copy, category intros | Copywriter | Business owner for approval | Short-form, benefit-led. |
| Blog articles | Copywriter | Business owner for topics/facts | Deferrable (Should, FR-1.4) — sequence after MVP-critical content. |
| Product photography/video | Photographer (existing Instagram content may be reusable) | Business owner for shot list priorities | Reuse and re-crop existing Instagram/WhatsApp assets where quality allows, to reduce net-new shoot scope. |
| Gallery ("on the wrist") imagery | Photographer | — | Distinct from product studio shots — lifestyle/use context per FR-1.3. |
| Meta titles/descriptions, alt text | Copywriter, following SEO guidelines in §6 | — | Written per-page, not templated boilerplate. |
| WhatsApp/notification message copy | Copywriter | Backend team (for variable placeholders) | Must match the tone rules in §5 and the event list in the Backend Plan §7. |

**Recommendation:** assign a single copywriter (freelance or in-house) as the point person for all written content, working directly with the business owner rather than routing through the dev team — content production and software development can run in parallel without blocking each other, but only if this handoff is explicit from the start.

---

## 3. Content Inventory by Page (mapped to FR-x.x)

| Page/Component | FR reference | Content needed | Priority |
|---|---|---|---|
| Homepage | FR-1.1 | Hero copy, 3–5 featured product picks with rationale, seasonal collection blurb, bundle offer callouts | Must |
| Our Story page | FR-1.2 | Full narrative: origin, craftsmanship process, materials philosophy (~400–800 words) | Must |
| Gallery | FR-1.3 | Curated selection of lifestyle photos/video with short captions | Must |
| Category landing copy | FR-2.1 | One short intro paragraph per category (anklets, bangles, bracelet sets, chains, layered sets) | Should |
| Product detail pages | FR-2.2 | Per-SKU: name, description (~40–80 words), material grade, dimensions, care instructions | Must — blocks catalog launch |
| Blog | FR-1.4 | 3–5 launch articles (craftsmanship stories, styling guides, material education) | Should — can follow launch |
| Contact page | FR-1.5 | Response-time expectations, WhatsApp/Instagram/Facebook link labels | Must |
| Checkout / order confirmation microcopy | FR-3.3–3.7 | Field labels, help text for Vodafone Cash proof upload, status explanations ("Pending Review" vs. "Confirmed") | Must — directly affects the payment-proof flow's clarity |
| Notification templates | Backend Plan §7 | WhatsApp/email/SMS copy for each of the 5 order events | Must |
| Legal/policy pages | Not yet covered elsewhere — see §7 | Privacy policy, terms, return/shipping policy plain-language copy | Must |

---

## 4. Product Catalog Content Audit Process

This is the content-side counterpart to the "full catalog and stock audit" risk mitigation already named in PRD §12 and SRS §8.1 — that audit produces the *numbers* (quantities, SKUs); this process produces the *words and images* attached to each SKU. Recommend running them together, one SKU at a time, rather than as separate passes:

1. **Inventory the physical catalog.** For each product: assign or confirm a SKU, take/select photos (studio + lifestyle), note material, dimensions, and current price.
2. **Draft copy per SKU.** Use a consistent template (name pattern, description structure, materials phrasing) so the catalog doesn't read as though each entry was written by a different person.
3. **Bundle mapping.** Identify which SKUs form existing bundles/sets (feeds `BundleItem` in the backend schema and FR-3.2 bundle pricing) — this is easy to get wrong retroactively, so it should happen during the audit, not after.
4. **Review pass.** Business owner approves each entry for accuracy before it's entered into the admin console.
5. **Data entry.** Either the business owner enters approved entries directly via the Admin Console (FR-4.1) once available, or the dev team performs a one-time bulk import (FR-4.3) from a spreadsheet the content team fills in.

**Recommended format for the working spreadsheet** (handed to the backend team for bulk import if needed): `SKU | Name | Category | Description | Material | Dimensions | Price | Bundle (Y/N) | Bundle Components | Photo filenames | Video filename (optional) | Stock Qty`.

---

## 5. Voice & Tone Guidelines

- **Arabic-first, conversational but premium** — matches PRD's positioning ("منصة عربية أولاً... تليق بجودة القطع المصنوعة يدويًا"). Avoid overly formal Modern Standard Arabic that feels distant from how the brand actually talks to customers on WhatsApp today; avoid slang that undercuts the "premium" positioning.
- **Craft-forward, not sales-forward.** Product copy should lead with material and construction detail (matches the Azza Fahmy reference cited in the SRS as a style benchmark), not discount language — discounting has its own dedicated UI surface (bundle pricing, promo codes) and doesn't need to live in the core description copy.
- **WhatsApp remains a relationship, not a fallback.** Any copy referencing WhatsApp (FR-1.6, FR-6.1) should read as an invitation, not an escape hatch from a broken checkout — consistent with PRD's explicit intent to preserve WhatsApp as "a first-class option," not a workaround.
- **Status/notification copy must be honest about "Pending Review."** Per the platform's core design rule (Backend Plan §2, PRD §7.3), no customer-facing copy may imply a Vodafone Cash order is confirmed before an admin has actually confirmed it. This is a hard content rule, not a style preference — it directly protects the business rule the whole payment flow is built around.

---

## 6. SEO Foundation (FR-6.4)

| Element | Approach |
|---|---|
| **Keyword research** | Arabic-language, Egypt-market keyword research for jewelry/accessory categories (e.g. "خلاخيل ستانلس ستيل", "أساور يدوي مصر") — not a direct translation of English jewelry SEO terms, which won't match how Egyptian shoppers actually search. |
| **URL structure** | Clean, slug-based per SRS FR-6.4 and the Prisma schema's `slug` fields on `Product` and `Category` — e.g. `/products/anklet-name`, `/categories/bangles`. |
| **Meta titles/descriptions** | Written per page, not auto-generated from templates alone — especially for the homepage, story page, and top category pages. |
| **Image alt text** | Required for every product image at data-entry time (extends the catalog audit template in §4 with an `alt text` column) — also directly supports accessibility (SRS NFR: Accessibility). |
| **Semantic headings** | One `H1` per page, consistent heading hierarchy — a frontend implementation detail, but the content team should write copy with heading structure in mind rather than as a single undifferentiated paragraph. |
| **Structured data** | Product schema markup (price, availability, images) — technical implementation is a frontend/backend task, but relies on the content fields (§3) being complete and accurate. |
| **Blog as an SEO channel** | Deferrable per FR-1.4's "Should" priority, but when it launches, articles should target long-tail, non-branded search terms (styling guides, material care) rather than duplicating product-page content. |

---

## 7. Legal & Policy Copy (flagged gap, not yet owned anywhere)

None of the existing documents assign ownership of these pages, but the storefront cannot ethically or legally launch without them, especially given the platform stores phone numbers, addresses, and uploaded payment-proof images (Backend Plan §9):

- **Privacy Policy** — plain-language explanation of what's collected (name, phone, address, payment-proof images) and why, referencing the retention policy still open in Backend Plan §12.
- **Terms & Conditions** — basic terms of sale.
- **Return / Exchange Policy** — especially important given COD and manual Vodafone Cash verification mean disputes will be resolved by the admin directly, not a payment processor.
- **Shipping Policy** — delivery areas, approximate timelines, and what happens if an order can't be delivered.

**Recommendation:** these can be drafted from templates and reviewed by the business owner (or, ideally, a lawyer familiar with Egyptian e-commerce/consumer-protection requirements) rather than written from scratch — but they need an explicit owner and a slot in the timeline, since they're currently unassigned in every document produced so far.

---

## 8. Sequencing Relative to Development

| Phase (per PRD §11 / Backend Plan §11) | Content deliverable due |
|---|---|
| Phase 1 — Discovery & Design | Voice/tone guidelines finalized (§5); legal policy owner assigned (§7) |
| Phase 2 — MVP Build | Catalog audit content (§4) complete and ready for data entry before admin console freeze; homepage, story, category, contact copy finalized; notification templates finalized (feeds Backend Plan's notification module) |
| Phase 3 — Beta Launch | Legal/policy pages live; first 1–2 blog articles published as a content-freshness signal for SEO |
| Phase 4 — Expansion | Ongoing blog cadence; expanded keyword targeting as catalog grows |

The single highest-risk dependency: **catalog content (§4) must be substantially done before the admin console's product-management features can be considered "launch ready,"** since an empty or copy-less catalog makes every other finished feature (search, filtering, cart, checkout) untestable end-to-end.

---

## 9. Open Questions

- Who is the copywriter — in-house, freelance, or the business owner personally? This determines the realistic timeline for §4.
- Does existing Instagram/WhatsApp content include reusable high-resolution photography, or does the catalog audit require a net-new photo shoot?
- Is there budget/appetite for professional legal review of the policy pages in §7, or should they launch as templated boilerplate with a plan to formalize later?
- Confirm whether English content is truly out of scope for MVP (per SRS §2.5, Arabic-first at launch) or whether even a minimal English version is expected for any page at launch.
