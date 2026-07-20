# SETT EL-HETTA PLATFORM
## Comprehensive Feature Plan v1.0
**Date:** July 19, 2026  
**Project:** Digital Portfolio & E-Commerce Platform for Handcrafted Jewelry & Accessories  
**Prepared by:** Product & Design Team  
**Stakeholder:** Sameh El-Abyad (Business Owner)

---

## EXECUTIVE SUMMARY

Sett El-Hetta is transitioning from manual WhatsApp-based sales to a fully integrated digital commerce platform comprising **three core systems**: a customer-facing Portfolio & Storefront, an Admin Operations Console, and Marketing/Communications Integration.

**Key Strategic Decision:** No online payment gateway in MVP. All payments verified manually by the admin (Cash on Delivery or Vodafone Cash with image proof).

**Scope:** Single-tenant, mobile-first, Arabic-first web application launching in **Phase 1 (MVP)** with progressive features in Phases 2–4.

---

## 1. PLATFORM ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│           SETT EL-HETTA DIGITAL PLATFORM                     │
│                  (Three Integrated Systems)                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. PUBLIC PORTFOLIO & STOREFRONT          │                 │
│     └─ Brand storytelling + Product discovery + Checkout     │
│                                                               │
│  2. ADMIN OPERATIONS CONSOLE               │                 │
│     └─ Central hub for catalog, inventory, orders, reports   │
│                                                               │
│  3. MARKETING & COMMUNICATIONS             │                 │
│     └─ WhatsApp, Instagram/Facebook, email/SMS, inquiries    │
│                                                               │
│           (Unified Product & Order Database)                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. PHASE-BASED ROADMAP

### PHASE 1: MVP (Launch) — Months 1–3
**Goal:** Deliver a fully functional e-commerce platform with manual payment verification, replacing WhatsApp broadcasts with a professional storefront.

**Core Deliverables:**
- Portfolio & Storefront (hero to checkout)
- Admin Console (catalog, inventory, orders, payment verification)
- Manual payment flow (COD + Vodafone Cash proof upload)
- WhatsApp integration (click-to-chat & order confirmation)
- Basic reporting (best-sellers, order trends)

---

### PHASE 2: Enhanced Operations — Months 4–6
**Goal:** Streamline admin workflows, add advanced filtering, bundle/promotion rules, inventory alerts.

**Core Deliverables:**
- Bulk product upload & management
- Advanced inventory alerts (low-stock, reorder points)
- Promotion & bundle discount engine
- Enhanced order search & filtering
- Customer feedback / review collection

---

### PHASE 3: Payment & Fulfillment — Months 7–12
**Goal:** Integrate payment gateways and automate shipping/courier workflows.

**Core Deliverables:**
- Vodafone Cash API integration (auto-verify transfers)
- InstaPay & card payment gateway (Paymob/Fawry)
- Courier integration (Bosta, Mylerz) with auto-tracking
- Automated order status updates
- Shipping label generation

---

### PHASE 4: Growth & Loyalty — Months 12+
**Goal:** Expand product lines, add customer loyalty program, and support bilingual interface.

**Core Deliverables:**
- Bilingual UI (Arabic/English)
- Customer loyalty & referral program
- Advanced analytics & BI dashboards
- Multi-product-line support (rings, bridal, custom)
- Email marketing automation

---

## 3. DETAILED FEATURE LIST BY MODULE

### 3.1 MODULE: PORTFOLIO & BRAND PRESENTATION

#### **PR-1.1 Homepage** ⚙️ MUST
**Description:** Introduces the brand, showcases hero products, displays seasonal collections.

**Acceptance Criteria:**
- [ ] Display 3–5 hero product carousel/slider
- [ ] Show seasonal collections/limited editions with imagery
- [ ] Include call-to-action buttons to catalog, WhatsApp inquiry
- [ ] Load hero images optimized for mobile (WebP, lazy-loading)
- [ ] Responsive layout: mobile, tablet, desktop

**Priority:** P1 | **Phase:** 1 | **Complexity:** M | **Effort:** 8 pts

---

#### **PR-1.2 "Our Story" Page** ⚙️ MUST
**Description:** Brand narrative page explaining Sett El-Hetta's heritage, craftsmanship, and values.

**Acceptance Criteria:**
- [ ] Display brand history & mission statement (Arabic-first)
- [ ] Feature artisan/maker photos & bios
- [ ] Show material sourcing & quality commitments
- [ ] Include high-resolution product-in-use photography
- [ ] SEO-optimized with structured meta tags

**Priority:** P1 | **Phase:** 1 | **Complexity:** M | **Effort:** 5 pts

---

#### **PR-1.3 Product Gallery** ⚙️ MUST
**Description:** Curated visual gallery of products in-use (wrist photography, lifestyle context).

**Acceptance Criteria:**
- [ ] Display grid of gallery images (lazy-loaded)
- [ ] Filter gallery by product category
- [ ] Support both image and short video clips
- [ ] Include image attribution/product SKU links
- [ ] Mobile-optimized masonry or grid layout

**Priority:** P1 | **Phase:** 1 | **Complexity:** M | **Effort:** 6 pts

---

#### **PR-1.4 Blog/Content Hub** ⚙️ SHOULD
**Description:** Optional blog for styling tips, material care guides, seasonal trends.

**Acceptance Criteria:**
- [ ] Create/publish blog posts (CRUD by admin)
- [ ] Display list view with pagination
- [ ] Full blog post view with images & comments
- [ ] SEO metadata for each post
- [ ] Social sharing buttons (WhatsApp, Instagram)

**Priority:** P2 | **Phase:** 2 | **Complexity:** M | **Effort:** 8 pts

---

#### **PR-1.5 Contact & Inquiry Form** ⚙️ MUST
**Description:** Customer inquiry form with email/WhatsApp routing to business owner.

**Acceptance Criteria:**
- [ ] Form fields: name, email, phone, subject, message
- [ ] Submit inquiry to email + database
- [ ] Send WhatsApp notification to owner
- [ ] Display "Thank you" confirmation message
- [ ] CAPTCHA or honeypot for spam prevention

**Priority:** P1 | **Phase:** 1 | **Complexity:** S | **Effort:** 3 pts

---

---

### 3.2 MODULE: PRODUCT CATALOG & DISCOVERY

