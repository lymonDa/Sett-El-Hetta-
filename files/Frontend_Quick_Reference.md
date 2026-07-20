# SETT EL-HETTA FRONTEND — QUICK REFERENCE GUIDE

## ⚡ Quick Start

```bash
# Install dependencies
pnpm install

# Start dev server (both apps)
pnpm dev

# Start only storefront
pnpm dev --filter=storefront

# Start only admin
pnpm dev --filter=admin

# Build for production
pnpm build

# Run tests
pnpm test

# Run specific test file
pnpm test ProductCard

# Type checking
pnpm type-check

# Linting & formatting
pnpm lint
pnpm format
pnpm format:check
```

---

## 🏗️ TECH STACK AT A GLANCE

| Purpose | Technology | Why |
|---------|-----------|-----|
| **Framework** | React 18 + TypeScript | Component-based, type-safe |
| **Build** | Vite | Fast HMR, optimized bundles |
| **Styling** | Tailwind CSS + CSS Modules | Utility-first, RTL-ready |
| **Routing** | React Router v6 | Nested routes, lazy loading |
| **State** | Zustand | Lightweight, simple |
| **Data Fetch** | TanStack Query + Axios | Smart caching, auto-refetch |
| **Forms** | React Hook Form + Zod | Performant, type-safe validation |
| **UI Components** | Headless UI + Tailwind | Accessible, fully customizable |
| **Testing** | Vitest + React Testing Library | Fast, modern, best practices |
| **E2E** | Playwright | Real browser automation |
| **Linting** | ESLint + Prettier | Code quality, auto-format |
| **Docs** | Storybook | Component documentation |
| **Monitoring** | Sentry + Google Analytics 4 | Error tracking, user insights |

---

## 📁 FOLDER STRUCTURE QUICK MAP

```
apps/storefront          ← Customer-facing portal
├── src/
│   ├── components/      ← Reusable UI components
│   ├── pages/           ← Route pages
│   ├── hooks/           ← Custom React hooks
│   ├── stores/          ← Zustand state management
│   ├── services/        ← API calls & business logic
│   ├── utils/           ← Helper functions
│   ├── types/           ← TypeScript types
│   └── styles/          ← Global CSS + Tailwind config

apps/admin              ← Admin dashboard
├── src/
│   ├── components/      ← Admin-specific UI
│   ├── pages/           ← Admin pages (dashboard, orders, products)
│   └── ... (same structure as storefront)

packages/               ← Shared code
├── types/              ← Shared TypeScript definitions
├── ui/                 ← Shared UI components
├── utils/              ← Shared utilities
└── api-client/         ← Shared API client
```

---

## 🎨 DESIGN TOKENS

### Brand Colors
```css
Primary Gold:     #FF9C1F
Secondary Sand:   #CCBBA0
Success Green:    #10B981
Error Red:        #EF4444
Warning Amber:    #F59E0B
```

### Responsive Breakpoints
```
Mobile:   320px - 479px
Tablet:   480px - 767px
Desktop:  768px - 1024px
Wide:     1025px+
```

### Spacing Scale (Tailwind)
```
xs: 0.5rem    (p-2)
sm: 1rem      (p-4)
md: 1.5rem    (p-6)
lg: 2rem      (p-8)
xl: 3rem      (p-12)
```

### Typography
```
Font Family:  Cairo, Tajawal (Arabic-first)
Sizes:        xs (0.75rem) → 4xl (2.25rem)
Line Height:  1.5 (base)
```

---

## 📝 COMMON COMMANDS & PATTERNS

### Creating a New Component

```bash
# Create component file structure
mkdir -p src/components/myComponent
touch src/components/myComponent/{MyComponent.tsx,MyComponent.test.tsx,MyComponent.module.css,index.ts}
```

```typescript
// MyComponent.tsx
import React from 'react';
import styles from './MyComponent.module.css';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  return (
    <div className={styles.container}>
      <h1>{title}</h1>
      {onAction && <button onClick={onAction}>Action</button>}
    </div>
  );
};

export default MyComponent;
```

