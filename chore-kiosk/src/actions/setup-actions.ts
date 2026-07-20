"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSession } from "@/lib/session";
import { hashPin } from "@/lib/pin";
import { pinSchema } from "@/lib/validation";
import * as z from "zod";

const setupSchema = z.object({
  householdName: z.string().trim().min(1).max(80),
  parentName: z.string().trim().min(1).max(40),
  pin: pinSchema,
});

export type SetupState = { error?: string } | undefined;

/** One-time bootstrap: creates the household and its first parent profile. */
export async function setupHousehold(_prevState: SetupState, formData: FormData): Promise<SetupState> {
  // Guard against re-running once a household exists — this form should be unreachable then,
  // but a direct POST could still hit this action.
  const existing = await db.household.count();
  if (existing > 0) {
    return { error: "This household is already set up." };
  }

  const parsed = setupSchema.safeParse({
    householdName: formData.get("householdName"),
    parentName: formData.get("parentName"),
    pin: formData.get("pin"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const { householdName, parentName, pin } = parsed.data;
  const pinHash = await hashPin(pin);

  const parent = await db.$transaction(async (tx) => {
    const household = await tx.household.create({ data: { name: householdName } });
    return tx.profile.create({
      data: {
        householdId: household.id,
        role: "PARENT",
        name: parentName,
        pinHash,
      },
    });
  });

  await createSession({
    profileId: parent.id,
    householdId: parent.householdId,
    role: "PARENT",
    name: parent.name,
  });

  redirect("/parent");
}