#### **CD-2.1 Structured Product Catalog** ⚙️ MUST
**Description:** Organized product listing by category (anklets, bangles, bracelet sets, chains, layered sets).

**Acceptance Criteria:**
- [ ] Display all products in grid/list view
- [ ] Show product thumbnail, name, price, material, availability
- [ ] Implement 5 category filters (anklets, bangles, sets, chains, bundles)
- [ ] Support sorting: newest, price (low/high), best-selling
- [ ] Lazy-load images as user scrolls

**Priority:** P1 | **Phase:** 1 | **Complexity:** M | **Effort:** 10 pts

---

#### **CD-2.2 Advanced Product Filtering** ⚙️ MUST
**Description:** Allow customers to refine product search by category, price, material, availability.

**Acceptance Criteria:**
- [ ] Category filter with checkboxes (multi-select)
- [ ] Price range slider ($5–$200)
- [ ] Material filter (stainless steel, gold-plated, mixed)
- [ ] Availability filter (in-stock, pre-order, sold-out)
- [ ] Filter persistence in URL (shareable filter states)
- [ ] Clear all filters button

**Priority:** P1 | **Phase:** 1 | **Complexity:** M | **Effort:** 6 pts

---

#### **CD-2.3 Product Search** ⚙️ MUST
**Description:** Full-text search across product names, descriptions, SKUs.

**Acceptance Criteria:**
- [ ] Search bar with autocomplete suggestions
- [ ] Search by product name, SKU, or description
- [ ] Display search results count
- [ ] Highlight matching terms in results
- [ ] Support Arabic diacritics and variants

**Priority:** P1 | **Phase:** 1 | **Complexity:** M | **Effort:** 5 pts

---

#### **CD-2.4 Rich Product Detail Page** ⚙️ MUST
**Description:** Comprehensive product page with images, specifications, pricing, and add-to-cart.

**Acceptance Criteria:**
- [ ] Hero image carousel (5–10 high-res photos per product)
- [ ] Product video (demo or lifestyle clip)
- [ ] Product details: name, price, material, dimensions, weight
- [ ] Quantity available indicator
- [ ] "Add to Cart" button (disabled if out-of-stock)
- [ ] "Ask via WhatsApp" button for questions
- [ ] Related/recommended products (algorithmic or manual)
- [ ] Product reviews section (Phase 2+)
- [ ] Share to social media buttons

**Priority:** P1 | **Phase:** 1 | **Complexity:** L | **Effort:** 12 pts

---

#### **CD-2.5 Product Availability/Inventory** ⚙️ MUST
**Description:** Real-time stock visibility; gray out or hide out-of-stock items; show restock notifications.

**Acceptance Criteria:**
- [ ] Display quantity available for each product
- [ ] Disable add-to-cart if quantity = 0
- [ ] Show "Out of Stock" badge
- [ ] Offer "Notify Me" option for out-of-stock products
- [ ] Show "Pre-order Available" if applicable
- [ ] Sync inventory from admin in real-time (or <1 min delay)

**Priority:** P1 | **Phase:** 1 | **Complexity:** M | **Effort:** 4 pts

---

#### **CD-2.6 Bundle & Set Promotion Display** ⚙️ MUST
**Description:** Highlight and allow purchase of product bundles/sets with bundle pricing.

**Acceptance Criteria:**
- [ ] Display bundled products (e.g., "3-piece anklet set")
- [ ] Show individual price vs. bundle price
- [ ] Display discount percentage/savings
- [ ] Add entire bundle to cart in one click
- [ ] Allow customization of bundle contents (if applicable)

**Priority:** P1 | **Phase:** 1 | **Complexity:** M | **Effort:** 6 pts

---

---

### 3.3 MODULE: CART & CHECKOUT

#### **CO-3.1 Shopping Cart** ⚙️ MUST
**Description:** Persistent cart showing selected items, quantities, and running total.

**Acceptance Criteria:**
- [ ] Display all cart items with image, name, price, quantity
- [ ] Allow increment/decrement quantity
- [ ] Remove item from cart
- [ ] Display subtotal, taxes (if applicable), total
- [ ] Show "Save for Later" option
- [ ] Cart persists across sessions (localStorage + DB)
- [ ] Show stock availability warning if quantity unavailable

**Priority:** P1 | **Phase:** 1 | **Complexity:** M | **Effort:** 6 pts

---

#### **CO-3.2 Streamlined Checkout Flow** ⚙️ MUST
**Description:** Multi-step checkout: billing info → shipping → payment method → review.

**Acceptance Criteria:**
- [ ] Step 1: Collect customer name, email, phone, address
- [ ] Step 2: Confirm shipping address
- [ ] Step 3: Select payment method (COD vs. Vodafone Cash)
- [ ] Step 4: Review order summary before submit
- [ ] Display expected delivery date estimate
- [ ] Back/next navigation between steps
- [ ] Progress indicator (step 1/2/3/4)
- [ ] Save billing info for future orders (optional)

**Priority:** P1 | **Phase:** 1 | **Complexity:** M | **Effort:** 8 pts

---

#### **CO-3.3 Cash on Delivery (COD) Flow** ⚙️ MUST
**Description:** Simple COD option requiring only address & phone; order moves to admin review.

**Acceptance Criteria:**
- [ ] Customer selects "Cash on Delivery" at checkout
- [ ] Confirm delivery address
- [ ] Order created with status = "Pending Review"
- [ ] Customer sees confirmation page with order #, summary, next steps
- [ ] No payment receipt generated (admin verifies manually)

**Priority:** P1 | **Phase:** 1 | **Complexity:** S | **Effort:** 2 pts

---

#### **CO-3.4 Vodafone Cash Payment Flow (Manual Proof Upload)** ⚙️ MUST
**Description:** Customer selects Vodafone Cash, uploads transfer proof image, order goes to admin review.

**Acceptance Criteria:**
- [ ] Display Vodafone Cash instructions (account, phone, transfer amount)
- [ ] Provide file upload field for transfer proof image (JPG/PNG, <5MB)
- [ ] Capture transaction ID or reference number (optional)
- [ ] Order created with status = "Pending Review"
- [ ] Display "Please wait for admin confirmation" message
- [ ] Send notification to admin for image verification
- [ ] Customer receives email/WhatsApp confirmation (referencing pending review)

