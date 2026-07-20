# Family Chore Kiosk

A touchscreen kiosk app for turning chores into weekly payouts. Kids claim
and complete chores on a big-tile board; a parent reviews and approves each
one before it counts toward that kid's balance; at the end of the week the
app produces a payout summary that becomes QuickBooks Online bills — one
per kid — for a parent to release manually via ACH inside QuickBooks.

## Stack

- **Next.js 16** (App Router, TypeScript, Server Actions) — single deployable app, no separate API server.
- **PostgreSQL** via **Prisma 7** (driver adapter: `@prisma/adapter-pg`).
- **Tailwind CSS v4** for the touch-friendly UI.
- Sessions are a signed cookie (`jose`, HS256) — no third-party auth service, since login here is just "tap your avatar, enter your PIN."

## Data model

See `prisma/schema.prisma` (the comments at the top walk through the design). Short version:

- `Household` — the single-family tenant boundary. Everything else hangs off it.
- `Profile` — both parent and kid logins live here (`role: PARENT | KID`), PIN stored as a bcrypt hash only.
- `Chore` — a reusable library entry (name, description, dollar value, recurring or one-off).
- `WeekPeriod` — one Sunday–Saturday cycle. Claims and payouts are scoped to it; "reset for the new week" is just starting a new one.
- `ChoreClaim` — the kid-facing lifecycle: `CLAIMED → COMPLETED → APPROVED | REJECTED`. **Nothing touches a balance until a claim reaches `APPROVED`** — that's the approval gate from the spec, enforced structurally rather than just by convention.
- `PayoutSummary` / `PayoutLineItem` — one summary per week, one line item per kid, generated from approved claims only.
- `QuickBooksConnection` — encrypted OAuth token storage, one per household, plus which QBO expense account bills post against.

## Getting started

```bash
npm install
cp .env.example .env   # then fill in DATABASE_URL, SESSION_SECRET, TOKEN_ENCRYPTION_KEY
npm run db:migrate     # creates the schema
npm run db:seed        # optional: demo household (parent PIN 1234, kid PIN 1111)
npm run dev
```

Generate the two required secrets:

```bash
openssl rand -base64 32   # SESSION_SECRET
openssl rand -hex 32      # TOKEN_ENCRYPTION_KEY
```

Open `http://localhost:3000` — if no household exists yet you'll land on a
one-time setup form that creates the household and the first parent
profile. From there, use **Kids & Parents** to add kid profiles and
**Chores** to build the chore library.

### Running as a kiosk

Point the touchscreen's browser at the deployed URL in kiosk/fullscreen
mode (most browsers have a `--kiosk` flag, or use the OS's built-in kiosk
mode). The layout is tuned for large touch targets and disables
pinch-zoom; no app installation is needed on the device itself.

## Deploying

This is a standard Next.js + Postgres app — deploy it anywhere that runs
Node 20.9+ (Railway, Render, Fly.io, a VPS, etc.) with a Postgres database
(Railway/Render/Neon/Supabase all work). Steps:

1. Provision Postgres, set `DATABASE_URL`.
2. Set `SESSION_SECRET` and `TOKEN_ENCRYPTION_KEY` (generate fresh values for production — don't reuse the ones from local dev).
3. Run `npm run db:deploy` (applies migrations without prompting) as part of your deploy step.
4. `npm run build && npm run start`.

No secrets are hard-coded anywhere in the repo — everything sensitive
comes from environment variables (see `.env.example`).

## QuickBooks integration

`src/lib/quickbooks/` implements OAuth 2.0 + the Bills API against
QuickBooks Online directly over `fetch` (no SDK), so exactly what's
sent/received is visible in the code rather than hidden in a client
library:

- `client.ts` — `authorizeUrl`, `exchangeCodeForTokens`, `refreshTokens`, `createBillsForPayout`.
- `connection.ts` — persists tokens encrypted (`src/lib/crypto.ts`, AES-256-GCM, key from `TOKEN_ENCRYPTION_KEY`) on `QuickBooksConnection`, one row per household, and transparently refreshes the access token when it's close to expiring.
- `api.ts` — `fetchVendors` / `fetchExpenseAccounts`, used to populate the mapping dropdowns.
- `oauth-state.ts` — CSRF protection for the OAuth round trip (random `state`, stashed in a short-lived httpOnly cookie, verified on callback).
- `src/app/api/quickbooks/authorize` and `.../callback` — the two Route Handlers that carry out the browser redirect dance with Intuit.

**Setup**: register an app at https://developer.intuit.com (start with a
sandbox company), then set `QBO_CLIENT_ID`, `QBO_CLIENT_SECRET`, and
`QBO_REDIRECT_URI` in `.env` (see `.env.example` — redirect URI must match
what you register with Intuit exactly, including the `/api/quickbooks/callback`
path). Restart the app, then as a parent go to the **QuickBooks** tab:

1. **Connect** — redirects to Intuit's consent screen and stores the resulting tokens.
2. **Choose an expense account** — every Bill needs one; pick whichever account (e.g. "Allowance") should absorb these.
3. **Map each kid to a vendor** — kids must already exist as vendors in your QuickBooks company; pick the matching one for each.
4. From **Payouts**, once a weekly summary is generated, **Send to QuickBooks** creates one Bill per kid vendor for their approved total and records the resulting `quickbooksBillId`.
5. **The ACH release itself stays manual, inside QuickBooks** — this app never touches money movement. That's the deliberate fraud safeguard from the brief. Once you've released payment there, come back and **Mark settled & start new week** to close the books here and roll balances over.

This hasn't been exercised against a real Intuit sandbox company from this
environment (no credentials were available to test with) — the OAuth
redirect, CSRF state check, token refresh, and every UI error path
(unconfigured, not connected, QBO API unreachable, kid unmapped, missing
expense account) are verified, but the actual token exchange and Bill
creation calls have only been checked against Intuit's documented request/
response shapes, not a live round trip. Worth a first real run against a
sandbox company before trusting it with production data.

## Known simplifications (MVP scope)

- **Timezone**: week boundaries use the server's local clock rather than a per-household IANA timezone conversion. Correct as long as the app is deployed in the same timezone the family lives in — flag if that changes.
- **Claim race on the board**: "first tap wins" is enforced via a DB transaction check, not a DB-level constraint. Fine for a single household kiosk; would need a partial unique index if this ever ran at higher concurrency.
- **Single household per deployment**: the schema supports multiple households, but there's no multi-tenant routing/auth boundary built — this is meant to be one deploy per family.
