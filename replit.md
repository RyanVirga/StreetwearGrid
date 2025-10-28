# Streetwear Merch Request Platform

## Overview

A mobile-first web application for custom streetwear merchandise requests. The platform allows businesses and creators to submit detailed custom merch orders by selecting products, uploading artwork/logos, specifying quantities and deadlines, and providing contact information. The application features a multi-step wizard interface, product catalog, gallery of past work, and is designed with a cool streetwear aesthetic inspired by brands like Kith and Carhartt WIP.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Vite as the build tool and development server.

**Routing**: Wouter for client-side routing - a lightweight alternative to React Router, suitable for the simple page structure (Home, Catalog, Gallery, RequestWizard, ThankYou).

**State Management**: TanStack Query (React Query) for server state management, with local component state for UI interactions. No global state management library required given the straightforward data flow.

**UI Component Library**: Shadcn/ui components built on Radix UI primitives, providing accessible, customizable components with Tailwind CSS styling. Components follow the "new-york" style variant.

**Design System**: 
- Custom Tailwind configuration with streetwear-inspired color palette (charcoal backgrounds, off-white text, electric blue or safety red accents)
- Typography hierarchy using Inter (display weights 600-800) for headlines and Source Sans 3 for body text
- Spacing system based on Tailwind's 8px grid
- Mobile-first responsive design approach

### Backend Architecture

**Framework**: Express.js server with TypeScript support, running in ESM mode.

**Architecture Pattern**: Lightweight RESTful API structure with a storage interface pattern. Currently implements in-memory storage (`MemStorage`) as a proof-of-concept, designed to be swapped with database-backed storage.

**Storage Interface**: Abstraction layer (`IStorage`) defining CRUD operations, making it easy to switch between in-memory, database, or other storage implementations without changing business logic.

**Middleware Stack**:
- JSON body parsing with raw body preservation (for webhook verification)
- Request logging with duration tracking
- Vite middleware integration for development HMR

**Build Strategy**: Two-step build process - Vite builds the client SPA, esbuild bundles the server code for production deployment.

### Data Storage Solutions

**Database**: Configured for PostgreSQL via Neon's serverless PostgreSQL with WebSocket support for serverless environments.

**ORM**: Drizzle ORM with TypeScript-first schema definition in `shared/schema.ts`. Provides type-safe database queries and automatic TypeScript inference.

**Schema Management**: Drizzle Kit for migrations and schema pushing, supporting incremental database changes.

**Current Schema**: Minimal user authentication schema (users table with username/password) - serves as starting point for expanded merch request data models.

**Design Decision**: Chose PostgreSQL for relational data integrity (products, requests, user relationships) and Drizzle ORM for its lightweight nature and excellent TypeScript support, avoiding heavier ORMs like Prisma for this size application.

### External Dependencies

**UI Component Ecosystem**:
- Radix UI primitives (accordion, dialog, dropdown, select, etc.) for accessible headless components
- Lucide React for iconography
- date-fns for date manipulation in the request wizard
- class-variance-authority + clsx for component variant styling

**Development Tools**:
- Replit-specific plugins for development banner, error overlay, and cartographer
- PostCSS with Tailwind and Autoprefixer

**Database & Backend**:
- @neondatabase/serverless for PostgreSQL connections optimized for serverless/edge environments
- ws (WebSocket) for Neon's WebSocket-based database protocol
- connect-pg-simple for PostgreSQL session storage (configured but not yet implemented)

**Form Handling**: 
- React Hook Form with @hookform/resolvers for validation
- Zod for schema validation (via drizzle-zod integration)

**Type Safety**: Shared TypeScript configuration across client/server with path aliases (@/, @shared/) for clean imports.

**Asset Management**: Custom alias (@assets/) for accessing generated images and static assets, with attached_assets directory containing generated product images.

### Authentication and Authorization

Currently minimal - basic user schema exists with username/password fields, but no authentication middleware implemented. The application is designed for authenticated business users (not anonymous), suggesting future implementation of session-based or token-based auth.

**Future Consideration**: Session management prepared with connect-pg-simple for PostgreSQL-backed sessions.

### API Structure

Backend routes are registered via `registerRoutes()` function in `server/routes.ts`. All application routes are prefixed with `/api` by convention. Currently implements skeleton structure ready for:
- Merch request submission endpoints
- Product catalog retrieval
- Gallery/case study retrieval
- File upload handling

The storage interface provides the foundation for these endpoints to perform CRUD operations on request data, products, and gallery items.

### Design Philosophy

