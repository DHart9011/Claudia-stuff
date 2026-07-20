import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/auth";
import { authorizeUrl } from "@/lib/quickbooks/client";
import { isQuickBooksConfigured } from "@/lib/quickbooks/config";
import { createAndStoreOAuthState } from "@/lib/quickbooks/oauth-state";

// Kicks off the OAuth 2.0 authorization-code flow by redirecting to
// Intuit's consent screen. Route Handlers can't use next/navigation's
// redirect() (that's for Server Components/Actions) — NextResponse.redirect
// is the equivalent here.
export async function GET(request: NextRequest) {
  const session = await verifySession();
  if (!session || session.role !== "PARENT") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isQuickBooksConfigured()) {
    return NextResponse.redirect(new URL("/parent/quickbooks?error=1", request.url));
  }

  const state = await createAndStoreOAuthState();
  return NextResponse.redirect(authorizeUrl(state));
}
