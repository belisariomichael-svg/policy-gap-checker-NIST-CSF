import { describe, it, expect } from "vitest";
import { validatePolicyText, createRateLimiter, MIN_CHARS, MAX_CHARS } from "@/lib/validate";

describe("validatePolicyText", () => {
  it("rejects non-strings", () => expect(validatePolicyText(42).ok).toBe(false));
  it("rejects too-short text", () => expect(validatePolicyText("short").ok).toBe(false));
  it("rejects too-long text", () => expect(validatePolicyText("a".repeat(MAX_CHARS + 1)).ok).toBe(false));
  it("accepts valid text and strips control characters", () => {
    const r = validatePolicyText("x\u0000".repeat(MIN_CHARS));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.text.includes("\u0000")).toBe(false);
  });
});

describe("createRateLimiter", () => {
  it("blocks after the limit and resets after the window", () => {
    let t = 0;
    const allow = createRateLimiter(2, 1000, () => t);
    expect(allow("a")).toBe(true);
    expect(allow("a")).toBe(true);
    expect(allow("a")).toBe(false);
    expect(allow("b")).toBe(true);
    t = 1500;
    expect(allow("a")).toBe(true);
  });
});
