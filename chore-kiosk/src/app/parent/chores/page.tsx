import Link from "next/link";
import { db } from "@/lib/db";
import { requireParent } from "@/lib/auth";
import { formatCents } from "@/lib/money";
import { ChoreForm } from "@/components/ChoreForm";
import { createChore, setChoreActive } from "@/actions/chore-actions";

export default async function ChoresPage() {
  const session = await requireParent();

  const chores = await db.chore.findMany({
    where: { householdId: session.householdId },
    orderBy: [{ active: "desc" }, { createdAt: "asc" }],
  });

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Chore library</h1>
        <div className="flex flex-col divide-y divide-slate-100 rounded-2xl bg-white shadow">
          {chores.length === 0 && <p className="p-5 text-slate-400">No chores yet — add your first one.</p>}
          {chores.map((chore) => (
            <div key={chore.id} className={`flex items-center justify-between gap-4 p-5 ${chore.active ? "" : "opacity-50"}`}>
              <div>
                <p className="font-semibold text-slate-800">
                  {chore.name} <span className="text-emerald-600">{formatCents(chore.valueCents)}</span>
                </p>
                {chore.description && <p className="text-sm text-slate-500">{chore.description}</p>}
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  {chore.isRecurring ? "Recurring" : "One-off"} {!chore.active && "· Archived"}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/parent/chores/${chore.id}/edit`}
                  className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600"
                >
                  Edit
                </Link>
                <form action={setChoreActive.bind(null, chore.id, !chore.active)}>
                  <button className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600">
                    {chore.active ? "Archive" : "Restore"}
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow">
        <h2 className="text-lg font-semibold text-slate-700">Add a chore</h2>
        <ChoreForm action={createChore} submitLabel="Add chore" />
      </div>
    </div>
  );
}
