import { db } from "@/lib/db";
import { requireKid } from "@/lib/auth";
import { getOrCreateActiveWeekPeriod } from "@/lib/week";
import { formatCents } from "@/lib/money";
import { Avatar } from "@/components/Avatar";
import { claimChore, completeChore } from "@/actions/claim-actions";
import { logout } from "@/actions/auth-actions";

const ACTIVE_STATUSES = ["CLAIMED", "COMPLETED", "APPROVED"] as const;

export default async function KidBoardPage() {
  const session = await requireKid();
  const [profile, weekPeriod] = await Promise.all([
    db.profile.findUniqueOrThrow({ where: { id: session.profileId } }),
    getOrCreateActiveWeekPeriod(session.householdId),
  ]);

  const [availableChores, myClaims] = await Promise.all([
    db.chore.findMany({
      where: {
        householdId: session.householdId,
        active: true,
        claims: { none: { weekPeriodId: weekPeriod.id, status: { in: [...ACTIVE_STATUSES] } } },
      },
      orderBy: { createdAt: "asc" },
    }),
    db.choreClaim.findMany({
      where: { kidId: session.profileId, weekPeriodId: weekPeriod.id },
      include: { chore: true },
      orderBy: { claimedAt: "asc" },
    }),
  ]);

  const claimed = myClaims.filter((c) => c.status === "CLAIMED");
  const pendingApproval = myClaims.filter((c) => c.status === "COMPLETED");
  const approved = myClaims.filter((c) => c.status === "APPROVED");
  const weeklyBalanceCents = approved.reduce((sum, c) => sum + (c.awardedValueCents ?? 0), 0);

  return (
    <main className="flex flex-1 flex-col gap-8 p-6">
      <header className="flex items-center justify-between rounded-3xl bg-white p-4 shadow">
        <div className="flex items-center gap-4">
          <Avatar emoji={profile.avatarEmoji} color={profile.avatarColor} size="md" />
          <div>
            <h1 className="text-xl font-bold text-slate-800">{profile.name}</h1>
            <p className="text-sm text-slate-500">This week&apos;s balance</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-3xl font-bold text-emerald-600">{formatCents(weeklyBalanceCents)}</span>
          <form action={logout}>
            <button className="rounded-xl bg-slate-100 px-4 py-3 font-medium text-slate-600 active:scale-95">
              Switch profile
            </button>
          </form>
        </div>
      </header>

      {claimed.length > 0 && (
        <Section title="Your chores — mark done when finished">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {claimed.map((claim) => (
              <div key={claim.id} className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow">
                <ChoreCard name={claim.chore.name} description={claim.chore.description} valueCents={claim.chore.valueCents} />
                <form action={completeChore.bind(null, claim.id)}>
                  <button className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white active:scale-95">
                    Mark complete
                  </button>
                </form>
              </div>
            ))}
          </div>
        </Section>
      )}

      {pendingApproval.length > 0 && (
        <Section title="Waiting for a parent to check">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {pendingApproval.map((claim) => (
              <div key={claim.id} className="flex flex-col gap-2 rounded-2xl bg-amber-50 p-4 opacity-80">
                <ChoreCard name={claim.chore.name} description={claim.chore.description} valueCents={claim.chore.valueCents} />
                <span className="text-xs font-medium uppercase tracking-wide text-amber-600">Pending approval</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section title="Available chores — tap to claim">
        {availableChores.length === 0 ? (
          <p className="text-slate-400">No chores available right now.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {availableChores.map((chore) => (
              <form key={chore.id} action={claimChore.bind(null, chore.id)}>
                <button className="flex w-full flex-col items-start gap-2 rounded-2xl bg-white p-4 text-left shadow transition active:scale-95">
                  <ChoreCard name={chore.name} description={chore.description} valueCents={chore.valueCents} />
                </button>
              </form>
            ))}
          </div>
        )}
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-slate-600">{title}</h2>
      {children}
    </section>
  );
}

function ChoreCard({ name, description, valueCents }: { name: string; description: string; valueCents: number }) {
  return (
    <div className="flex w-full flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-slate-800">{name}</span>
        <span className="text-lg font-bold text-emerald-600">{formatCents(valueCents)}</span>
      </div>
      {description && <p className="text-sm text-slate-500">{description}</p>}
    </div>
  );
}
