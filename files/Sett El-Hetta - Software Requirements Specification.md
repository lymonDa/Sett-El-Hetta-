**SOFTWARE REQUIREMENTS SPECIFICATION** 

# **Sett El-Hetta Digital Platform** 

_Digital Portfolio & E-Commerce Platform for Handcrafted Jewelry & Accessories_ 

**Document Version:** 1.0 — Draft for Review **Date:** July 19, 2026 **Client:** Sameh El-Abyad — Sett El-Hetta, Cairo, Egypt **Prepared By:** Abdelsattar Mohamed (Lemon Da) **Classification:** Confidential 

**Reference:** Derived from Sett El-Hetta Project Brief v1.0 and approved site map / design flows 

Sett El-Hetta — Software Requirements Specification 

#### **Revision History** 

|**Version**|**Date**|**Author**|**Descripton**|
|---|---|---|---|
|1.0|2026-07-19|Abdelsatar Mohamed<br>(Lemon Da)|Inital draf derived from<br>approved project brief and<br>design map|



### **Table of Contents** 

Page 2 of 16 

Sett El-Hetta — Software Requirements Specification 

## **1  Introduction** 

#### **1.1 Purpose** 

This Software Requirements Specification (SRS) defines the functional, non-functional, and data requirements for the Sett El-Hetta Digital Platform, a greenfield web application combining a brand portfolio with a fully functional e- commerce storefront and an administrative back office. This document is intended for the development team, QA, and project stakeholders as the authoritative reference for what the system must do in its first release (MVP). 

#### **1.2 Scope** 

The system in scope consists of three integrated components: 

- Customer Portfolio & Storefront — a mobile-first, Arabic-first public website combining brand storytelling (home, story, gallery, blog, contact) with product discovery, cart, and checkout. 

- Admin & Operations Console — a role-based back office for the business owner (and future staff) to manage products, inventory, pricing, promotions, and orders, including manual payment verification. 

- Marketing & Communications Integration — WhatsApp click-to-chat, Instagram/Facebook linking, and a customer inquiry channel. 

Payment gateways, automated shipping/courier integrations, and a customer loyalty program are explicitly out of scope for this release and are reserved for a future phase (see Section 2.5, Future Considerations). 

#### **1.3 Definitions, Acronyms, and Abbreviations** 

|**Term**|**Defniton**|
|---|---|
|**SRS**|Sofware Requirements Specifcaton (this document).|
|**MVP**|Minimum Viable Product — the frst functonal release of<br>the platorm.|
|**Admin**|The business owner or authorized staf member operatng<br>the Admin Console.|
|**COD**|Cash on Delivery — customer pays in cash upon receiving<br>the order.|
|**Manual Payment Proof**|A screenshot/photo of a Vodafone Cash transfer uploaded<br>by the customer as evidence of payment.|
|**SKU**|Stock Keeping Unit — a unique identfer for a distnct<br>product/variant.|
|**RBAC**|Role-Based Access Control.|
|**FR**|Functonal Requirement.|
|**NFR**|Non-Functonal Requirement.|



#### **1.4 References** 

- Sett El-Hetta Project Brief, v1.0 — Final Draft, July 19, 2026. 

Page 3 of 16 

Sett El-Hetta — Software Requirements Specification 

- Sett El-Hetta Platform Design Map (site map and order/payment flow diagrams), July 19, 2026. 

- Reference brand site: Azza Fahmy Jewellery (eg.azzafahmy.com) — visual and structural inspiration only. 

#### **1.5 Overview** 

Section 2 describes the product at a high level, including user classes and constraints. Section 3 specifies detailed functional requirements grouped by module. Section 4 defines external interface requirements. Section 5 specifies nonfunctional requirements. Section 6 defines core data entities. Section 7 documents the order and payment state model in detail, given its priority for this project. Section 8 lists assumptions, dependencies, and open issues. 

Page 4 of 16 

Sett El-Hetta — Software Requirements Specification 

