import "server-only";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";

const STATE_COOKIE = "qbo_oauth_state";
const STATE_MAX_AGE_SECONDS = 10 * 60; // long enough to complete the Intuit consent screen

/** Generates a random CSRF token for the OAuth `state` param and stashes it in a short-lived cookie. */
export async function createAndStoreOAuthState(): Promise<string> {
  const state = randomBytes(16).toString("hex");
  const cookieStore = await cookies();
  cookieStore.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: STATE_MAX_AGE_SECONDS,
    path: "/",
  });
  return state;
}

/** Verifies the `state` Intuit sent back matches what we stored, then clears the cookie either way. */
export async function consumeOAuthState(candidate: string | null): Promise<boolean> {
  const cookieStore = await cookies();
  const expected = cookieStore.get(STATE_COOKIE)?.value;
  cookieStore.delete(STATE_COOKIE);
  return Boolean(expected) && expected === candidate;
}
