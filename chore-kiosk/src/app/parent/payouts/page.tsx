import { db } from "@/lib/db";
import { requireParent } from "@/lib/auth";
import { getOrCreateActiveWeekPeriod } from "@/lib/week";
import { formatCents } from "@/lib/money";
import { generatePayoutSummary, settleWeek } from "@/actions/payout-actions";

function formatRange(start: Date, end: Date) {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${start.toLocaleDateString(undefined, opts)} – ${end.toLocaleDateString(undefined, opts)}`;
}

export default async function PayoutsPage() {
  const session = await requireParent();
  const activeWeekPeriod = await getOrCreateActiveWeekPeriod(session.householdId);

  const summaries = await db.payoutSummary.findMany({
    where: { weekPeriod: { householdId: session.householdId } },
    include: { lineItems: { include: { kid: true } }, weekPeriod: true },
    orderBy: { generatedAt: "desc" },
  });

  const activeHasSummary = summaries.some((s) => s.weekPeriodId === activeWeekPeriod.id);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold text-slate-800">Payouts</h1>

      {!activeHasSummary && (
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow">
          <div>
            <p className="font-semibold text-slate-800">
              Current week: {formatRange(activeWeekPeriod.startDate, activeWeekPeriod.endDate)}
            </p>
            <p className="text-sm text-slate-500">
              Generate the summary once you&apos;ve finished approving chores for the week.
            </p>
          </div>
          <form action={generatePayoutSummary}>
            <button className="whitespace-nowrap rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white active:scale-95">
              Generate weekly summary
            </button>
          </form>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {summaries.length === 0 && <p className="text-slate-400">No payout summaries yet.</p>}
        {summaries.map((summary) => {
          const total = summary.lineItems.reduce((sum, li) => sum + li.totalCents, 0);
          return (
            <div key={summary.id} className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">
                    {formatRange(summary.weekPeriod.startDate, summary.weekPeriod.endDate)}
                  </p>
                  <span className="text-xs uppercase tracking-wide text-slate-400">{summary.status}</span>
                </div>
                <span className="text-xl font-bold text-emerald-600">{formatCents(total)}</span>
              </div>

              <div className="flex flex-col divide-y divide-slate-100">
                {summary.lineItems.map((li) => (
                  <div key={li.id} className="flex items-center justify-between py-2">
                    <span className="text-slate-700">{li.kid.name}</span>
                    <span className="font-semibold text-slate-800">{formatCents(li.totalCents)}</span>
                  </div>
                ))}
              </div>

              {summary.status === "DRAFT" && (
                <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
                  <button
                    disabled
                    title="Connect QuickBooks Online to send bills automatically (see README)"
                    className="rounded-xl bg-slate-100 px-4 py-3 font-medium text-slate-400"
                  >
                    Send to QuickBooks (not connected)
                  </button>
                  <form action={settleWeek.bind(null, summary.id)}>
                    <button className="rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white active:scale-95">
                      Mark settled & start new week
                    </button>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
