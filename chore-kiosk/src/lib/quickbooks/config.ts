import "server-only";
import type { QuickBooksEnvironment } from "./types";

// Reads the QBO app credentials from the environment. Nothing in this repo
// hard-codes a client ID/secret — see .env.example. Throws only when
// something actually tries to use these, so the rest of the app works
// fine before QuickBooks is connected.
export function getQuickBooksAppConfig() {
  const clientId = process.env.QBO_CLIENT_ID;
  const clientSecret = process.env.QBO_CLIENT_SECRET;
  const redirectUri = process.env.QBO_REDIRECT_URI;
  const environment = (process.env.QBO_ENVIRONMENT ?? "sandbox") as QuickBooksEnvironment;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      "QuickBooks is not configured. Set QBO_CLIENT_ID, QBO_CLIENT_SECRET, and QBO_REDIRECT_URI " +
        "(see .env.example) once you're ready to connect QuickBooks Online."
    );
  }

  return { clientId, clientSecret, redirectUri, environment };
}
