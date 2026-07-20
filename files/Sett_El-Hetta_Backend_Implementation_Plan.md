# SETT EL-HETTA — BACKEND IMPLEMENTATION PLAN

**Document Version:** 1.0 — Draft for Review
**Date:** July 19, 2026
**Companion documents:** Sett El-Hetta PRD v1.0 · SRS v1.0 · Platform Design Map · Frontend Implementation Plan v1.0
**Audience:** Backend engineering team, DevOps, project stakeholders

> This plan resolves the "TBD" backend items flagged in the SRS (§8.2) and Frontend Implementation Plan (backend framework, database, hosting) and defines the API contract the storefront/admin frontends already assume (`VITE_API_BASE_URL`, `packages/api-client`, `packages/types`).

---

## 1. Scope & Guiding Constraints

The backend serves three consumers sharing one database, per PRD §5:

1. **Storefront API** — public/guest-facing: catalog, cart pricing, checkout, order tracking.
2. **Admin API** — authenticated, role-based: products, inventory, orders, payment verification, promotions, reporting.
3. **Integration layer** — WhatsApp, email/SMS notifications, media/CDN.

Non-negotiable business rule carried from PRD §7 / SRS §7.3 (**this governs the core of the order/payment module**):

> No order may ever be created or transition into `CONFIRMED` automatically. Every order — COD or Vodafone Cash — is created as `PENDING_REVIEW`. Only an authenticated admin action can move it to `CONFIRMED` or `REJECTED`, and Vodafone Cash orders specifically require a human to have looked at the uploaded proof image first. There is no code path that skips this.

Out of scope for MVP (SRS §8.3, mirrored here): payment gateway integration, courier API integration, loyalty/referral, multi-tenant support. The API should not need a breaking redesign to add these later (NFR: Scalability).

---

## 2. Tech Stack Decision

The Frontend Implementation Plan left backend framework/database as "TBD with backend team." This plan resolves it:

| Layer | Choice | Rationale |
|---|---|---|
| **Language/Runtime** | TypeScript on Node.js 18+ (LTS) | Shares `packages/types` and tooling conventions with the frontend monorepo; one language across the stack lowers cost for a small team. |
| **Framework** | NestJS | Opinionated module/DI structure suits an admin-RBAC + storefront split cleanly; built-in Guards map directly to role checks; first-class OpenAPI/Swagger support satisfies SRS §4.3 documentation needs. |
| **Database** | PostgreSQL 15+ | Relational integrity needed for orders/inventory (SRS Data Requirements §6); native full-text search covers MVP catalog search (FR-2.3) without adding Elasticsearch. |
| **ORM** | Prisma | Type-safe client generation feeds `packages/types`; migrations are simple enough for a small non-technical-adjacent team to reason about. |
| **File/Media storage** | S3-compatible object storage (AWS S3 or Cloudinary) + CDN | Product media and payment-proof images (SRS §5, Data retention) need durable, access-controlled storage separate from the app server. |
| **Cache/Queue** | Redis | Session/rate-limit store now; ready for BullMQ job queues (notifications, media processing) as volume grows. |
| **Auth** | JWT (access + refresh) via `@nestjs/passport` | Stateless admin auth; refresh-token rotation stored in Redis for revocation. |
| **API style** | REST, OpenAPI 3 documented | Matches Frontend Plan §"API Format": REST for MVP, GraphQL explicitly deferred. |
| **Hosting** | Managed Postgres (AWS RDS or Neon) + containerized API (AWS ECS/Fargate or Railway/Render) | Matches Frontend Plan's staging note ("Managed service (AWS RDS, Vercel Postgres)"); horizontal scaling without re-architecture (NFR: Scalability). |
| **Monitoring** | Sentry (errors) + structured logs (pino) → CloudWatch/Logtail | Matches frontend's existing Sentry usage; NFR: Availability requires alerting on checkout/catalog services. |

**Open decision carried forward, not resolved here:** final hosting provider selection (AWS vs. a lighter PaaS like Railway/Render) — recommend deciding based on the client's budget and the team's DevOps bandwidth, since either satisfies the NFRs at MVP scale.

---

## 3. Monorepo Placement

The frontend plan already defines a pnpm/Turborepo workspace with `apps/storefront`, `apps/admin`, and shared `packages/`. The backend fits into the same workspace as a third app:

