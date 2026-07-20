import "server-only";
import { accountingApiBaseUrl, QBO_REQUEST_TIMEOUT_MS } from "./urls";
import { getValidAccessToken } from "./connection";
import type { QuickBooksAccount, QuickBooksVendor } from "./types";

interface VendorQueryResponse {
  QueryResponse?: { Vendor?: Array<{ Id: string; DisplayName: string }> };
}

interface AccountQueryResponse {
  QueryResponse?: { Account?: Array<{ Id: string; Name: string }> };
}

async function runQuery<T>(householdId: string, query: string): Promise<T> {
  const { accessToken, realmId, environment } = await getValidAccessToken(householdId);
  const base = accountingApiBaseUrl(environment);
  const url = `${base}/v3/company/${realmId}/query?query=${encodeURIComponent(query)}&minorversion=65`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
    signal: AbortSignal.timeout(QBO_REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`QuickBooks query failed (${res.status}): ${await res.text()}`);
  }
  return res.json();
}

/** Active vendors in the connected QBO company — for mapping kid profiles to a payee. */
export async function fetchVendors(householdId: string): Promise<QuickBooksVendor[]> {
  const json = await runQuery<VendorQueryResponse>(
    householdId,
    "SELECT Id, DisplayName FROM Vendor WHERE Active = true ORDER BY DisplayName"
  );
  return (json.QueryResponse?.Vendor ?? []).map((v) => ({ id: v.Id, displayName: v.DisplayName }));
}

/** Active expense accounts — the parent picks one to post all payout bills against. */
export async function fetchExpenseAccounts(householdId: string): Promise<QuickBooksAccount[]> {
  const json = await runQuery<AccountQueryResponse>(
    householdId,
    "SELECT Id, Name FROM Account WHERE AccountType = 'Expense' AND Active = true ORDER BY Name"
  );
  return (json.QueryResponse?.Account ?? []).map((a) => ({ id: a.Id, name: a.Name }));
}