**Priority:** P1 | **Phase:** 1 | **Complexity:** M | **Effort:** 5 pts

---

#### **CO-3.5 Order Confirmation Page** ⚙️ MUST
**Description:** Post-purchase page displaying order details, tracking, and next steps.

**Acceptance Criteria:**
- [ ] Display order number, date, total
- [ ] Show order summary (items, prices, shipping info)
- [ ] Display current order status ("Pending Review" for new orders)
- [ ] Show expected delivery date estimate
- [ ] Provide WhatsApp link for follow-up questions
- [ ] Send email receipt with same info
- [ ] Link to track order status (live updates)

**Priority:** P1 | **Phase:** 1 | **Complexity:** S | **Effort:** 3 pts

---

#### **CO-3.6 Apply Promo/Discount Code** ⚙️ SHOULD
**Description:** Allow customers to enter discount codes at checkout; validate and apply discount.

**Acceptance Criteria:**
- [ ] Promo code input field in checkout (cart review step)
- [ ] Validate code format and expiry
- [ ] Apply discount to subtotal
- [ ] Show discount % or fixed amount savings
- [ ] Display error if code invalid/expired
- [ ] Admin ability to create/manage promo codes (Phase 2+)

**Priority:** P2 | **Phase:** 2 | **Complexity:** M | **Effort:** 6 pts

---

#### **CO-3.7 "Order via WhatsApp" Button** ⚙️ MUST
**Description:** Alternative checkout option: generate pre-filled WhatsApp message with cart contents; customer completes purchase via chat.

**Acceptance Criteria:**
- [ ] Display "Order via WhatsApp" button on cart/product pages
- [ ] Clicking generates WhatsApp message with: product names, qty, estimated total
- [ ] Opens WhatsApp Web/app with pre-filled message
- [ ] Admin receives order inquiry in WhatsApp for manual processing
- [ ] Customer can continue browsing without forced checkout

**Priority:** P1 | **Phase:** 1 | **Complexity:** S | **Effort:** 3 pts

---

---

### 3.4 MODULE: ADMIN CONSOLE — CATALOG & INVENTORY

#### **AC-4.1 Product Management Dashboard** ⚙️ MUST
**Description:** Central hub for creating, editing, retiring products.

**Acceptance Criteria:**
- [ ] List all products with name, SKU, price, stock, status
- [ ] Search/filter products by name, SKU, category
- [ ] Sort by date added, price, popularity
- [ ] Quick-edit inline: price, stock, active/retired status
- [ ] Bulk actions: archive multiple products, export to CSV

**Priority:** P1 | **Phase:** 1 | **Complexity:** M | **Effort:** 8 pts

---

#### **AC-4.2 Create/Edit Product** ⚙️ MUST
**Description:** Form to create new product or edit existing product details.

**Acceptance Criteria:**
- [ ] Input fields: name, description, SKU, price, cost (for margin calc)
- [ ] Category selection (dropdown or multi-select)
- [ ] Material selection (stainless steel, gold-plated, etc.)
- [ ] Dimensions & weight fields
- [ ] Upload multiple product images (primary + gallery)
- [ ] Upload product video (MP4, MOV)
- [ ] Set quantity available
- [ ] Enable/disable product (show/hide on storefront)
- [ ] Save as draft or publish immediately
- [ ] Validate required fields before save

**Priority:** P1 | **Phase:** 1 | **Complexity:** M | **Effort:** 10 pts

---

#### **AC-4.3 Bulk Product Import/Upload** ⚙️ SHOULD
**Description:** CSV upload to bulk create or update products (admin efficiency).

**Acceptance Criteria:**
- [ ] Support CSV template (name, SKU, price, category, quantity, images)
- [ ] Validate CSV format and required columns
- [ ] Display validation errors/conflicts before import
- [ ] Option to create new or update existing products
- [ ] Batch image upload (zip file or direct folder)
- [ ] Import progress bar & completion summary

**Priority:** P2 | **Phase:** 2 | **Complexity:** M | **Effort:** 8 pts

---

#### **AC-4.4 Real-Time Inventory Management** ⚙️ MUST
**Description:** Dashboard to view stock levels, update quantities, set reorder thresholds.

**Acceptance Criteria:**
- [ ] Display all products with current stock quantity
- [ ] Search by product name/SKU
- [ ] Quick-edit stock quantity (with audit log)
- [ ] Set low-stock alert threshold per product
- [ ] Set reorder point (trigger notification to admin)
- [ ] Show stock history (transactions: order placed, restock added, manual adjustment)
- [ ] Export inventory report to CSV

**Priority:** P1 | **Phase:** 1 | **Complexity:** M | **Effort:** 7 pts

---

#### **AC-4.5 Automatic Inventory Deduction** ⚙️ MUST
**Description:** When order is confirmed, deduct quantities from inventory automatically.

**Acceptance Criteria:**
- [ ] On order confirmation, reduce product quantities
- [ ] Prevent double-deduction if order confirmed multiple times
- [ ] Restore quantity if order is cancelled/rejected
- [ ] Log all inventory transactions with timestamp & reason
- [ ] Alert admin if confirmation would exceed available stock

**Priority:** P1 | **Phase:** 1 | **Complexity:** M | **Effort:** 4 pts

---

#### **AC-4.6 Stock Alerts & Notifications** ⚙️ MUST
**Description:** Admin notifications when products reach low-stock or out-of-stock thresholds.

**Acceptance Criteria:**
- [ ] Display low-stock alert when quantity ≤ threshold (e.g., 5 units)
- [ ] Display out-of-stock alert when quantity = 0
- [ ] Send email notification to admin (daily digest or real-time)
- [ ] Show alerts on admin dashboard homepage
- [ ] Allow admin to customize alert thresholds per product

**Priority:** P1 | **Phase:** 1 | **Complexity:** S | **Effort:** 3 pts

---

#### **AC-4.7 Pricing & Cost Tracking** ⚙️ SHOULD
**Description:** Track product cost and display profit margins; support dynamic pricing by variant.

**Acceptance Criteria:**
- [ ] Store cost price per product (for margin calculation)
- [ ] Display margin % in product list
- [ ] Track historical pricing changes (audit log)
- [ ] Support price variants by size/color (Phase 2+)
- [ ] Export profitability report by product/category

