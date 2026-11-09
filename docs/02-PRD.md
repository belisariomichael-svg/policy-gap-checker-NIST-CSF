# PRD: Policy Gap Checker (1 page)

> If your course defines the 6 PRD components differently, rename the headings. Content below covers the usual six.

**1. Problem and context.** Risk and compliance analysts spend hours manually mapping policies to framework controls, with inconsistent results and weak traceability to policy wording. NIST CSF 2.0 (2024) increases the re-mapping workload.

**2. Target user.** Second-line risk/compliance analyst at a regulated firm (primary); small-company security lead preparing for audit (secondary).

**3. Solution and scope (MVP).** A web app where the user pastes or uploads (.txt/.md) a policy and receives, for each of 22 NIST CSF 2.0 categories: status (covered / partial / gap), a verbatim evidence quote, a rationale, and one recommendation, plus a 0 to 100 coverage score, a coverage map, and Markdown export. Signed-in users (Supabase Auth) can save, reopen and delete reports. The stack uses free tiers only: Next.js + Tailwind, Google Gemini (AI Studio key), Supabase, GitHub, Vercel Hobby.
*Out of scope (v1):* PDF/DOCX parsing, ISO 27001 mapping, multi-document analysis, report sharing, social login, authoritative compliance claims.

**4. Key requirements.**
- Functional: input validation (200 to 30,000 chars); AI classification against a fixed catalog; evidence guard; filter by status; copy report; sign up/in/out; save, list and delete own reports.
- Non-functional: no secrets in repo; policy text never stored (saved reports hold results only); per-user data isolation via Row Level Security; results in under 60 seconds; rate limiting; graceful handling of free-tier AI limits; keyboard accessible, mobile responsive.
- AI: Gemini, temperature 0, JSON mode validated by schema; policy text treated as untrusted data (prompt-injection resistant).

**5. Success metrics.** Time to first-pass under 2 minutes; 100% of covered/partial findings carry verifiable quotes; at least 70% reviewer agreement on a 10-finding spot check; 3 of 3 pilot users would reuse.

**6. Risks and mitigations.**
| Risk | Mitigation |
|---|---|
| Model invents evidence | Evidence guard downgrades unverifiable claims |
| Over-reliance on AI verdicts | Persistent "human review required" notice; wording avoids "compliant/non-compliant" |
| Confidential policy uploaded (free-tier Gemini inputs may be used by Google) | Prominent UI warning to use public or sanitized policies; no policy storage; v2 option for paid tier or private model |
| One user sees another's saved reports | Row Level Security; two-account test |
| Free-tier limits (Gemini rate limits, Supabase pause, auth email cap) | Friendly error messages; setup notes; disable email confirmation for demo |
| Prompt injection inside policy text | Policy wrapped as untrusted data; schema validation; no tool access |
| API cost abuse | Rate limit per IP; input length cap |
