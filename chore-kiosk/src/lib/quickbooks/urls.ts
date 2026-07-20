import type { QuickBooksEnvironment } from "./types";

// Intuit's OAuth 2.0 + Accounting API endpoints. These are fixed platform
// URLs, not configuration — the only things that vary per-app are the
// client id/secret/redirect (see config.ts) and which of the two
// Accounting API hosts below to hit (sandbox vs production company).
export const QBO_AUTHORIZE_URL = "https://appcenter.intuit.com/connect/oauth2";
export const QBO_TOKEN_URL = "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer";
export const QBO_REVOKE_URL = "https://developer.api.intuit.com/v2/oauth2/tokens/revoke";
export const QBO_SCOPE = "com.intuit.quickbooks.accounting";

// Every outbound call to Intuit should abort by this point rather than
// hanging the request (and, for calls made during a page render, the page).
export const QBO_REQUEST_TIMEOUT_MS = 10_000;

export function accountingApiBaseUrl(environment: QuickBooksEnvironment): string {
  return environment === "production"
    ? "https://quickbooks.api.intuit.com"
    : "https://sandbox-quickbooks.api.intuit.com";
}
