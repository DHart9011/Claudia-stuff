"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireParent } from "@/lib/auth";
import { weekBoundsAfter } from "@/lib/week";

/**
 * Generates the weekly payout summary: one line item per kid, totalling
 * only claims that have cleared the APPROVED gate for the active week.
 * This does not touch QuickBooks — that's a separate, not-yet-built step
 * (see src/lib/quickbooks). It just closes out the week's numbers so the
 * parent can review them before sending anything anywhere.
 */
export async function generatePayoutSummary() {
  const session = await requireParent();

  const weekPeriod = await db.weekPeriod.findFirst({
    where: { householdId: session.householdId, status: "ACTIVE" },
  });
  if (!weekPeriod) return;

  const existing = await db.payoutSummary.findUnique({ where: { weekPeriodId: weekPeriod.id } });
  if (existing) return;

  const kids = await db.profile.findMany({
    where: { householdId: session.householdId, role: "KID", active: true },
  });

  const approvedTotals = await db.choreClaim.groupBy({
    by: ["kidId"],
    where: { weekPeriodId: weekPeriod.id, status: "APPROVED" },
    _sum: { awardedValueCents: true },
  });
  const totalsByKid = new Map(approvedTotals.map((row) => [row.kidId, row._sum.awardedValueCents ?? 0]));

  await db.$transaction(async (tx) => {
    await tx.payoutSummary.create({
      data: {
        weekPeriodId: weekPeriod.id,
        status: "DRAFT",
        lineItems: {
          create: kids.map((kid) => ({
            kidId: kid.id,
            totalCents: totalsByKid.get(kid.id) ?? 0,
          })),
        },
      },
    });
    await tx.weekPeriod.update({ where: { id: weekPeriod.id }, data: { status: "PENDING_PAYOUT" } });
  });

  revalidatePath("/parent/payouts");
}

/**
 * Marks the week's payout as settled and rolls balances over into a fresh
 * ACTIVE week period. The actual ACH release happens manually inside
 * QuickBooks (by design, as a fraud safeguard) — this just closes the book
 * on this app's side once that's done.
 */
export async function settleWeek(payoutSummaryId: string) {
  const session = await requireParent();

  const summary = await db.payoutSummary.findFirst({
    where: { id: payoutSummaryId, weekPeriod: { householdId: session.householdId } },
    include: { weekPeriod: true },
  });
  if (!summary || summary.status === "SETTLED") return;

  const { startDate, endDate } = weekBoundsAfter(summary.weekPeriod.endDate);

  await db.$transaction(async (tx) => {
    await tx.payoutSummary.update({
      where: { id: summary.id },
      data: { status: "SETTLED", settledAt: new Date() },
    });
    await tx.weekPeriod.update({
      where: { id: summary.weekPeriod.id },
      data: { status: "SETTLED" },
    });
    await tx.weekPeriod.upsert({
      where: { householdId_startDate: { householdId: session.householdId, startDate } },
      update: {},
      create: { householdId: session.householdId, startDate, endDate, status: "ACTIVE" },
    });
  });

  revalidatePath("/parent/payouts");
  revalidatePath("/parent/approvals");
  revalidatePath("/kid");
}
