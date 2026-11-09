# Architecture Notes

## System overview
```
Browser (Next.js 14 client, Tailwind)
   │                         │
   │ POST /api/analyze       │ supabase-js (anon key, user session)
   │ { text }                │ sign in / save / list / delete reports
   ▼                         ▼
Next.js Route Handler     Supabase (free tier)
(Vercel serverless)        ├─ Auth (email + password)
   1. validatePolicyText   └─ Postgres: reports table + Row Level Security
   2. rate limiter (10/IP/hr)
   3. buildUserPrompt  (fixed NIST CSF 2.0 catalog + <policy> data block)
   4. Gemini API via Google AI Studio key (GEMINI_API_KEY, temperature 0, JSON mode)
   5. extractJson → zod schema
   6. normalizeFindings  (one finding per control, drop unknown IDs)
   7. applyEvidenceGuard (verify quotes exist in policy, else downgrade)
   8. computeScore
   ▼
JSON result → UI (coverage map, findings, Markdown export, Save report)
```

## Components
| Layer | Technology | Responsibility |
|---|---|---|
| UI | Next.js 14, React, Tailwind | Input, results, filters, auth forms, saved reports |
| API | Next.js route handler on Vercel Hobby | Validation, rate limiting, orchestration, Gemini call |
| AI | Google Gemini (model set by `GEMINI_MODEL`) via `@google/genai` | Classify each control and extract evidence |
| Auth | Supabase Auth | Email and password sign-in; JWT session in the browser |
| Database | Supabase Postgres | `reports` table (title, score, counts, result JSON) |
| CI/CD | GitHub Actions + Vercel Git integration | Lint, typecheck, test, build; auto-deploy `main` |
| Monitoring | Vercel Analytics + structured function logs | Usage, success rate, latency |

## AI module design
- **Capability:** classification with extraction (status + supporting quote per control).
- **Model:** Gemini via Google AI Studio free key. Model name is an environment variable so it can follow free-tier availability without code changes.
- **Prompt:** system instruction defines rules and JSON shape; user content holds the control catalog and policy inside `<policy>` tags.
- **Controls against hallucination:** verbatim-quote requirement, server-side substring check, JSON mode plus schema validation, completeness check.
- **Determinism:** temperature 0.
- **Free-tier handling:** HTTP 429/503 from Gemini is mapped to a friendly "busy, try again" message.

## Data model (Supabase)
`reports(id uuid, user_id uuid default auth.uid(), title, score, counts jsonb, result jsonb, created_at)`
- Row Level Security enabled. Policies: a signed-in user can select, insert and delete only rows where `user_id = auth.uid()`.
- **The policy text is never saved.** The `result` JSON contains short evidence quotes (up to 200 characters each) from the policy; this is disclosed to users.
- Because the browser talks to Postgres through the anon key, RLS is the security boundary. The `service_role` key is never used.

## Data flow and privacy
Analysis is stateless on our side: policy text exists only in the request and is logged only as a character count. Gemini free-tier inputs may be used by Google to improve its products, so the UI tells users to submit only public or sanitized policies. Saving a report is optional and explicit.

## Why anonymous analysis plus optional sign-in
Anyone (including graders in an incognito window) can try the core feature at once, protected by a per-IP rate limit. Sign-in adds saved history, which demonstrates Supabase Auth and Postgres without blocking the core value.

## Security checklist
- [x] Secrets only via environment variables; `.env.local` ignored by Git; `.env.example` committed
- [x] Gemini key server-side only; only public Supabase values use `NEXT_PUBLIC_`
- [x] Row Level Security on every table; no `service_role` key
- [x] Server-side input validation and size caps; title sanitised before saving
- [x] Rate limiting (in-memory; v2: shared store for multiple instances)
- [x] Untrusted-input handling in prompt
- [x] Generic errors to client, detail only in server logs

## Known free-tier constraints
- Gemini free tier: lower rate limits, limits visible in AI Studio, inputs may be used by Google.
- Supabase free: 2 active projects, project pauses after 1 week of inactivity (restore from dashboard), built-in auth email limited to a few per hour (disable email confirmation for demos or add custom SMTP).
- Vercel Hobby: for personal, non-commercial use.

## Deployment and CI/CD
GitHub Actions (`.github/workflows/ci.yml`): install, lint, typecheck, test, build on every push and PR. Vercel Git integration deploys `main`. Environment variables are set in Vercel. Monitoring: Vercel Analytics and function logs (`analysis_ok`, `analysis_failed`).
