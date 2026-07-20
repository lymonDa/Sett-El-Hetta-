# SETT EL-HETTA — LEGAL & POLICY DOCUMENTS (DRAFT)

**Document Version:** 1.0 — Draft for Legal Review
**Date:** July 19, 2026
**Companion documents:** PRD v1.0 · Backend Implementation Plan v1.0 · Content & SEO Plan v1.0 (§7 flagged this as an unowned gap)

> **Important disclaimer:** I'm not a lawyer, and this is not legal advice. These are structural drafts — placeholders in the *shape* of a privacy policy, terms of sale, return policy, and shipping policy, written from what the platform actually does (per the PRD/SRS/Backend Plan) — not a substitute for review by someone qualified in Egyptian consumer-protection and data-protection law before publishing. Bracketed items like `[ ]` mark decisions that need the business owner's input or legal confirmation, not just a fill-in-the-blank.

---

## 1. Why These Four Documents Specifically

The platform collects and stores personal data (name, phone number, address) and sensitive-by-nature uploaded images (Vodafone Cash transfer screenshots, which can contain financial account details) per the Backend Implementation Plan's data model (§4). It also sells physical goods with no online payment gateway, which creates dispute-resolution questions (a rejected Vodafone Cash payment, a COD order the customer refuses at the door) that aren't handled by a payment processor's own terms the way they would be with a card gateway. These four documents are the minimum a store handling that combination typically needs before launch.

---

## 2. Privacy Policy (Draft Structure)

```
PRIVACY POLICY — SETT EL-HETTA

Last updated: [date]

1. What we collect
   - Name, phone number, and delivery address, provided when you place an order
     or create an account.
   - Payment-proof images you upload when paying via Vodafone Cash.
   - [ Optional account credentials, if you register an account. ]
   - [ Basic usage data — pages visited, general location by IP — if analytics
     tooling is added. Confirm what analytics, if any, are in scope. ]

2. Why we collect it
   - To process and deliver your order.
   - To verify payment for Vodafone Cash orders.
   - To contact you about your order status.
   - [ Marketing communications — only if the customer explicitly opts in;
     do not bundle this with order processing consent. ]

3. How long we keep it
   - Order and customer records: [ retention period — see Backend Plan §9,
     currently an open question with the client ].
   - Payment-proof images: [ same retention question — needs a concrete
     answer, e.g. "12 months from order date" or "as required for
     accounting/dispute resolution," not left open in a live policy. ]

4. Who we share it with
   - We do not sell customer data.
   - [ Confirm: is any data shared with a delivery/courier partner to fulfill
     shipping? If so, name the categories of data shared (name, phone,
     address only — not payment-proof images). ]
   - [ Confirm: WhatsApp Business API provider, if used, as a data processor
     for order notifications. ]

5. Your rights
   - You can request a copy of the data we hold about you, ask us to correct
     it, or ask us to delete it, by contacting us at [ contact email/WhatsApp ].
   - [ Confirm applicable rights under Egyptian data protection law — Law
     No. 151 of 2020 on the Protection of Personal Data is the relevant
     framework; a qualified reviewer should confirm specific obligations
     that apply to a business of this size and type. ]

6. Security
   - Data is transmitted over HTTPS. Payment-proof images are stored
     privately and are only accessible to authorized admin staff reviewing
     your order (see Backend Plan §9 for the technical implementation this
     policy should match).

7. Contact
   - [ business contact email/phone for privacy questions ]
```

---

## 3. Terms & Conditions (Draft Structure)

```
TERMS & CONDITIONS — SETT EL-HETTA

Last updated: [date]

1. About us
   - Sett El-Hetta, Khan El-Khalili, Cairo, Egypt. [ Confirm legal business
     name/registration status if formally registered, for the terms to
     reference correctly. ]

2. Orders
   - Placing an order is an offer to purchase; it is not accepted until we
     confirm it (see Section 4, Payment). We reserve the right to decline
     or cancel an order, for example if an item is unexpectedly out of
     stock or a payment cannot be verified.

3. Pricing
   - Prices are listed in EGP and may change without notice; the price
     charged is the price shown at the time of order.

4. Payment
   - We currently accept Cash on Delivery and Vodafone Cash (with manual
     transfer-proof upload) only. No online payment gateway is used.
   - Every order is reviewed by us before it is confirmed — see the Order
     Status section of the site for what "Pending Review" means.

5. Delivery
   - See the separate Shipping Policy (Section 5 of this document set).

6. Returns & exchanges
   - See the separate Return & Exchange Policy (Section 6 of this document
     set).

7. Intellectual property
   - Product photography, descriptions, and brand content belong to Sett
     El-Hetta and may not be reused without permission.

8. Limitation of liability
   - [ Standard limitation-of-liability language — needs legal drafting,
     not a generic template, given this varies meaningfully by
     jurisdiction. ]

9. Governing law
   - These terms are governed by the laws of the Arab Republic of Egypt.
     [ Confirm with legal reviewer. ]

10. Contact
   - [ business contact email/phone ]
```