```
sett-el-hetta/
├── apps/
│   ├── storefront/
│   ├── admin/
│   └── api/                          ← NEW: NestJS backend
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/             # Admin login, JWT, refresh, RBAC guards
│       │   │   ├── catalog/          # Products, categories, search, filters
│       │   │   ├── inventory/        # Stock levels, InventoryLog, low-stock alerts
│       │   │   ├── cart/             # Server-side cart/session pricing (bundle rules)
│       │   │   ├── orders/           # Order lifecycle, state machine
│       │   │   ├── payments/         # PaymentProof upload/review (manual verification)
│       │   │   ├── promotions/       # Promo codes, bundle discount rules
│       │   │   ├── customers/        # Optional customer accounts, addresses
│       │   │   ├── admin-users/      # AdminUser CRUD, roles/permissions
│       │   │   ├── notifications/    # WhatsApp / email / SMS dispatch abstraction
│       │   │   ├── media/            # Signed upload URLs, image processing hooks
│       │   │   ├── reports/          # Sales/performance aggregates
│       │   │   └── contact/          # Contact/inquiry form routing
│       │   ├── common/
│       │   │   ├── guards/           # RolesGuard, JwtAuthGuard
│       │   │   ├── interceptors/     # Logging, audit-trail
│       │   │   ├── filters/          # Global exception filter
│       │   │   ├── decorators/       # @Roles(), @CurrentAdmin()
│       │   │   └── pipes/            # Zod/class-validator DTO validation
│       │   ├── prisma/
│       │   │   ├── schema.prisma
│       │   │   └── migrations/
│       │   ├── config/               # env schema/validation
│       │   ├── main.ts
│       │   └── app.module.ts
│       ├── test/
│       ├── Dockerfile
│       ├── .env.example
│       └── package.json
│
├── packages/
│   ├── types/                        # SHARED — Prisma-generated types feed this
│   │   └── src/{product,order,api}.ts
│   ├── api-client/                   # Frontend consumes; endpoint paths must match apps/api routes 1:1
│   └── utils/
```

This keeps the existing `packages/api-client/src/endpoints.ts` (already referenced in the frontend plan) as the single source of truth for route paths — every endpoint defined below should have a matching entry there.

---

## 4. Data Model

Derived directly from PRD §8 / SRS §6, expanded with the fields needed to enforce the state machine and RBAC. This is a Prisma schema outline — exact column types are a migration-time detail.

