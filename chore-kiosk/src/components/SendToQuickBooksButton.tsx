"use client";

import { useActionState } from "react";
import { sendPayoutToQuickBooks } from "@/actions/quickbooks-actions";

export function SendToQuickBooksButton({ payoutSummaryId }: { payoutSummaryId: string }) {
  const [state, formAction, pending] = useActionState(sendPayoutToQuickBooks.bind(null, payoutSummaryId), undefined);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white active:scale-95 disabled:opacity-50"
      >
        {pending ? "Sending…" : "Send to QuickBooks"}
      </button>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
