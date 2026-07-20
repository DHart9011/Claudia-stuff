import "server-only";
import { getQuickBooksAppConfig } from "./config";
import { QBO_AUTHORIZE_URL, QBO_TOKEN_URL, QBO_SCOPE, QBO_REQUEST_TIMEOUT_MS, accountingApiBaseUrl } from "./urls";
import type { CreatedBill, PendingBill, QuickBooksApiContext, QuickBooksTokenSet } from "./types";

// OAuth 2.0 authorization-code flow + Bills creation against the
// QuickBooks Online Accounting API. No SDK — Intuit's REST API is stable
// and well documented, and plain fetch keeps exactly what's sent/received
// visible instead of hiding it behind a client library.
//
// See src/app/api/quickbooks/authorize and .../callback for how this gets
// wired into a browser redirect flow, and src/lib/quickbooks/connection.ts
// for where the resulting tokens are stored (encrypted) and refreshed.

export function authorizeUrl(state: string): string {
  const { clientId, redirectUri } = getQuickBooksAppConfig();
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    scope: QBO_SCOPE,
    redirect_uri: redirectUri,
    state,
  });
  return `${QBO_AUTHORIZE_URL}?${params.toString()}`;
}

function basicAuthHeader(clientId: string, clientSecret: string): string {
  return "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
}

interface RawTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number; // seconds
  x_refresh_token_expires_in: number; // seconds
}

async function requestTokens(body: URLSearchParams): Promise<RawTokenResponse> {
  const { clientId, clientSecret } = getQuickBooksAppConfig();
  const res = await fetch(QBO_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: basicAuthHeader(clientId, clientSecret),
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body,
    signal: AbortSignal.timeout(QBO_REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`QuickBooks token request failed (${res.status}): ${await res.text()}`);
  }
  return res.json();
}

function toTokenSet(raw: RawTokenResponse, realmId: string): QuickBooksTokenSet {
  const now = Date.now();
  return {
    accessToken: raw.access_token,
    refreshToken: raw.refresh_token,
    accessTokenExpiresAt: new Date(now + raw.expires_in * 1000),
    refreshTokenExpiresAt: new Date(now + raw.x_refresh_token_expires_in * 1000),
    realmId,
  };
}

export async function exchangeCodeForTokens(code: string, realmId: string): Promise<QuickBooksTokenSet> {
  const { redirectUri } = getQuickBooksAppConfig();
  const raw = await requestTokens(
    new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirectUri })
  );
  return toTokenSet(raw, realmId);
}

export async function refreshTokens(refreshToken: string, realmId: string): Promise<QuickBooksTokenSet> {
  const raw = await requestTokens(new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }));
  return toTokenSet(raw, realmId);
}

/**
 * Creates one Bill per kid vendor for their approved weekly total. Runs
 * sequentially (payouts are at most a handful of kids) so a failure partway
 * through leaves a clear, easy-to-reason-about set of what did/didn't get
 * created rather than a pile of parallel error handling.
 */
export async function createBillsForPayout(
  bills: PendingBill[],
  context: QuickBooksApiContext
): Promise<CreatedBill[]> {
  const base = accountingApiBaseUrl(context.environment);
  const created: CreatedBill[] = [];

  for (const bill of bills) {
    const res = await fetch(`${base}/v3/company/${context.realmId}/bill?minorversion=65`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${context.accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        VendorRef: { value: bill.quickbooksVendorId },
        PrivateNote: `Chore payout — ${bill.weekPeriodLabel}`,
        Line: [
          {
            DetailType: "AccountBasedExpenseLineDetail",
            Amount: bill.totalCents / 100,
            Description: `Weekly chore payout — ${bill.weekPeriodLabel}`,
            AccountBasedExpenseLineDetail: { AccountRef: { value: context.expenseAccountId } },
          },
        ],
      }),
      signal: AbortSignal.timeout(QBO_REQUEST_TIMEOUT_MS),
    });

    if (!res.ok) {
      throw new Error(
        `QuickBooks bill creation failed for vendor ${bill.quickbooksVendorId} (${res.status}): ${await res.text()}`
      );
    }

    const json = (await res.json()) as { Bill: { Id: string } };
    created.push({ quickbooksBillId: json.Bill.Id, kidProfileId: bill.kidProfileId });
  }

  return created;
}