```prisma
enum OrderStatus {
  PENDING_REVIEW
  CONFIRMED
  REJECTED
  SHIPPED
  DELIVERED
  CANCELLED
}

enum PaymentMethod {
  COD
  VODAFONE_CASH
}

enum PaymentProofStatus {
  PENDING
  CONFIRMED
  REJECTED
}

enum AdminRole {
  OWNER
  STAFF
  DELIVERY_COORDINATOR
}

enum ProductStatus {
  ACTIVE
  RETIRED
}

model Category {
  id       String    @id @default(cuid())
  name     String
  slug     String    @unique
  parentId String?
  parent   Category? @relation("CategoryTree", fields: [parentId], references: [id])
  children Category[] @relation("CategoryTree")
  products Product[]
}

model Product {
  id          String        @id @default(cuid())
  sku         String        @unique
  name        String
  slug        String        @unique
  categoryId  String
  category    Category      @relation(fields: [categoryId], references: [id])
  description String?
  material    String?
  dimensions  String?
  price       Decimal       @db.Money
  isBundle    Boolean       @default(false)
  bundleItems BundleItem[]  // if isBundle, which products compose it
  media       ProductMedia[]
  stockQty    Int           @default(0)
  status      ProductStatus @default(ACTIVE)
  inventoryLogs InventoryLog[]
  orderItems  OrderItem[]
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@index([categoryId, status])
}

model BundleItem {
  id            String  @id @default(cuid())
  bundleId      String
  bundle        Product @relation(fields: [bundleId], references: [id])
  componentSku  String
  quantity      Int     @default(1)
}

model ProductMedia {
  id        String  @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id])
  url       String
  type      String  // "image" | "video"
  sortOrder Int     @default(0)
}

model Customer {
  id            String   @id @default(cuid())
  name          String
  phone         String   @unique
  email         String?
  passwordHash  String?  // null = guest checkout, never converted to account
  addresses     Address[]
  orders        Order[]
  createdAt     DateTime @default(now())
}

model Address {
  id         String   @id @default(cuid())
  customerId String
  customer   Customer @relation(fields: [customerId], references: [id])
  label      String?
  line1      String
  city       String
  notes      String?
}

model Order {
  id            String        @id @default(cuid())
  orderNumber   String        @unique  // human-readable, e.g. SEH-2026-0001
  customerId    String?
  customer      Customer?     @relation(fields: [customerId], references: [id])
  guestName     String?
  guestPhone    String?
  guestAddress  String?
  items         OrderItem[]
  subtotal      Decimal       @db.Money
  discountTotal Decimal       @db.Money @default(0)
  total         Decimal       @db.Money
  promoCodeId   String?
  promoCode     Promotion?    @relation(fields: [promoCodeId], references: [id])
  paymentMethod PaymentMethod
  paymentProof  PaymentProof?
  status        OrderStatus   @default(PENDING_REVIEW)
  statusHistory OrderStatusEvent[]
  source        String        @default("storefront")
  notes         String?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model OrderItem {
  id         String  @id @default(cuid())
  orderId    String
  order      Order   @relation(fields: [orderId], references: [id])
  productId  String
  product    Product @relation(fields: [productId], references: [id])
  quantity   Int
  unitPrice  Decimal @db.Money  // snapshot at time of order — never re-read from Product
}

model PaymentProof {
  id             String              @id @default(cuid())
  orderId        String              @unique
  order          Order               @relation(fields: [orderId], references: [id])
  imageUrl       String
  uploadedAt     DateTime            @default(now())
  status         PaymentProofStatus  @default(PENDING)
  reviewedById   String?
  reviewedBy     AdminUser?          @relation(fields: [reviewedById], references: [id])
  reviewNote     String?
  reviewedAt     DateTime?
}

// Immutable audit trail — required by NFR "Auditability" (SRS §5)
model OrderStatusEvent {
  id        String      @id @default(cuid())
  orderId   String
  order     Order       @relation(fields: [orderId], references: [id])
  fromStatus OrderStatus?
  toStatus   OrderStatus
  actorId    String?     // AdminUser id; null = system
  actorType  String      // "admin" | "system"
  note       String?
  createdAt  DateTime    @default(now())
}

model Promotion {
  id           String   @id @default(cuid())
  code         String   @unique
  discountType String   // "percentage" | "fixed" | "bundle"
  discountValue Decimal
  startsAt     DateTime?
  endsAt       DateTime?
  usageLimit   Int?
  usageCount   Int      @default(0)
  active       Boolean  @default(true)
  orders       Order[]
}

model AdminUser {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  passwordHash  String
  role          AdminRole @default(STAFF)
  active        Boolean   @default(true)
  reviewedProofs PaymentProof[]
  createdAt     DateTime  @default(now())
}

model InventoryLog {
  id         String   @id @default(cuid())
  productId  String
  product    Product  @relation(fields: [productId], references: [id])
  change     Int      // signed: -2, +10, etc.
  reason     String   // "order_placed" | "manual_adjustment" | "restock" | "order_cancelled"
  adminId    String?
  createdAt  DateTime @default(now())
}

model ContactInquiry {
  id        String   @id @default(cuid())
  name      String
  phone     String?
  email     String?
  message   String
  routedTo  String   // notification channel used
  createdAt DateTime @default(now())
}
```

**Design notes:**
- `OrderItem.unitPrice` is a snapshot, not a live join to `Product.price` — orders must remain historically accurate even if prices change later.
- `OrderStatusEvent` exists specifically to satisfy SRS §5 Auditability ("logged with timestamp and acting admin user"). Every status mutation writes one row here in the same transaction as the `Order.status` update — never update status without it.
- `PaymentProof` is a 1:1 with `Order`, not embedded in it, so the review workflow (FR-5.3/5.4) has its own timestamps and reviewer reference independent of the order record.
- Guest checkout (`customerId = null`, `guestName/guestPhone/guestAddress` populated) is the default per PRD persona table ("يصل غالبًا... يتصفح ويشتري دون الحاجة لإنشاء حساب"); registered accounts (FR-3.8) are additive, not required.

---

## 5. API Surface

Grouped to match the FR-x.x numbering in the PRD/SRS so QA and the frontend team can trace endpoints back to requirements.

### 5.1 Public — Catalog & Discovery (FR-2.x)

| Method & Path | Purpose | Auth |
|---|---|---|
| `GET /categories` | List category tree | Public |
| `GET /products` | List/search/filter products — query params: `category`, `q`, `minPrice`, `maxPrice`, `material`, `page`, `limit` | Public |
| `GET /products/:slug` | Product detail (media, stock status, bundle composition) | Public |