```typescript
// index.ts (for clean imports)
export { MyComponent } from './MyComponent';
export type { MyComponentProps } from './MyComponent';
```

### Creating a Custom Hook

```typescript
// src/hooks/useMyData.ts
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

interface UseMyDataOptions {
  enabled?: boolean;
}

export function useMyData(options: UseMyDataOptions = {}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['myData'],
    queryFn: async () => {
      const response = await api.get('/my-endpoint');
      return response.data;
    },
    enabled: options.enabled ?? true,
  });

  return { data, isLoading, error };
}
```

### API Service Pattern

```typescript
// src/services/productService.ts
import { api } from './api';
import { Product } from '@/types';

export const productService = {
  getAll: async (filters?: Record<string, any>) => {
    const { data } = await api.get<Product[]>('/products', { params: filters });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<Product>(`/products/${id}`);
    return data;
  },

  create: async (product: Omit<Product, 'id'>) => {
    const { data } = await api.post<Product>('/products', product);
    return data;
  },

  update: async (id: string, updates: Partial<Product>) => {
    const { data } = await api.patch<Product>(`/products/${id}`, updates);
    return data;
  },

  delete: async (id: string) => {
    await api.delete(`/products/${id}`);
  },
};
```

### Zustand Store Pattern

```typescript
// src/stores/cartStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        
        addItem: (item) => set((state) => ({
          items: [...state.items, item],
        })),
        
        removeItem: (productId) => set((state) => ({
          items: state.items.filter(item => item.productId !== productId),
        })),
        
        clearCart: () => set({ items: [] }),
        
        getTotalPrice: () => {
          return get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        },
      }),
      { name: 'cart-store' }
    )
  )
);
```

### Form Handling Pattern

```typescript
// Using React Hook Form + Zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  price: z.number().positive('Price must be positive'),
  category: z.enum(['anklets', 'bangles', 'chains']),
  material: z.enum(['stainless-steel', 'gold-plated']),
});

type ProductFormData = z.infer<typeof productSchema>;

export function ProductForm({ onSubmit }: { onSubmit: (data: ProductFormData) => Promise<void> }) {
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="Product name" />
      {errors.name && <span>{errors.name.message}</span>}
      
      <input {...register('price', { valueAsNumber: true })} type="number" />
      {errors.price && <span>{errors.price.message}</span>}

      <button type="submit">Save Product</button>
    </form>
  );
}
```

### Testing Pattern

```typescript
// ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
  it('should render product name', () => {
    render(<ProductCard product={{ id: '1', name: 'Test Product' }} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('should call onAddToCart when button clicked', () => {
    const mockOnAdd = vi.fn();
    render(<ProductCard product={{ id: '1', name: 'Test' }} onAddToCart={mockOnAdd} />);
    
    fireEvent.click(screen.getByText('Add to Cart'));
    expect(mockOnAdd).toHaveBeenCalled();
  });
});
```

---

## 🔍 DEBUGGING TIPS

### React DevTools
```
Install: React Developer Tools browser extension
- Component tree inspection
- Props/state viewing
- Re-render highlighting
```

### Zustand Middleware (Logging)
```typescript
// Auto-log all state changes in dev
const store = create<State>()(
  devtools((set) => ({
    // ... store definition
  }), { name: 'MyStore' })
);
```

### Network Tab
- Inspect API requests/responses
- Check image sizes
- Monitor bundle load time

### Lighthouse
```bash
# Run in browser DevTools (Lighthouse tab)
# or

npm run lighthouse:audit
```

### Console Logging Best Practices
```typescript
// Prefix logs with feature name
console.log('[ProductCard]', 'Product loaded:', product);
console.error('[API]', 'Failed to fetch:', error);

// Use appropriate levels
console.info('Application started');
console.warn('Deprecated API used');
console.error('Critical error occurred');
```