**Priority:** P2 | **Phase:** 2 | **Complexity:** M | **Effort:** 5 pts

---

#### **AC-4.8 Bundle/Set Configuration** ⚙️ MUST
**Description:** Admin creates product bundles and sets with automatic discount rules.

**Acceptance Criteria:**
- [ ] Create new bundle: select child products, set bundle price
- [ ] Display individual item prices vs. bundle price
- [ ] Automatic discount calculation (fixed amount or % off)
- [ ] Set bundle availability (show/hide on storefront)
- [ ] Edit/delete bundles
- [ ] Bundle inventory tracking (reserve stock or track separately)

**Priority:** P1 | **Phase:** 1 | **Complexity:** M | **Effort:** 8 pts

---

---

### 3.5 MODULE: ADMIN CONSOLE — ORDERS & PAYMENT VERIFICATION

#### **AO-5.1 Order Management Dashboard** ⚙️ MUST
**Description:** Central hub to view, filter, and manage all orders.

**Acceptance Criteria:**
- [ ] Display all orders with order #, date, customer, total, status
- [ ] Filter by status (Pending Review, Confirmed, Shipped, Delivered, Cancelled)
- [ ] Filter by date range, payment method
- [ ] Sort by date, customer, total, status
- [ ] Search orders by order #, customer name, phone, email
- [ ] Quick-view order details (popup/modal)
- [ ] Bulk actions: mark as shipped, export orders

**Priority:** P1 | **Phase:** 1 | **Complexity:** M | **Effort:** 8 pts

---

#### **AO-5.2 Order Detail View** ⚙️ MUST
**Description:** Full order details including items, customer info, payment proof, delivery tracking.

**Acceptance Criteria:**
- [ ] Display order # and date
- [ ] Show customer name, email, phone, delivery address
- [ ] List ordered items (product name, quantity, price, total)
- [ ] Display order total, taxes (if any), shipping cost (if any)
- [ ] Show payment method selected (COD or Vodafone Cash)
- [ ] If Vodafone Cash: display uploaded proof image (viewable)
- [ ] Show order status timeline (created → confirmed → shipped → delivered)
- [ ] Display any customer notes or special requests

**Priority:** P1 | **Phase:** 1 | **Complexity:** M | **Effort:** 6 pts

---

#### **AO-5.3 Payment Verification (COD)** ⚙️ MUST
**Description:** Admin reviews Cash on Delivery orders and confirms/rejects payment.

**Acceptance Criteria:**
- [ ] Display list of "Pending Review" COD orders
- [ ] Admin can "Confirm" order → status changes to "Confirmed"
- [ ] Inventory auto-deducts upon confirmation
- [ ] Admin can "Reject" with reason (out of stock, customer request, etc.)
- [ ] Send WhatsApp/email notification to customer on confirm/reject
- [ ] Log confirmation action with timestamp & admin user

**Priority:** P1 | **Phase:** 1 | **Complexity:** S | **Effort:** 3 pts

---

#### **AO-5.4 Payment Verification (Vodafone Cash Proof Upload)** ⚙️ MUST
**Description:** Admin reviews Vodafone Cash transfer proof image and confirms/rejects payment.

**Acceptance Criteria:**
- [ ] Display list of "Pending Review" Vodafone Cash orders with uploaded images
- [ ] Show uploaded proof image in large view
- [ ] Display expected transfer amount & phone number for verification
- [ ] Admin can "Confirm" → status changes to "Confirmed", inventory deducts
- [ ] Admin can "Reject" with reason (invalid proof, amount mismatch, duplicate, etc.)
- [ ] Send WhatsApp/email notification to customer on confirm/reject
- [ ] Log verification action with timestamp & admin user
- [ ] Mark image as verified (prevent accidental re-submission)

**Priority:** P1 | **Phase:** 1 | **Complexity:** M | **Effort:** 5 pts

---

#### **AO-5.5 Order Status Lifecycle Management** ⚙️ MUST
**Description:** Update order status through lifecycle: Pending Review → Confirmed → Shipped → Delivered (or Cancelled).

**Acceptance Criteria:**
- [ ] Status flow: Pending Review → Confirmed → Shipped → Delivered
- [ ] Status flow: Any → Cancelled (before shipped)
- [ ] Prevent invalid status transitions (e.g., Confirmed → Pending Review)
- [ ] Each status change: log timestamp, admin user, reason (if cancellation)
- [ ] Auto-notify customer on status change via WhatsApp/email
- [ ] Display status timeline in order detail view

**Priority:** P1 | **Phase:** 1 | **Complexity:** M | **Effort:** 6 pts

---

#### **AO-5.6 Order Rejection & Refund Workflow** ⚙️ MUST
**Description:** Admin rejects invalid payment proof; customer contacted to resubmit or cancel.

**Acceptance Criteria:**
- [ ] Admin selects "Reject" on Pending Review order
- [ ] Admin enters rejection reason (invalid image, amount mismatch, etc.)
- [ ] Order status stays "Pending Review" (not marked as cancelled)
- [ ] Send WhatsApp/email notification to customer with reason & resubmission instructions
- [ ] Customer can resubmit new proof image OR request cancellation
- [ ] If customer abandons: admin can manually cancel after 48 hours

**Priority:** P1 | **Phase:** 1 | **Complexity:** M | **Effort:** 5 pts

---

#### **AO-5.7 Manual Order Notes & Communication** ⚙️ SHOULD
**Description:** Admin can add notes to orders; auto-send templates to customer via WhatsApp/email.

**Acceptance Criteria:**
- [ ] Admin text field for internal order notes
- [ ] Admin can send predefined message templates to customer (e.g., "Order Confirmed", "Ready to Ship", "Tracking Info")
- [ ] Option to customize template messages
- [ ] Message sent via WhatsApp Business API & email
- [ ] Log all communications in order timeline

**Priority:** P2 | **Phase:** 2 | **Complexity:** M | **Effort:** 5 pts

---

#### **AO-5.8 Shipping Label & Fulfillment Prep** ⚙️ SHOULD
**Description:** Generate shipping label; integrate with courier (Phase 3); mark order as shipped.

