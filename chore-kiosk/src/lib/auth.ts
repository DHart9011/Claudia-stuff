import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession, type SessionPayload } from "@/lib/session";

/**
 * Data Access Layer entry point. Every Server Action / page that needs to
 * know "who is this" should go through here rather than reading the cookie
 * directly — this is the one place that decides what "authenticated" means.
 */
export const verifySession = cache(async (): Promise<SessionPayload | null> => {
  return getSession();
});

export async function requireSession(): Promise<SessionPayload> {
  const session = await verifySession();
  if (!session) {
    redirect("/");
  }
  return session;
}

export async function requireParent(): Promise<SessionPayload> {
  const session = await requireSession();
  if (session.role !== "PARENT") {
    redirect("/kid");
  }
  return session;
}

export async function requireKid(): Promise<SessionPayload> {
  const session = await requireSession();
  if (session.role !== "KID") {
    redirect("/parent");
  }
  return session;
}
