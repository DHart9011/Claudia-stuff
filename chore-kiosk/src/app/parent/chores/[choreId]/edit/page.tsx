import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireParent } from "@/lib/auth";
import { ChoreForm } from "@/components/ChoreForm";
import { updateChore } from "@/actions/chore-actions";

export default async function EditChorePage({ params }: PageProps<"/parent/chores/[choreId]/edit">) {
  const session = await requireParent();
  const { choreId } = await params;

  const chore = await db.chore.findFirst({ where: { id: choreId, householdId: session.householdId } });
  if (!chore) notFound();

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 rounded-2xl bg-white p-6 shadow">
      <h1 className="text-2xl font-bold text-slate-800">Edit chore</h1>
      <ChoreForm
        action={updateChore.bind(null, chore.id)}
        defaultValues={{
          name: chore.name,
          description: chore.description,
          valueDollars: chore.valueCents / 100,
          isRecurring: chore.isRecurring,
        }}
        submitLabel="Save changes"
      />
    </div>
  );
}
