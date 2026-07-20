import "server-only";
import { db } from "@/lib/db";
import { encryptSecret, decryptSecret } from "@/lib/crypto";
import { exchangeCodeForTokens, refreshTokens } from "./client";
import type { QuickBooksEnvironment } from "./types";

const REFRESH_SKEW_MS = 5 * 60 * 1000; // refresh a bit before actual expiry, not right at the deadline

export async function saveConnectionFromAuthCode(
  householdId: string,
  code: string,
  realmId: string,
  environment: QuickBooksEnvironment
) {
  const tokens = await exchangeCodeForTokens(code, realmId);
  const data = {
    environment: environment === "production" ? ("PRODUCTION" as const) : ("SANDBOX" as const),
    realmId,
    encryptedAccessToken: encryptSecret(tokens.accessToken),
    encryptedRefreshToken: encryptSecret(tokens.refreshToken),
    accessTokenExpiresAt: tokens.accessTokenExpiresAt,
    refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
  };

  await db.quickBooksConnection.upsert({
    where: { householdId },
    create: { householdId, ...data },
    update: data,
  });
}

export async function disconnectQuickBooksConnection(householdId: string) {
  await db.quickBooksConnection.deleteMany({ where: { householdId } });
}

/** Returns a currently-valid access token for the household, refreshing (and persisting) if it's close to expiring. */
export async function getValidAccessToken(
  householdId: string
): Promise<{ accessToken: string; realmId: string; environment: QuickBooksEnvironment }> {
  const connection = await db.quickBooksConnection.findUnique({ where: { householdId } });
  if (!connection) {
    throw new Error("QuickBooks is not connected for this household yet.");
  }

  const environment: QuickBooksEnvironment = connection.environment === "PRODUCTION" ? "production" : "sandbox";

  if (connection.accessTokenExpiresAt.getTime() - REFRESH_SKEW_MS > Date.now()) {
    return { accessToken: decryptSecret(connection.encryptedAccessToken), realmId: connection.realmId, environment };
  }

  const refreshed = await refreshTokens(decryptSecret(connection.encryptedRefreshToken), connection.realmId);

  await db.quickBooksConnection.update({
    where: { householdId },
    data: {
      encryptedAccessToken: encryptSecret(refreshed.accessToken),
      encryptedRefreshToken: encryptSecret(refreshed.refreshToken),
      accessTokenExpiresAt: refreshed.accessTokenExpiresAt,
      refreshTokenExpiresAt: refreshed.refreshTokenExpiresAt,
    },
  });

  return { accessToken: refreshed.accessToken, realmId: connection.realmId, environment };
}