Stock status returned to the client is derived server-side (`in_stock` / `low_stock` / `out_of_stock`, threshold configurable) — the frontend never computes this from raw `stockQty`, keeping the "≤ some threshold" business rule in one place (FR-2.5).

### 5.2 Public — Cart & Checkout (FR-3.x)

| Method & Path | Purpose | Auth |
|---|---|---|
| `POST /cart/price` | Server-side re-pricing of a cart payload (line items) — applies bundle discount rules (FR-3.2) and returns authoritative subtotal/total | Public |
| `POST /orders` | Create order. Body: items, customer/guest info, paymentMethod, promoCode?, and — if `paymentMethod = VODAFONE_CASH` — a `paymentProofImageId` from a prior media upload. **Always creates status `PENDING_REVIEW`; no request payload can set any other initial status.** | Public |
| `GET /orders/:orderNumber/track` | Order status + history for customer-facing tracking (FR-3.7), scoped by order number + phone number match (no auth account required) | Public (phone-verified) |
| `POST /media/payment-proof` | Upload transfer-proof image, returns a reference to attach to the order create call | Public, rate-limited |

`POST /cart/price` exists so the bundle-discount logic (PRD FR-3.2, SRS §3.3) lives once on the server and both the live cart UI and the final checkout total call the same code path — avoids the classic bug where displayed cart total and charged total diverge.

### 5.3 Public — Optional Customer Accounts (FR-3.8)

| Method & Path | Purpose | Auth |
|---|---|---|
| `POST /auth/customer/register` | Optional account creation | Public |
| `POST /auth/customer/login` | Customer login | Public |
| `GET /customers/me/orders` | Order history | Customer JWT |
| `GET /customers/me/addresses`, `POST /customers/me/addresses` | Saved addresses | Customer JWT |

### 5.4 Public — Brand & Marketing (FR-1.x, FR-6.x)

| Method & Path | Purpose | Auth |
|---|---|---|
| `GET /content/home` | Featured products, seasonal collections, bundle offers for homepage | Public |
| `GET /blog/posts`, `GET /blog/posts/:slug` | Blog listing/detail (Should, FR-1.4) | Public |
| `POST /contact` | Contact form submission → routes to admin notification channel (FR-1.5/6.3) | Public, rate-limited |

### 5.5 Admin — Auth (foundation for RBAC, FR-5.7)

| Method & Path | Purpose | Auth |
|---|---|---|
| `POST /admin/auth/login` | Email/password → access + refresh JWT | Public |
| `POST /admin/auth/refresh` | Rotate access token | Refresh token |
| `POST /admin/auth/logout` | Revoke refresh token | Admin JWT |

### 5.6 Admin — Catalog & Inventory (FR-4.x)

| Method & Path | Purpose | Role |
|---|---|---|
| `POST /admin/products`, `PATCH /admin/products/:id`, `DELETE /admin/products/:id` (soft — sets `RETIRED`) | Product CRUD | Owner, Staff |
| `POST /admin/products/:id/media` | Bulk media upload (FR-4.2) | Owner, Staff |
| `PATCH /admin/products/:id/stock` | Manual stock adjustment — writes `InventoryLog` | Owner, Staff |
| `GET /admin/inventory/alerts` | Low/out-of-stock list (FR-4.4) | Owner, Staff |
| `POST /admin/promotions`, `PATCH /admin/promotions/:id` | Promo/bundle rule management (FR-4.5) | Owner |

### 5.7 Admin — Orders & Payment Verification (FR-5.x) — the critical module

| Method & Path | Purpose | Role |
|---|---|---|
| `GET /admin/orders` | List with filters: status, paymentMethod, dateRange, source (FR-5.1) | Owner, Staff |
| `GET /admin/orders/:id` | Full detail: items, customer, address, payment method, status history (FR-5.2) | Owner, Staff |
| `GET /admin/orders/:id/payment-proof` | Full-resolution proof image (FR-5.3) | Owner, Staff |
| `POST /admin/orders/:id/confirm` | **Only valid transition into `CONFIRMED`.** For COD, always allowed from `PENDING_REVIEW`. For Vodafone Cash, the service layer *rejects the call with a 409* if `paymentProof.status` is not first explicitly set via the review step — confirming an order is never a side effect of anything else. Writes `OrderStatusEvent`. (FR-5.4) | Owner, Staff |
| `POST /admin/orders/:id/reject` | Sets `REJECTED`, requires `reason` note, triggers customer notification (FR-5.4) | Owner, Staff |
| `PATCH /admin/orders/:id/status` | Transitions to `SHIPPED` / `DELIVERED` / `CANCELLED` per the allowed-transition table below (FR-5.5) | Owner, Staff, Delivery Coordinator (shipping/delivery only) |
| `GET /admin/reports/sales` | Best-sellers, revenue by category, volume trends (FR-5.8) | Owner |