**Acceptance Criteria:**
- [ ] When admin marks "Shipped", generate shipping label (PDF or image)
- [ ] Display label with: order #, customer address, barcode/QR
- [ ] Label ready to print (thermal printer compatible)
- [ ] Future: integrate with Bosta/Mylerz for auto-label generation
- [ ] Admin scans package/barcode to confirm shipment

**Priority:** P2 | **Phase:** 2 | **Complexity:** M | **Effort:** 6 pts

---

---

### 3.6 MODULE: MARKETING & COMMUNICATIONS

#### **MC-6.1 WhatsApp Click-to-Chat Integration** ⚙️ MUST
**Description:** Clickable WhatsApp buttons throughout customer journey; pre-filled message support.

**Acceptance Criteria:**
- [ ] "Ask via WhatsApp" button on product detail pages
- [ ] "Chat with us" button on homepage/contact
- [ ] "Order via WhatsApp" button on cart/checkout
- [ ] Pre-filled messages include: product name, current cart contents
- [ ] Buttons open WhatsApp Web/app on desktop/mobile
- [ ] Link to business WhatsApp Business number (to be configured)

**Priority:** P1 | **Phase:** 1 | **Complexity:** S | **Effort:** 2 pts

---

#### **MC-6.2 WhatsApp Order Confirmation & Notifications** ⚙️ MUST
**Description:** Auto-send order confirmation to customer via WhatsApp when order placed or status changes.

**Acceptance Criteria:**
- [ ] Send WhatsApp message when order is created: order #, total, status
- [ ] Send WhatsApp update when order status changes to "Confirmed", "Shipped", "Delivered"
- [ ] Use WhatsApp Business API (or click-to-link as fallback)
- [ ] Include order tracking link in message
- [ ] Support template messages for consistency
- [ ] Log all messages sent (for audit)

**Priority:** P1 | **Phase:** 1 | **Complexity:** M | **Effort:** 6 pts

---

#### **MC-6.3 Email Notifications** ⚙️ MUST
**Description:** Transactional emails for order confirmation, status updates, inquiry follow-up.

**Acceptance Criteria:**
- [ ] Send email on order creation: order summary, total, next steps
- [ ] Send email on status change: Confirmed, Shipped, Delivered
- [ ] Send email on inquiry form submission: auto-reply to customer + notification to owner
- [ ] Use email template service (SendGrid, Mailgun, etc.)
- [ ] Support HTML email with brand colors, product images
- [ ] Unsubscribe link (comply with email regulations)

**Priority:** P1 | **Phase:** 1 | **Complexity:** M | **Effort:** 5 pts

---

#### **MC-6.4 SMS Notifications** ⚙️ SHOULD
**Description:** Optional SMS alerts for time-sensitive updates (order confirmed, ready to ship).

**Acceptance Criteria:**
- [ ] Send SMS on order confirmation: order #, total, tracking link
- [ ] Send SMS on shipment: tracking number & courier link
- [ ] Use SMS provider (Twilio, Vodafone SMS API, etc.)
- [ ] Admin can enable/disable SMS per customer
- [ ] Track SMS delivery status (for audit)

**Priority:** P2 | **Phase:** 2 | **Complexity:** S | **Effort:** 4 pts

---

#### **MC-6.5 Instagram & Facebook Profile Linking** ⚙️ MUST
**Description:** Direct links to Sett El-Hetta Instagram/Facebook profiles from storefront.

**Acceptance Criteria:**
- [ ] Display Instagram & Facebook icons in footer/header
- [ ] Clicking opens profile in new tab
- [ ] Consistent brand visual identity (colors, fonts)
- [ ] Social follow CTAs on homepage & product pages

**Priority:** P1 | **Phase:** 1 | **Complexity:** S | **Effort:** 1 pt

---

#### **MC-6.6 Promo Campaign Management** ⚙️ SHOULD
**Description:** Admin creates and schedules seasonal promotions, discount codes, campaigns.

