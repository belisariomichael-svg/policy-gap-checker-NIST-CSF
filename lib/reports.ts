import type { AnalysisResult } from "./result";

export const MAX_TITLE = 100;

export type ReportRow = {
  title: string;
  score: number;
  counts: AnalysisResult["counts"];
  result: AnalysisResult;
};

export type SavedReport = ReportRow & { id: string; created_at: string };

/** Clean a user-supplied title; fall back to a dated default. Never stores the policy text itself. */
export function cleanTitle(input: string | undefined | null, now: Date = new Date()): string {
  const t = (input ?? "").replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, MAX_TITLE);
  return t.length > 0 ? t : `Policy check ${now.toISOString().slice(0, 10)}`;
}

export function buildReportRow(result: AnalysisResult, title?: string | null, now: Date = new Date()): ReportRow {
  return { title: cleanTitle(title, now), score: result.score, counts: result.counts, result };
}
