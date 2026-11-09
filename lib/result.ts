import { z } from "zod";
import { CONTROLS, CONTROL_IDS } from "./controls";

export const StatusSchema = z.enum(["covered", "partial", "gap", "not_assessed"]);
export type Status = z.infer<typeof StatusSchema>;

export const FindingSchema = z.object({
  control_id: z.string(),
  status: StatusSchema,
  evidence: z.string().default(""),
  rationale: z.string().default(""),
  recommendation: z.string().default(""),
});
export type Finding = z.infer<typeof FindingSchema>;

export const RawResultSchema = z.object({
  summary: z.string().default(""),
  findings: z.array(FindingSchema),
});

export type AnalysisResult = {
  summary: string;
  findings: (Finding & { name: string; function: string })[];
  score: number; // 0-100 coverage score
  counts: Record<Status, number>;
  warnings: string[];
};

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

/** Extract the first JSON object from model output (tolerates code fences). */
export function extractJson(raw: string): unknown {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) throw new Error("No JSON object found in model output.");
  return JSON.parse(cleaned.slice(start, end + 1));
}

/**
 * Hallucination guard: a "covered" or "partial" claim must quote evidence that
 * actually appears in the policy. Otherwise it is downgraded to "gap".
 */
export function applyEvidenceGuard(findings: Finding[], policyText: string): { findings: Finding[]; warnings: string[] } {
  const haystack = norm(policyText);
  const warnings: string[] = [];
  const out = findings.map((f) => {
    if ((f.status === "covered" || f.status === "partial") && (!f.evidence || !haystack.includes(norm(f.evidence)))) {
      warnings.push(`${f.control_id}: quoted evidence not found in policy; downgraded to gap.`);
      return { ...f, status: "gap" as Status, evidence: "", rationale: `${f.rationale} (Downgraded: cited evidence could not be verified in the policy text.)`.trim() };
    }
    return f;
  });
  return { findings: out, warnings };
}

/** Ensure every control appears exactly once, in catalog order; drop unknown IDs. */
export function normalizeFindings(findings: Finding[]): Finding[] {
  const byId = new Map<string, Finding>();
  for (const f of findings) if (CONTROL_IDS.includes(f.control_id) && !byId.has(f.control_id)) byId.set(f.control_id, f);
  return CONTROL_IDS.map(
    (id) => byId.get(id) ?? { control_id: id, status: "not_assessed" as Status, evidence: "", rationale: "Model did not return an assessment for this control.", recommendation: "" }
  );
}

export function computeScore(findings: Finding[]): { score: number; counts: Record<Status, number> } {
  const counts: Record<Status, number> = { covered: 0, partial: 0, gap: 0, not_assessed: 0 };
  for (const f of findings) counts[f.status] += 1;
  const assessed = counts.covered + counts.partial + counts.gap;
  const score = assessed === 0 ? 0 : Math.round(((counts.covered + 0.5 * counts.partial) / assessed) * 100);
  return { score, counts };
}

export function buildResult(raw: unknown, policyText: string): AnalysisResult {
  const parsed = RawResultSchema.parse(raw);
  const normalized = normalizeFindings(parsed.findings);
  const guarded = applyEvidenceGuard(normalized, policyText);
  const { score, counts } = computeScore(guarded.findings);
  const meta = new Map(CONTROLS.map((c) => [c.id, c]));
  return {
    summary: parsed.summary,
    findings: guarded.findings.map((f) => ({ ...f, name: meta.get(f.control_id)!.name, function: meta.get(f.control_id)!.function })),
    score,
    counts,
    warnings: guarded.warnings,
  };
}
