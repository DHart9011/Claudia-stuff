"use client";

import { useActionState } from "react";
import { createProfile } from "@/actions/profile-actions";

export function ProfileForm() {
  const [state, formAction, pending] = useActionState(createProfile, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-600">Name</span>
        <input name="name" required placeholder="Jamie" className="rounded-xl border border-slate-300 px-4 py-3" />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-600">Role</span>
        <select name="role" className="rounded-xl border border-slate-300 px-4 py-3" defaultValue="KID">
          <option value="KID">Kid</option>
          <option value="PARENT">Parent</option>
        </select>
      </label>

      <div className="flex gap-4">
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-sm font-medium text-slate-600">Avatar emoji</span>
          <input
            name="avatarEmoji"
            defaultValue="🙂"
            maxLength={4}
            className="rounded-xl border border-slate-300 px-4 py-3 text-center text-xl"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-sm font-medium text-slate-600">Avatar color</span>
          <input
            name="avatarColor"
            type="color"
            defaultValue="#6366f1"
            className="h-[52px] w-full rounded-xl border border-slate-300"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-600">4-digit PIN</span>
        <input
          name="pin"
          required
          inputMode="numeric"
          pattern="\d{4}"
          maxLength={4}
          placeholder="1234"
          className="rounded-xl border border-slate-300 px-4 py-3 tracking-widest"
        />
      </label>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white active:scale-95 disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add profile"}
      </button>
    </form>
  );
}