---

## 🚀 DEPLOYMENT CHECKLIST

### Before Pushing to Production

- [ ] All tests passing (`pnpm test`)
- [ ] No TypeScript errors (`pnpm type-check`)
- [ ] No ESLint warnings (`pnpm lint`)
- [ ] Bundle size checked (`pnpm build` then analyze)
- [ ] Lighthouse score ≥ 90
- [ ] RTL layout verified (Arabic text)
- [ ] Mobile responsive on actual device
- [ ] Cross-browser tested (Chrome, Safari, Firefox, Edge)
- [ ] Accessibility tested (keyboard nav, screen reader)
- [ ] Security audit passed (no console errors, no XSS)
- [ ] Environment variables configured
- [ ] Database migrations ready

### CI/CD Pipeline

```
Push to develop
  ↓
Run Tests → Lint → Type-check → Build
  ↓
Deploy to Staging
  ↓
Manual QA ✓
  ↓
Push to main (via PR merge)
  ↓
Auto-deploy to Production
  ↓
Smoke tests + Monitoring
```

---

## 📊 PERFORMANCE CHECKLIST

| Metric | Target | Tool |
|--------|--------|------|
| FCP (First Contentful Paint) | < 1.5s | Lighthouse |
| LCP (Largest Contentful Paint) | < 2.5s | Web Vitals |
| CLS (Cumulative Layout Shift) | < 0.1 | Web Vitals |
| TTL (Time to Interactive) | < 3.5s | Lighthouse |
| Bundle Size | < 150KB (gzip) | Bundlebuddy |

### Quick Performance Win
```bash
# Analyze bundle size
pnpm build
npx rollup-plugin-visualizer dist/stats.html
open dist/stats.html
```

---

## 🔐 SECURITY CHECKLIST

- [ ] No hardcoded API keys in code
- [ ] HTTPS enabled in all environments
- [ ] Content Security Policy (CSP) headers set
- [ ] CSRF protection on forms
- [ ] Input validation (client + server)
- [ ] XSS prevention (sanitize user input)
- [ ] SQL injection prevention (use parameterized queries)
- [ ] Authentication tokens in httpOnly cookies
- [ ] OWASP Top 10 audit passed
- [ ] Dependencies scanned for vulnerabilities (`pnpm audit`)

---

## 📚 USEFUL LINKS

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Router Docs](https://reactrouter.com/)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Vitest Docs](https://vitest.dev)
- [Testing Library Best Practices](https://testing-library.com/docs/queries/about)

---

## 🆘 COMMON ISSUES & SOLUTIONS

### "Module not found" errors
```
Solution: Check import paths, ensure tsconfig paths are correct
tsconfig.json: "baseUrl": ".", "paths": { "@/*": ["src/*"] }
```

### TypeScript "unknown type" errors
```
Solution: Add proper type imports
import type { Product } from '@/types';  ← Use 'type' keyword
```

### State not updating in component
```
Solution: Check if store method is called correctly
const cart = useCartStore();
cart.addItem(item);  ← Direct call, not in object
```

### Images not loading on mobile
```
Solution: Use responsive images with srcset
<img src={img} srcSet={`${img} 1x, ${img}@2x 2x`} />
```

### Slow API requests
```
Solution: Enable React Query caching and deduplication
useQuery({ queryKey: ['products'], queryFn: fetchProducts })
```

### CSS classes not applying
```
Solution: Ensure Tailwind CSS content paths are correct
tailwind.config.ts: content: ['./src/**/*.{js,ts,jsx,tsx}']
```

---

## 📞 SUPPORT & COMMUNICATION

- **Slack Channel:** #sett-el-hetta-dev
- **PR Review Time:** 24 hours
- **Deploy Window:** Weekdays 10 AM - 4 PM Cairo time
- **On-Call Rotation:** Check DevOps team wiki

---

**Version:** 1.0  
**Last Updated:** July 19, 2026  
**Maintained by:** Frontend Team