## **2  Overall Description** 

#### **2.1 Product Perspective** 

The platform is a new, single-tenant web application; it does not replace any existing system but formalizes a business currently run through WhatsApp broadcasts and social media posts. It is architected as three cooperating modules sharing one product/order database: the public-facing Portfolio & Storefront, the Admin Console, and the Marketing Integration layer. The Admin Console is the operational hub: all product, inventory, and order data — regardless of where it originates — is created, verified, or actioned by an admin user. 

#### **2.2 Product Functions (Summary)** 

- Present the brand through a homepage, story, gallery, and blog. 

- Let customers browse, filter, and search a structured product catalog. 

- Support cart, checkout, and order placement without a payment gateway. 

- Offer exactly two payment methods: Cash on Delivery, and Vodafone Cash with manual transfer-proof upload. 

- Route every order — regardless of payment method — to the Admin Console for review and confirmation. 

- Give the admin full control over catalog, inventory, pricing, promotions, and order lifecycle. 

- Preserve WhatsApp as a first-class ordering and support channel throughout the funnel. 

#### **2.3 User Classes and Characteristics** 

|**User Class**|**Characteristcs & Needs**|
|---|---|
|**Customer (Guest)**|Mobile-frst shopper, primarily discovered via<br>Instagram/Facebook/WhatsApp; browses and purchases<br>without necessarily creatng an account; low tolerance for<br>fricton or slow load tmes.|
|**Customer (Registered, optonal)**|Wants order history and saved favorites; low technical<br>sophistcaton expected.|
|**Business Owner / Admin**|Non-technical; needs a simple, low-fricton console; primary<br>daily task is verifying payments and managing orders;<br>limited tme available for admin tasks.|
|**Store Operatons Staf (future)**|Day-to-day product, inventory, and order handling under a<br>restricted role; not present at MVP launch but the role<br>model must antcipate this.|



#### **2.4 Operating Environment** 

- Client: modern mobile and desktop browsers (Chrome, Safari, Edge, Samsung Internet); mobile-first responsive layout is mandatory. 

- Server/Hosting: to be determined by the technical team; must support HTTPS, CDN-backed media delivery, and horizontal scaling of catalog/traffic. 

- Network: designed and tested primarily for 4G mobile connections in Egypt. 

Page 5 of 16 

Sett El-Hetta — Software Requirements Specification 

#### **2.5 Design and Implementation Constraints** 

- No third-party payment gateway integration in this release — all payment confirmation is manual, performed by an admin. 

- Arabic-first UI at launch; information architecture must not block future bilingual (Arabic/English) support. 

- Single-tenant architecture — the platform is built for one brand in this release, though the codebase should not preclude a future reusable storefront template. 

#### **2.6 Assumptions and Dependencies** 

- The business owner will complete a full catalog and stock audit prior to launch (see Risks, Section 8). 

- WhatsApp Business API/Click-to-Chat availability is assumed for order confirmation and support messaging. 

- Future phases will introduce payment gateways (Vodafone Cash API, InstaPay, card via Paymob/Fawry) and courier integrations (e.g., Bosta, Mylerz) without requiring a structural redesign of this release. 

Page 6 of 16 

Sett El-Hetta — Software Requirements Specification 

## **3  Specific Requirements — Functional** 

Functional requirements are grouped by module. Priority is expressed as Must (required for MVP launch), Should (important but deferrable), or Could (nice to have). 

##### **3.1 Portfolio & Brand Presentation** 

