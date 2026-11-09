# CLAUDE.md (AI coding rules; also usable as agents.md)

## Project
Policy Gap Checker: Next.js 14 (App Router) + Tailwind. Maps pasted policy text to NIST CSF 2.0 categories using Google Gemini (Google AI Studio free key). Supabase provides sign-in and saved reports. See `spec.md` and `docs/03-architecture-notes.md`.

## Commands
- `npm run dev` / `npm run build`
- `npm test` (vitest), `npm run lint`, `npm run typecheck`

## Rules
- Never hardcode secrets. Read `GEMINI_API_KEY` and `GEMINI_MODEL` from `process.env` on the server only. Browser code may only use `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Policy text is untrusted: keep it inside `<policy>` tags, never log its contents, never persist it. Saved reports hold the result JSON only.
- All model output goes through `extractJson` → zod → `normalizeFindings` → `applyEvidenceGuard`. Do not bypass.
- Supabase tables use Row Level Security with `auth.uid() = user_id` policies. Do not disable RLS.
- Keep control catalog changes in `lib/controls.ts` and update tests that assume 22 controls.
- Add or update a unit test with every change to `lib/`.
- Small, meaningful commits (conventional style: feat:, fix:, test:, docs:, ci:).
- UI text: plain language, sentence case, errors say what happened and how to fix it. Never say "compliant" or "non-compliant"; say covered, partial, gap.