---

## 4. Return & Exchange Policy (Draft Structure)

This one needs the most direct input from the business owner, since it's a business decision as much as a legal one — none of the existing documents state a return window, condition requirements, or who pays return shipping.

```
RETURN & EXCHANGE POLICY — SETT EL-HETTA

Last updated: [date]

1. Return window
   - [ Business decision: how many days after delivery can a customer
     request a return? Common ranges are 3–14 days for handmade/small
     retail — needs the owner's input, not an assumption. ]

2. Condition for return
   - [ Unworn, with original packaging? Given handcrafted jewelry, is
     "custom" or "final sale" language needed for any bundle/set items? ]

3. How to request a return
   - Contact us via WhatsApp or the contact form with your order number
     and reason for return.

4. Refunds
   - [ Since there's no payment gateway, refunds for Vodafone Cash orders
     are themselves manual — a return will need to specify HOW a refund
     is actually issued: cash, a Vodafone Cash transfer back, or store
     credit. This is a genuine open operational question, not just policy
     wording — flag it to the business owner directly. ]
   - COD orders that are refused at the door are not a "return" in the
     same sense — [ confirm whether there's any cost/penalty for repeated
     refused COD orders, a common problem for COD-based stores in Egypt. ]

5. Damaged or incorrect items
   - If you receive a damaged or incorrect item, contact us within
     [ X days ] with photos, and we will arrange a replacement or refund
     per Section 4 above.

6. Non-returnable items
   - [ Confirm if any category (e.g. custom orders) is excluded. ]
```

**Note:** the refund-mechanism question in Section 4 above isn't a wording gap — it's a genuine operational decision the business needs to make, since "refund" has no automatic meaning when there's no payment gateway processing the original transaction. Recommend resolving this with the business owner before publishing this policy, not after.

---

## 5. Shipping Policy (Draft Structure)

```
SHIPPING POLICY — SETT EL-HETTA

Last updated: [date]

1. Delivery areas
   - [ Confirm: Cairo only, or nationwide Egypt? This affects both this
     policy and the checkout form's address validation. ]

2. Delivery timeframes
   - [ Confirm approximate delivery windows per area — e.g. "2–4 business
     days within Cairo." ]

3. Delivery fees
   - [ Confirm: flat fee, free above a threshold, or calculated by area?
     This also affects the checkout total calculation in the storefront,
     so it needs to be decided before checkout is finalized, not just for
     this policy page. ]

4. Order tracking
   - You can track your order status at [ order tracking page URL ] using
     your order number and phone number.

5. Failed delivery attempts
   - [ Confirm the process if a courier can't reach the customer or a COD
     order is refused — ties back to the Return Policy's open question
     about repeated refused COD orders. ]
```

---

## 6. Recommended Path to Publication

1. **Business owner fills in every bracketed item** above — most of these are business decisions (return window, delivery areas/fees, refund mechanism), not legal ones, and can be resolved without a lawyer.
2. **Qualified legal review** — specifically for Egyptian consumer-protection and data-protection compliance (Law No. 151 of 2020 is the relevant data-protection framework to check against; consumer-protection obligations for online retail should also be confirmed) — before these go live, not after.
3. **Cross-check against the actual built system** — once checkout, the return-handling process, and shipping-fee logic are implemented, verify the published policy text still matches what the platform actually does. A policy that overpromises (e.g. a return window the admin console has no way to track) creates a liability gap, not just a UX inconsistency.
4. **Publish and link** from the footer of every page and specifically from the checkout flow, consistent with standard practice for e-commerce sites of this kind.

---

## 7. Open Questions Requiring the Business Owner's Direct Input

- Return window length and condition requirements
- Refund mechanism for Vodafone Cash orders (no gateway to auto-refund through)
- Policy on repeated refused COD deliveries
- Delivery area(s) covered and fee structure
- Payment-proof and customer-data retention period (also flagged in Backend Plan §12 and Content & SEO Plan §7 — this is now the third document pointing at the same unresolved decision, which suggests it should be settled soon rather than deferred again)
