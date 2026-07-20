import "server-only";
import type { CreatedBill, PendingBill, QuickBooksTokenSet } from "./types";

// Deliberately unimplemented. This file defines the *shape* of the
// QuickBooks integration so the rest of the app (payout summaries, the
// data model, the encrypted-token storage in QuickBooksConnection) can be
// built and reviewed before any OAuth or API code is written.
//
// Planned flow, once we build this out:
//   1. authorizeUrl() -> redirect the parent to Intuit's consent screen.
//   2. exchangeCodeForTokens() -> OAuth 2.0 authorization-code exchange.
//   3. refreshTokens() -> silent refresh using the encrypted refresh token.
//   4. createBillsForPayout() -> one Bill per kid vendor for their approved
//      weekly total. The ACH release itself is a deliberate manual step
//      inside QuickBooks — this app never touches money movement.
//
// Tokens are persisted via QuickBooksConnection (prisma/schema.prisma),
// encrypted at rest with src/lib/crypto.ts. The QBO_CLIENT_ID /
// QBO_CLIENT_SECRET never appear in code — only in environment variables.

export function authorizeUrl(_state: string): string {
  throw new Error("QuickBooks OAuth is not implemented yet.");
}

export async function exchangeCodeForTokens(_code: string, _realmId: string): Promise<QuickBooksTokenSet> {
  throw new Error("QuickBooks OAuth is not implemented yet.");
}

export async function refreshTokens(_refreshToken: string): Promise<QuickBooksTokenSet> {
  throw new Error("QuickBooks OAuth is not implemented yet.");
}

export async function createBillsForPayout(_bills: PendingBill[]): Promise<CreatedBill[]> {
  throw new Error("QuickBooks Bills API integration is not implemented yet.");
}
