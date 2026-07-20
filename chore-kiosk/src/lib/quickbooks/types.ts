// Shape of the data this app will eventually exchange with QuickBooks
// Online. No network calls happen anywhere in this module yet — see
// README "QuickBooks integration" for the planned OAuth 2.0 + Bills flow.

export type QuickBooksEnvironment = "sandbox" | "production";

export interface QuickBooksTokenSet {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
  realmId: string;
}

/** One kid's weekly payout total, ready to become a QBO Bill against their vendor record. */
export interface PendingBill {
  kidProfileId: string;
  quickbooksVendorId: string;
  totalCents: number;
  weekPeriodLabel: string;
}

export interface CreatedBill {
  quickbooksBillId: string;
  kidProfileId: string;
}