**Acceptance Criteria:**
- [ ] Admin creates promo campaigns: name, discount %, applicable products, start/end date
- [ ] Generate unique discount codes (batch generate)
- [ ] Display campaign on homepage or product pages (banner/badge)
- [ ] Admin view: active campaigns, usage stats (# codes issued, redeemed)
- [ ] Track redemption rate per promo code
- [ ] Auto-enable/disable campaigns by date

**Priority:** P2 | **Phase:** 2 | **Complexity:** M | **Effort:** 7 pts

---

#### **MC-6.7 Customer Inquiry Management** ⚙️ MUST
**Description:** Collect customer inquiries via contact form; route to admin; track responses.

**Acceptance Criteria:**
- [ ] Contact form: name, email, phone, message
- [ ] Submit inquiry → stored in database & sent to owner email
- [ ] Admin dashboard shows all inquiries (unread count, status)
- [ ] Admin can mark inquiry as "Resolved" or "Pending"
- [ ] Send auto-reply email to customer
- [ ] Admin can respond directly via email/WhatsApp from inquiry detail view

**Priority:** P1 | **Phase:** 1 | **Complexity:** M | **Effort:** 5 pts

---

---

### 3.7 MODULE: CUSTOMER ACCOUNT & ORDER TRACKING

#### **CA-7.1 Optional Customer Accounts** ⚙️ SHOULD
**Description:** Customers can optionally register account to save favorites, order history, addresses.

**Acceptance Criteria:**
- [ ] Sign-up form: name, email, password (or social login: Google/Facebook)
- [ ] Login form
- [ ] Password reset via email
- [ ] Forgot password workflow
- [ ] User profile page: name, email, phone, saved addresses
- [ ] Edit profile details
- [ ] Option to checkout without account (guest checkout)

**Priority:** P2 | **Phase:** 2 | **Complexity:** M | **Effort:** 8 pts

---

#### **CA-7.2 Order History & Tracking** ⚙️ MUST
**Description:** Customers can view past orders and real-time tracking of current orders.

**Acceptance Criteria:**
- [ ] Display all customer orders (date, #, total, status)
- [ ] Click order to view details & full timeline
- [ ] Live status updates: Pending Review → Confirmed → Shipped → Delivered
- [ ] Estimated delivery date (if available)
- [ ] Option to reorder same items
- [ ] Guest order tracking: enter order # + email

**Priority:** P1 | **Phase:** 1 | **Complexity:** M | **Effort:** 5 pts

---

#### **CA-7.3 Saved Favorites/Wishlist** ⚙️ COULD
**Description:** Customers can save products for later purchase (wishlist).

**Acceptance Criteria:**
- [ ] "Add to Favorites" button on product detail
- [ ] Favorites page showing all saved products
- [ ] Quick add to cart from favorites
- [ ] Share favorite list via WhatsApp/email
- [ ] Notify customer if favorited product goes on sale (Phase 2+)

**Priority:** P3 | **Phase:** 2+ | **Complexity:** S | **Effort:** 3 pts

---

#### **CA-7.4 Reorder / Repeat Purchase** ⚙️ SHOULD
**Description:** Quick reorder functionality for returning customers.

**Acceptance Criteria:**
- [ ] "Reorder" button on past order detail
- [ ] Pre-populate cart with same items
- [ ] Allow quantity changes before checkout
- [ ] Show discount if product is on sale since last purchase

**Priority:** P2 | **Phase:** 2 | **Complexity:** S | **Effort:** 2 pts

---

---

## 4. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **Page Load Time:** < 3 seconds on 4G mobile (Egyptian network conditions)
- **Image Optimization:** WebP format, lazy-loading, responsive sizes
- **API Response Time:** < 500ms for all endpoints
- **Database Queries:** Indexed, optimized; no N+1 queries

### Scalability
- **Traffic:** Support 500+ concurrent users at launch; designed to scale to 10,000+
- **Storage:** Support 5,000+ products with high-res imagery
- **Horizontal Scaling:** Stateless backend; CDN for static assets

### Security
- **HTTPS Only:** All traffic encrypted (TLS 1.3+)
- **Authentication:** Secure password hashing (bcrypt), session management
- **Authorization:** Role-based access control (customer, admin, staff)
- **CSRF Protection:** Token-based CSRF prevention
- **Input Validation:** Client-side + server-side validation
- **SQL Injection Prevention:** Parameterized queries
- **XSS Prevention:** Output encoding, CSP headers
- **PCI Compliance:** N/A for MVP (manual payment); future phases require PCI compliance for card payments

### Accessibility
- **WCAG 2.1 AA Compliance:** Keyboard navigation, screen reader support
- **Arabic/RTL Support:** Full bidirectional text, proper character rendering
- **Mobile Responsiveness:** Touch-friendly buttons, readable font sizes

### Availability
- **Uptime SLA:** 99.9% (target)
- **Backup & Recovery:** Daily backups, tested recovery procedure
- **Error Monitoring:** Sentry or similar error tracking
- **Logging:** Structured logs for audit, debugging

### Compliance & Privacy
- **Data Privacy:** GDPR-inspired data handling (customer contact info, order data)
- **Terms of Service:** Published on platform
- **Refund Policy:** Clear, published in FAQ
- **Email Unsubscribe:** Compliant with CAN-SPAM (for future email marketing)

---

## 5. DATA ENTITIES (Core Model)

```
PRODUCT
├─ id (UUID)
├─ name (string, Arabic)
├─ description (text, Arabic)
├─ sku (string, unique)
├─ category (enum: anklets, bangles, bracelets, chains, bundles)
├─ price (decimal)
├─ cost (decimal, for margin calc)
├─ material (enum: stainless steel, gold-plated, mixed)
├─ quantity_available (integer)
├─ dimensions (string: length x width)
├─ weight (decimal, grams)
├─ images (array of URLs)
├─ video_url (string, optional)
├─ is_active (boolean)
├─ created_at (timestamp)
└─ updated_at (timestamp)

BUNDLE
├─ id (UUID)
├─ name (string)
├─ products (array of product IDs)
├─ bundle_price (decimal)
├─ discount_amount (decimal, calculated)
├─ is_active (boolean)
└─ created_at (timestamp)

ORDER
├─ id (UUID / order number)
├─ customer_id (UUID, optional for guest)
├─ customer_name (string)
├─ customer_email (string)
├─ customer_phone (string)
├─ delivery_address (object: street, city, postal_code, country)
├─ items (array of order items)
├─ subtotal (decimal)
├─ tax (decimal, if applicable)
├─ shipping_cost (decimal, if applicable)
├─ total (decimal)
├─ payment_method (enum: cod, vodafone_cash)
├─ payment_status (enum: pending_review, confirmed, rejected)
├─ payment_proof_image_url (string, if vodafone_cash)
├─ order_status (enum: pending_review, confirmed, shipped, delivered, cancelled)
├─ status_timeline (array of status change events)
├─ notes (text, internal)
├─ created_at (timestamp)
├─ confirmed_at (timestamp, nullable)
├─ shipped_at (timestamp, nullable)
├─ delivered_at (timestamp, nullable)
└─ updated_at (timestamp)

CUSTOMER (optional, for accounts)
├─ id (UUID)
├─ name (string)
├─ email (string, unique)
├─ phone (string)
├─ password_hash (string)
├─ saved_addresses (array)
├─ favorites (array of product IDs)
├─ created_at (timestamp)
└─ updated_at (timestamp)

INVENTORY_LOG (audit trail)
├─ id (UUID)
├─ product_id (UUID)
├─ quantity_delta (integer, +/-)
├─ reason (enum: order_placed, order_cancelled, manual_adjustment, restock)
├─ order_id (UUID, if related)
├─ admin_user_id (UUID)
├─ created_at (timestamp)
└─ notes (string)

INQUIRY
├─ id (UUID)
├─ name (string)
├─ email (string)
├─ phone (string)
├─ subject (string)
├─ message (text)
├─ status (enum: unread, pending, resolved)
├─ created_at (timestamp)
└─ response_notes (text, internal)

PROMO_CODE
├─ id (UUID)
├─ code (string, unique)
├─ discount_type (enum: percentage, fixed_amount)
├─ discount_value (decimal)
├─ applicable_products (array of product IDs, or null for all)
├─ max_redemptions (integer, or null for unlimited)
├─ redemptions_count (integer)
├─ start_date (timestamp)
├─ end_date (timestamp)
├─ is_active (boolean)
└─ created_at (timestamp)
```

---

## 6. CRITICAL DESIGN DECISIONS

### 6.1 Manual Payment Verification (No Payment Gateway in MVP)
**Decision:** All orders require manual admin confirmation before being marked "Confirmed", regardless of payment method.

**Rationale:**
- Reduces complexity & time-to-launch (no PCI compliance, payment gateway integration)
- Aligns with business owner's current comfort level (used to manual verification)
- Allows business to grow revenue without payment processing fees initially
- Creates feedback loop for admin to verify stock & customer eligibility

**Impact on UX:**
- Customers must enter delivery info before payment method selection
- COD orders: brief confirmation → status "Pending Review" → admin confirms
- Vodafone Cash: upload proof image → status "Pending Review" → admin verifies image + confirms
- **Critical Rule:** Order status must display "Pending Review" to customer immediately after submission, not "Confirmed"

**Future State (Phase 3):**
- Integrate Vodafone Cash API for automatic transfer verification
- Integrate card payment gateway (Paymob, Fawry) for auto-authorization
- Phase 3 orders may auto-confirm without admin intervention

---

### 6.2 WhatsApp as First-Class Order Channel
**Decision:** "Order via WhatsApp" is not a fallback option — it's a primary, equally-supported order path.

**Rationale:**
- Customers already use WhatsApp; removing it would frustrate existing buyers
- Preserves personal relationship between brand & customer
- Allows orders outside the storefront (groups, broadcasts, etc.)

**Implementation:**
- "Order via WhatsApp" button available on every product & cart page
- Pre-populated message includes product details + quantity + estimated price
- Customer initiates WhatsApp conversation; business owner responds manually
- Order details manually entered into admin console or auto-captured via API (future)

---

### 6.3 Arabic-First, Mobile-First Architecture
**Decision:** All interfaces designed in Arabic (RTL) first; English support deferred to Phase 4.

**Rationale:**
- Primary customer base is Arabic-speaking Egyptians
- Mobile-first ensures usability on 4G networks in Egypt
- Responsive design supports tablet/desktop without separate app

**Implementation:**
- All text, form labels, error messages in Arabic
- RTL layout baseline; LTR will be applied via CSS variable flips in future
- Mobile breakpoint: 320px (iPhone SE) to 480px as primary
- Tablet breakpoint: 481px to 768px
- Desktop: 769px+

---

### 6.4 Single-Tenant MVP; Reusable Template Future
**Decision:** Platform built specifically for Sett El-Hetta; not multi-tenant initially.

**Rationale:**
- Faster, simpler MVP launch
- Can customize UI, business logic, integrations without multi-tenant constraints

**Future Path (Phase 4+):**
- Extract reusable storefront template
- Support additional product lines (rings, bridal) without code changes
- Enable future brands to use same platform

---

## 7. DEPENDENCIES & INTEGRATIONS

### External Dependencies (MVP Phase 1)

| Service | Purpose | Status | Alternative |
|---------|---------|--------|-------------|
| WhatsApp Business API | Order confirmation & support messaging | TBD | Click-to-Chat (link-based) |
| Email Provider (SendGrid/Mailgun) | Transactional emails | TBD | Basic SMTP server |
| Image Hosting (S3, Cloudinary) | Store & serve product images | TBD | Self-hosted CDN |
| Domain & SSL | HTTPS, branded domain | TBD | Self-signed cert (dev only) |

### Future Dependencies (Phase 3+)

| Service | Purpose | Phase | Priority |
|---------|---------|-------|----------|
| Vodafone Cash API | Auto-verify transfers | Phase 3 | High |
| InstaPay API | Auto-verify bank transfers | Phase 3 | High |
| Paymob / Fawry | Card payment gateway | Phase 3 | Medium |
| Bosta / Mylerz | Courier integration & tracking | Phase 3 | Medium |
| Analytics (Google Analytics, Segment) | User behavior tracking | Phase 2 | Medium |
| SMS Provider (Twilio) | SMS notifications | Phase 2 | Low |

---

## 8. RISKS & MITIGATION

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Business owner not ready to commit catalog data before launch | High | High | Conduct pre-launch inventory audit; provide template |
| Payment verification becomes bottleneck if order volume spikes | Medium | High | Phase 3 payment gateway integration; hire fulfillment staff |
| Product images poor quality / inconsistent | High | Medium | Provide photography guidelines; professional photo shoot pre-launch |
| Customers confused by "Pending Review" status | Medium | Medium | Clear messaging in confirmation email/WhatsApp; FAQ |
| Vodafone Cash transfer proof verification scale issues | Low | High | Transition to Vodafone Cash API in Phase 3 |
| Mobile data plan limitations in Egypt cause image load delays | Medium | Medium | Aggressive image optimization; lazy-loading; WebP format |
| Competitors copy storefront design | Low | Medium | N/A (design should be continuously improved) |

---

## 9. SUCCESS METRICS & KPIs

### Business Metrics (Target: 6 months post-launch)

| KPI | Target | Measurement |
|-----|--------|-------------|
| Unique Website Visitors | 5,000+ | Google Analytics |
| Conversion Rate (visitor → order) | 10–15% | Orders / Visitors |
| Average Order Value (AOV) | $50–75 | Total Revenue / Orders |
| Customer Repeat Purchase Rate | ≥25% | Repeat Customers / Total |
| Customer Satisfaction (NPS/Review Score) | 4.5/5.0 stars | Customer feedback form |
| Admin Order Processing Time | <30 min | Manual tracking |
| Cart Abandonment Rate | <50% | Abandoned Carts / Carts Created |

### Technical Metrics

| Metric | Target | Tool |
|--------|--------|------|
| Page Load Time (P95) | <3s on 4G | Lighthouse, WebPageTest |
| Uptime | 99.9% | Monitoring service (Uptime Robot) |
| Error Rate | <0.1% | Sentry or similar |
| Core Web Vitals Score | A (green) | Google PageSpeed Insights |
| Mobile Usability | 100% | Google Mobile-Friendly Test |

---

## 10. IMPLEMENTATION ROADMAP TIMELINE

```
PHASE 1 (MVP) — Months 1–3
├─ Week 1–2: Design & Architecture finalization
├─ Week 3–8: Core development (portfolio, catalog, cart, checkout, admin)
├─ Week 9: Testing (UAT) & bug fixes
├─ Week 10: Launch preparation & go-live
└─ Deliverable: Full end-to-end platform with manual payment verification

PHASE 2 — Months 4–6
├─ Enhanced admin workflows (bulk upload, advanced alerts, promo management)
├─ Customer accounts & order history
├─ Blog & content hub
├─ Expanded reporting
└─ Deliverable: Operational efficiency & customer engagement enhancements

PHASE 3 — Months 7–12
├─ Payment gateway integrations (Vodafone Cash API, InstaPay, Paymob)
├─ Courier integrations (Bosta, Mylerz) with auto-tracking
├─ SMS notifications
├─ Advanced analytics dashboard
└─ Deliverable: Automated payments & fulfillment

PHASE 4 — Months 12+
├─ Bilingual (Arabic/English) support
├─ Customer loyalty program
├─ Additional product lines (rings, bridal, custom)
├─ Reusable storefront template
└─ Deliverable: Scalable growth platform
```

---

## 11. ACCEPTANCE CRITERIA CHECKLIST

### Phase 1 Acceptance Criteria (MVP Go-Live)

**Storefront:**
- [ ] All portfolio pages (home, story, gallery, contact) load & render correctly
- [ ] Product catalog displays all products with correct info (price, images, availability)
- [ ] Search & filtering work correctly
- [ ] Product detail page shows all info; add-to-cart works
- [ ] Cart is persistent; checkout flow completes end-to-end
- [ ] Both payment methods (COD, Vodafone Cash proof upload) work
- [ ] Order confirmation email & WhatsApp sent successfully
- [ ] Guest checkout works; customer accounts optional

**Admin Console:**
- [ ] Admin can create, edit, delete products
- [ ] Inventory management works; deduction on order confirmation
- [ ] Admin can review pending orders
- [ ] Admin can confirm/reject COD & Vodafone Cash orders
- [ ] Admin can update order status (shipped, delivered, cancelled)
- [ ] Basic reporting (best-sellers, revenue by category) works
- [ ] WhatsApp notifications send to admin & customer

**Non-Functional:**
- [ ] Page load time <3s on 4G (Egyptian network)
- [ ] Mobile responsive on phones, tablets, desktops
- [ ] HTTPS enabled; no security vulnerabilities (OWASP Top 10)
- [ ] Uptime >99% over 7-day monitoring period
- [ ] All images optimized (WebP, lazy-loaded)
- [ ] Arabic text renders correctly (no character encoding issues)
- [ ] Forms validate input; error messages clear

**Stakeholder Sign-Off:**
- [ ] Business owner (Sameh) reviews & approves platform
- [ ] All Must-have features working
- [ ] No critical/high bugs remaining
- [ ] Documentation & user guide provided

---

## 12. GLOSSARY & DEFINITIONS

| Term | Definition |
|------|-----------|
| **MVP** | Minimum Viable Product; Phase 1 launch with core features only |
| **Admin Console** | Back-office dashboard for business owner to manage products, orders, inventory |
| **COD** | Cash on Delivery; payment collected by courier/at delivery |
| **Vodafone Cash** | Mobile money service in Egypt; customers transfer amount to business account & upload proof image |
| **Order Confirmation** | Admin manually verifies payment & marks order as "Confirmed" |
| **Pending Review** | Default order status after placement; awaiting admin verification |
| **RTL** | Right-to-Left text direction (Arabic, Hebrew, etc.) |
| **LTR** | Left-to-Right text direction (English, etc.) |
| **Storefront** | Public-facing e-commerce website |
| **SKU** | Stock Keeping Unit; unique product identifier |

---

## 13. DOCUMENT CONTROL & APPROVALS

**Document Version:** 1.0  
**Last Updated:** July 19, 2026  
**Prepared By:** Product & Design Team  
**Reviewed By:** [TBD]  
**Approved By:** [TBD – Sameh El-Abyad, Business Owner]

**Change Log:**
- v1.0 (Jul 19, 2026): Initial comprehensive feature plan derived from PRD, SRS, and design map

---

## APPENDIX A: FEATURE PRIORITY MATRIX

```
MUST (Required for MVP) | SHOULD (Important, deferrable) | COULD (Nice-to-have)

MUST:
├─ PR-1.1 Homepage
├─ PR-1.2 Our Story
├─ PR-1.3 Gallery
├─ PR-1.5 Contact Form
├─ CD-2.1 Product Catalog
├─ CD-2.2 Filtering
├─ CD-2.3 Search
├─ CD-2.4 Product Detail Page
├─ CD-2.5 Inventory Availability
├─ CD-2.6 Bundle Display
├─ CO-3.1 Shopping Cart
├─ CO-3.2 Checkout Flow
├─ CO-3.3 COD Flow
├─ CO-3.4 Vodafone Cash Flow
├─ CO-3.5 Order Confirmation
├─ CO-3.7 Order via WhatsApp
├─ AC-4.1 Product Dashboard
├─ AC-4.2 Create/Edit Product
├─ AC-4.4 Inventory Management
├─ AC-4.5 Auto Deduction
├─ AC-4.6 Stock Alerts
├─ AC-4.8 Bundle Configuration
├─ AO-5.1 Order Dashboard
├─ AO-5.2 Order Detail View
├─ AO-5.3 Payment Verification (COD)
├─ AO-5.4 Payment Verification (Vodafone Cash)
├─ AO-5.5 Order Status Lifecycle
├─ AO-5.6 Order Rejection Workflow
├─ MC-6.1 WhatsApp Click-to-Chat
├─ MC-6.2 WhatsApp Notifications
├─ MC-6.3 Email Notifications
├─ MC-6.5 Instagram/Facebook Links
├─ MC-6.7 Inquiry Management
├─ CA-7.2 Order History & Tracking

SHOULD:
├─ PR-1.4 Blog
├─ CO-3.6 Promo Codes
├─ AC-4.3 Bulk Import
├─ AC-4.7 Pricing & Cost Tracking
├─ AO-5.7 Order Notes
├─ AO-5.8 Shipping Label
├─ MC-6.4 SMS Notifications
├─ MC-6.6 Campaign Management
├─ CA-7.1 Customer Accounts
├─ CA-7.4 Reorder Functionality

COULD:
├─ CA-7.3 Wishlist/Favorites
```

---

**END OF DOCUMENT**
