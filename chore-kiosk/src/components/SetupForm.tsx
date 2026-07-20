"use client";

import { useActionState } from "react";
import { setupHousehold } from "@/actions/setup-actions";

export function SetupForm() {
  const [state, action, pending] = useActionState(setupHousehold, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-600">Household name</span>
        <input
          name="householdName"
          required
          placeholder="The Smith Family"
          className="rounded-xl border border-slate-300 px-4 py-3 text-lg"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-600">Your name (parent)</span>
        <input
          name="parentName"
          required
          placeholder="Alex"
          className="rounded-xl border border-slate-300 px-4 py-3 text-lg"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-600">Choose a 4-digit PIN</span>
        <input
          name="pin"
          required
          inputMode="numeric"
          pattern="\d{4}"
          maxLength={4}
          placeholder="1234"
          className="rounded-xl border border-slate-300 px-4 py-3 text-lg tracking-widest"
        />
      </label>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-xl bg-indigo-600 px-4 py-3 text-lg font-semibold text-white transition active:scale-95 disabled:opacity-50"
      >
        {pending ? "Setting up…" : "Create household"}
      </button>
    </form>
  );
}