|**ID**|**Requirement**|**Descripton**|**Priority**|
|---|---|---|---|
|**FR-1.1**|**Homepage**|Display hero products,<br>seasonal collectons, and<br>bundle ofers with high-<br>resoluton imagery.|Must|
|**FR-1.2**|**Brand story page**|Present brand background<br>and crafsmanship narratve<br>("our story").|Must|
|**FR-1.3**|**Gallery**|Showcase photo and video<br>content of products "on the<br>wrist" / in use.|Must|
|**FR-1.4**|**Blog**|List and display blog/news<br>artcles with a listng page<br>and artcle detail page.|Should|
|**FR-1.5**|**Contact & inquiry form**|Provide a contact form that<br>routes submissions to the<br>admin, plus direct<br>WhatsApp/Instagram/Faceb<br>ook links.|Must|
|**FR-1.6**|**WhatsApp click-to-chat**|Provide an "Order via<br>WhatsApp" or "Ask via<br>WhatsApp" entry point<br>visible at every stage of the<br>browsing and checkout<br>funnel.|Must|



##### **3.2 Product Catalog & Discovery** 

|**ID**|**Requirement**|**Descripton**|**Priority**|
|---|---|---|---|
|**FR-2.1**|**Category browsing**|Organize products into<br>categories: anklets, bangles,<br>bracelet sets, chains,<br>layered sets, bundles.|Must|
|**FR-2.2**|**Product detail page**|Show high-resoluton<br>photos, optonal video,<br>price, material grade,<br>dimensions, and available<br>quantty per product.|Must|
|**FR-2.3**|**Search**|Allow customers to search<br>the catalog by keyword.|Must|
|**FR-2.4**|**Filtering**|Allow fltering by category,|Should|



Page 7 of 16 

Sett El-Hetta — Software Requirements Specification 

|**ID**|**Requirement**|**Descripton**|**Priority**|
|---|---|---|---|
|||price range, and material.||
|**FR-2.5**|**Stock display**|Refect real-tme stock<br>status on product and listng<br>pages (in stock / low stock /<br>out of stock), driven by<br>Admin inventory data.|Must|



##### **3.3 Cart & Checkout** 

|**ID**|**Requirement**|**Descripton**|**Priority**|
|---|---|---|---|
|**FR-3.1**|**Shopping cart**|Allow adding, updatng<br>quantty, and removing<br>items; persist cart during<br>the session.|Must|
|**FR-3.2**|**Bundle pricing**|Automatcally calculate<br>discounted pricing when<br>qualifying bundle/set<br>combinatons are in the<br>cart.|Should|
|**FR-3.3**|**Checkout form**|Collect customer name,<br>phone number, delivery<br>address, and optonal notes.|Must|
|**FR-3.4**|**Payment method selecton**|Present exactly two<br>payment optons at<br>checkout: Cash on Delivery,<br>and Vodafone Cash. No<br>online payment gateway is<br>ofered.|Must|
|**FR-3.5**|**Vodafone Cash transfer**<br>**proof**|When Vodafone Cash is<br>selected, display the<br>merchant's Vodafone Cash<br>number and require the<br>customer to upload an<br>image of the transfer<br>receipt before the order can<br>be submited.|Must|
|**FR-3.6**|**Order submission & status**|On submission, create the<br>order with status "Pending<br>Review" regardless of<br>payment method, and<br>display/send a confrmaton<br>to the customer statng the<br>order is pending admin<br>confrmaton.|Must|
|**FR-3.7**|**Order status tracking**|Allow the customer to view<br>order status progression:<br>Pending Review →<br>Confrmed → Shipped →<br>Delivered (or|Must|



Page 8 of 16 

Sett El-Hetta — Software Requirements Specification 

|**ID**|**Requirement**|**Descripton**|**Priority**|
|---|---|---|---|
|**FR-3.8**|**Optonal customer account**|Rejected/Cancelled).<br>Allow guest checkout by<br>default; allow optonal<br>account creaton for order<br>history and saved favorites.|Should|
|**FR-3.9**|**Promo codes**|Allow entry of a promo code<br>at checkout that applies a<br>confgured discount rule.|Could|



##### **3.4 Admin Console — Catalog & Inventory** 

