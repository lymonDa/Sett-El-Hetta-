---
name: Heritage Luxe
colors:
  surface: '#fff8f5'
  surface-dim: '#e1d8d4'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf2ed'
  surface-container: '#f5ece7'
  surface-container-high: '#efe6e2'
  surface-container-highest: '#e9e1dc'
  on-surface: '#1e1b18'
  on-surface-variant: '#544434'
  inverse-surface: '#34302c'
  inverse-on-surface: '#f8efea'
  outline: '#877362'
  outline-variant: '#dac2ae'
  surface-tint: '#8b5000'
  primary: '#8b5000'
  on-primary: '#ffffff'
  primary-container: '#ff9c1f'
  on-primary-container: '#673b00'
  inverse-primary: '#ffb870'
  secondary: '#6a5d46'
  on-secondary: '#ffffff'
  secondary-container: '#f0ddc1'
  on-secondary-container: '#6e614a'
  tertiary: '#006c49'
  on-tertiary: '#ffffff'
  tertiary-container: '#33ca90'
  on-tertiary-container: '#005035'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcbe'
  primary-fixed-dim: '#ffb870'
  on-primary-fixed: '#2c1600'
  on-primary-fixed-variant: '#693c00'
  secondary-fixed: '#f2e0c4'
  secondary-fixed-dim: '#d6c4a9'
  on-secondary-fixed: '#231a09'
  on-secondary-fixed-variant: '#514530'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#fff8f5'
  on-background: '#1e1b18'
  surface-variant: '#e9e1dc'
  surface-cream: '#F9F7F2'
  border-muted: '#E5E1D8'
  status-warning: '#F59E0B'
  status-error: '#EF4444'
typography:
  display:
    fontFamily: Cairo
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Cairo
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-lg-mobile:
    fontFamily: Cairo
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Cairo
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Tajawal
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Tajawal
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Cairo
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  caption:
    fontFamily: Tajawal
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  margin-mobile: 1rem
  margin-desktop: 4rem
  gutter: 1.5rem
  section-gap: 5rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style

The brand embodies "Premium Heritage"—a sophisticated blend of traditional Egyptian craftsmanship and high-end editorial aesthetics. It targets a discerning audience that values the story of the maker as much as the object itself. The emotional response should be one of "accessible exclusivity": the warmth of gold and sand combined with the structured confidence of luxury fashion.

The design style is **Minimalist / Corporate Modern** with a **Tactile** edge. 
- **Layout:** Generous whitespace (macro-typography) and large, photography-led layouts create an "editorial" feel.
- **Atmosphere:** Clean lines and structured grids provide a sense of reliability (corporate), while soft corners and warm tones evoke the hand-made, artisanal nature of the jewelry.
- **RTL-First:** The system is built for Arabic-first consumption, where the flow of elegance moves from right to left naturally.

## Colors

The palette is anchored by **Primary Gold**, used as a focused accent for call-to-actions and brand flourishes. **Secondary Sand** serves as the tonal bridge between the brand and its physical materials (brass, gold-plating).

- **Backgrounds:** Use `surface-cream` for page backgrounds to avoid the clinical feel of pure white.
- **Typography:** `neutral-color` (a warm near-black) provides high-contrast legibility for Arabic script.
- **Status Tints:** 
  - **Pending Review:** Uses `status-warning` (Amber) to signal a "pause" state.
  - **Confirmed:** Uses `tertiary_color` (Success Green) to signal completion.
  - **Error/Rejected:** Reserved for `status-error`.

Avoid overusing Gold; it should feel like a rare inlay, not a dominant wash.

## Typography

Typography is Arabic-first, utilizing **Cairo** for structured, confident headlines and **Tajawal** for warm, readable body copy. 

- **Hierarchy:** Display and Headlines use Cairo with tighter leading to create a "locked" editorial look. 
- **Readability:** Body text uses Tajawal with generous line height (1.6) to ensure the fluid nature of Arabic script remains legible at all sizes.
- **RTL Considerations:** Numbers should default to the format appropriate for the target locale (Eastern Arabic or Western Arabic numerals), but must remain consistent brand-wide.
- **Mixed Text:** When Latin characters appear within Arabic strings, Cairo’s geometric nature helps maintain visual alignment.

## Layout & Spacing

This design system uses a **Fluid Grid** model with a mobile-first philosophy.

- **Mobile (320px+):** 4-column grid, 16px margins. Emphasis is on vertical stacking with large image cards.
- **Desktop (1024px+):** 12-column grid, 64px margins. Content is often centered or offset to create a gallery feel.
- **RTL Logic:** All horizontal spacing (margins, padding, position) is mirrored. A "right-margin" in LTR becomes a "left-margin" here. 
- **White Space:** Use `section-gap` liberally between product categories and hero sections to maintain the premium, "un-cluttered" boutique feel.

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows.

- **Surface Levels:** 
  - Level 0: `surface-cream` (Main background).
  - Level 1: White (Cards and elevated surfaces).
- **Outlines:** Use soft `border-muted` (1px) for product cards and input fields. This provides structure without the "weight" of a shadow.
- **Shadows:** Reserved strictly for high-impact floating elements (e.g., the WhatsApp button or active Modals). When used, shadows should be very diffused (20px-40px blur) and tinted with a hint of the secondary sand color (#CCBBA0) at 10% opacity to feel natural.

## Shapes

The shape language is **Rounded**, reflecting the organic curves found in jewelry design.

- **Standard Elements:** Buttons, cards, and input fields use a 0.5rem (8px) radius.
- **Large Elements:** Featured gallery images or high-level category cards may use "rounded-lg" (1rem) to feel softer.
- **Status Badges:** Use a pill-shape (full radius) to distinguish them from functional buttons.

## Components

- **Buttons:** 
  - *Primary:* Filled with Gold (#FF9C1F), white text, rounded corners. 
  - *Secondary:* Outlined with Sand (#CCBBA0), Cairo font, uppercase-equivalent styling.
- **Status Badges:**
  - *Pending Review:* Amber background with a clock icon. Visually distinct from "Success" to manage customer expectations.
  - *Confirmed:* Success green background with a checkmark.
- **Product Cards:** Minimalist. Large image top, product name in Cairo-MD below, price in Tajawal. No heavy borders; use subtle tonal changes on hover.
- **Input Fields:** Bottom-aligned labels or floating labels in Cairo. Focus state uses a Gold border-bottom or 2px Gold outline.
- **WhatsApp Button:** Fixed position (Bottom-Left for RTL). Uses a high-visibility circle shape to remain "always on" but unobtrusive.
- **Order Tracker:** A horizontal (RTL) stepper. Completed steps use Success Green; the active "Pending" step uses Amber.