The application embraces a **streetwear editorial aesthetic** with:
- Bold typography and generous negative space
- Editorial grid layouts for product/gallery displays
- High-contrast dark mode color scheme
- Minimal color palette avoiding purple entirely
- Large product imagery with hover effects
- Mobile-first responsive breakpoints

This design direction influences component structure, with reusable cards, badges, and layout primitives that maintain visual consistency throughout the wizard flow, catalog browsing, and gallery presentation.

### Hero Showcase Design (Shopify Supply-Inspired)

**Updated December 2024**: The homepage hero showcase has been redesigned to match Shopify Supply's aesthetic:

**Horizontal Scroll Showcase Components**:
- `HorizontalScrollSection`: Converts vertical scroll into horizontal content movement using Framer Motion
- `ProductShowcase`: Two-column split layout featuring 3D model on left, lifestyle photo on right
- `ScrollingMarquee`: Animated text marquee displaying product-specific messaging
- `Product3DModel`: React Three Fiber canvas with placeholder geometric shapes and ErrorBoundary fallback
- `ScrollProgressIndicator`: Fixed circular progress indicator showing scroll position

**Layout Structure**:
- **Left Panel**: Diagonal striped dark background with 3D model placeholder and product info overlay (bottom-left: name, price, "QUICK VIEW" button)
- **Right Panel**: Full-bleed lifestyle photo with small product card (bottom-right: thumbnail, name, price, arrow icon)
- **Crosshair Cursor**: Custom cursor throughout showcase section
- **Scrolling Marquee**: Large italic text at top with product-specific messaging (e.g., "3D EMBROIDERY // FLEECE BLEND")

**Error Handling**:
- `ErrorBoundary`: React error boundary component catches rendering errors and displays fallback UI
- WebGL context loss handling in `Product3DModel` with `event.preventDefault()` for recovery attempts
- Graceful degradation: Shows "3D Preview Unavailable" message when WebGL is not supported
- Optimized Canvas settings: disabled preserveDrawingBuffer and antialias, limited DPR for performance

**3D Model Implementation (October 2025)**:
- **TECHNICAL BLOCKER - React Three Fiber Incompatibility**:
  - React Three Fiber (@react-three/fiber v8.17) encounters `"Cannot read properties of undefined (reading 'replit')"` error in Replit environment
  - Error occurs during `meshStandardMaterial` instantiation in R3F's `applyProps` function
  - Issue appears to be environment-specific incompatibility between R3F and Replit's configuration
  - Attempted fixes: Removed THREE.DoubleSide, simplified materials, reinstalled packages - error persists on clean restart
  - WebGL context repeatedly lost: `THREE.WebGLRenderer: Context Lost` errors occur immediately after R3F initialization
  - **Current Approach**: ErrorBoundary catches errors and falls back to product images
  - **Recommendation**: Consider alternative 3D approaches (CSS 3D transforms, plain Three.js without R3F, or external 3D hosting)
  
- **Previous Spline Attempt** (October 27-28, 2025):
  - Attempted integration with Spline 3D viewer (`https://prod.spline.design/untitled-ZfPPVu3CvwQ20F2vP0AcL0NO/scene.splinecode`)
  - Encountered "Data read, but end of buffer not reached" errors when loading `.splinecode` URLs
  - Spline package and SplineModel component removed due to persistent loading failures
  
- **Current State**: 
  - Custom Three.js mesh geometries defined for all products (t-shirt, hoodie, cap, tote)
  - Components exist but cannot render due to R3F environment error
  - ErrorBoundary fallback to product lifestyle images active
  - 3D scroll-based rotation feature non-functional until R3F compatibility resolved

**Scroll Progress Architecture**:
- **Scalable Design**: Supports any number of products without hardcoding
- **HorizontalScrollSection**: Passes global scrollProgress, productIndex, and totalProducts to children
- **ProductShowcase**: Creates own useTransform at top level with calculated scroll segment
- **Rules of Hooks Compliant**: All hooks called unconditionally at top level
- **Segment Calculation**: Each product receives 0→1 progress for its portion of scroll (Product 0: 0-0.25, Product 1: 0.25-0.5, etc.)
- **Rotation Mapping**: `rotation = scrollProgress * Math.PI * 2` (full 360° rotation per product)

**Error Handling & Resilience**:
- ErrorBoundary catches rendering errors with fallback UI
- WebGL context loss recovery handlers
- Graceful fallback to product images when WebGL unavailable
- Works in headless/CI environments without errors
- No React warnings or hooks violations

**Technical Implementation**:
- React Three Fiber v8.17 for React 18 compatibility
- Framer Motion for scroll-driven animations
- Custom MotionValue fallback ensures hooks compliance
- Production-ready with architect approval