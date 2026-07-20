import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/auth";
import { consumeOAuthState } from "@/lib/quickbooks/oauth-state";
import { saveConnectionFromAuthCode } from "@/lib/quickbooks/connection";
import { getQuickBooksAppConfig } from "@/lib/quickbooks/config";

// Intuit redirects the parent's browser back here with ?code&realmId&state
// (or ?error=...) after they approve/deny the consent screen.
export async function GET(request: NextRequest) {
  const session = await verifySession();
  if (!session || session.role !== "PARENT") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const realmId = searchParams.get("realmId");
  const state = searchParams.get("state");
  const intuitError = searchParams.get("error");

  const stateIsValid = await consumeOAuthState(state);

  if (intuitError || !code || !realmId || !stateIsValid) {
    return NextResponse.redirect(new URL("/parent/quickbooks?error=1", request.url));
  }

  try {
    const { environment } = getQuickBooksAppConfig();
    await saveConnectionFromAuthCode(session.householdId, code, realmId, environment);
  } catch (err) {
    console.error("Failed to complete QuickBooks connection:", err);
    return NextResponse.redirect(new URL("/parent/quickbooks?error=1", request.url));
  }

  return NextResponse.redirect(new URL("/parent/quickbooks?connected=1", request.url));
}
