"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireParent } from "@/lib/auth";
import { disconnectQuickBooksConnection, getValidAccessToken } from "@/lib/quickbooks/connection";
import { createBillsForPayout } from "@/lib/quickbooks/client";

export async function disconnectQuickBooks() {
  const session = await requireParent();
  await disconnectQuickBooksConnection(session.householdId);
  revalidatePath("/parent/quickbooks");
  revalidatePath("/parent/payouts");
}

export async function setExpenseAccount(formData: FormData) {
  const session = await requireParent();
  const [accountId, ...nameParts] = String(formData.get("account") ?? "").split("::");
  if (!accountId) return;

  await db.quickBooksConnection.updateMany({
    where: { householdId: session.householdId },
    data: { expenseAccountId: accountId, expenseAccountName: nameParts.join("::") },
  });

  revalidatePath("/parent/quickbooks");
}

export async function setKidVendor(kidId: string, formData: FormData) {
  const session = await requireParent();
  const vendorId = String(formData.get("vendorId") ?? "").trim();

  await db.profile.updateMany({
    where: { id: kidId, householdId: session.householdId, role: "KID" },
    data: { quickbooksVendorId: vendorId || null },
  });

  revalidatePath("/parent/quickbooks");
}

export type SendPayoutState = { error?: string } | undefined;

/** Creates a QuickBooks Bill per kid vendor for this week's approved totals. The ACH release itself stays manual, inside QuickBooks. */
export async function sendPayoutToQuickBooks(
  payoutSummaryId: string,
  _prevState: SendPayoutState,
  _formData: FormData
): Promise<SendPayoutState> {
  const session = await requireParent();

  const summary = await db.payoutSummary.findFirst({
    where: { id: payoutSummaryId, weekPeriod: { householdId: session.householdId } },
    include: { weekPeriod: true, lineItems: { include: { kid: true } } },
  });
  if (!summary || summary.status !== "DRAFT") {
    return { error: "This payout has already been sent or settled." };
  }

  const connection = await db.quickBooksConnection.findUnique({ where: { householdId: session.householdId } });
  if (!connection) {
    return { error: "Connect QuickBooks first (see the QuickBooks tab)." };
  }
  if (!connection.expenseAccountId) {
    return { error: "Choose an expense account on the QuickBooks tab before sending payouts." };
  }

  const billable = summary.lineItems.filter((li) => li.totalCents > 0);
  const missingVendor = billable.find((li) => !li.kid.quickbooksVendorId);
  if (missingVendor) {
    return { error: `${missingVendor.kid.name} isn't mapped to a QuickBooks vendor yet — see the QuickBooks tab.` };
  }

  if (billable.length === 0) {
    return { error: "Nothing to send — every kid's total is $0 this week." };
  }

  try {
    const { accessToken, realmId, environment } = await getValidAccessToken(session.householdId);
    const weekLabel = `${summary.weekPeriod.startDate.toLocaleDateString()} – ${summary.weekPeriod.endDate.toLocaleDateString()}`;

    const created = await createBillsForPayout(
      billable.map((li) => ({
        kidProfileId: li.kidId,
        quickbooksVendorId: li.kid.quickbooksVendorId!,
        totalCents: li.totalCents,
        weekPeriodLabel: weekLabel,
      })),
      { accessToken, realmId, environment, expenseAccountId: connection.expenseAccountId }
    );

    await db.$transaction([
      ...created.map((bill) =>
        db.payoutLineItem.updateMany({
          where: { payoutSummaryId: summary.id, kidId: bill.kidProfileId },
          data: { quickbooksBillId: bill.quickbooksBillId, quickbooksSyncStatus: "BILL_CREATED" },
        })
      ),
      db.payoutSummary.update({ where: { id: summary.id }, data: { status: "SENT_TO_QUICKBOOKS" } }),
    ]);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Something went wrong talking to QuickBooks." };
  }

  revalidatePath("/parent/payouts");
}
