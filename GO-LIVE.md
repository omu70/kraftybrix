# KraftyBrix — Go-Live Checklist

Everything the store needs to take real orders. No Supabase — a free Neon
Postgres database + your Razorpay keys.

## 1. Database (free — Neon)
1. Create a free project at https://neon.tech (no card required).
2. Copy the **pooled** connection string.
3. In Vercel → Project → Settings → Environment Variables, add:
   ```
   DATABASE_URL = postgresql://…  (your Neon pooled string)
   ```
4. Locally, put the same in `.env`, then run:
   ```
   npm run db:push     # creates all tables
   npm run db:seed     # loads the 30 real products
   ```
   The admin flips from "Demo mode" to **"Live database"** automatically — add/edit/delete now persist.

## 2. Payments (Razorpay — you have keys)
Add to Vercel env vars (and `.env`):
```
RAZORPAY_KEY_ID = rzp_live_xxx        (or rzp_test_xxx to test first)
RAZORPAY_KEY_SECRET = xxx
NEXT_PUBLIC_RAZORPAY_KEY_ID = rzp_live_xxx
```
Checkout then opens the real Razorpay window. Test card: `4111 1111 1111 1111`, any future expiry/CVV, OTP `1111`. COD works with no keys.

## 3. Auth (optional at launch — guest checkout works without it)
```
NEXTAUTH_URL = https://kraftybrix.vercel.app
NEXTAUTH_SECRET = (openssl rand -base64 32)
GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET   # for Google login
```

## 4. Emails (optional — order confirmations)
```
RESEND_API_KEY = re_xxx
RESEND_FROM_EMAIL = KraftyBrix <hello@yourdomain.com>
```

## 5. Analytics (optional)
```
NEXT_PUBLIC_GA_ID = G-xxxx
NEXT_PUBLIC_META_PIXEL_ID = xxxx
```

## 6. Logo
Drop your logo at `public/logo.png` (falls back to a text wordmark if absent).

## 7. Admin
Visit `/admin` — Dashboard, Products (add/edit/delete/search), Orders, Inventory, Customers, Coupons.
- **Demo mode** (no DATABASE_URL): fully clickable, changes aren't saved.
- **Live** (DATABASE_URL set): every change persists to Postgres.
> Protect `/admin` before launch: gate it behind NextAuth with `role: ADMIN`
> (the schema already has a `role` field) or Vercel password protection.

## 8. Deploy
Push to `main` → Vercel auto-builds. Confirm the deployment is green, hard-refresh.

---
### Launch-day minimum
1 (database) + 2 (Razorpay) + 8 (deploy). Everything else is optional polish.
