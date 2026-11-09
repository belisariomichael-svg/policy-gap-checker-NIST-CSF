export const MIN_CHARS = 200;
export const MAX_CHARS = 30000;

export type ValidationResult = { ok: true; text: string } | { ok: false; error: string };

/** Validate and normalize policy text submitted by the user. */
export function validatePolicyText(input: unknown): ValidationResult {
  if (typeof input !== "string") return { ok: false, error: "Policy text must be a string." };
  // Strip control characters (keep tab/newline), normalize line endings and whitespace.
  const text = input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\r\n?/g, "\n")
    .trim();
  if (text.length < MIN_CHARS)
    return { ok: false, error: `Policy text is too short. Provide at least ${MIN_CHARS} characters.` };
  if (text.length > MAX_CHARS)
    return { ok: false, error: `Policy text is too long. Limit is ${MAX_CHARS} characters; split the policy into sections.` };
  return { ok: true, text };
}

/** Simple fixed-window in-memory rate limiter (per server instance; good enough for a demo). */
export function createRateLimiter(limit: number, windowMs: number, now: () => number = Date.now) {
  const hits = new Map<string, { count: number; start: number }>();
  return function allow(key: string): boolean {
    const t = now();
    const entry = hits.get(key);
    if (!entry || t - entry.start >= windowMs) {
      hits.set(key, { count: 1, start: t });
      return true;
    }
    if (entry.count >= limit) return false;
    entry.count += 1;
    return true;
  };
}
