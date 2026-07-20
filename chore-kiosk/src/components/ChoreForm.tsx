"use client";

import { useActionState } from "react";
import type { ActionState } from "@/actions/chore-actions";

type ChoreFormAction = (state: ActionState, formData: FormData) => Promise<ActionState>;

export function ChoreForm({
  action,
  defaultValues,
  submitLabel = "Save",
}: {
  action: ChoreFormAction;
  defaultValues?: { name: string; description: string; valueDollars: number; isRecurring: boolean };
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-600">Chore name</span>
        <input
          name="name"
          required
          defaultValue={defaultValues?.name}
          placeholder="Take out the trash"
          className="rounded-xl border border-slate-300 px-4 py-3"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-600">Description</span>
        <textarea
          name="description"
          defaultValue={defaultValues?.description}
          placeholder="Both bins, out to the curb by 8am"
          className="rounded-xl border border-slate-300 px-4 py-3"
          rows={2}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-600">Value ($)</span>
        <input
          name="valueDollars"
          type="number"
          step="0.01"
          min="0.01"
          required
          defaultValue={defaultValues?.valueDollars}
          placeholder="2.00"
          className="rounded-xl border border-slate-300 px-4 py-3"
        />
      </label>

      <label className="flex items-center gap-2">
        <input
          name="isRecurring"
          type="checkbox"
          defaultChecked={defaultValues?.isRecurring ?? true}
          className="h-5 w-5"
        />
        <span className="text-sm font-medium text-slate-600">Recurring — reappears every week</span>
      </label>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white active:scale-95 disabled:opacity-50"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
