"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";
import { db } from "@/lib/db";
import { requireParent } from "@/lib/auth";
import { hashPin } from "@/lib/pin";
import { profileFormSchema, pinSchema } from "@/lib/validation";

export type ActionState = { error?: string } | undefined;

export async function createProfile(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireParent();

  const parsed = profileFormSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    avatarEmoji: formData.get("avatarEmoji") || undefined,
    avatarColor: formData.get("avatarColor") || undefined,
    pin: formData.get("pin"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const { name, role, avatarEmoji, avatarColor, pin } = parsed.data;
  const pinHash = await hashPin(pin);

  await db.profile.create({
    data: {
      householdId: session.householdId,
      role,
      name,
      avatarEmoji,
      avatarColor,
      pinHash,
    },
  });

  revalidatePath("/parent/profiles");
  revalidatePath("/");
}

const editProfileSchema = z.object({
  name: z.string().trim().min(1).max(40),
  avatarEmoji: z.string().trim().min(1).max(8),
  avatarColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  pin: z.union([pinSchema, z.literal("")]).optional(),
});

export async function updateProfile(profileId: string, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireParent();

  const parsed = editProfileSchema.safeParse({
    name: formData.get("name"),
    avatarEmoji: formData.get("avatarEmoji"),
    avatarColor: formData.get("avatarColor"),
    pin: formData.get("pin") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const profile = await db.profile.findFirst({
    where: { id: profileId, householdId: session.householdId },
  });
  if (!profile) {
    return { error: "Profile not found." };
  }

  const { name, avatarEmoji, avatarColor, pin } = parsed.data;

  await db.profile.update({
    where: { id: profileId },
    data: {
      name,
      avatarEmoji,
      avatarColor,
      ...(pin ? { pinHash: await hashPin(pin) } : {}),
    },
  });

  revalidatePath("/parent/profiles");
  revalidatePath("/");
}

export async function setProfileActive(profileId: string, active: boolean) {
  const session = await requireParent();

  await db.profile.updateMany({
    where: { id: profileId, householdId: session.householdId },
    data: { active },
  });

  revalidatePath("/parent/profiles");
  revalidatePath("/");
}
