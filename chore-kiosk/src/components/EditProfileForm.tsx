"use client";

import { useActionState } from "react";
import type { ActionState } from "@/actions/profile-actions";

type EditProfileAction = (state: ActionState, formData: FormData) => Promise<ActionState>;

export function EditProfileForm({
  action,
  defaultValues,
}: {
  action: EditProfileAction;
  defaultValues: { name: string; avatarEmoji: string; avatarColor: string };
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <input
          name="name"
          required
          defaultValue={defaultValues.name}
          className="rounded-xl border border-slate-300 px-3 py-2"
        />
        <input
          name="avatarEmoji"
          defaultValue={defaultValues.avatarEmoji}
          maxLength={4}
          className="w-16 rounded-xl border border-slate-300 px-3 py-2 text-center"
        />
        <input
          name="avatarColor"
          type="color"
          defaultValue={defaultValues.avatarColor}
          className="h-[42px] w-14 rounded-xl border border-slate-300"
        />
        <input
          name="pin"
          inputMode="numeric"
          pattern="\d{4}"
          maxLength={4}
          placeholder="New PIN (optional)"
          className="w-40 rounded-xl border border-slate-300 px-3 py-2 tracking-widest"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white active:scale-95 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
