# Design Guidelines: Streetwear Merch Request Platform

## Design Approach

**Reference-Based Approach**: Drawing inspiration from streetwear culture, editorial magazines, and modern product showcases. Think: Kith's editorial grid + Carhartt WIP's bold typography + Uniqlo's clean product presentation with a street-culture edge.

**Core Design Philosophy**: Cool streetwear aesthetic with bold type, generous negative space, editorial grid layouts, and big product imagery. Minimal color palette with strong hierarchy. Mobile-first with desktop enrichment.

---

## Color Palette

**Base Colors (Dark Mode Primary)**
- Charcoal: 220 8% 8% (#111315) - Primary background
- Off-white: 60 14% 98% (#FAFAF7) - Primary text and cards
- Asphalt Gray: 200 4% 30% (#4B4F52) - Secondary elements, borders

**Accent Colors (Choose One)**
- Electric Blue: 221 100% 59% (#2F6BFF) - Modern, tech-forward
- Safety Red: 356 77% 57% (#E63946) - Bold, streetwear edge

**Application**
- Use accent color sparingly: CTAs, active states, priority indicators
- Maintain high contrast ratios for accessibility
- Avoid purple entirely

---

## Typography

**Primary Typeface**: Inter (Display weights: 600-800)
- Headlines, product names, step headers, CTAs
- Sizes: 48-72px (hero), 32-40px (section headers), 24-28px (card titles)

**Secondary Typeface**: Source Sans 3 (Regular 400, Medium 500)
- Body text, form labels, descriptions, specs
- Sizes: 16-18px (body), 14px (captions, metadata)

**Hierarchy**
- Hero headline: Inter Bold 64px, tight line-height (1.1)
- Section headers: Inter SemiBold 40px
- Card titles: Inter SemiBold 24px
- Body text: Source Sans 3 Regular 17px, comfortable line-height (1.6)
- Form labels: Source Sans 3 Medium 15px, tracking +0.02em

---

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24, 32
- Micro spacing (form elements, inline gaps): 2, 4
- Component padding: 6, 8, 12
- Section padding: 16, 20, 24 (mobile), 32 (desktop)
- Generous vertical rhythm: 20-32 between sections

**Grid Systems**
- Product catalog: 1 col (mobile) → 2 cols (tablet) → 3 cols (desktop)
- Gallery: Masonry grid, 2-4 columns based on viewport
- Upload previews: 3-4 column grid with consistent aspect ratios
- Editorial spacing: Asymmetric layouts with wide margins

**Container Strategy**
- Max-width: 1280px for content, full-bleed for hero/gallery
- Lateral padding: 4-6 (mobile), 8-12 (desktop)

---

## Component Library

**Navigation**
- Minimal top nav: Logo left, "Start Request" CTA right, optional secondary link
- Sticky on scroll with subtle backdrop blur
- 64px height, clean divider

**Hero Section**
- Large, impactful studio-lit product imagery on textured concrete/paper backdrop
- Bold headline (Inter 64-72px), concise subcopy (Source Sans 18px)
- Dual CTAs: Primary accent, Secondary outline with blurred background when over image
- Trust badges below fold: turnaround icons, review count, client logos grid

**Product Cards**
- Big imagery (16:10 aspect ratio), studio-lit on neutral backdrop with subtle grain
- Minimal text overlay: product name, key spec line, turnaround estimate
- "Add to Request" CTA on hover/tap
- Filters as pill buttons with active state in accent color

**Request Wizard**
- Sticky progress stepper: Step number, title, 4-dot progress
- Generous card-based step containers with soft shadows
- Inline validation errors in red, success states in green
- Previous/Next navigation always visible, disabled states clear

**File Upload Component**
- Drag-drop zone with dashed border, icon, and instructional copy
- Grid preview (3-4 columns) with thumbnails, file type badges (SVG/AI badge in accent)
- Remove icon (X) on hover, reorder drag handles
- Progress bars during upload, checkmarks on completion
- File type icons for non-image files

**Gallery/Case Studies**
- Filterable grid with large imagery (masonry or equal-height)
- Modal overlays for case study details: fullscreen carousel, method specs, brief copy
- Minimal chrome, focus on photography

**Forms**
- Large touch targets (44px minimum)
- Clear labels above inputs, helper text below
- Dropdown selectors for multi-choice (product types, methods)
- Radio cards for priority selection (large, visual)
- Per-size quantity table with inline totals
- Date picker with rush tier warnings
- Honeypot field hidden for bot prevention

**Alerts & Notifications**
- Rush alert (due date <3 days): Yellow background, bold warning icon, inline in wizard
- MOQ alert (<50 qty): Blue info background, upsell copy, sample pack link
- Success toast after submission: Green, auto-dismiss

**Footer**
- Simple, single-column on mobile, 3-4 columns desktop
- Quick links, contact info, social icons
- Newsletter signup optional (if included: minimal, single input + button)

---

## Imagery & Visual Style

**Photography Direction**
- Studio-lit apparel on textured backdrops (concrete, kraft paper, raw canvas)
- Subtle film grain overlay for streetwear authenticity
- Neutral, desaturated backgrounds to make products pop
- Mix of flat lays and hanging garments at eye level
- Authentic, non-staged feel

**Image Placement**
- Hero: Full-width background image (50-60vh mobile, 70-80vh desktop)
- Product cards: 16:10 ratio, consistent across catalog
- Gallery: Variable sizes for masonry effect, 4:5 and 16:9 mix
- Case study modals: Large, immersive carousels

**Icons**
- Use Heroicons (outline style for UI, solid for badges)
- Consistent 24px size for inline icons, 32-40px for feature highlights

---

## Animations & Interactions

**Motion Principles**
- Minimal, purposeful animations only
- Smooth transitions: 200-300ms ease-in-out
- Hover states: Subtle scale (1.02), shadow lift on cards
- Loading states: Progress bars, skeleton screens for async content
- Page transitions: Fade or slide for wizard steps

**Specific Interactions**
- File upload: Progress bar fill, checkmark animation
- Form validation: Shake animation on error, green pulse on success
- CTA buttons: Slight scale + shadow on hover, no color change
- Image galleries: Smooth crossfade between images

---

## Accessibility & UX

- Maintain WCAG AA contrast ratios (4.5:1 text, 3:1 UI)
- Keyboard navigable: Tab order follows visual flow, focus indicators visible
- Touch targets: 44px minimum, generous spacing on mobile
- Alt text prompts for uploaded images
- Clear error messages with recovery instructions
- Sticky wizard progress for orientation
- Autosave wizard state (persist across sessions)

---

## Page-Specific Layouts

**Home/Landing**
- Hero with large imagery, headline, dual CTAs, trust badges
- 3-column feature grid (products, methods, turnaround)
- Gallery preview (6-9 items) with "See All" link
- Social proof section: Client logos, testimonial quotes
- Final CTA section before footer

**Catalog**
- Horizontal filter bar (sticky below nav)
- Grid layout with pagination or infinite scroll
- Sidebar on desktop for expanded filters

**Gallery**
- Masonry grid, no hero
- Filter pills at top
- Lightbox/modal for case studies

**Wizard**
- Clean, single-column step container
- Sticky progress at top
- Summary sidebar on desktop (optional)
- Thank you page: Confirmation icon, clear next steps, post-submit upload link

---

## Empty States & Edge Cases

- Empty gallery: Placeholder with "Coming Soon" copy
- No uploads yet: Drag-drop zone with large icon, encouraging copy
- Form errors: Inline red text, field outline in red
- Success states: Green checkmarks, positive reinforcement copy