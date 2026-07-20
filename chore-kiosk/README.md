# Family Chore Kiosk

A touchscreen kiosk app for turning chores into weekly payouts. Kids claim
and complete chores on a big-tile board; a parent reviews and approves each
one before it counts toward that kid's balance; at the end of the week the
app produces a payout summary that (eventually) becomes QuickBooks Online
bills for a parent to release manually.

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
- `QuickBooksConnection` — encrypted OAuth token storage for a future QuickBooks connection. Nothing reads or writes real QuickBooks data yet (see below).

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

## QuickBooks integration (not built yet, by design)

Per the brief, this was scaffolded first: `src/lib/quickbooks/` has the
types (`types.ts`), the config reader (`config.ts`), and a client module
(`client.ts`) whose functions currently just `throw` with a clear message.
The `QuickBooksConnection` model and the `PayoutLineItem.quickbooksBillId` /
`quickbooksSyncStatus` fields are ready for it. Nothing here makes a
network call to Intuit yet.

The planned flow, when we build it:

1. **Connect**: parent starts OAuth 2.0 from a settings page; Intuit redirects back with a code; exchange it for an access + refresh token pair.
2. **Store**: encrypt both tokens (`src/lib/crypto.ts`, AES-256-GCM, key from `TOKEN_ENCRYPTION_KEY`) and save them on `QuickBooksConnection`, one per household. Refresh silently when they're close to expiring.
3. **Map kids to vendors**: each kid profile gets a `quickbooksVendorId`, set once against an existing QBO vendor record for that kid.
4. **Send a payout**: from `/parent/payouts`, "Send to QuickBooks" creates one Bill per kid vendor for their approved weekly total (`PayoutLineItem.totalCents`), then records the resulting `quickbooksBillId`.
5. **Manual release stays manual**: this app never touches ACH — releasing the actual payment is a one-tap approval inside QuickBooks itself, which is the fraud safeguard called out in the brief. Once that's done in QBO, "Mark settled & start new week" here just closes the books on this app's side and rolls balances over.

To pick this up: register an app at https://developer.intuit.com, fill in
`QBO_CLIENT_ID` / `QBO_CLIENT_SECRET` / `QBO_REDIRECT_URI` in `.env`
(sandbox first), then implement `authorizeUrl`, `exchangeCodeForTokens`,
`refreshTokens`, and `createBillsForPayout` in `src/lib/quickbooks/client.ts`.

## Known simplifications (MVP scope)

- **Timezone**: week boundaries use the server's local clock rather than a per-household IANA timezone conversion. Correct as long as the app is deployed in the same timezone the family lives in — flag if that changes.
- **Claim race on the board**: "first tap wins" is enforced via a DB transaction check, not a DB-level constraint. Fine for a single household kiosk; would need a partial unique index if this ever ran at higher concurrency.
- **Single household per deployment**: the schema supports multiple households, but there's no multi-tenant routing/auth boundary built — this is meant to be one deploy per family.
