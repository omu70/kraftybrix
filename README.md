# KraftyBrix

> **Build The Garage You've Always Dreamed Of** — a premium ecommerce platform for brick-built automotive collectibles.

A production-oriented Next.js 15 storefront with a real-time 3D procedural brick-car hero, conversion-optimised homepage, full product/collection/cart/checkout flow, customer account, and admin dashboard. Catalogue is seeded from the real KraftyBrix product list.

---

## Tech stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS, custom luxury dark design system |
| Animation | Framer Motion, GSAP (ScrollTrigger) |
| 3D | React Three Fiber + drei + three.js (procedural brick car — no GLB needed) |
| State | Zustand (cart + wishlist, persisted to localStorage) |
| Backend | Next.js Server Actions |
| ORM / DB | Prisma + PostgreSQL (Neon) |
| Auth | NextAuth — Google + Email/Credentials + guest checkout |
| Payments | Razorpay (test + live) + Cash on Delivery |
| Email | Resend |
| Media | Cloudinary |
| CMS | Sanity (optional content source) |
| Analytics | Google Analytics 4 + Meta Pixel |
| Hosting | Vercel |

---

## Quick start

```bash
cp .env.example .env        # fill in values (see below)
npm install
npx prisma generate
npm run dev                 # http://localhost:3000
```

Add your logo: drop the KraftyBrix logo PNG at **`public/logo.png`** (the header/footer load it from there).

### Database (when ready)

```bash
npm run db:push             # push schema to Neon
npm run db:seed             # seed real catalogue + BRICK10 coupon
npm run db:studio           # browse data
```

The site runs **without** a database for previewing — product data is read from `src/lib/products.ts`. Server actions are stubbed to no-op until env is configured.

---

## Razorpay test payments

1. Go to **dashboard.razorpay.com → toggle Test Mode → Settings → API Keys → Generate**.
2. Put the keys in `.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxx
   RAZORPAY_KEY_SECRET=xxx
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx
   ```
3. Checkout → "Pay online" opens the real Razorpay widget in test mode.
4. **Test card:** `4111 1111 1111 1111`, any future expiry, any CVV, OTP `1111`. **Test UPI:** `success@razorpay`.

Without keys, checkout runs in **demo mode** (simulated success) so the flow is still clickable. Signature verification happens server-side in `verifyPayment()`.

---

## Folder structure

```
kraftybrix/
├─ prisma/
│  ├─ schema.prisma          # Users, Products, Orders, Coupons, Reviews, …
│  └─ seed.ts                # seeds real catalogue from src/lib/products.ts
├─ public/
│  ├─ logo.png               # ← drop your logo here
│  └─ products/              # product imagery
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx          # root layout, fonts, JSON-LD, analytics
│  │  ├─ page.tsx            # homepage (9 sections)
│  │  ├─ globals.css         # design tokens
│  │  ├─ collection/         # filtered/sortable grid
│  │  ├─ product/[slug]/     # 3D viewer, build stats, tabs, related
│  │  ├─ checkout/           # single-page checkout (Razorpay + COD)
│  │  ├─ order-confirmed/
│  │  ├─ account/            # orders, wishlist, addresses, profile, notifications
│  │  ├─ admin/              # dashboard analytics, orders, products, …
│  │  ├─ login/
│  │  ├─ actions/            # server actions: checkout, newsletter
│  │  ├─ api/auth/[...nextauth]/
│  │  ├─ sitemap.ts · robots.ts · manifest.ts · not-found.tsx
│  ├─ components/
│  │  ├─ three/              # brick-car, car-scene (R3F)
│  │  ├─ home/               # hero, categories, why, best-sellers, build-experience,
│  │  │                      #   garage-builder, community, testimonials, newsletter
│  │  ├─ product/            # product-card, product-viewer, buy-box, product-tabs
│  │  ├─ collection/         # collection-view (filters + sort)
│  │  ├─ cart/               # cart-drawer
│  │  ├─ layout/             # header, footer
│  │  └─ ui/                 # button, magnetic, reveal, badge, stars, counter
│  ├─ store/                 # cart.ts, wishlist.ts (Zustand)
│  └─ lib/                   # products.ts, types.ts, utils.ts, prisma.ts, auth.ts
└─ next.config.mjs · tailwind.config.ts · tsconfig.json
```

---

## Architecture notes

**Rendering.** Pages are Server Components by default; only interactive islands (`"use client"`) ship JS — the 3D scene, cart, filters, carousels. The hero 3D canvas is lazy-loaded via `next/dynamic({ ssr:false })` so hero copy is in the initial HTML for LCP/SEO.

**3D brick car.** `components/three/brick-car.tsx` assembles a supercar entirely from box-geometry "bricks" with `InstancedMesh` studs — no external model files, fully theme-able via `bodyColor`/`accentColor` (driven per-product). Reused on the homepage hero and the product viewer (with rotate / exploded / fullscreen controls).

**Data layer.** `src/lib/products.ts` is the single source of truth for previews and is mirrored into Postgres by `prisma/seed.ts`. Swap reads to `prisma`/Sanity in the server components when your DB is live.

**Server actions** (`src/app/actions/`) handle newsletter signup and the full checkout (coupon validation, order creation, Razorpay order + signature verification). Wire the commented Prisma/Resend/Razorpay calls once env is set.

**CRO touches.** Announcement bar, free-shipping progress meter in cart, trust badges, sticky buy box, social proof (ratings, verified reviews, community wall), scarcity (Limited badges), exit-friendly newsletter offer, magnetic CTAs.

---

## Integrations

- **Auth** — `src/lib/auth.ts`. Add `GOOGLE_CLIENT_ID/SECRET`; enable the `PrismaAdapter` (commented) for persisted sessions. Guest checkout needs no session.
- **Sanity CMS** — add `NEXT_PUBLIC_SANITY_*`; create a `next-sanity` client and replace `getProduct`/`products` reads for editorial content.
- **Cloudinary** — product images via `next-cloudinary`; domain already allowed in `next.config.mjs`.
- **Resend** — welcome + order emails (uncomment in the actions).
- **Analytics** — set `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_META_PIXEL_ID`; ecommerce events fire via `track()` in `components/analytics.tsx`.

---

## SEO

Dynamic per-page metadata + Open Graph/Twitter, JSON-LD (`Organization` site-wide, `Product` on product pages), `sitemap.ts`, `robots.ts`, PWA `manifest.ts`.

---

## Deploy to Vercel

1. Push to GitHub.
2. Import the repo in Vercel.
3. Add all `.env` variables in **Project → Settings → Environment Variables**.
4. Set `DATABASE_URL` to your Neon pooled connection string.
5. Build command `npm run build` (runs `prisma generate`), output auto-detected.
6. After first deploy, run `npm run db:push && npm run db:seed` against the production DB (locally with prod `DATABASE_URL`, or a one-off Vercel job).

**Performance:** server components, code-splitting, lazy 3D, `next/image` (AVIF/WebP), font `display:swap`, package-import optimisation — targets Lighthouse 95+ / green Core Web Vitals.

---

© KraftyBrix. Built with Next.js.