|**ID**|**Requirement**|**Descripton**|**Priority**|
|---|---|---|---|
|**FR-4.1**|**Product management**|Create, edit, and retre<br>product listngs, including<br>category, price, material,<br>dimensions, and<br>descripton.|Must|
|**FR-4.2**|**Bulk media upload**|Support bulk upload of<br>product photos and videos.|Should|
|**FR-4.3**|**Inventory management**|Track stock levels per SKU in<br>real tme; support manual<br>stock adjustments.|Must|
|**FR-4.4**|**Stock alerts**|Generate low-stock and out-<br>of-stock alerts visible to the<br>admin.|Must|
|**FR-4.5**|**Pricing & promotons**<br>**engine**|Confgure bundle/set<br>discount rules and seasonal<br>promotons.|Should|



##### **3.5 Admin Console — Orders & Payment Verification** 

|**ID**|**Requirement**|**Descripton**|**Priority**|
|---|---|---|---|
|**FR-5.1**|**Order dashboard**|List all orders with flters by<br>status, payment method,<br>and date; show order<br>source (storefront).|Must|
|**FR-5.2**|**Order detail view**|Show full order detail:<br>items, customer info,<br>delivery address, payment<br>method, and status history.|Must|
|**FR-5.3**|**Payment proof review**|For Vodafone Cash orders,<br>display the uploaded<br>transfer-proof image in full<br>resoluton within the order<br>detail view for admin<br>verifcaton.|Must|
|**FR-5.4**|**Confrm / reject payment**|Allow the admin to mark a|Must|



Page 9 of 16 

Sett El-Hetta — Software Requirements Specification 

|**ID**|**Requirement**|**Descripton**|**Priority**|
|---|---|---|---|
|||Vodafone Cash order as<br>Confrmed (payment<br>verifed) or Rejected<br>(payment not<br>received/invalid), with an<br>optonal note.||
|**FR-5.5**|**Order status updates**|Allow the admin to progress<br>any order through its<br>lifecycle: Pending Review →<br>Confrmed → Shipped →<br>Delivered, or mark<br>Cancelled/Rejected at<br>applicable stages.|Must|
|**FR-5.6**|**Customer notfcaton on**<br>**status change**|Trigger a WhatsApp and/or<br>email/SMS notfcaton to<br>the customer whenever<br>order status changes.|Must|
|**FR-5.7**|**Role-based access**|Restrict admin functons by<br>role (Owner vs. future<br>Staf/Delivery Coordinator).|Should|
|**FR-5.8**|**Sales & performance**<br>**reportng**|Provide lightweight<br>reportng: best-selling<br>products, revenue by<br>category, and order volume<br>trends.|Should|



##### **3.6 Marketing & Communications** 

|**ID**|**Requirement**|**Descripton**|**Priority**|
|---|---|---|---|
|**FR-6.1**|**WhatsApp integraton**|Integrate WhatsApp<br>Business API or Click-to-Chat<br>for order confrmaton and<br>customer support.|Must|
|**FR-6.2**|**Social linking**|Link storefront pages to the<br>brand's Instagram and<br>Facebook profles.|Must|
|**FR-6.3**|**Inquiry routng**|Route contact-form<br>submissions to the admin's<br>notfcaton channel (e.g.,<br>email/WhatsApp).|Must|
|**FR-6.4**|**SEO foundaton**|Implement basic on-page<br>SEO structure (meta<br>ttles/descriptons, semantc<br>headings, clean URLs) to<br>support organic discovery.|Should|



Page 10 of 16 

Sett El-Hetta — Software Requirements Specification 

## **4  External Interface Requirements** 

#### **4.1 User Interfaces** 

- Mobile-first responsive design across phone, tablet, and desktop breakpoints. 

- Arabic-first (RTL) interface at launch; component and text architecture must support future English (LTR) localization without redesign. 

- Consistent visual language across Portfolio, Storefront, and Admin Console, reflecting the brand's premiumbut-accessible positioning. 

#### **4.2 Hardware Interfaces** 

No dedicated hardware interfaces are required. Customers and admins interact via standard smartphones, tablets, or computers with a camera (for uploading Vodafone Cash transfer proof images) and an internet connection. 

