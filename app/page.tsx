"use client";

import { useMemo, useRef, useState } from "react";
import type { AnalysisResult, Status } from "@/lib/result";
   import { SAMPLE_POLICY, SAMPLE_POLICY_2 } from "@/lib/sample";
import { STATUS_LABEL, toMarkdown } from "@/lib/report";
import { MAX_CHARS, MIN_CHARS } from "@/lib/validate";
import { buildReportRow } from "@/lib/reports";
import { getSupabase } from "@/lib/supabase";
import AuthPanel, { useSession } from "@/components/AuthPanel";
import SavedReports from "@/components/SavedReports";

const FUNCTIONS = ["Govern", "Identify", "Protect", "Detect", "Respond", "Recover"];
const STATUS_BG: Record<Status, string> = { covered: "bg-covered", partial: "bg-partial", gap: "bg-gap", not_assessed: "bg-na" };
const STATUS_TEXT: Record<Status, string> = { covered: "text-covered", partial: "text-partial", gap: "text-gap", not_assessed: "text-na" };
const STATUS_EDGE: Record<Status, string> = { covered: "border-l-covered", partial: "border-l-partial", gap: "border-l-gap", not_assessed: "border-l-na" };

const SECONDARY_BTN = "rounded border border-rule bg-surface px-4 py-2 transition-colors hover:border-accent/60";
const HERO_PRIMARY = "rounded bg-accent px-5 py-3 font-medium text-paper transition-opacity hover:opacity-90";
const HERO_SECONDARY = "rounded border border-rule bg-surface px-5 py-3 font-medium transition-colors hover:border-accent/60";

// STYLE: content for the "how it works" cards (a real sequence, so numbered and connected)
const STEPS = [
  { title: "Paste your policy", body: "Paste text or upload a .txt or .md file. Use public or sanitized policies only." },
  { title: "Checked against NIST CSF 2.0", body: "The policy is read against 22 categories across Govern, Identify, Protect, Detect, Respond and Recover." },
  { title: "Findings you can verify", body: "Each finding quotes your policy. If a quote cannot be found in your text, the finding is downgraded." },
];

