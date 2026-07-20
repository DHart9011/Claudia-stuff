import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decryptSessionToken, SESSION_COOKIE_NAME } from "@/lib/session";

// Optimistic route guard only — reads the signed cookie, no DB hit. Real
// authorization (role checks, ownership) happens in Server Actions and the
// DAL (src/lib/auth.ts), which is the actual line of defense.
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const session = await decryptSessionToken(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  const isParentRoute = path.startsWith("/parent");
  const isKidRoute = path.startsWith("/kid");

  if (isParentRoute && session?.role !== "PARENT") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isKidRoute && session?.role !== "KID") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/parent/:path*", "/kid/:path*"],
};