#### **4.3 Software Interfaces** 

|**Interface**|**Purpose**|
|---|---|
|**WhatsApp Business API / Click-to-Chat**|Order confrmaton, customer support, and "Order via<br>WhatsApp" checkout path.|
|**Instagram & Facebook**|Profle linking and cross-channel discovery (no data<br>exchange required at MVP).|
|**Email / SMS provider**|Transactonal notfcatons for order confrmatons and<br>status changes.|
|**CDN / Media hostng**|Optmized delivery of product images and video.|
|**Future: Payment gateways (Vodafone Cash API, InstaPay,**<br>**Paymob/Fawry)**|Reserved for Phase 4 — not implemented at MVP.|
|**Future: Courier APIs (Bosta, Mylerz)**|Reserved for Phase 4 — not implemented at MVP.|



#### **4.4 Communications Interfaces** 

- All client-server communication over HTTPS (TLS). 

- Outbound notification messages (WhatsApp/email/SMS) triggered by order-status transitions. 

Page 11 of 16 

Sett El-Hetta — Software Requirements Specification 

## **5  Non-Functional Requirements** 

|**Dimension**|**Requirement**|
|---|---|
|**Performance**|Sub-3-second page load on standard 4G mobile<br>connectons; optmized image delivery (compressed, lazy-<br>loaded, CDN-backed).|
|**Responsiveness**|Fully responsive, mobile-frst design across phones, tablets,<br>and desktop.|
|**Security**|Encrypted data in transit (HTTPS); secure authentcaton for<br>admin and optonal customer accounts; safe handling of<br>customer contact data and uploaded payment-proof<br>images.|
|**Scalability**|Architecture supports growth in catalog size, trafc, and<br>future mult-category expansion without structural<br>redesign.|
|**Availability**|Target uptme of 99.5%+, with monitoring and alertng on<br>checkout and catalog services.|
|**Localizaton**|Arabic-frst experience at launch; informaton architecture<br>ready for bilingual (Arabic/English) support.|
|**Accessibility**|Legible typography, sufcient color contrast, and touch-<br>friendly interface elements (minimum comfortable tap<br>target size).|
|**Auditability**|Order status changes and payment confrmatons/rejectons<br>are logged with tmestamp and actng admin user, for<br>dispute resoluton.|
|**Data retenton**|Uploaded payment-proof images retained for at least the<br>duraton required for order dispute resoluton and<br>accountng.|



Page 12 of 16 

Sett El-Hetta — Software Requirements Specification 

## **6  Data Requirements — Core Entities** 

The following entities represent the minimum data model implied by the functional requirements above. Field lists are indicative, not exhaustive; final schema is a technical design decision. 

|**Entty**|**Key Atributes**|
|---|---|
|**Product**|SKU, name, category, descripton, material, dimensions,<br>price, bundle/set fag, media (photos/video), stock quantty,<br>status (actve/retred).|
|**Category**|Name, slug, parent category (optonal).|
|**Customer**|Name, phone number, address(es), optonal account<br>credentals, order history reference.|
|**Order**|Order ID, customer reference, line items, subtotal, promo<br>code (optonal), payment method (COD / Vodafone Cash),<br>status, source (storefront), tmestamps.|
|**OrderItem**|Order reference, product reference, quantty, unit price at<br>tme of order.|
|**PaymentProof**|Order reference, uploaded image, upload tmestamp,<br>verifcaton status (pending/confrmed/rejected), reviewing<br>admin, review note.|
|**Promoton / PromoCode**|Code, discount type (percentage/fxed/bundle rule), validity<br>window, usage constraints.|
|**AdminUser**|Name, credentals, role (Owner / Staf / Delivery<br>Coordinator), permissions.|
|**InventoryLog**|Product reference, change quantty, reason, admin<br>reference, tmestamp.|



Page 13 of 16 

Sett El-Hetta — Software Requirements Specification 

## **7  Order & Payment State Model (Priority Requirement)** 

