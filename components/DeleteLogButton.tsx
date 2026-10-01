"use client";

import { useTransition } from "react";
import { deleteFieldLog } from "@/app/logs/actions";

export function DeleteLogButton({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`Delete “${title}”? This can't be undone.`)) return;

    startTransition(async () => {
      const result = await deleteFieldLog(id);
      if (result.error) window.alert(result.error);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="rounded-md px-2.5 py-1 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