// STYLE: content for the "what gets checked" cards (the 22 categories grouped by CSF function)
const FUNCTION_INFO = [
  { code: "GV", name: "Govern", count: 6, body: "Context, risk strategy, roles, policy, oversight and supply chain." },
  { code: "ID", name: "Identify", count: 3, body: "Asset management, risk assessment and improvement." },
  { code: "PR", name: "Protect", count: 5, body: "Access control, awareness and training, data security, platform and infrastructure." },
  { code: "DE", name: "Detect", count: 2, body: "Continuous monitoring and adverse event analysis." },
  { code: "RS", name: "Respond", count: 4, body: "Incident management, analysis, reporting and mitigation." },
  { code: "RC", name: "Recover", count: 2, body: "Recovery plan execution and recovery communication." },
];

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const session = useSession();
  const [title, setTitle] = useState("");
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const tooShort = text.trim().length < MIN_CHARS;
  const tooLong = text.length > MAX_CHARS;

  async function analyze() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setResult(data as AnalysisResult);
      setFilter("all");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/\.(txt|md)$/i.test(file.name)) {
      setError("Upload a .txt or .md file, or paste the policy text.");
      return;
    }
    if (file.size > 200_000) {
      setError("File is too large. Limit is 200 KB.");
      return;
    }
    setError(null);
    file.text().then(setText);
  }

  async function saveReport() {
    const sb = getSupabase();
    if (!sb || !result || !session) return;
    const { error } = await sb.from("reports").insert(buildReportRow(result, title));
    setSaveMsg(error ? "Could not save the report." : "Report saved.");
    if (!error) setRefreshKey((k) => k + 1);
  }

  async function copyReport() {
    if (!result) return;
    await navigator.clipboard.writeText(toMarkdown(result));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  // STYLE: hero button that loads the sample policy and scrolls to the tool
  function trySample() {
    setText(SAMPLE_POLICY);
    document.getElementById("check")?.scrollIntoView({ behavior: "smooth" });
  }

  const grouped = useMemo(
    () => FUNCTIONS.map((fn) => ({ fn, items: result?.findings.filter((f) => f.function === fn) ?? [] })),
    [result]
  );
  const visible = result?.findings.filter((f) => filter === "all" || f.status === filter) ?? [];

  return (
    <main className="mx-auto max-w-6xl px-5 pb-16 pt-6">
      {/* STYLE: top bar with brand and in-page links */}
      <nav className="flex items-center justify-between" aria-label="Main">
        <a href="#" className="flex items-center gap-2.5 font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/40 bg-accent/10 text-accent" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </span>
          Policy Gap Checker
        </a>
        <div className="flex gap-5 text-sm text-ink/80">
          <a href="#how" className="hover:text-accent">How it works</a>
          <a href="#check" className="hover:text-accent">Check a policy</a>
        </div>
      </nav>

      {/* STYLE: centered hero */}
      <header className="mx-auto mt-14 max-w-3xl text-center">
        <p className="inline-block rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
          For risk, audit and IT security teams
        </p>
        <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight sm:text-5xl">Does your security policy say what you think it says?</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-ink/80">
          Paste a policy. Get a control-by-control check against NIST CSF 2.0, with the exact wording that supports each finding.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a href="#check" className={HERO_PRIMARY}>Check a policy</a>
          <button onClick={trySample} className={HERO_SECONDARY}>Try the sample policy</button>
          <a href="#how" className={HERO_SECONDARY}>How it works</a>
        </div>
      </header>

      {/* STYLE: three connected step cards */}
      <section id="how" aria-labelledby="how-h" className="mt-16 scroll-mt-6">
        <h2 id="how-h" className="sr-only">How it works</h2>
        <ol className="grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title}
              className={`relative rounded-lg border border-rule bg-surface p-5 ${i < STEPS.length - 1 ? "md:after:absolute md:after:-right-6 md:after:top-10 md:after:h-px md:after:w-6 md:after:bg-accent/50" : ""}`}>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent font-mono text-sm font-semibold text-paper">{i + 1}</span>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-ink/70">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* STYLE: the tool itself, with sign-in moved into a labelled optional strip */}
      <div id="check" className="mt-16 scroll-mt-6">
        <div className="mb-6 rounded-lg border border-rule bg-surface p-4">
          <p className="mb-2 text-sm text-ink/70">Optional: sign in to save reports. You can run checks without an account.</p>
          <AuthPanel session={session} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <section aria-labelledby="input-h">
            <h2 id="input-h" className="font-serif text-xl font-semibold">Your policy</h2>
            <label htmlFor="policy" className="sr-only">Policy text</label>
            <textarea
              id="policy"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={16}
              placeholder="Paste policy text here (200 to 30,000 characters)"
              className="mt-3 w-full rounded border border-rule bg-surface p-3 text-sm leading-relaxed text-ink placeholder:text-ink/40"
            />
            <p className={`mt-1 text-sm ${tooLong ? "text-gap" : "text-ink/60"}`}>
              {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={analyze} disabled={loading || tooShort || tooLong} className="rounded bg-accent px-4 py-2 font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-40">
                {loading ? "Checking policy…" : "Check policy"}
              </button>
                 <button onClick={() => setText(SAMPLE_POLICY)} className={SECONDARY_BTN}>Sample: basic policy</button>
                 <button onClick={() => setText(SAMPLE_POLICY_2)} className={SECONDARY_BTN}>Sample: stronger policy</button>
              <button onClick={() => fileRef.current?.click()} className={SECONDARY_BTN}>Upload .txt or .md</button>
              <input ref={fileRef} type="file" accept=".txt,.md,text/plain,text/markdown" onChange={onFile} className="hidden" />
            </div>
            <p className="mt-4 text-sm text-ink/70">
              Policy text is sent to the Google Gemini API (free tier) for analysis; Google may use free-tier inputs to improve its products. This app does not store your policy text. Use public or sanitized policies only.
            </p>
            {error && <p role="alert" className="mt-4 rounded border border-gap/40 bg-surface p-3 text-gap">{error}</p>}
          </section>

          <section aria-labelledby="result-h" aria-live="polite">
            <h2 id="result-h" className="font-serif text-xl font-semibold">Coverage</h2>
            {!result && !loading && <p className="mt-3 text-ink/70">Results appear here. Try the sample policy to see how it works.</p>}
            {loading && <p className="mt-3 text-ink/70">Reading the policy against 22 NIST CSF 2.0 categories. This takes 10 to 30 seconds.</p>}

            {result && (
              <div className="mt-3">
                <div className="rounded-lg border border-rule bg-surface p-5">
                  <div className="flex items-baseline gap-3">
                    <span className="score-glow font-mono text-6xl font-semibold text-accent">{result.score}</span>
                    <span className="text-ink/70">out of 100 coverage score ({result.counts.covered} covered, {result.counts.partial} partial, {result.counts.gap} gaps)</span>
                  </div>
                  <p className="mt-3 max-w-prose">{result.summary}</p>

                  <div className="mt-5 space-y-2" role="group" aria-label="Control coverage map">
                    {grouped.map(({ fn, items }) => (
                      <div key={fn} className="flex items-center gap-3">
                        <span className="w-16 shrink-0 text-sm text-ink/70">{fn}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {items.map((f) => (
                            <a key={f.control_id} href={`#${f.control_id}`} title={`${f.control_id} ${f.name}: ${STATUS_LABEL[f.status]}`}
                              className={`${STATUS_BG[f.status]} rounded px-2 py-1.5 font-mono text-xs font-semibold text-paper transition hover:brightness-110`}>
                              {f.control_id}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-ink/70">
                    {(["covered", "partial", "gap"] as const).map((s) => (
                      <span key={s} className="flex items-center gap-1.5">
                        <span className={`${STATUS_BG[s]} h-2.5 w-2.5 rounded-sm`} />
                        {STATUS_LABEL[s]}
                      </span>
                    ))}
                  </div>
                </div>

                {result.warnings.length > 0 && (
                  <p className="mt-4 text-sm text-partial">
                    {result.warnings.length} finding(s) were downgraded because the quoted evidence could not be verified in your policy.
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-2">
                  {(["all", "gap", "partial", "covered"] as const).map((s) => (
                    <button key={s} onClick={() => setFilter(s)} aria-pressed={filter === s}
                      className={`rounded border px-3 py-1 text-sm transition-colors ${filter === s ? "border-accent bg-accent font-medium text-paper" : "border-rule bg-surface hover:border-accent/60"}`}>
                      {s === "all" ? "All" : STATUS_LABEL[s]}
                    </button>
                  ))}
                  <button onClick={copyReport} className="ml-auto rounded border border-rule bg-surface px-3 py-1 text-sm transition-colors hover:border-accent/60">
                    {copied ? "Copied" : "Copy report as Markdown"}
                  </button>
                </div>

                {session && (
                  <div className="mt-4 flex flex-wrap items-end gap-2 text-sm">
                    <div>
                      <label htmlFor="title" className="block text-ink/70">Report title (optional)</label>
                      <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} className="rounded border border-rule bg-surface px-2 py-1 text-ink" />
                    </div>
                    <button onClick={saveReport} className="rounded border border-rule bg-surface px-3 py-1.5 transition-colors hover:border-accent/60">Save report</button>
                    {saveMsg && <span role="status" className="text-ink/70">{saveMsg}</span>}
                  </div>
                )}

                <ul className="mt-4 space-y-3">
                  {visible.map((f) => (
                    <li key={f.control_id} id={f.control_id} className={`rounded border border-l-4 border-rule ${STATUS_EDGE[f.status]} bg-surface p-4`}>
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-medium"><span className="font-mono text-accent">{f.control_id}</span> {f.name}</h3>
                        <span className={`text-sm font-medium ${STATUS_TEXT[f.status]}`}>{STATUS_LABEL[f.status]}</span>
                      </div>
                      {f.evidence && <blockquote className="mt-2 border-l-4 border-accent/50 pl-3 text-sm italic text-ink/80">{f.evidence}</blockquote>}
                      {f.rationale && <p className="mt-2 text-sm">{f.rationale}</p>}
                      {f.recommendation && <p className="mt-2 text-sm"><span className="font-medium">Fix: </span>{f.recommendation}</p>}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm text-ink/70">AI-generated draft. A human reviewer must validate every finding before it is used in an audit or assessment.</p>
              </div>
            )}
          </section>
        </div>
      </div>

      <SavedReports session={session} refreshKey={refreshKey} onOpen={(r) => { setResult(r); setFilter("all"); }} />

      {/* STYLE: reference cards showing what the 22 categories cover */}
      <section aria-labelledby="covers-h" className="mt-16">
        <h2 id="covers-h" className="font-serif text-xl font-semibold">What gets checked</h2>
        <p className="mt-1 text-sm text-ink/70">22 categories from NIST CSF 2.0, grouped by function.</p>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FUNCTION_INFO.map((f) => (
            <li key={f.code} className="rounded-lg border border-rule bg-surface p-4">
              <div className="flex items-baseline justify-between">
                <h3 className="font-semibold"><span className="mr-2 font-mono text-accent">{f.code}</span>{f.name}</h3>
                <span className="text-xs text-ink/60">{f.count} categories</span>
              </div>
              <p className="mt-1.5 text-sm text-ink/70">{f.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
