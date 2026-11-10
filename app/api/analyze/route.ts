import { NextResponse } from "next/server";
import { validatePolicyText, createRateLimiter } from "@/lib/validate";
import { buildResult, extractJson } from "@/lib/result";
import { generateAnalysisText, AiBusyError } from "@/lib/gemini";

export const maxDuration = 60;
const allow = createRateLimiter(10, 60 * 60 * 1000); // 10 analyses per IP per hour

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error(JSON.stringify({ event: "config_error", reason: "missing_api_key" }));
    return NextResponse.json({ error: "Server is not configured. Missing API key." }, { status: 500 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!allow(ip)) return NextResponse.json({ error: "Rate limit reached. Try again later." }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const check = validatePolicyText((body as { text?: unknown })?.text);
  if (!check.ok) return NextResponse.json({ error: check.error }, { status: 400 });

  const started = Date.now();
  try {
    const raw = await generateAnalysisText(check.text, apiKey, process.env.GEMINI_MODEL ?? "gemini-3.5-flash-lite");
    const result = buildResult(extractJson(raw), check.text);
    console.log(JSON.stringify({ event: "analysis_ok", chars: check.text.length, ms: Date.now() - started, score: result.score, warnings: result.warnings.length }));
    return NextResponse.json(result);
  } catch (err) {
    console.error(JSON.stringify({ event: "analysis_failed", ms: Date.now() - started, message: err instanceof Error ? err.message : "unknown" }));
    if (err instanceof AiBusyError)
      return NextResponse.json({ error: "The AI service is busy (free-tier limit). Wait a minute and try again." }, { status: 503 });
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 502 });
  }
}
