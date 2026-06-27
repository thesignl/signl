# SIGNL — Pre-Launch Secret Rotation & Production Env Runbook

**Status:** MANDATORY before public launch (target: 1 July 2026)
**Why:** The secrets shared over WhatsApp are considered compromised (transmitted
over chat + sitting in a transfers folder). All must be rotated. The current JWT
secrets are also human-readable phrases that the backend will reject in
production (`server.ts` exits if `JWT_ACCESS_SECRET` < 64 chars when
`NODE_ENV=production`).

Templates to fill in:
- `signl-backend/.env.production.example`  → becomes `signl-backend/.env`
- `signl-frontend/.env.production.example` → becomes `signl-frontend/.env.local`

---

## ✅ Item 2 — JWT secrets (generated — copy from chat, do NOT commit)

Two fresh 64-byte secrets were generated for you. They are intentionally NOT
stored in any committed file (committing real secrets puts them in git history
forever). Copy the values provided in chat into the production `.env`, or
regenerate your own with:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Run it twice (once per secret).

---

## 🔑 Item 1a — Rotate Neon database password

1. Log in to https://console.neon.tech
2. Select the SIGNL project → **Roles** (or **Settings → Database**).
3. On the `neondb_owner` role, click **Reset password**.
4. Copy the new **pooled** connection string (the one with `-pooler` in the host).
5. Paste it into `DATABASE_URL` in the production `.env`, keeping
   `?sslmode=require&channel_binding=require`.
6. The old password is now invalid everywhere — confirm no other service uses it.

> The schema is already migrated and in sync (verified). Rotating the password
> does not affect data or schema.

## 🔑 Item 1b — Rotate Google OAuth client secret

1. Go to https://console.cloud.google.com → **APIs & Services → Credentials**.
2. Open the OAuth 2.0 Client used by SIGNL.
3. Click **Add secret** (or reset), then **disable/delete the old secret** once
   the new one is in place.
4. Put the new value in `OAuth_Client_Secret`. `OAuth_Client_ID` stays the same.
5. Verify the **Authorized redirect URIs** include your production callback
   (e.g. `https://api.signl.media/api/auth/google/callback`).

## 🔑 Item 3 — Switch Razorpay to LIVE + webhook

1. https://dashboard.razorpay.com → toggle from **Test Mode** to **Live Mode**
   (top of dashboard). Complete KYC/activation if not already done.
2. **Settings → API Keys → Generate Live Key.** Copy `rzp_live_...` key id +
   secret into `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`.
3. **Settings → Webhooks → Add New Webhook:**
   - URL: `https://api.signl.media/api/subscription/webhook`
   - Active events: `payment.captured`, `payment.failed`, `order.paid`
   - Copy the **webhook secret** into `RAZORPAY_WEBHOOK_SECRET`.

> ⚠️ **Webhook handler not yet implemented.** The route's raw-body parser is
> wired, but there is no server handler consuming `/subscription/webhook` yet.
> Today, Pro activation depends entirely on the browser-side `/verify` call
> after payment. Edge case: if the user's browser closes between payment and
> verify, they are charged but not activated until they revisit.
> **Decision needed (see below).**

---

## 🖥️ Item 4 — Production host env vars

Backend host (the box running `node dist/server.js`):
```
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://signl.media          # exact frontend origin, no trailing slash
DATABASE_URL=<rotated Neon pooled URL>
JWT_ACCESS_SECRET=<generated>
JWT_REFRESH_SECRET=<generated>
RAZORPAY_KEY_ID=<live>
RAZORPAY_KEY_SECRET=<live>
RAZORPAY_WEBHOOK_SECRET=<from dashboard>
OAuth_Client_ID=<same>
OAuth_Client_Secret=<rotated>
REDIS_URL=                                # optional
```

Frontend host:
```
NEXT_PUBLIC_API_URL=https://api.signl.media/api
NEXT_PUBLIC_SITE_URL=https://signl.media
```

Deploy order:
1. Set backend env → `npm ci && npm run build` → `npx prisma migrate deploy`
   → `npm run start` (or PM2).
2. Set frontend env → `npm ci && npm run build` → `npm run start`.

Boot sanity check (backend):
- `GET /api/health` → 200
- `GET /api/ready`  → 200 (confirms DB connectivity)
If the server exits on boot with a JWT length fatal, the secret is still the old
short phrase — replace with the generated 64-byte value.

---

## Open decision — Razorpay webhook handler

**Recommended before taking live payments:** implement the
`POST /subscription/webhook` handler that verifies `x-razorpay-signature`
against `RAZORPAY_WEBHOOK_SECRET` and activates the subscription server-side.
This closes the "paid-but-not-activated" gap.

Options:
- **(A)** Launch invite-only / soft with client-verify only; add webhook in
  week 1. Acceptable for low volume.
- **(B)** Implement the webhook handler now before launch. ~Half a day; I can
  build it (it reuses the existing signature-verify + the atomic activation
  transaction already in `subscription.service.verifyPayment`).

---

## Final pre-launch verification (already passing locally)
- Backend + frontend: typecheck, build, tests (28/28) ✅
- Auth lifecycle (login/refresh/reload/logout) ✅
- RBAC for USER/EDITOR/ADMIN ✅
- Premium paywall: anon/free gated, subscriber full access ✅
- Razorpay checkout creates real orders; signature DoS-safe ✅
- Visual QA: 27 route×viewport combos clean; WCAG AA contrast ✅
