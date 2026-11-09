"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";

export function useSession(): Session | null {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  return session;
}

export default function AuthPanel({ session }: { session: Session | null }) {
  const sb = getSupabase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!sb) return null; // Supabase not configured: app still works without accounts

  if (session) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="text-ink/70">Signed in as {session.user.email}</span>
        <button onClick={() => sb.auth.signOut()} className="rounded border border-rule bg-white px-3 py-1">Sign out</button>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const { data, error } =
      mode === "signin"
        ? await sb!.auth.signInWithPassword({ email, password })
        : await sb!.auth.signUp({ email, password });
    setBusy(false);
    if (error) setMsg(error.message);
    else if (mode === "signup" && !data.session) setMsg("Account created. Check your email to confirm, then sign in.");
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-2 text-sm" aria-label="Sign in">
      <div>
        <label htmlFor="email" className="block text-ink/70">Email</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="rounded border border-rule bg-white px-2 py-1" />
      </div>
      <div>
        <label htmlFor="password" className="block text-ink/70">Password (8+ characters)</label>
        <input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="rounded border border-rule bg-white px-2 py-1" />
      </div>
      <button disabled={busy} className="rounded bg-accent px-3 py-1.5 font-medium text-white disabled:opacity-40">{mode === "signin" ? "Sign in" : "Create account"}</button>
      <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="px-1 py-1.5 text-accent underline">
        {mode === "signin" ? "Need an account?" : "Have an account?"}
      </button>
      {msg && <p role="alert" className="w-full text-gap">{msg}</p>}
    </form>
  );
}
