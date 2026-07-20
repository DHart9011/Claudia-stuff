"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { loginWithPin } from "@/actions/auth-actions";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"] as const;

export function PinPad({ profileId }: { profileId: string }) {
  const [state, formAction, actionPending] = useActionState(loginWithPin, undefined);
  const [pin, setPin] = useState("");
  const [isPending, startTransition] = useTransition();
  const pending = actionPending || isPending;

  // Clear the entered PIN whenever a new (failed) attempt comes back from the
  // server. Adjusting state during render — rather than in an effect — avoids
  // an extra render pass; see https://react.dev/learn/you-might-not-need-an-effect
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state?.error && pin !== "") {
      setPin("");
    }
  }

  useEffect(() => {
    if (pin.length !== 4) return;
    const formData = new FormData();
    formData.set("profileId", profileId);
    formData.set("pin", pin);
    startTransition(() => {
      formAction(formData);
    });
  }, [pin, profileId, formAction]);

  function press(key: string) {
    if (pending) return;
    if (key === "back") {
      setPin((prev) => prev.slice(0, -1));
      return;
    }
    if (key === "" || pin.length >= 4) return;
    setPin((prev) => prev + key);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className={`h-5 w-5 rounded-full border-2 border-indigo-500 ${
              i < pin.length ? "bg-indigo-500" : "bg-transparent"
            }`}
          />
        ))}
      </div>

      {state?.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}

      <div className="grid grid-cols-3 gap-4">
        {KEYS.map((key, i) =>
          key === "" ? (
            <div key={i} />
          ) : (
            <button
              key={i}
              type="button"
              onClick={() => press(key)}
              disabled={pending}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl font-semibold text-slate-700 shadow transition active:scale-95 disabled:opacity-50"
            >
              {key === "back" ? "⌫" : key}
            </button>
          )
        )}
      </div>
    </div>
  );
}
