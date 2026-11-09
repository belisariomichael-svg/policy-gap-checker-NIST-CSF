import type { AnalysisResult, Status } from "./result";

export const STATUS_LABEL: Record<Status, string> = { covered: "Covered", partial: "Partial", gap: "Gap", not_assessed: "Not assessed" };

export function toMarkdown(r: AnalysisResult): string {
  const lines = [`# Policy gap report`, ``, `Coverage score: ${r.score}/100`, ``, r.summary, ``];
  for (const f of r.findings) {
    lines.push(`## ${f.control_id} ${f.name} (${STATUS_LABEL[f.status]})`);
    if (f.evidence) lines.push(`Evidence: "${f.evidence}"`);
    if (f.rationale) lines.push(f.rationale);
    if (f.recommendation) lines.push(`Recommendation: ${f.recommendation}`);
    lines.push("");
  }
  lines.push("_AI-generated draft. A human reviewer must validate every finding._");
  return lines.join("\n");
}
