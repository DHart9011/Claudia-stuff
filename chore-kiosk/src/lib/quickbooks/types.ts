// Shape of the data this app exchanges with QuickBooks Online. See README
// "QuickBooks integration" for the OAuth 2.0 + Bills flow this supports.

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

/** Everything createBillsForPayout needs beyond the bills themselves. */
export interface QuickBooksApiContext {
  accessToken: string;
  realmId: string;
  environment: QuickBooksEnvironment;
  expenseAccountId: string;
}

export interface QuickBooksVendor {
  id: string;
  displayName: string;
}

export interface QuickBooksAccount {
  id: string;
  name: string;
}
