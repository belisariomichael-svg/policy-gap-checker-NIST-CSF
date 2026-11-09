import { describe, it, expect } from "vitest";
import { CONTROL_IDS } from "@/lib/controls";
import { applyEvidenceGuard, buildResult, computeScore, extractJson, normalizeFindings } from "@/lib/result";

const policy = "All employees must complete security awareness training annually. Access is reviewed every quarter.";

describe("extractJson", () => {
  it("parses JSON wrapped in code fences", () => {
    expect(extractJson('```json\n{"a":1}\n```')).toEqual({ a: 1 });
  });
  it("throws when no JSON is present", () => expect(() => extractJson("no json")).toThrow());
});

describe("applyEvidenceGuard", () => {
  it("keeps verified evidence and downgrades fabricated evidence", () => {
    const { findings, warnings } = applyEvidenceGuard(
      [
        { control_id: "PR.AT", status: "covered", evidence: "complete security awareness training annually", rationale: "", recommendation: "" },
        { control_id: "DE.CM", status: "covered", evidence: "24/7 SOC monitoring", rationale: "", recommendation: "" },
      ],
      policy
    );
    expect(findings[0].status).toBe("covered");
    expect(findings[1].status).toBe("gap");
    expect(warnings).toHaveLength(1);
  });
});

describe("normalizeFindings", () => {
  it("returns every control once, drops unknown IDs, fills missing as not_assessed", () => {
    const out = normalizeFindings([
      { control_id: "PR.AT", status: "gap", evidence: "", rationale: "", recommendation: "" },
      { control_id: "FAKE.ID", status: "gap", evidence: "", rationale: "", recommendation: "" },
    ]);
    expect(out.map((f) => f.control_id)).toEqual(CONTROL_IDS);
    expect(out.find((f) => f.control_id === "GV.PO")?.status).toBe("not_assessed");
  });
});

describe("computeScore", () => {
  it("weights partial as half and ignores not_assessed", () => {
    const mk = (status: "covered" | "partial" | "gap" | "not_assessed") => ({ control_id: "X", status, evidence: "", rationale: "", recommendation: "" });
    const { score, counts } = computeScore([mk("covered"), mk("partial"), mk("gap"), mk("not_assessed")]);
    expect(score).toBe(50);
    expect(counts.not_assessed).toBe(1);
  });
});

describe("buildResult", () => {
  it("builds a complete result with names and warnings", () => {
    const r = buildResult({ summary: "ok", findings: [{ control_id: "PR.AT", status: "covered", evidence: "Access is reviewed every quarter", rationale: "r", recommendation: "" }] }, policy);
    expect(r.findings).toHaveLength(CONTROL_IDS.length);
    expect(r.findings.find((f) => f.control_id === "PR.AT")?.name).toBe("Awareness and Training");
  });
});
