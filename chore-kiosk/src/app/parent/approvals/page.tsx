import { db } from "@/lib/db";
import { requireParent } from "@/lib/auth";
import { getOrCreateActiveWeekPeriod } from "@/lib/week";
import { formatCents } from "@/lib/money";
import { Avatar } from "@/components/Avatar";
import { approveClaim, rejectClaim } from "@/actions/claim-actions";

export default async function ApprovalsPage() {
  const session = await requireParent();
  const weekPeriod = await getOrCreateActiveWeekPeriod(session.householdId);

  const pendingClaims = await db.choreClaim.findMany({
    where: { weekPeriodId: weekPeriod.id, status: "COMPLETED" },
    include: { chore: true, kid: true },
    orderBy: { completedAt: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-800">Approval queue</h1>

      {pendingClaims.length === 0 ? (
        <p className="text-slate-400">Nothing waiting on you right now.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {pendingClaims.map((claim) => (
            <div key={claim.id} className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow">
              <div className="flex items-center gap-3">
                <Avatar emoji={claim.kid.avatarEmoji} color={claim.kid.avatarColor} size="md" />
                <div>
                  <p className="font-semibold text-slate-800">{claim.kid.name}</p>
                  <p className="text-sm text-slate-400">
                    Completed {claim.completedAt?.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <div>
                  <p className="font-semibold text-slate-800">{claim.chore.name}</p>
                  {claim.chore.description && <p className="text-sm text-slate-500">{claim.chore.description}</p>}
                </div>
                <span className="text-lg font-bold text-emerald-600">{formatCents(claim.chore.valueCents)}</span>
              </div>

              <form className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="awardedValueDollars"
                    step="0.01"
                    min="0.01"
                    max={(claim.chore.valueCents / 100).toFixed(2)}
                    placeholder={`${(claim.chore.valueCents / 100).toFixed(2)} (full value)`}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    name="note"
                    placeholder="Reason (for reject)"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    formAction={approveClaim.bind(null, claim.id)}
                    className="flex-1 rounded-xl bg-emerald-600 py-3 font-semibold text-white active:scale-95"
                  >
                    Approve
                  </button>
                  <button
                    formAction={rejectClaim.bind(null, claim.id)}
                    className="flex-1 rounded-xl bg-red-100 py-3 font-semibold text-red-700 active:scale-95"
                  >
                    Reject
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Leave the amount blank to approve at full value, or enter a lower amount to approve reduced.
                </p>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
