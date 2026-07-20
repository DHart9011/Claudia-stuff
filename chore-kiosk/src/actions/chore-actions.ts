"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireParent } from "@/lib/auth";
import { choreFormSchema } from "@/lib/validation";
import { dollarsToCents } from "@/lib/money";

export type ActionState = { error?: string } | undefined;

export async function createChore(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireParent();

  const parsed = choreFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || "",
    valueDollars: formData.get("valueDollars"),
    isRecurring: formData.get("isRecurring") === "on",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const { name, description, valueDollars, isRecurring } = parsed.data;

  await db.chore.create({
    data: {
      householdId: session.householdId,
      name,
      description,
      valueCents: dollarsToCents(valueDollars),
      isRecurring,
      createdById: session.profileId,
    },
  });

  revalidatePath("/parent/chores");
  revalidatePath("/kid");
}

export async function updateChore(choreId: string, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireParent();

  const parsed = choreFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || "",
    valueDollars: formData.get("valueDollars"),
    isRecurring: formData.get("isRecurring") === "on",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const chore = await db.chore.findFirst({ where: { id: choreId, householdId: session.householdId } });
  if (!chore) {
    return { error: "Chore not found." };
  }

  const { name, description, valueDollars, isRecurring } = parsed.data;

  await db.chore.update({
    where: { id: choreId },
    data: {
      name,
      description,
      valueCents: dollarsToCents(valueDollars),
      isRecurring,
    },
  });

  revalidatePath("/parent/chores");
  revalidatePath("/kid");
}

export async function setChoreActive(choreId: string, active: boolean) {
  const session = await requireParent();

  await db.chore.updateMany({
    where: { id: choreId, householdId: session.householdId },
    data: { active },
  });

  revalidatePath("/parent/chores");
  revalidatePath("/kid");
}
