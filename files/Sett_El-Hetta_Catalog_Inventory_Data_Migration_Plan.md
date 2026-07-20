# SETT EL-HETTA — CATALOG INVENTORY & DATA MIGRATION PLAN

**Document Version:** 1.0 — Draft for Review
**Date:** July 19, 2026
**Companion documents:** PRD v1.0 · SRS v1.0 · Backend Implementation Plan v1.0 · Content & SEO Plan v1.0

> The PRD names this directly as a launch risk: *"بيانات المخزون غير منظمة حاليًا"* (PRD §12) and the SRS repeats it as Risk #2 (§8.1), with the same mitigation both times — "conduct a full catalog and stock audit prior to launch." Neither document says how. This plan is that "how": a concrete, step-by-step process for turning today's scattered WhatsApp/Instagram catalog into clean, structured data loaded into the production database — without which the admin console, search, filtering, cart, and checkout all have nothing real to operate on.

---

## 1. Why This Is Its Own Plan

Every functional requirement that touches products (FR-2.x catalog browsing, FR-3.x cart/checkout, FR-4.x admin catalog management) assumes accurate, structured product data already exists in the system. Today it doesn't — it exists as informal knowledge, physical stock, and scattered social posts. This is not a coding task; it's an operations task that happens to feed the database, and it has its own timeline, its own owner, and its own failure modes (undercounted stock, duplicate SKUs, mismatched bundle components) that no amount of good backend engineering can fix after the fact.

This plan is the execution companion to:
- **Content & SEO Plan §4** (Product Catalog Content Audit Process) — which covers the *copy and photography* side.
- **Backend Implementation Plan §4** (Data Model) — which defines the *schema* this data must conform to.

Where those two describe the "what," this plan describes the "how" and "in what order."

---

## 2. Scope

Every physical product currently sold or offered by Sett El-Hetta, across all categories named in PRD §6.2 (anklets, bangles, bracelet sets, chains, layered/multi-tier sets, bundles), needs to end up as one clean row in the `Product` table (Backend Plan §4) with:

- A unique, permanent SKU
- A category assignment
- Accurate stock quantity
- Complete descriptive copy (owned by the Content Plan, §4 there)
- At least one usable photo
- A price
- Bundle composition, if applicable (`BundleItem` records)

Anything not meeting all of the above by the data-freeze date (§7) does not go live at launch — a smaller, fully accurate catalog is a better launch state than a larger, partially wrong one, given the PRD's own KPI target of "100% of active SKUs listed" (PRD §4) implicitly assumes the SKUs it's measuring against are themselves correct.

---

## 3. Roles & Responsibilities

| Role | Responsibility |
|---|---|
| **Business owner (Sameh El-Abyad)** | Final source of truth on stock counts, pricing, and bundle composition; physically counts/verifies inventory; approves each catalog entry before it's entered. |
| **Content lead** (per Content & SEO Plan §2) | Drafts product copy and organizes photography per SKU. |
| **Data-entry coordinator** (can be the same person as content lead, or a dev-team member for the initial bulk load) | Owns the working spreadsheet (§5), checks for duplicates/gaps, and either enters data via the Admin Console or hands off a clean file for bulk import. |
| **Backend team** | Provides the bulk-import path (`POST /admin/products` in bulk, or a one-time CSV import script) so the coordinator isn't forced to hand-enter hundreds of SKUs one at a time through the UI before it's fully built. |

---

## 4. Process — Step by Step

### Step 1: Physical Stock Count
Walk the actual inventory (workshop/storage) and count every distinct item. This is the moment to catch the exact problem the PRD flags as a risk — informal tracking that could lead to selling something that's actually out of stock. Record raw counts before anything else happens.

### Step 2: SKU Assignment
Assign a permanent SKU to each distinct product. Recommend a simple, human-readable scheme rather than an opaque code, e.g. `CATEGORY-SHORTNAME-VARIANT` (e.g. `ANK-MOON-GLD` for a gold-plated moon-charm anklet) — the business owner will be reading these SKUs in the Admin Console daily (per PRD persona: limited time, non-technical), so they should be recognizable at a glance, not just unique.

**Rule:** once assigned, a SKU is never reused for a different product, even after that product is retired — this matters because `OrderItem` records reference products historically (Backend Plan §4), and reusing a SKU would corrupt historical order data.

### Step 3: Category & Bundle Mapping
For each SKU: assign it to exactly one primary category (from the fixed list in PRD §6.2), and separately flag whether it's a standalone item or part of a bundle/set. For bundles, list every component SKU and the quantity of each — this maps directly to the `BundleItem` table and is the input the bundle-discount pricing logic (FR-3.2) depends on. Getting this wrong doesn't just mislabel a product — it silently breaks pricing at checkout, so it deserves a second pass of verification, not a single pass.

### Step 4: Pricing Confirmation
Confirm current selling price per SKU, and separately note which SKUs are part of any existing seasonal/bundle discount so that data feeds the `Promotion` records (Backend Plan §4), not just the base `Product.price`.

