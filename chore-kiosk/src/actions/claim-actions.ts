"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireKid, requireParent } from "@/lib/auth";
import { getOrCreateActiveWeekPeriod } from "@/lib/week";
import { dollarsToCents } from "@/lib/money";
import { decisionNoteSchema } from "@/lib/validation";

const ACTIVE_CLAIM_STATUSES = ["CLAIMED", "COMPLETED", "APPROVED"] as const;

/** Kid taps an available chore to claim it. First tap wins. */
export async function claimChore(choreId: string) {
  const session = await requireKid();

  const chore = await db.chore.findFirst({
    where: { id: choreId, householdId: session.householdId, active: true },
  });
  if (!chore) return;

  const weekPeriod = await getOrCreateActiveWeekPeriod(session.householdId);

  try {
    await db.$transaction(async (tx) => {
      const alreadyClaimed = await tx.choreClaim.findFirst({
        where: { choreId, weekPeriodId: weekPeriod.id, status: { in: [...ACTIVE_CLAIM_STATUSES] } },
      });
      if (alreadyClaimed) {
        throw new Error("ALREADY_CLAIMED");
      }
      await tx.choreClaim.create({
        data: { choreId, weekPeriodId: weekPeriod.id, kidId: session.profileId, status: "CLAIMED" },
      });
    });
  } catch {
    // Someone else claimed it first (or it raced) — the board will simply
    // no longer show it as available once we revalidate below.
  }

  revalidatePath("/kid");
}

/** Kid marks one of their own claimed chores as done; it drops into the parent's approval queue. */
export async function completeChore(claimId: string) {
  const session = await requireKid();

  const claim = await db.choreClaim.findFirst({
    where: { id: claimId, kidId: session.profileId, status: "CLAIMED" },
  });
  if (!claim) return;

  await db.choreClaim.update({
    where: { id: claimId },
    data: { status: "COMPLETED", completedAt: new Date() },
  });

  revalidatePath("/kid");
  revalidatePath("/parent/approvals");
}

/** Parent approves a completed claim, optionally at a reduced dollar value. */
export async function approveClaim(claimId: string, formData: FormData) {
  const session = await requireParent();

  const claim = await db.choreClaim.findFirst({
    where: { id: claimId, status: "COMPLETED", weekPeriod: { householdId: session.householdId } },
    include: { chore: true },
  });
  if (!claim) return;

  const reducedInput = String(formData.get("awardedValueDollars") ?? "").trim();
  let awardedValueCents = claim.chore.valueCents;
  if (reducedInput) {
    try {
      const candidate = dollarsToCents(reducedInput);
      if (candidate > 0 && candidate <= claim.chore.valueCents) {
        awardedValueCents = candidate;
      }
    } catch {
      // Invalid input — fall back to full value rather than blocking the approval.
    }
  }

  await db.$transaction(async (tx) => {
    await tx.choreClaim.update({
      where: { id: claimId },
      data: {
        status: "APPROVED",
        decidedAt: new Date(),
        decidedById: session.profileId,
        awardedValueCents,
      },
    });
    // One-off chores don't respawn — retire them once they've paid out.
    if (!claim.chore.isRecurring) {
      await tx.chore.update({ where: { id: claim.choreId }, data: { active: false } });
    }
  });

  revalidatePath("/parent/approvals");
  revalidatePath("/parent/chores");
  revalidatePath("/parent/payouts");
  revalidatePath("/kid");
}

/** Parent sends a completed claim back to the board instead of approving it. */
export async function rejectClaim(claimId: string, formData: FormData) {
  const session = await requireParent();

  const claim = await db.choreClaim.findFirst({
    where: { id: claimId, status: "COMPLETED", weekPeriod: { householdId: session.householdId } },
  });
  if (!claim) return;

  const note = decisionNoteSchema.parse(String(formData.get("note") ?? "").trim() || undefined);

  await db.choreClaim.update({
    where: { id: claimId },
    data: {
      status: "REJECTED",
      decidedAt: new Date(),
      decidedById: session.profileId,
      decisionNote: note,
    },
  });

  revalidatePath("/parent/approvals");
  revalidatePath("/kid");
}
