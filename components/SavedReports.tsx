"use client";

import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";
import type { SavedReport } from "@/lib/reports";
import type { AnalysisResult } from "@/lib/result";

export default function SavedReports({ session, refreshKey, onOpen }: { session: Session | null; refreshKey: number; onOpen: (r: AnalysisResult) => void }) {
  const [items, setItems] = useState<SavedReport[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const sb = getSupabase();
    if (!sb || !session) return;
    const { data, error } = await sb.from("reports").select("id,title,score,counts,result,created_at").order("created_at", { ascending: false }).limit(20);
    if (error) setError("Could not load saved reports.");
    else {
      setError(null);
      setItems((data ?? []) as SavedReport[]);
    }
  }, [session]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  async function remove(id: string) {
    const sb = getSupabase();
    if (!sb) return;
    const { error } = await sb.from("reports").delete().eq("id", id);
    if (error) setError("Could not delete report.");
    else setItems((prev) => prev.filter((i) => i.id !== id));
  }

  if (!session) return null;
  return (
    <section aria-labelledby="saved-h" className="mt-10">
      <h2 id="saved-h" className="font-serif text-xl font-semibold">Your saved reports</h2>
      {error && <p role="alert" className="mt-2 text-gap">{error}</p>}
      {items.length === 0 && !error && <p className="mt-2 text-ink/70">Nothing saved yet. Run a check, then choose Save report.</p>}
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {items.map((i) => (
          <li key={i.id} className="flex items-center justify-between gap-3 rounded border border-rule bg-white p-3">
            <div>
              <p className="font-medium">{i.title}</p>
              <p className="text-sm text-ink/70">Score {i.score} · {new Date(i.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2 text-sm">
              <button onClick={() => onOpen(i.result)} className="rounded border border-rule px-2 py-1">Open</button>
              <button onClick={() => remove(i.id)} className="rounded border border-rule px-2 py-1 text-gap">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
