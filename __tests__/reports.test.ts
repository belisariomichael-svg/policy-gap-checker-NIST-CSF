import { describe, it, expect } from "vitest";
import { buildReportRow, cleanTitle, MAX_TITLE } from "@/lib/reports";
import { buildResult } from "@/lib/result";

const fixed = new Date("2026-10-31T10:00:00Z");

describe("cleanTitle", () => {
  it("falls back to a dated default for empty input", () => {
    expect(cleanTitle("   ", fixed)).toBe("Policy check 2026-10-31");
    expect(cleanTitle(undefined, fixed)).toBe("Policy check 2026-10-31");
  });
  it("trims, collapses whitespace, strips control characters, and caps length", () => {
    expect(cleanTitle("  My\u0000   policy \n v2 ")).toBe("My policy v2");
    expect(cleanTitle("a".repeat(500)).length).toBe(MAX_TITLE);
  });
});

describe("buildReportRow", () => {
  it("stores score, counts and result but never policy text", () => {
    const policy = "Secret policy text that must never be saved. ".repeat(10);
    const result = buildResult({ summary: "s", findings: [] }, policy);
    const row = buildReportRow(result, "Q4 review", fixed);
    expect(row.title).toBe("Q4 review");
    expect(row.score).toBe(result.score);
    expect(JSON.stringify(row)).not.toContain("Secret policy text");
  });
});
