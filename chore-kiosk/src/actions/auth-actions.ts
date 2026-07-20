"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";
import { verifyPin } from "@/lib/pin";
import { pinSchema } from "@/lib/validation";

export type LoginState = { error?: string } | undefined;

export async function loginWithPin(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const profileId = String(formData.get("profileId") ?? "");
  const pinInput = String(formData.get("pin") ?? "");

  const parsedPin = pinSchema.safeParse(pinInput);
  if (!profileId || !parsedPin.success) {
    return { error: "Enter a 4-digit PIN." };
  }

  const profile = await db.profile.findUnique({ where: { id: profileId } });
  if (!profile || !profile.active) {
    return { error: "Profile not found." };
  }

  const valid = await verifyPin(parsedPin.data, profile.pinHash);
  if (!valid) {
    return { error: "Incorrect PIN." };
  }

  await createSession({
    profileId: profile.id,
    householdId: profile.householdId,
    role: profile.role,
    name: profile.name,
  });

  redirect(profile.role === "PARENT" ? "/parent" : "/kid");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
