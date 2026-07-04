# KraftyBrix — Production Audit & Roadmap

_Last updated: 4 July 2026_

**Stack (preserved as-is):** Next.js 15 App Router · React 19 · TypeScript · Tailwind · Framer Motion / GSAP · Zustand · Prisma + PostgreSQL (Neon) · Razorpay · Resend · NextAuth · Vercel.

This audit reflects the **actual** code in the repo, not assumptions. Legend: ✅ done · 🟡 partial · ❌ missing.

---

## 1. Honest reality check (read this first)

The brief you pasted describes a **Shopify-scale platform** — gift cards, affiliate programs, 6-role RBAC, media library, blog CMS, warehouse/incoming stock, 360 viewers, voice search, push notifications, abandoned-cart recovery, email campaigns, PDF invoices/packing slips, and more. That is a **multi-month build**, not a single pass.

Auto-generating all ~200 items in one go would produce exactly the thing the brief forbids: **stubs, dummy buttons and placeholder data**. So the professional approach is to **prioritise** — ship a genuinely production-ready core first, then layer depth. Some items (RBAC, warehouse logistics, affiliate, media library, voice search) are **over-engineered for a store at launch** and are flagged as _defer_ below with honest reasoning.

**Good news:** your store is already ~70% of the way to a clean, sellable launch, and this session closed several of the real gaps.

---

## 2. What was completed this session

- **Two checkout options only**, exactly as requested: **Partial COD** (₹99 paid online now, balance in cash on delivery) and **Pay online** (full amount). Full COD and all other methods removed. Dynamic "pay now / due on delivery" maths across the checkout, order-confirmation page, emails, and admin.
- **Order model** extended (`amountPaid`, `codBalance`, `PARTIAL` payment status; `PaymentMethod` = `ONLINE | PARTIAL_COD`).
- **Admin completed with real data + demo fallback:** live Dashboard KPIs (revenue collected, orders, AOV, COD-to-collect, low stock, subscribers), real Orders table with editable status that persists, Customers (derived + lifetime value), Coupons, Subscribers, Inventory (low-stock alerts), and a Settings "go-live status" panel.
- **Global Search** (`/search`) with live filtering + popular searches — the header search button was a dead button; now wired.
- **Wishlist page** (`/wishlist`) — the header heart pointed at `/account/wishlist` which 404'd; fixed.
- **Newsletter** now actually persists subscribers (and emails a welcome code) when the DB/Resend keys are present.
- **New static pages:** About, FAQ, Cookie Policy — wired into the footer + sitemap.
- **Broken routes fixed:** `/account/orders` and `/account/wishlist`.

---

## 3. Page-by-page audit

| Area | Status | Notes |
|---|---|---|
| Home | ✅ | Hero, trust bar, categories, best-sellers, "why", build experience, garage builder, testimonials, community, newsletter, exit-intent promo, live scarcity. |
| Collection | ✅ | Category/price/difficulty/rating/stock filters + sort. 🟡 no pagination/infinite scroll yet. |
| Product | ✅ | Gallery, buy box, tabs, related, **Product JSON-LD** already present. 🟡 no reviews submission / Q&A (static), no compare. |
| Bundle (3 for ₹1999) | ✅ | Working. |
| Cart | ✅ | Drawer, quantity, coupon, bundle lines. |
| Checkout | ✅ | Two payment methods, coupons, validation, Razorpay + demo fallback. |
| Order confirmed | ✅ | Now shows paid vs balance-due. |
| Search / Wishlist | ✅ | Added this session. |
| Account dashboard | 🟡 | UI exists (orders/wishlist/addresses/profile/notifications) but **uses demo data** and buttons aren't wired to a real customer session. |
| Login / Register | 🟡 | Page exists but the form is **non-functional** (Google commented out, no submit handler, no register). |
| Admin + login | ✅ | Completed this session; gated by middleware. |
| Legal (privacy/terms/shipping/returns/cookies) | ✅ | Real content. |
| About / FAQ | ✅ | Added this session. |
| Contact | ✅ | Present. |
| 404 / loading | ✅ | `not-found.tsx` + `loading.tsx`. 🟡 no per-route `error.tsx` boundaries; no maintenance page. |

---

## 4. Backend / data / security

- ✅ **Prisma schema** is comprehensive: User, Account, Session, Category, Product, Order, OrderItem, Address, Review, Wishlist, Coupon, Subscriber.
- ✅ **Server actions** for checkout (Razorpay order, signature verify, persist, email), admin CRUD (products/orders/stats/subscribers/config), newsletter.
- ✅ **Admin auth** via httpOnly cookie + middleware on `/admin`.
- ✅ **Validation** with Zod on checkout + newsletter + admin product.
- 🟡 **Customer auth** (NextAuth) is scaffolded but not functional end-to-end.
- ❌ Rate limiting, audit logs, granular RBAC, secure file-upload pipeline.
- ✅ **SEO:** sitemap, robots, manifest, per-product metadata + OG + JSON-LD. 🟡 breadcrumb/FAQ schema, per-page OG images.

---

## 5. Prioritised roadmap

### Phase 1 — Go-live essentials  ✅ (done this session, except env)
Two payment options · admin order management · search · wishlist · static pages · order emails · SEO basics.
**Your remaining action:** add `DATABASE_URL` (Neon) + Razorpay keys in Vercel, redeploy, run "Load sample products," place one test order.

### Phase 2 — Real customer accounts  (highest value next)
Functional NextAuth (Google + email/password), bind orders to the logged-in user, real order history & tracking from the DB, address book CRUD, working profile/notification saves. Wire the currently-decorative account buttons.

### Phase 3 — Merchandising & trust
Product reviews with verified-purchase + photos, Q&A, recently-viewed, compare, collection pagination/infinite scroll, skeleton loaders, per-route error boundaries.

### Phase 4 — Admin depth
Coupon CRUD in the DB (currently code-managed), brands, bulk CSV import/export, order invoice PDF + status timeline, inventory logs, reports/exports, store settings (tax, shipping zones, branding).

### Phase 5 — Growth
Blog/CMS, abandoned-cart recovery, email campaigns, referral program, gift cards.

### Deferred — over-engineered for launch (recommend skipping for now)
6-role RBAC & permission matrix · warehouse / incoming / reserved stock · media library · 360° viewer · voice search · push notifications · affiliate program · live-visitor tracking. _These add large maintenance surface for little near-term ROI on a new store; revisit once you have order volume._

---

## 6. Recommendation

Go live now on Phase 1 (add the env vars and test one order), then let me build **Phase 2 (real customer accounts)** next — it's the highest-impact remaining work and unlocks order tracking, which customers expect. I can proceed through the phases in order.