This section documents in detail the order and payment flow, since the absence of a payment gateway is the single most consequential design decision in the storefront and directly shapes both the customer checkout experience and the Admin Console. 

#### **7.1 Payment Methods** 

The storefront offers exactly two payment methods at checkout. No online payment gateway (card, wallet, or aggregator) is available in this release. 

|**Method**|**Customer Flow**|
|---|---|
|**Cash on Delivery (COD)**|Customer selects COD at checkout and submits the order<br>with no upfront payment. Order enters status "Pending<br>Review" for admin confrmaton, then payment is collected<br>physically upon delivery.|
|**Vodafone Cash (manual)**|Customer selects Vodafone Cash, is shown the merchant's<br>number, transfers the amount outside the platorm, then<br>uploads a photo/screenshot of the transfer confrmaton as<br>part of order submission. Order enters status "Pending<br>Review" untl the admin verifes the uploaded proof.|



#### **7.2 Order Status Lifecycle** 

- Pending Review — default status on order creation for both payment methods; visually distinct from Confirmed in both customer-facing and admin views. 

- Confirmed — set by the admin after verifying payment (automatic eligibility for COD; manual image verification required for Vodafone Cash). 

- Rejected — set by the admin when a Vodafone Cash transfer proof is invalid, insufficient, or unverifiable; triggers customer contact. 

- Shipped — set by the admin once the order is handed to delivery. 

- Delivered — set by the admin (or automatically via future courier integration) once the order reaches the customer. 

- Cancelled — may be set by the admin at any stage prior to shipping, per business rules. 

#### **7.3 Critical Design Rule** 

A Vodafone Cash order must never be treated as equivalent to a confirmed order until an admin has explicitly reviewed the uploaded transfer-proof image and marked it Confirmed. The customer-facing order status and any automated notification must reflect "Pending Review," not "Confirmed," immediately after submission — regardless of payment method chosen. 

#### **7.4 Notifications** 

|**Trigger**|**Notfcaton**|
|---|---|
|**Order submited**|Customer receives confrmaton that the order was received|



Page 14 of 16 

Sett El-Hetta — Software Requirements Specification 

|**Trigger**|**Notfcaton**|
|---|---|
||and is pending review (WhatsApp and/or email/SMS).|
|**Order confrmed**|Customer notfed that payment/order is confrmed and<br>preparaton has begun.|
|**Order rejected**|Customer notfed with reason and next steps (e.g.,<br>resubmit proof or contact support).|
|**Order shipped / delivered**|Customer notfed of shipment and delivery.|



Page 15 of 16 

Sett El-Hetta — Software Requirements Specification 

## **8  Assumptions, Risks, and Open Issues** 

#### **8.1 Risks** 

|**Risk**|**Mitgaton**|
|---|---|
|**Customer habit is anchored to WhatsApp ordering.**|Preserve WhatsApp checkout as a frst-class opton<br>throughout the funnel.|
|**Inventory data is currently informal / untracked.**|Conduct a full catalog and stock audit prior to launch.|
|**No existng payment gateway relatonship.**|Launch with cash-on-delivery / manual confrmaton; add<br>gateways in Phase 4.|
|**Owner has limited tme for day-to-day admin tasks.**|Prioritze a simple, low-fricton admin console with minimal<br>training overhead, especially for payment-proof review.|



#### **8.2 Open Issues for Technical Design** 

- Final choice of database and hosting/deployment platform (marked "To Be Determined" in the project brief). 

- Exact WhatsApp integration approach (official Business API vs. Click-to-Chat links) and associated cost/approval timeline. 

- SMS/email provider selection for transactional notifications. 

- Precise bundle/set discount rule engine design (rule complexity vs. admin usability). 

#### **8.3 Out of Scope for This Release** 

- Online payment gateways (Vodafone Cash API, InstaPay, card payments). 

- Automated shipping/courier tracking integrations. 

- Customer loyalty / referral program. 

- Multi-tenant or multi-brand support. 

Page 16 of 16 