**Allowed status transitions (enforced in a single `OrdersStateMachine` service, not scattered across controllers):**

```
PENDING_REVIEW → CONFIRMED   (admin action only; Vodafone Cash requires proof review first)
PENDING_REVIEW → REJECTED    (admin action, Vodafone Cash only, requires reason)
PENDING_REVIEW → CANCELLED   (admin action)
CONFIRMED      → SHIPPED     (admin action)
CONFIRMED      → CANCELLED   (admin action, per business rules — PRD §7.2)
SHIPPED        → DELIVERED   (admin action; automatable later via courier webhook)
```

Any transition not in this table returns `409 Conflict`. This is the single most important piece of business logic in the system (PRD's own words: "أهم قرار تصميمي في هذا الإصدار") and should have the heaviest test coverage in the codebase (see §8).

### 5.8 Admin — User & Role Management

| Method & Path | Purpose | Role |
|---|---|---|
| `GET/POST/PATCH /admin/users` | Manage AdminUser accounts and roles | Owner only |

---

## 6. Order & Payment Verification — Sequence

Matches the flow diagrammed in the Platform Design Map (شكل ٢) and PRD §7:

1. Customer submits checkout → `POST /orders`.
2. If `paymentMethod = VODAFONE_CASH`, the request must include a `paymentProofImageId` obtained from a prior `POST /media/payment-proof` call; the API rejects order creation without it (`400`).
3. Order service creates `Order` (status `PENDING_REVIEW`) and, if applicable, a linked `PaymentProof` (status `PENDING`) — in one DB transaction.
4. `InventoryLog` entries are written and `Product.stockQty` decremented at order-creation time (reserving stock), not at confirmation — otherwise two pending orders could oversell the same low-stock item. If an order is later `REJECTED` or `CANCELLED`, stock is restored via a compensating `InventoryLog` entry.
5. Customer receives a "received, pending review" notification (§7 below) — never a "confirmed" message.
6. Admin console lists the order under `PENDING_REVIEW`; for Vodafone Cash, admin opens `GET /admin/orders/:id/payment-proof`.
7. Admin calls `POST /admin/orders/:id/confirm` or `.../reject`. Both write an `OrderStatusEvent` with `actorId` set. Confirm/reject each fire the matching customer notification.
8. Admin progresses the order through `SHIPPED` → `DELIVERED` via `PATCH /admin/orders/:id/status`, each transition notifying the customer.

---

## 7. Notifications Module

An abstraction over multiple channels, since the SRS leaves the exact WhatsApp integration approach and SMS/email provider as open decisions (§8.2):

```
notifications/
├── notification.service.ts     # dispatch(event, order) — chooses channel(s)
├── channels/
│   ├── whatsapp.channel.ts     # Business API today; Click-to-Chat deep-link fallback
│   ├── email.channel.ts        # Provider-agnostic interface (e.g. SendGrid/SES)
│   └── sms.channel.ts          # Provider-agnostic interface (e.g. Twilio/local aggregator)
└── templates/                  # One template per event, per channel
```

Events that trigger dispatch (PRD §7.4 / SRS §7.4): `order_submitted`, `order_confirmed`, `order_rejected`, `order_shipped`, `order_delivered`. The service is called from the same transaction boundary as the status-changing endpoint but sends asynchronously (via a Redis-backed queue) so a slow WhatsApp/SMS provider never blocks the admin's confirm/reject action.

Keeping this behind an interface means the "WhatsApp Business API vs. Click-to-Chat" and "SMS/email provider" decisions (both explicitly open in SRS §8.2) can be made later without touching order/payment logic.

---

## 8. Testing Strategy

| Layer | Approach | Priority |
|---|---|---|
| **Order state machine** | Exhaustive unit tests for every transition in §5.7's table, plus every *disallowed* transition returning 409. Specifically: a test asserting a Vodafone Cash order cannot reach `CONFIRMED` without a prior proof review — this is the rule the whole project brief calls out as the most consequential decision. | Highest |
| **Inventory** | Concurrency test: two simultaneous orders against the last unit of stock — only one should succeed. | High |
| **RBAC** | Guard tests per role × per endpoint matrix (Owner/Staff/Delivery Coordinator). | High |
| **Pricing/bundles** | Unit tests for the discount engine against the bundle rules defined in Admin promotions. | Medium |
| **Integration** | Supertest against a test Postgres instance for the full checkout → admin-confirm → notification-sent flow. | Medium |
| **Contract** | OpenAPI schema diffed in CI against `packages/api-client/src/endpoints.ts` so frontend and backend can't silently drift. | Medium |

Target: mirror the frontend plan's stated 60%+ integration coverage, with the order/payment module held to a stricter bar given its criticality.

---

## 9. Security & Compliance (NFR: Security, Auditability, Data retention)

- All traffic over HTTPS/TLS (NFR: Performance/Security).
- Admin passwords hashed with bcrypt/argon2; JWT access tokens short-lived (15 min), refresh tokens rotated and revocable via Redis.
- Payment-proof images stored in a private bucket, served only via short-lived signed URLs to authenticated admins — never publicly listable.
- Rate limiting on `POST /orders`, `POST /media/payment-proof`, and `POST /contact` to prevent abuse of unauthenticated write endpoints.
- Every order status change and payment confirm/reject is written to `OrderStatusEvent` with `actorId` and timestamp — satisfies SRS §5 Auditability directly.
- Payment-proof images retained per a defined policy (SRS §5 Data retention says "at least the duration required for dispute resolution and accounting") — recommend confirming a concrete retention period (e.g. 12–24 months) with the client, then implementing a scheduled cleanup job; this is an open business decision, not a technical one.
- Input validation on every DTO (class-validator/Zod) — particularly checkout payloads, given they're public and unauthenticated.

---

## 10. Environment Configuration

Mirrors the frontend's `VITE_API_BASE_URL` per-environment pattern:

```bash
# apps/api/.env.example
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/settelhetta
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
MEDIA_STORAGE_BUCKET=
MEDIA_STORAGE_REGION=
CDN_BASE_URL=
WHATSAPP_PROVIDER=click_to_chat   # or business_api
WHATSAPP_MERCHANT_NUMBER=
EMAIL_PROVIDER_API_KEY=
SMS_PROVIDER_API_KEY=
SENTRY_DSN=
```

Staging/production values follow the same three-tier pattern already established in the frontend plan (`localhost:3000` → `api-staging.sett-el-hetta.com` → `api.sett-el-hetta.com`).

---

## 11. Delivery Roadmap (aligned to PRD §11 phases)

| Phase | Backend Focus | Key Outputs |
|---|---|---|
| **Phase 1 — Discovery & Design** | Finalize schema against approved wireframes; confirm hosting/DB provider; draft OpenAPI spec for frontend team to build against in parallel | ERD, OpenAPI spec v0.1 |
| **Phase 2 — MVP Build** | Catalog, cart pricing, order creation, payment-proof upload, admin auth/RBAC, order state machine, notifications (Click-to-Chat + one email/SMS provider), inventory logging | Deployed staging API, Swagger docs live |
| **Phase 3 — Beta Launch** | Load/perf testing against NFR targets (sub-3s, 99.5% uptime), monitoring/alerting wired to Sentry, reporting endpoints, real catalog data migration | Production API, monitoring dashboards |
| **Phase 4 — Expansion** | Payment gateway integration (Vodafone Cash API/InstaPay/Paymob), courier API integration (Bosta/Mylerz), loyalty groundwork | New modules behind existing state-machine abstractions, no breaking schema changes |

---

## 12. Open Questions for the Client/Team

Carried over from SRS §8.2 and extended with backend-specific items:

- Final hosting provider and DB service (AWS RDS vs. Neon vs. Vercel Postgres) — recommend deciding in Phase 1.
- WhatsApp Business API (paid, requires approval) vs. Click-to-Chat (free, simpler) — affects the `notifications/channels/whatsapp.channel.ts` implementation timeline.
- SMS/email provider selection — needs to support Arabic content correctly.
- Concrete payment-proof image retention period (compliance/accounting requirement, not purely technical).
- Low-stock threshold value(s) per category — needed to implement `GET /admin/inventory/alerts` and the stock-status logic behind FR-2.5.
