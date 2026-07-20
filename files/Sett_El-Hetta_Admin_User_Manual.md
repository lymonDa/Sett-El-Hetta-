# SETT EL-HETTA — ADMIN USER MANUAL & TRAINING GUIDE

**Document Version:** 1.0 — Draft for Review
**Date:** July 19, 2026
**Audience:** Business owner (Sameh El-Abyad) and any future operations staff
**Companion documents:** PRD v1.0 · Backend Implementation Plan v1.0 · Feature Plan v1.0

> The PRD is explicit that the admin is **non-technical, time-constrained, and the daily task is reviewing payments and updating orders** (PRD §3, §12). None of the other documents produce anything the owner can actually read to operate the console day-to-day — they're all written for the engineering team. This manual is written for the owner: plain steps, no jargon, organized around the tasks they'll actually do, not around the system's internal modules.

---

## 1. How to Use This Manual

Each section covers one real task, in the order you're likely to do them during a normal day. You don't need to read this front to back — find the task you're doing and follow those steps. Screenshots should be added here once the Admin Console's UI is finalized (placeholders noted where a screenshot belongs).

**Your two most important daily tasks are Section 3 (reviewing payment proofs) and Section 4 (updating order status)** — everything else in the console can wait if you're short on time, but orders sitting in "Pending Review" too long directly affects customers waiting on their purchases.

---

## 2. Logging In

