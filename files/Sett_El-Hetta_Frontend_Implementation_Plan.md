# SETT EL-HETTA PLATFORM
## Front-End Implementation Plan v1.0

**Date:** July 19, 2026  
**Project:** Digital Portfolio & E-Commerce Platform  
**Scope:** Customer Storefront + Admin Console + Marketing Integration  
**Phase 1 Timeline:** 3 months (Weeks 1–12)

---

## TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Component Architecture](#component-architecture)
5. [Design System & Styling](#design-system--styling)
6. [Development Workflow](#development-workflow)
7. [Phase-Based Implementation](#phase-based-implementation)
8. [Coding Standards & Best Practices](#coding-standards--best-practices)
9. [Testing Strategy](#testing-strategy)
10. [Performance Optimization](#performance-optimization)
11. [Deployment & DevOps](#deployment--devops)
12. [Monitoring & Analytics](#monitoring--analytics)
13. [Dependencies & Packages](#dependencies--packages)
14. [Risk Mitigation](#risk-mitigation)

---

## EXECUTIVE SUMMARY

This document outlines the technical strategy for building the Sett El-Hetta front-end, comprising two integrated applications:

1. **Customer Portal** — Portfolio & Storefront (public-facing)
2. **Admin Dashboard** — Catalog, Inventory, Orders (internal operations)

**Key Principles:**
- Mobile-first, responsive design (Arabic RTL)
- Progressive enhancement (works on slow networks)
- Component-based architecture (reusability, maintainability)
- Type-safe development (TypeScript)
- Automated testing & CI/CD
- Accessibility compliance (WCAG 2.1 AA)

**Deliverables (Phase 1):**
- Fully functional e-commerce storefront with manual payment flow
- Admin operations console with product, inventory, and order management
- WhatsApp integration (click-to-chat, notifications)
- Responsive design (mobile 320px → desktop 1920px)
- SEO optimization (structured data, Open Graph meta tags)

---

## TECHNOLOGY STACK

### Frontend Framework & Build

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | React 18+ (TypeScript) | Component-based, well-supported ecosystem, large community |
| **Build Tool** | Vite | Fast builds, HMR, optimized production bundles |
| **Runtime** | Node.js 18+ | Server-side rendering (SSR) prep, tooling |
| **Package Manager** | pnpm | Faster, more reliable than npm, monorepo support |

### Styling & Layout

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **CSS Framework** | Tailwind CSS 3+ | Utility-first, highly customizable, RTL support native |
| **CSS-in-JS** | CSS Modules + Tailwind | Scoped styles, no runtime overhead |
| **Icon Library** | Heroicons (SVG) | Consistent, accessible, RTL-ready |

### State Management & Data Fetching

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **State Management** | Zustand | Lightweight, simple API, no boilerplate |
| **Data Fetching** | TanStack Query (React Query) | Server state caching, automatic refetching, dev tools |
| **API Client** | Axios | Interceptors for auth, error handling, RTL header support |

### Routing & Navigation

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Router** | React Router v6+ | Standard in React ecosystem, nested routes, TypeScript support |
| **Link Prefetching** | React Router + Prefetch API | Performance optimization |

### Form Handling & Validation

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Form Library** | React Hook Form | Lightweight, performant, minimal rerenders |
| **Validation** | Zod or Yup | Schema validation, TypeScript integration, error messages |

### UI Component Library

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Component Lib** | Headless UI (Radix UI) + Tailwind | Accessible, unstyled primitives, full control |
| **Alternative** | Chakra UI | Higher-level components, built-in accessibility, Arabic support |

### Image Optimization

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Image Library** | Next.js Image or Sharp | Auto-resize, WebP conversion, lazy-loading |
| **CDN** | Cloudinary or AWS S3 + CloudFront | Responsive image serving, on-the-fly optimization |

### Authentication & Security

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Auth** | JWT (stored in httpOnly cookies) | Stateless, secure, CSRF-proof |
| **Session Mgmt** | Custom middleware + Zustand | Store auth state, handle refresh tokens |

### Testing

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Unit/Integration** | Vitest + React Testing Library | Fast, shallow rendering, follows best practices |
| **E2E Testing** | Playwright or Cypress | Real browser testing, visual regression |
| **Visual Testing** | Percy or Chromatic | Detect UI regressions automatically |

### Development Tools

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Code Quality** | ESLint + Prettier | Enforce standards, auto-format code |
| **Type Checking** | TypeScript + type-check script | Catch errors at dev time |
| **Git Hooks** | Husky + lint-staged | Prevent bad commits |
| **Documentation** | Storybook + MDX | Live component documentation |

### Monitoring & Analytics

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Error Tracking** | Sentry | Production error monitoring & source maps |
| **Analytics** | Segment or Google Analytics 4 | User behavior, conversion tracking |
| **Performance** | Web Vitals, Lighthouse CI | Continuous performance monitoring |
| **Logging** | Pino or Winston | Structured server/client logging |

### API & Backend Integration

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Backend Framework** | Node.js (Express/Fastify) or Python (FastAPI) | TBD with backend team |
| **API Format** | REST (GraphQL optional future) | Simpler than GraphQL for MVP |
| **API Documentation** | Swagger/OpenAPI + Redoc | Automated, interactive API docs |

---

## PROJECT STRUCTURE

```
sett-el-hetta/
├── apps/
│   ├── storefront/                  # Customer-facing portal
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── common/          # Reusable across pages
│   │   │   │   │   ├── Header.tsx
│   │   │   │   │   ├── Footer.tsx
│   │   │   │   │   ├── Navigation.tsx
│   │   │   │   │   ├── MobileMenu.tsx
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Card.tsx
│   │   │   │   │   └── ...
│   │   │   │   ├── layouts/         # Page layout wrappers
│   │   │   │   │   ├── MainLayout.tsx
│   │   │   │   │   ├── CheckoutLayout.tsx
│   │   │   │   │   └── ErrorLayout.tsx
│   │   │   │   ├── hero/            # Homepage sections
│   │   │   │   │   ├── HeroCarousel.tsx
│   │   │   │   │   ├── FeaturedProducts.tsx
│   │   │   │   │   └── Testimonials.tsx
│   │   │   │   ├── product/         # Product-specific
│   │   │   │   │   ├── ProductCard.tsx
│   │   │   │   │   ├── ProductGrid.tsx
│   │   │   │   │   ├── ProductDetail.tsx
│   │   │   │   │   ├── ProductImageGallery.tsx
│   │   │   │   │   ├── ProductReviews.tsx
│   │   │   │   │   └── RelatedProducts.tsx
│   │   │   │   ├── cart/            # Shopping cart
│   │   │   │   │   ├── CartIcon.tsx
│   │   │   │   │   ├── CartSidebar.tsx
│   │   │   │   │   ├── CartItem.tsx
│   │   │   │   │   └── CartSummary.tsx
│   │   │   │   ├── checkout/        # Checkout flow
│   │   │   │   │   ├── CheckoutStepper.tsx
│   │   │   │   │   ├── BillingForm.tsx
│   │   │   │   │   ├── ShippingForm.tsx
│   │   │   │   │   ├── PaymentMethodSelect.tsx
│   │   │   │   │   ├── CashOnDeliveryForm.tsx
│   │   │   │   │   ├── VodafoneCashForm.tsx
│   │   │   │   │   ├── OrderReview.tsx
│   │   │   │   │   └── OrderConfirmation.tsx
│   │   │   │   ├── search/          # Search & filtering
│   │   │   │   │   ├── SearchBar.tsx
│   │   │   │   │   ├── ProductFilter.tsx
│   │   │   │   │   ├── CategoryFilter.tsx
│   │   │   │   │   ├── PriceRangeSlider.tsx
│   │   │   │   │   └── SortOptions.tsx
│   │   │   │   ├── account/         # Customer accounts (Phase 2)
│   │   │   │   │   ├── LoginForm.tsx
│   │   │   │   │   ├── SignupForm.tsx
│   │   │   │   │   ├── ProfilePage.tsx
│   │   │   │   │   ├── OrderHistory.tsx
│   │   │   │   │   ├── Favorites.tsx
│   │   │   │   │   └── AddressManager.tsx
│   │   │   │   └── forms/           # Reusable form components
│   │   │   │       ├── InputField.tsx
│   │   │   │       ├── SelectField.tsx
│   │   │   │       ├── FileUpload.tsx
│   │   │   │       ├── FormError.tsx
│   │   │   │       └── FormSubmitButton.tsx
│   │   │   ├── pages/
│   │   │   │   ├── HomePage.tsx
│   │   │   │   ├── StoryPage.tsx
│   │   │   │   ├── GalleryPage.tsx
│   │   │   │   ├── BlogPage.tsx
│   │   │   │   ├── BlogPostPage.tsx
│   │   │   │   ├── CatalogPage.tsx
│   │   │   │   ├── ProductPage.tsx
│   │   │   │   ├── CartPage.tsx
│   │   │   │   ├── CheckoutPage.tsx
│   │   │   │   ├── OrderConfirmationPage.tsx
│   │   │   │   ├── OrderTrackingPage.tsx
│   │   │   │   ├── ContactPage.tsx
│   │   │   │   ├── NotFoundPage.tsx
│   │   │   │   ├── ErrorPage.tsx
│   │   │   │   └── PrivacyPage.tsx
│   │   │   ├── hooks/               # Custom React hooks
│   │   │   │   ├── useCart.ts
│   │   │   │   ├── useProducts.ts
│   │   │   │   ├── useOrders.ts
│   │   │   │   ├── useSearch.ts
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useInfiniteScroll.ts
│   │   │   │   ├── useLocalStorage.ts
│   │   │   │   └── useMediaQuery.ts
│   │   │   ├── stores/              # Zustand state management
│   │   │   │   ├── cartStore.ts
│   │   │   │   ├── authStore.ts
│   │   │   │   ├── filterStore.ts
│   │   │   │   ├── uiStore.ts
│   │   │   │   └── notificationStore.ts
│   │   │   ├── services/            # API calls
│   │   │   │   ├── api.ts           # Axios instance + interceptors
│   │   │   │   ├── productService.ts
│   │   │   │   ├── orderService.ts
│   │   │   │   ├── authService.ts
│   │   │   │   ├── inquiryService.ts
│   │   │   │   ├── whatsappService.ts
│   │   │   │   └── uploadService.ts
│   │   │   ├── utils/
│   │   │   │   ├── constants.ts
│   │   │   │   ├── helpers.ts
│   │   │   │   ├── formatting.ts    # Price, date, text formatting
│   │   │   │   ├── validation.ts
│   │   │   │   ├── storage.ts
│   │   │   │   ├── analytics.ts
│   │   │   │   └── errors.ts
│   │   │   ├── types/
│   │   │   │   ├── index.ts         # Shared types
│   │   │   │   ├── product.ts
│   │   │   │   ├── order.ts
│   │   │   │   ├── user.ts
│   │   │   │   ├── cart.ts
│   │   │   │   └── api.ts
│   │   │   ├── styles/
│   │   │   │   ├── globals.css      # Global styles + CSS variables
│   │   │   │   ├── tailwind.config.ts
│   │   │   │   ├── fonts.css        # Custom fonts (Arabic)
│   │   │   │   └── animations.css
│   │   │   ├── config/
│   │   │   │   ├── api.config.ts
│   │   │   │   ├── app.config.ts
│   │   │   │   └── seo.config.ts
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── errorBoundary.ts
│   │   │   │   └── analytics.ts
│   │   │   ├── App.tsx              # Root component
│   │   │   ├── main.tsx             # Entry point
│   │   │   └── vite-env.d.ts
│   │   ├── public/
│   │   │   ├── images/
│   │   │   ├── icons/
│   │   │   ├── favicon.ico
│   │   │   └── manifest.json
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   ├── integration/
│   │   │   ├── e2e/
│   │   │   └── mocks/
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── admin/                       # Admin dashboard
│       ├── src/
│       │   ├── components/
│       │   │   ├── layout/
│       │   │   │   ├── AdminHeader.tsx
│       │   │   │   ├── AdminSidebar.tsx
│       │   │   │   └── DashboardLayout.tsx
│       │   │   ├── dashboard/
│       │   │   │   ├── SalesCard.tsx
│       │   │   │   ├── StatCard.tsx
│       │   │   │   ├── Chart.tsx
│       │   │   │   └── RecentOrders.tsx
│       │   │   ├── products/
│       │   │   │   ├── ProductList.tsx
│       │   │   │   ├── ProductForm.tsx
│       │   │   │   ├── ProductImageUpload.tsx
│       │   │   │   ├── BulkUpload.tsx
│       │   │   │   └── ProductTable.tsx
│       │   │   ├── inventory/
│       │   │   │   ├── InventoryTable.tsx
│       │   │   │   ├── StockAlert.tsx
│       │   │   │   ├── QuickEditStock.tsx
│       │   │   │   └── InventoryLog.tsx
│       │   │   ├── orders/
│       │   │   │   ├── OrderList.tsx
│       │   │   │   ├── OrderDetail.tsx
│       │   │   │   ├── OrderStatusTimeline.tsx
│       │   │   │   ├── PaymentVerification.tsx
│       │   │   │   ├── VodafoneCashImageViewer.tsx
│       │   │   │   ├── OrderNotes.tsx
│       │   │   │   └── ShippingLabel.tsx
│       │   │   ├── reports/
│       │   │   │   ├── SalesReport.tsx
│       │   │   │   ├── BestSellers.tsx
│       │   │   │   └── RevenueByCategory.tsx
│       │   │   ├── promotions/
│       │   │   │   ├── PromoList.tsx
│       │   │   │   ├── PromoForm.tsx
│       │   │   │   └── PromoStats.tsx
│       │   │   ├── forms/
│       │   │   │   └── [shared form components]
│       │   │   └── common/
│       │   │       ├── DataTable.tsx
│       │   │       ├── SearchBox.tsx
│       │   │       ├── FilterPanel.tsx
│       │   │       └── StatusBadge.tsx
│       │   ├── pages/
│       │   │   ├── DashboardPage.tsx
│       │   │   ├── ProductsPage.tsx
│       │   │   ├── InventoryPage.tsx
│       │   │   ├── OrdersPage.tsx
│       │   │   ├── OrderDetailPage.tsx
│       │   │   ├── ReportsPage.tsx
│       │   │   ├── PromotionsPage.tsx
│       │   │   ├── SettingsPage.tsx
│       │   │   └── LoginPage.tsx
│       │   ├── hooks/
│       │   │   ├── useOrders.ts
│       │   │   ├── useProducts.ts
│       │   │   ├── useInventory.ts
│       │   │   ├── useDashboardStats.ts
│       │   │   └── useAuth.ts
│       │   ├── stores/
│       │   │   ├── authStore.ts
│       │   │   ├── filterStore.ts
│       │   │   └── notificationStore.ts
│       │   ├── services/
│       │   │   ├── orderService.ts
│       │   │   ├── productService.ts
│       │   │   ├── inventoryService.ts
│       │   │   ├── dashboardService.ts
│       │   │   └── uploadService.ts
│       │   ├── utils/
│       │   │   ├── formatters.ts
│       │   │   └── validators.ts
│       │   ├── types/
│       │   │   └── index.ts
│       │   ├── styles/
│       │   └── App.tsx
│       ├── public/
│       ├── tests/
│       ├── vite.config.ts
│       ├── tsconfig.json
│       ├── package.json
│       └── README.md
│
├── packages/                        # Shared packages (monorepo)
│   ├── types/                       # Shared TypeScript types
│   │   └── src/
│   │       ├── product.ts
│   │       ├── order.ts
│   │       ├── api.ts
│   │       └── index.ts
│   ├── ui/                          # Shared UI components
│   │   └── src/
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       ├── Alert.tsx
│   │       └── index.ts
│   ├── utils/                       # Shared utilities
│   │   └── src/
│   │       ├── formatting.ts
│   │       ├── validation.ts
│   │       └── index.ts
│   └── api-client/                  # Shared API client
│       └── src/
│           ├── client.ts
│           ├── endpoints.ts
│           └── index.ts
│
├── .github/
│   └── workflows/
│       ├── ci.yml                   # Lint, test, type-check
│       ├── deploy-staging.yml       # Deploy to staging
│       └── deploy-production.yml    # Deploy to production
│
├── docker-compose.yml               # Local dev environment
├── pnpm-workspace.yaml              # Monorepo config
├── turbo.json                       # Turborepo build config
├── .eslintrc.json
├── .prettierrc
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## COMPONENT ARCHITECTURE

### Component Hierarchy

```
App
├── Router
│   ├── Storefront
│   │   ├── MainLayout
│   │   │   ├── Header
│   │   │   │   ├── Logo
│   │   │   │   ├── Navigation
│   │   │   │   ├── CartIcon
│   │   │   │   ├── LanguageSwitcher
│   │   │   │   └── MobileMenuToggle
│   │   │   ├── Pages (home, product, checkout, etc.)
│   │   │   └── Footer
│   │   │       ├── FooterLinks
│   │   │       ├── SocialLinks
│   │   │       └── Newsletter
│   │   └── CartSidebar (floating)
│   │       └── CartItem[] + CheckoutCTA
│   │
│   ├── Admin
│   │   ├── AuthGuard
│   │   │   └── LoginPage (if not authenticated)
│   │   └── DashboardLayout
│   │       ├── AdminHeader
│   │       ├── Sidebar (navigation)
│   │       └── Pages (orders, products, etc.)
│   │
│   └── Error Pages
│       ├── 404Page
│       ├── 500Page
│       └── ErrorBoundary

```

### Component Types

**1. Layout Components** (Reusable page shells)
- MainLayout (header, footer, navigation)
- CheckoutLayout (stepper, progress)
- AdminLayout (sidebar, top bar)

**2. Container Components** (Smart, connected to state/API)
- ProductGrid (fetches products, passes to ProductCard)
- OrderList (fetches orders, displays table)
- CheckoutFlow (manages checkout state)

**3. Presentational Components** (Dumb, receive props)
- Button, Card, Modal, Input, Badge
- ProductCard (displays single product)
- OrderRow (displays single order)

**4. Page Components** (Top-level route handlers)
- HomePage, CatalogPage, CheckoutPage
- DashboardPage, OrdersPage, ProductsPage

### Shared Component Library (Storybook)

All components documented in Storybook for:
- Development isolation
- Cross-team communication
- Component documentation
- Visual regression testing

---

## DESIGN SYSTEM & STYLING

### Tailwind CSS Configuration

```typescript
// tailwind.config.ts
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand colors (Sett El-Hetta)
        gold: {
          50: '#FFF9F0',
          100: '#FFE8D1',
          200: '#FFD4A3',
          300: '#FFC075',
          400: '#FFAC47',
          500: '#FF9C1F',   // Primary brand color
          600: '#E68A1A',
          700: '#CC7815',
          800: '#B26610',
          900: '#99540B',
        },
        sand: {
          50: '#FAF7F2',
          100: '#F5EFE6',
          200: '#EBE2D5',
          300: '#E1D6C3',
          400: '#D7C9B2',
          500: '#CCBBA0',   // Secondary color
          600: '#B8A890',
          700: '#9D927A',
          800: '#827C64',
          900: '#67664E',
        },
        // Neutral
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        // Status colors
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Cairo', 'Tajawal', 'system-ui', 'sans-serif'], // Arabic-first fonts
        arabic: ['Cairo', 'Tajawal', 'serif'],
      },
      fontSize: {
        // RTL-optimized scale
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        // RTL-aware spacing
        '4.5': '1.125rem',
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in',
        slideInRight: 'slideInRight 0.3s ease-out',
        slideInLeft: 'slideInLeft 0.3s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(1rem)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-1rem)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      backdropFilter: {
        none: 'none',
        blur: 'blur(10px)',
      },
      boxShadow: {
        soft: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  corePlugins: {
    // Customize Tailwind if needed
  },
  plugins: [
    require('@tailwindcss/forms'),      // Better form styling
    require('@tailwindcss/typography'),  // Prose for blog content
    require('@tailwindcss/aspect-ratio'),// Image aspect ratios
  ],
};
```

### CSS Custom Properties (Variables)

```css
/* globals.css */
:root {
  /* Colors */
  --color-primary: #FF9C1F;
  --color-primary-dark: #E68A1A;
  --color-secondary: #CCBBA0;
  --color-accent: #10B981;
  
  /* Spacing */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
  
  /* Typography */
  --font-family-primary: 'Cairo', 'Tajawal', sans-serif;
  --font-size-base: 1rem;
  --line-height-base: 1.5;
  
  /* Layout */
  --max-width-container: 1280px;
  --header-height: 64px;
  --footer-height: auto;
  
  /* Z-index */
  --z-dropdown: 1000;
  --z-modal: 1050;
  --z-notification: 1100;
  
  /* Transitions */
  --transition-duration: 200ms;
  --transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
}

/* RTL adjustments */
[dir='rtl'] {
  direction: rtl;
  unicode-bidi: bidi-override;
}

[dir='ltr'] {
  direction: ltr;
  unicode-bidi: bidi-override;
}

/* Light theme (default) */
:root {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F9FAFB;
  --text-primary: #111827;
  --text-secondary: #6B7280;
  --border-color: #E5E7EB;
}

/* Dark theme (future) */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #111827;
    --bg-secondary: #1F2937;
    --text-primary: #F9FAFB;
    --text-secondary: #D1D5DB;
    --border-color: #374151;
  }
}
```

### Responsive Breakpoints

```
Mobile:   320px - 479px
Tablet:   480px - 767px
Desktop:  768px - 1024px
Wide:     1025px+
```

---

## DEVELOPMENT WORKFLOW

### Local Development Setup

```bash
# Clone repository
git clone https://github.com/sett-el-hetta/platform.git
cd platform

# Install dependencies (pnpm required)
pnpm install

# Environment setup
cp .env.example .env.local
# Edit .env.local with API endpoints, API keys, etc.

# Start development server
pnpm dev

# Run storefront only
pnpm dev --filter=storefront

# Run admin only
pnpm dev --filter=admin

# Run specific port
pnpm --filter=storefront dev -- --port 5173
```

### Git Workflow

```
main branch (production)
  ↓
staging branch (staging environment)
  ↓
develop branch (integration)
  ↓
feature branches: feature/FEATURE-ID
                 bugfix/BUG-ID
                 chore/CHORE-ID
```

**Branch Naming Convention:**
- `feature/PR-1.1-homepage` (from feature plan)
- `bugfix/fix-cart-calculation`
- `chore/update-dependencies`

**Commit Messages:**
```
[SCOPE] Short description

Longer description explaining the change, why it's needed, and any
relevant context. Reference issue numbers: Closes #123, Related to #456
```

### Code Review Checklist

- [ ] Changes reviewed against feature spec
- [ ] TypeScript types added (no `any`)
- [ ] Tests written (unit + integration)
- [ ] Components isolated in Storybook
- [ ] No console warnings
- [ ] Accessibility tested (keyboard, screen reader)
- [ ] RTL layout verified (Arabic/English)
- [ ] Performance impact assessed (Bundle size, render time)
- [ ] Security reviewed (no XSS, CSRF, injection)
- [ ] Documentation updated

---

## PHASE-BASED IMPLEMENTATION

### Phase 1: MVP (Weeks 1–12)

#### Week 1–2: Setup & Architecture
- [ ] Repository setup (monorepo, pnpm, Vite)
- [ ] TypeScript configuration
- [ ] Tailwind CSS setup
- [ ] ESLint, Prettier, Husky
- [ ] Storybook setup
- [ ] GitHub Actions CI/CD pipeline
- [ ] Staging & production deployment config

**Deliverable:** Boilerplate with CI/CD working

#### Week 3–4: Foundation Components & Layouts
**Storefront:**
- [ ] Main layout (header, footer, navigation)
- [ ] Mobile menu
- [ ] Base UI components (Button, Card, Input, etc.)
- [ ] Error boundary & error pages
- [ ] Loading skeletons

**Admin:**
- [ ] Admin layout (sidebar, top bar)
- [ ] Authentication pages (login)
- [ ] Base dashboard
- [ ] Data table component

**Deliverable:** Component library with Storybook stories

#### Week 5–6: Product Catalog & Search (Storefront)
- [ ] Homepage (hero carousel, featured products)
- [ ] Product catalog page (grid, list view)
- [ ] Product filtering (category, price, material)
- [ ] Product search (autocomplete)
- [ ] Product detail page (images, specs, video)
- [ ] API integration (fetch products)
- [ ] Image lazy-loading & optimization

**Deliverable:** Fully browsable product catalog

#### Week 7: Shopping Cart (Storefront)
- [ ] Cart icon with badge
- [ ] Cart sidebar/drawer
- [ ] Cart item management (add, remove, qty)
- [ ] Cart persistence (localStorage + server sync)
- [ ] Cart summary (subtotal, total)
- [ ] "Order via WhatsApp" button

**Deliverable:** Functional cart with state management

#### Week 8: Checkout Flow (Storefront)
- [ ] Checkout layout (stepper/progress)
- [ ] Billing/shipping form (address fields)
- [ ] Payment method selection
- [ ] COD flow
- [ ] Vodafone Cash flow (image upload)
- [ ] Order review page
- [ ] Order confirmation page
- [ ] Email/WhatsApp notification

**Deliverable:** Complete checkout experience

#### Week 9: Product Management (Admin)
- [ ] Product list view with search/filter
- [ ] Create product form
- [ ] Edit product form
- [ ] Product image upload
- [ ] Bulk product import (CSV)
- [ ] Product deletion/archiving

**Deliverable:** Full CRUD for products

#### Week 10: Inventory & Orders (Admin)
- [ ] Inventory dashboard
- [ ] Real-time stock updates
- [ ] Low-stock alerts
- [ ] Order list with filtering
- [ ] Order detail view
- [ ] Payment verification (COD + Vodafone Cash)
- [ ] Order status updates
- [ ] Order notes/communication

**Deliverable:** Order & inventory management complete

#### Week 11: Polish & Testing
- [ ] Responsive design (all breakpoints)
- [ ] RTL layout verification (Arabic)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Performance optimization (bundle size, load time)
- [ ] SEO meta tags (OpenGraph, structured data)
- [ ] Cross-browser testing
- [ ] Security audit

**Deliverable:** Production-ready code

#### Week 12: Launch Prep & Deployment
- [ ] Final UAT with stakeholders
- [ ] Database migrations
- [ ] Staging deployment & testing
- [ ] Monitoring setup (Sentry, Analytics)
- [ ] Documentation (admin guide, user manual)
- [ ] Production deployment
- [ ] Go-live support

**Deliverable:** Live platform

### Phase 2: Enhanced Operations (Weeks 13–26)

**Storefront:**
- [ ] Customer accounts (signup, login, profile)
- [ ] Order history & tracking
- [ ] Wishlist/favorites
- [ ] Product reviews (collection, display)
- [ ] Blog section (create, publish posts)
- [ ] SMS notifications (optional)

**Admin:**
- [ ] Bulk product export (CSV)
- [ ] Advanced inventory alerts (reorder points)
- [ ] Promotion & discount management
- [ ] Bundle/set discount rules
- [ ] Sales reports (revenue by category, top products)
- [ ] Customer management

**Shared:**
- [ ] Analytics dashboard enhancements
- [ ] Email template customization

### Phase 3: Payment & Fulfillment (Weeks 27–52)

- [ ] Vodafone Cash API integration (auto-verify)
- [ ] InstaPay integration
- [ ] Card payment (Paymob/Fawry)
- [ ] Courier integrations (Bosta, Mylerz)
- [ ] Automated shipping labels
- [ ] Order tracking integration
- [ ] Auto-status updates

### Phase 4: Growth & Scaling (Weeks 52+)

- [ ] Bilingual UI (Arabic/English)
- [ ] Customer loyalty program
- [ ] Email marketing automation
- [ ] Multi-product-line support
- [ ] Storefront template for other brands

---

## CODING STANDARDS & BEST PRACTICES

### TypeScript Guidelines

**Strict Mode (always enabled)**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true
  }
}
```

**No `any` type** — Always be specific:
```typescript
// ❌ Bad
const data: any = fetchData();

// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}
const data: User[] = await fetchData();
```

**Export types explicitly:**
```typescript
// ✅ Good
export type Product = {
  id: string;
  name: string;
  price: number;
};

export interface Order {
  id: string;
  products: Product[];
}
```

### React Guidelines

**Functional Components Only** (no class components)
```typescript
// ✅ Good
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return <div>{product.name}</div>;
};
```

**Props Interface**
```typescript
// ✅ Good
interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  isLoading?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, isLoading }) => {
  // ...
};
```

**Hooks Best Practices:**
- Extract custom hooks for reusable logic
- Use `useCallback` for event handlers passed to child components
- Use `useMemo` for expensive computations
- Don't call hooks conditionally

```typescript
// ✅ Good
const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const handleClick = useCallback(() => {
    onAddToCart(product.id);
  }, [product.id, onAddToCart]);

  return <button onClick={handleClick}>Add to Cart</button>;
};
```

### Component Structure

```typescript
import React, { useCallback, useMemo } from 'react';
import { Product } from '@/types';
import Button from '@/components/common/Button';
import styles from './ProductCard.module.css';

/** ProductCard displays a single product with add-to-cart action */
interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
}) => {
  const handleAddToCart = useCallback(() => {
    onAddToCart(product.id);
  }, [product.id, onAddToCart]);

  const formattedPrice = useMemo(
    () => new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(product.price),
    [product.price]
  );

  return (
    <div className={styles.card}>
      <img 
        src={product.imageUrl} 
        alt={product.name}
        loading="lazy"
      />
      <h3>{product.name}</h3>
      <p>{formattedPrice}</p>
      <Button onClick={handleAddToCart}>اطلب الآن</Button>
    </div>
  );
};

export default ProductCard;
```

### File Naming Conventions

```
Components:     PascalCase.tsx      (ProductCard.tsx)
Pages:          PascalCase.tsx      (HomePage.tsx)
Hooks:          camelCase.ts        (useCart.ts)
Utilities:      camelCase.ts        (formatters.ts)
Types:          PascalCase.ts       (Product.ts)
Stores:         camelCase.ts        (cartStore.ts)
Styles:         kebab-case.css      (product-card.module.css)
Tests:          *.test.tsx or *.spec.tsx
```

### Imports Organization

```typescript
// 1. External libraries
import React, { useCallback } from 'react';
import axios from 'axios';
import clsx from 'clsx';

// 2. Project imports (absolute paths via tsconfig)
import { Product } from '@/types';
import Button from '@/components/common/Button';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/formatting';

// 3. Styles (last)
import styles from './ProductCard.module.css';
```

### Error Handling

```typescript
// ✅ Good error handling
try {
  const response = await api.get<Product[]>('/products');
  setProducts(response.data);
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 404) {
      setError('Products not found');
    } else if (error.response?.status === 500) {
      setError('Server error. Please try again later.');
    } else {
      setError('Network error');
    }
  } else {
    setError('Unknown error occurred');
  }
  console.error('Product fetch error:', error);
}
```

### Comments & Documentation

```typescript
/**
 * ProductCard component displays a single product with add-to-cart functionality.
 * 
 * @param product - Product object containing name, price, images, etc.
 * @param onAddToCart - Callback fired when user clicks "Add to Cart"
 * 
 * @example
 * <ProductCard product={product} onAddToCart={handleAddToCart} />
 */
const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  // ...
};
```

---

## TESTING STRATEGY

### Test Coverage Targets

- **Unit Tests:** 80%+ coverage (business logic, utilities, hooks)
- **Integration Tests:** 60%+ coverage (component interactions, API calls)
- **E2E Tests:** Critical user journeys (checkout, login, order)

### Unit Testing (Vitest + React Testing Library)

```typescript
// ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from './ProductCard';
import { Product } from '@/types';

describe('ProductCard', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Gold Anklet',
    price: 150,
    imageUrl: '/images/anklet.jpg',
    material: 'gold-plated',
  };

  it('renders product name and price', () => {
    render(<ProductCard product={mockProduct} onAddToCart={vi.fn()} />);
    expect(screen.getByText('Gold Anklet')).toBeInTheDocument();
    expect(screen.getByText(/150/)).toBeInTheDocument();
  });

  it('calls onAddToCart when button is clicked', () => {
    const handleAddToCart = vi.fn();
    render(<ProductCard product={mockProduct} onAddToCart={handleAddToCart} />);
    
    fireEvent.click(screen.getByText('اطلب الآن'));
    expect(handleAddToCart).toHaveBeenCalledWith('1');
  });

  it('renders product image with correct src', () => {
    render(<ProductCard product={mockProduct} onAddToCart={vi.fn()} />);
    const img = screen.getByAltText('Gold Anklet');
    expect(img).toHaveAttribute('src', '/images/anklet.jpg');
  });
});
```

### Integration Testing

```typescript
// Cart.integration.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Cart from './Cart';
import * as cartService from '@/services/cartService';

vi.mock('@/services/cartService');

describe('Cart Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds product to cart and persists to server', async () => {
    vi.mocked(cartService.addToCart).mockResolvedValue({ success: true });

    render(<Cart />);
    
    const addButton = screen.getByText('Add to Cart');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(cartService.addToCart).toHaveBeenCalled();
    });
  });
});
```

### E2E Testing (Playwright)

```typescript
// checkout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('complete checkout with COD payment', async ({ page }) => {
    // Add product to cart
    await page.click('[data-testid="add-to-cart"]');
    expect(await page.textContent('[data-testid="cart-count"]')).toBe('1');

    // Go to checkout
    await page.click('[data-testid="checkout-btn"]');
    await page.waitForURL('**/checkout');

    // Fill billing info
    await page.fill('[name="name"]', 'Ahmed Hassan');
    await page.fill('[name="email"]', 'ahmed@example.com');
    await page.fill('[name="phone"]', '01001234567');
    await page.fill('[name="address"]', 'Cairo, Egypt');

    // Select COD
    await page.click('[data-testid="payment-cod"]');
    
    // Complete checkout
    await page.click('[data-testid="place-order"]');
    
    // Verify confirmation
    await page.waitForURL('**/confirmation');
    expect(await page.textContent('h1')).toContain('Order Confirmed');
  });
});
```

### Visual Regression Testing (Chromatic)

```yaml
# .github/workflows/chromatic.yml
name: Chromatic
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  chromatic-deployment:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - uses: chromaui/action@v1
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

---

## PERFORMANCE OPTIMIZATION

### Bundle Size Optimization

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'data-vendor': ['zustand', '@tanstack/react-query', 'axios'],
          'ui-vendor': ['tailwindcss'],
        },
      },
    },
    // Target modern browsers
    target: ['es2020', 'edge88', 'firefox78', 'chrome90', 'safari14'],
    minify: 'terser',
    cssCodeSplit: true,
  },
});
```

### Code Splitting Strategy

- **Main bundle:** App shell + critical routes (home, auth)
- **Vendors:** React, routing, state management (cached)
- **Routes:** Each page lazy-loaded
- **Utils:** Shared utilities (formatting, validation)

```typescript
// Lazy load routes
const HomePage = lazy(() => import('@/pages/HomePage'));
const CatalogPage = lazy(() => import('@/pages/CatalogPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));

// Use Suspense boundary
<Suspense fallback={<PageLoader />}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/catalog" element={<CatalogPage />} />
    <Route path="/checkout" element={<CheckoutPage />} />
  </Routes>
</Suspense>
```

### Image Optimization

```typescript
// Image component with optimization
const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  width = 300 
}) => {
  return (
    <picture>
      {/* WebP format for modern browsers */}
      <source 
        srcSet={`${src}.webp`} 
        type="image/webp"
      />
      {/* Fallback for older browsers */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={width}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
};
```

### Network Optimization

```typescript
// API request deduplication
const createApiClient = () => {
  const cache = new Map<string, Promise<any>>();

  return {
    get: async <T>(url: string): Promise<T> => {
      if (cache.has(url)) {
        return cache.get(url)!;
      }

      const promise = axios.get<T>(url).then(r => r.data);
      cache.set(url, promise);
      
      // Clear cache after 5 minutes
      setTimeout(() => cache.delete(url), 5 * 60 * 1000);
      
      return promise;
    }
  };
};
```

### Core Web Vitals Monitoring

```typescript
// vitals.ts
export function reportWebVitals() {
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(logMetric);
    getFID(logMetric);
    getFCP(logMetric);
    getLCP(logMetric);
    getTTFB(logMetric);
  });
}

function logMetric(metric: any) {
  console.log(`${metric.name}:`, metric.value);
  
  // Send to analytics
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_category: 'Web Vitals',
    });
  }
}
```

---

## DEPLOYMENT & DEVOPS

### Hosting Strategy

**Staging Environment:**
- Vercel or Netlify (auto-deploy on develop branch)
- Database: Cloud instance (copy of production, anonymized data)
- CDN: Integrated

**Production Environment:**
- Vercel Pro / AWS Amplify
- Database: Managed service (AWS RDS, Vercel Postgres)
- CDN: Cloudflare or AWS CloudFront
- SSL: Auto-provisioned

### GitHub Actions CI/CD

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm lint
      - run: pnpm type-check
      - run: pnpm test
      - run: pnpm build

      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

```yaml
# .github/workflows/deploy-production.yml
name: Deploy Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm build

      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          production: true

      - name: Notify Slack
        if: always()
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK }}
          payload: |
            {
              "text": "Sett El-Hetta deployment: ${{ job.status }}"
            }
```

### Environment Variables

```env
# .env.local (development)
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=Sett El-Hetta
VITE_ENABLE_MOCKS=true
VITE_LOG_LEVEL=debug

# .env.staging (staging)
VITE_API_BASE_URL=https://api-staging.sett-el-hetta.com
VITE_ENABLE_MOCKS=false
VITE_LOG_LEVEL=info

# .env.production (production)
VITE_API_BASE_URL=https://api.sett-el-hetta.com
VITE_ENABLE_MOCKS=false
VITE_LOG_LEVEL=error
```

---

## MONITORING & ANALYTICS

### Error Tracking (Sentry)

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  release: process.env.VITE_APP_VERSION,
  beforeSend(event) {
    // Don't send personal data
    return event;
  },
});

export default Sentry.withProfiler(App);
```

### Google Analytics 4

```typescript
import ReactGA from 'react-ga4';

ReactGA.initialize(process.env.VITE_GA_MEASUREMENT_ID!);

// Track page view
export function trackPageView(path: string) {
  ReactGA.send({ hitType: 'pageview', page: path });
}

// Track events
export function trackEvent(category: string, action: string, label?: string, value?: number) {
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
}
```

### Web Vitals Dashboard

- Lighthouse CI (automated)
- Performance monitoring (Core Web Vitals)
- Bundle size tracking (Bundlebuddy)
- Uptime monitoring (StatusPage.io)

---

## DEPENDENCIES & PACKAGES

### Essential Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.20.0",
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.6.0",
    "react-hook-form": "^7.50.0",
    "zod": "^3.22.0",
    "tailwindcss": "^3.4.0",
    "@headlessui/react": "^1.7.0",
    "@heroicons/react": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "tailwindcss": "^3.4.0",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0",
    "husky": "^8.0.0",
    "lint-staged": "^15.2.0",
    "vitest": "^1.1.0",
    "@testing-library/react": "^14.1.0",
    "@testing-library/jest-dom": "^6.1.0",
    "playwright": "^1.40.0",
    "storybook": "^7.6.0",
    "sentry/react": "^7.84.0"
  }
}
```

---

## RISK MITIGATION

| Risk | Probability | Severity | Mitigation |
|------|-------------|----------|-----------|
| Performance issues on slow networks | High | High | Aggressive code splitting, image optimization, SSR prep |
| RTL layout bugs (Arabic) | Medium | Medium | Automated testing with Arabic content, manual QA in Arabic |
| Payment flow complexity | Medium | High | Thorough manual testing, flow diagrams, clear error messaging |
| Third-party API failures (WhatsApp, email) | Low | High | Error handling, fallback flows, retry logic |
| Mobile Safari compatibility | Medium | Medium | Regular testing on real devices, iOS-specific fixes |
| Accessibility issues | Medium | High | Automated a11y testing (axe), manual screen reader testing |
| Security vulnerabilities | Low | Critical | Security audit, OWASP Top 10 review, dependency scanning |

---

## SUCCESS CRITERIA

### Development Metrics
- [ ] Build time < 30 seconds (HMR < 2 seconds)
- [ ] All tests pass (80%+ coverage)
- [ ] TypeScript zero errors
- [ ] Lighthouse score ≥ 90 (performance)
- [ ] No console errors/warnings in dev

### Production Metrics
- [ ] Page load time < 3s (4G)
- [ ] Core Web Vitals passing (all green)
- [ ] Error rate < 0.1%
- [ ] 99.9% uptime
- [ ] WCAG 2.1 AA compliance

### User Experience
- [ ] Mobile viewport fully responsive
- [ ] RTL layout correct for Arabic
- [ ] Checkout flow completes in <2 minutes
- [ ] Admin can add product in <5 minutes
- [ ] Customer satisfaction ≥ 4.5/5.0

---

**END OF DOCUMENT**