### Step 5: Copy & Photography (handoff to Content Plan §4)
Runs in parallel with Steps 1–4 where possible — the content lead drafts descriptions and organizes photos against the SKU list as it's finalized, rather than waiting for the entire catalog to be counted first.

### Step 6: Assemble the Master Spreadsheet
Consolidate everything into one working file (template in §5) — this becomes the single source of truth handed to either the Admin Console (manual entry) or the backend team (bulk import).

### Step 7: Review & Sign-off
Business owner reviews the complete spreadsheet end-to-end — every SKU, price, quantity, and bundle mapping — before any of it is loaded into the production database. This is the last point at which errors are cheap to fix; once orders start referencing these SKUs, corrections get harder.

### Step 8: Load into the System
Either:
- **(a) Manual entry** via `POST /admin/products` through the Admin Console, one SKU at a time, once that feature is built — appropriate for smaller catalogs or as a way to have the owner get comfortable with the console before launch, or
- **(b) Bulk import** — the backend team writes a one-time script (or exposes a bulk-upload endpoint per FR-4.3, "Should" priority) that ingests the finalized spreadsheet directly into `Product`, `ProductMedia`, and `BundleItem` tables. Recommended if the catalog is large enough that manual entry would meaningfully delay launch.

### Step 9: Post-Load Verification
Spot-check a sample of loaded products against the source spreadsheet (name, price, stock, category, images rendering correctly, bundle pricing calculating correctly in a test cart) before removing "staging" status and going live.

---

## 5. Master Spreadsheet Template

One row per SKU. This is the same structure referenced in Content & SEO Plan §4, repeated here as the canonical version:

| Column | Notes |
|---|---|
| `SKU` | Permanent, human-readable, never reused |
| `Name` | Customer-facing product name |
| `Category` | One of the fixed PRD §6.2 categories |
| `Description` | From Content Plan process |
| `Material` | e.g. "Stainless steel, 18k gold-plated" |
| `Dimensions` | Size/length as applicable |
| `Price (EGP)` | Current selling price |
| `Is Bundle (Y/N)` | |
| `Bundle Components` | SKU + quantity pairs, if applicable |
| `Stock Quantity` | From physical count |
| `Photo filenames` | Reference to files in the shared media folder |
| `Video filename` | Optional |
| `Alt text` | Per Content & SEO Plan §6, SEO/accessibility requirement |
| `Status` | Active / Retired |
| `Reviewed by owner (Y/N)` | Sign-off tracking per Step 7 |

---

## 6. Handling Common Data Problems

| Problem | How to resolve it |
|---|---|
| **Two products that look similar but aren't identical** (e.g. slight variant in charm design) | Treat as separate SKUs, not one SKU with an ambiguous description — ambiguity here becomes an unfixable customer-support problem post-launch. |
| **A product currently sold only as part of informal, ad-hoc bundles on WhatsApp** | Decide explicitly whether it becomes a formal bundle (`BundleItem` mapping) or reverts to being sold standalone only — don't carry over ad-hoc, undocumented bundle logic into the structured system. |
| **Stock count doesn't match what's been recently sold/reserved on WhatsApp** | Reconcile before go-live — any order still "in flight" over WhatsApp at the cutover point should be accounted for in the opening stock count, not double-counted as available. |
| **A product with no usable photo** | Either schedule it for the photo shoot (Content Plan §2) before its data-entry date, or explicitly exclude it from the initial launch catalog rather than publishing it without imagery. |

---

## 7. Timeline & Data Freeze

Recommend aligning to the phases already defined in the PRD (§11) and Backend Plan (§11):

| Phase | Catalog milestone |
|---|---|
| Phase 1 — Discovery & Design | Spreadsheet template finalized (§5); SKU naming convention agreed |
| Phase 2 — MVP Build (early) | Physical stock count and SKU assignment (Steps 1–2) complete |
| Phase 2 — MVP Build (mid) | Full spreadsheet assembled and reviewed (Steps 3–7) |
| Phase 2 — MVP Build (late) / Phase 3 — Beta prep | **Data freeze**: spreadsheet locked, loaded into the system (Step 8), verified (Step 9) |
| Phase 3 — Beta Launch | Live catalog matches physical stock exactly; any post-freeze changes go through the Admin Console, not the spreadsheet |

**Data freeze rule:** after the freeze date, all catalog changes happen through the Admin Console (once available) or via a formal, logged change request to the backend team — never through silent edits to the original spreadsheet. This keeps the spreadsheet's job strictly limited to "get the initial dataset in cleanly," rather than letting it become a second, unofficial source of truth that drifts from the live database.

---

## 8. Open Questions

- Realistic estimate of total SKU count — this determines whether manual Admin Console entry (Step 8a) is feasible or whether the bulk-import path (Step 8b) is worth prioritizing earlier in the backend build.
- Who physically performs the stock count, and by what date can it realistically start given the business owner's limited available time (a constraint the PRD itself calls out)?
- Are there any products currently advertised on Instagram/WhatsApp that are actually discontinued or no longer available — i.e., does the "catalog" need pruning as much as counting?
