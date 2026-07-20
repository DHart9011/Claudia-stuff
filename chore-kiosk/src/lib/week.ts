import "server-only";
import { db } from "@/lib/db";
import type { WeekStart } from "@/generated/prisma/enums";

const DAY_MS = 24 * 60 * 60 * 1000;

// NOTE: this uses the server's local clock, not a per-household IANA
// timezone conversion. That's correct as long as the app is deployed in
// the same timezone the family lives in (the normal case for a single-
// region kiosk deploy). If that stops being true, swap this for a proper
// tz-aware library (e.g. date-fns-tz) using household.timezone.
function startOfWeek(reference: Date, weekStart: WeekStart): Date {
  const dayOfWeek = reference.getDay(); // 0 = Sunday .. 6 = Saturday
  const anchor = weekStart === "MONDAY" ? 1 : 0;
  const diff = (dayOfWeek - anchor + 7) % 7;
  const start = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate() - diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

export function currentWeekBounds(weekStart: WeekStart, now: Date = new Date()) {
  const startDate = startOfWeek(now, weekStart);
  const endDate = new Date(startDate.getTime() + 7 * DAY_MS - 1);
  return { startDate, endDate };
}

/**
 * Bounds for the cycle immediately following `previousEndDate`. Used when
 * settling a week so the new cycle always picks up right where the last
 * one left off, regardless of exactly when during the week the parent hits
 * "settle" (which may not line up with the wall-clock week boundary).
 */
export function weekBoundsAfter(previousEndDate: Date) {
  const startDate = new Date(previousEndDate.getTime() + 1);
  const endDate = new Date(startDate.getTime() + 7 * DAY_MS - 1);
  return { startDate, endDate };
}

/**
 * Returns the household's current ACTIVE week period, creating the record
 * for this Sun-Sat (or Mon-Sun) cycle the first time anyone touches it.
 */
export async function getOrCreateActiveWeekPeriod(householdId: string) {
  const existing = await db.weekPeriod.findFirst({
    where: { householdId, status: "ACTIVE" },
    orderBy: { startDate: "desc" },
  });
  if (existing) return existing;

  const household = await db.household.findUniqueOrThrow({ where: { id: householdId } });
  const { startDate, endDate } = currentWeekBounds(household.weekStart);

  return db.weekPeriod.upsert({
    where: { householdId_startDate: { householdId, startDate } },
    update: {},
    create: { householdId, startDate, endDate, status: "ACTIVE" },
  });
}
