# KraftyBrix — Go-Live Checklist

Work top to bottom. Everything is set in **Vercel → Project → Settings → Environment Variables** (Production), then **Redeploy**.

## 1. Database (required — fixes "db connection error")
- [ ] `DATABASE_URL` = your **direct** Neon connection string
      - Must be the **non-pooled** URL (no `-pooler` in the host).
      - Keep `?sslmode=require`. **Remove** `&channel_binding=require` (it breaks Prisma).
- [ ] Redeploy. The build runs `prisma db push`, which creates every table automatically.
- [ ] Open `/admin` → **Settings → Test database connection** → should say connected.
- [ ] `/admin → Products → Load sample products` (or add your own) to populate the DB.

## 2. Payments — PayU (primary)
- [ ] `PAYU_MERCHANT_KEY` = your PayU merchant key
- [ ] `PAYU_SALT` = your PayU salt  *(server-only — never prefix with NEXT_PUBLIC)*
- [ ] `PAYU_MODE` = `test` while testing, then `live` to take real money
- [ ] `NEXT_PUBLIC_PAYU_MERCHANT_KEY` = same merchant key (lets the checkout offer PayU)
- [ ] `NEXT_PUBLIC_SITE_URL` = `https://your-domain` (used for PayU success/failure return URLs)
- [ ] In the PayU dashboard, set the **webhook / server-to-server URL** to
      `https://your-domain/api/payu/webhook` (so orders record even if the shopper closes the tab).
- [ ] Test a ₹99 Partial-COD order in `test` mode, confirm it lands in `/admin → Live transactions`.
- [ ] Flip `PAYU_MODE=live`, redeploy, do one real ₹99 order, refund it in the PayU dashboard.

Razorpay is optional and still supported — add `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`,
`NEXT_PUBLIC_RAZORPAY_KEY_ID` and both gateways appear at checkout.

## 3. Accounts & email
- [ ] `NEXTAUTH_SECRET` = a long random string (`openssl rand -base64 32`)
- [ ] `NEXTAUTH_URL` = `https://your-domain`
- [ ] `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (for Google login) — optional
- [ ] `RESEND_API_KEY` (order confirmation emails) — optional but recommended
- [ ] `RESEND_FROM_EMAIL` = `KraftyBrix <hello@your-domain>`

## 4. Admin lock & tracking
- [ ] `ADMIN_SESSION` = a strong secret → locks `/admin` behind login
- [ ] `NEXT_PUBLIC_META_PIXEL_ID` (already defaults to your pixel `1937440843807692`)
- [ ] Push your latest code and confirm Vercel builds green.

## 5. Final smoke test (do all of these once)
- [ ] Home, collection, a product page, cart, checkout all load
- [ ] Place a PARTIAL_COD order (₹99) → PayU → returns to "Order confirmed"
- [ ] Place a full ONLINE order → PayU → confirmed
- [ ] Order shows in `/admin → Orders` and `/admin → Live transactions`
- [ ] Confirmation email arrives (if Resend set)
- [ ] `/admin → Settings` shows Database + PayU as green

## Security (already built in)
- PayU **salt stays server-side**; the browser only ever sees the non-secret merchant key + a one-way hash.
- The amount is **computed on the server** and bound into the request hash — customers can't tamper with the price.
- The callback is **verified with PayU's reverse hash** plus an amount check before any order is marked paid; a paid order can never be downgraded by a replayed/forged callback.
- Razorpay payments are verified with an HMAC signature.
- `/admin` and all admin actions are gated behind `ADMIN_SESSION`.
- Keep `.env` out of git (it already is). Never paste live keys into chat or commits.
