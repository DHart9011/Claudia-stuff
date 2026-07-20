import * as z from "zod";

export const pinSchema = z
  .string()
  .regex(/^\d{4}$/, { error: "PIN must be exactly 4 digits." });

export const choreFormSchema = z.object({
  name: z.string().trim().min(1, { error: "Name is required." }).max(80),
  description: z.string().trim().max(500).default(""),
  valueDollars: z.coerce
    .number()
    .positive({ error: "Value must be greater than $0." })
    .max(1000, { error: "Value must be $1000 or less." }),
  isRecurring: z.coerce.boolean().default(true),
});

export const profileFormSchema = z.object({
  name: z.string().trim().min(1, { error: "Name is required." }).max(40),
  role: z.enum(["PARENT", "KID"]),
  avatarEmoji: z.string().trim().min(1).max(8).default("🙂"),
  avatarColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, { error: "Pick a valid color." })
    .default("#6366f1"),
  pin: pinSchema,
});

export const decisionNoteSchema = z.string().trim().max(280).optional();