1. Go to the admin console link (bookmark this — you'll use it every day).
2. Enter your email and password.
3. If you forget your password, use "Forgot Password" — a reset link is sent to your email.

*[Screenshot placeholder: login screen]*

**Security note:** never share your login with anyone. If you add operations staff later, each person gets their own account with their own role (see Section 8) — never a shared login. This keeps the record of "who confirmed which order" accurate, which matters if a customer ever disputes a payment.

---

## 3. Reviewing a Payment Proof (Vodafone Cash orders)

This is the single most important thing you do in the system. **An order is never confirmed automatically — you are the only thing that confirms it.**

1. Open the **Orders** section. Orders with a Vodafone Cash payment and no decision yet appear under **Pending Review**.
2. Click into the order. You'll see the customer's details, what they ordered, and the transfer-proof image they uploaded.
3. Open the image at full size and check:
   - The amount transferred matches the order total.
   - The transfer went to your correct Vodafone Cash number.
   - The screenshot looks legitimate (not edited, not a duplicate of a previous order's proof).
4. **If it checks out:** click **Confirm Payment**. The customer is automatically notified that their order is confirmed and being prepared.
5. **If something's wrong** (amount doesn't match, image unclear, can't verify): click **Reject**, and write a short note explaining why (e.g. "Amount doesn't match order total — please resend proof"). The customer is automatically notified with your note so they know what to do next.

*[Screenshot placeholder: order detail view with payment-proof image and Confirm/Reject buttons]*

**Important:** never confirm an order just because a customer says they paid, or because you're in a hurry — always open and actually look at the image first. This is the one rule the entire payment system is built around, and skipping it defeats the purpose of requiring proof in the first place.

---

## 4. Reviewing a Cash-on-Delivery (COD) Order

COD orders don't need a payment image — the customer pays when the item is delivered. Your job here is lighter:

1. Open the order under **Pending Review**.
2. Check that the order details (items, address, phone number) look correct and reachable.
3. Click **Confirm Order** to move it forward.

You don't need to verify anything about payment for COD — that happens physically at delivery.

---

## 5. Updating Order Status as It Moves Forward

Once an order is confirmed, you'll update it as it physically progresses:

| When this happens... | ...do this in the console |
|---|---|
| You've handed the order to the delivery person/courier | Change status to **Shipped** |
| The customer has received it | Change status to **Delivered** |
| An order needs to be cancelled (customer changed their mind, item unavailable, etc.) | Change status to **Cancelled** — do this before shipping, not after |

Each status change automatically sends the customer a notification, so you don't need to message them separately unless you want to add a personal note.

*[Screenshot placeholder: order status dropdown/buttons]*

---

## 6. Managing Products

### Adding a New Product
1. Go to **Products → Add New**.
2. Fill in: name, category, description, material, dimensions, price, and stock quantity.
3. Upload photos (and video, if you have one).
4. If this product is part of a bundle/set, mark it and select which other products belong with it.
5. Save. It appears live on the storefront immediately unless you mark it as "Draft."

### Editing or Retiring a Product
- To change price, description, or photos: open the product and edit the relevant field, then save.
- To stop selling something without deleting its history (past orders still reference it): mark it **Retired** instead of deleting it. Deleting isn't offered for this reason — retiring keeps your order records intact.

### Updating Stock
- When you sell something outside the platform (e.g. in person, or you're adjusting for a recount), open the product and adjust the **Stock Quantity** field directly, with a short reason note. This is logged automatically so you always have a history of why a number changed.
- The system automatically reduces stock when an order is placed — you don't need to manually subtract for online orders, only for anything happening outside the platform.

*[Screenshot placeholder: product edit screen]*

---

## 7. Low Stock Alerts

You'll see a notification/badge in the console when a product is running low or has hit zero. Check this regularly — it's the direct fix for the "not knowing what's actually in stock" problem the whole project started from. Don't wait for a customer to order something you don't actually have.

---

## 8. Managing Staff Accounts (once you have help)

If you bring on operations or delivery staff later, you can give them limited access instead of full access:

| Role | Can do |
|---|---|
| **Owner** (you) | Everything — products, orders, payments, staff accounts, reports |
| **Staff** | Products, inventory, orders, payment review — cannot manage other staff accounts |
| **Delivery Coordinator** | Can update orders to Shipped/Delivered only — cannot see payment proofs or edit products |

Go to **Settings → Users** to add someone and choose their role. Give people the narrowest role that lets them do their job — this isn't about trust, it's about limiting mistakes and keeping the "who did what" history clean.

---

## 9. Discount Codes & Bundle Pricing

1. Go to **Promotions**.
2. Create a code (e.g. `SUMMER10`), choose whether it's a percentage or fixed discount, and set a start/end date if it's time-limited.
3. Save — customers can now enter this code at checkout.

Bundle discounts (buy-this-set-together pricing) are set up when you mark products as part of a bundle in Section 6 — you don't need a separate promo code for that; the discount applies automatically when a customer's cart matches the bundle.

---

## 10. Checking Your Sales Reports

Go to **Reports** for a simple view of:
- Best-selling products
- Revenue by category
- Order volume over time

Check this monthly (or whenever you're deciding what to restock or feature on the homepage) rather than daily — it's not something that needs your attention every day the way order/payment review does.

---

## 11. If Something Goes Wrong

- **You can't find an order a customer says they placed:** ask for their phone number — orders are searchable by the phone number used at checkout.
- **You rejected a payment by mistake:** contact the development team — order status corrections outside the normal flow should go through them so the history stays accurate, rather than being edited directly in the database.
- **The console is slow or not loading:** check your internet connection first; if it persists, contact the development team with a screenshot and roughly what time it happened.

---

## 12. Quick Reference — Daily Checklist

- [ ] Check **Pending Review** orders — confirm or reject payment proofs
- [ ] Check **Low Stock** alerts
- [ ] Update status on any orders that shipped/delivered today
- [ ] (Weekly) Review new contact-form inquiries
- [ ] (Monthly) Check sales reports for restocking decisions

---

## 13. Notes for the Development Team

This manual should be finalized with real screenshots once the Admin Console UI (Feature Plan §3.4–3.5) is built, and reviewed with the business owner in person before launch (Phase 3, per PRD §11) — a short walkthrough session is more valuable than the document alone, given the owner's limited technical background and time. Recommend a single 30–45 minute training session covering Sections 3–6 specifically, since those are the tasks used daily; Sections 8–10 can be covered later, closer to when they're actually needed.
