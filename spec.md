# spec.md: Policy Gap Checker

## AI capability
Classification with evidence extraction: given policy text, assess it against 22 NIST CSF 2.0 categories using Google Gemini (AI Studio free key).

## Inputs
| Field | Type | Rules |
|---|---|---|
| `text` | string | 200 to 30,000 chars after trimming; control characters stripped |
| File upload (UI) | .txt / .md | max 200 KB; read client-side into `text` |
| Report title (UI, optional) | string | max 100 chars; sanitised; defaults to "Policy check YYYY-MM-DD" |
| Email / password (UI) | strings | handled by Supabase Auth; password 8+ chars |

## Outputs (`AnalysisResult`)
- `summary`: up to 3 sentences
- `findings[22]`: `control_id`, `name`, `function`, `status` (covered | partial | gap | not_assessed), `evidence` (verbatim quote or empty), `rationale`, `recommendation`
- `score`: 0 to 100 = (covered + 0.5 × partial) / assessed × 100
- `counts`, `warnings`

## API: `POST /api/analyze` body `{ "text": string }`
| Status | Meaning |
|---|---|
| 200 | `AnalysisResult` |
| 400 | invalid JSON or text fails validation |
| 429 | per-IP rate limit (10/hour) |
| 500 | server missing `GEMINI_API_KEY` |
| 502 | model or parsing failure |
| 503 | Gemini free-tier limit or overload; try again shortly |

## Data (Supabase)
Table `reports` with Row Level Security (see `supabase/schema.sql`). Signed-in users can list, insert and delete only their own reports. Policy text is never stored.

## Acceptance criteria
1. Pasting the sample policy returns exactly 22 findings in catalog order.
2. Every "covered" or "partial" finding contains a quote found verbatim (whitespace/case-insensitive) in the policy; otherwise it is shown as "gap".
3. Text under 200 or over 30,000 chars is rejected with a clear message, both in UI and API.
4. Model output with fences, missing controls, or unknown IDs is handled without crashing.
5. Gemini free-tier limit errors show a friendly "busy" message, not a crash.
6. A user can create an account, sign in, save a report, reopen it, delete it, and sign out.
7. User A cannot read or delete User B's reports (verified with two accounts).
8. The 14 unit tests pass in CI; build succeeds.
9. No secret in repo or client bundle (only the public Supabase URL and anon key are exposed); app fails safely if the Gemini key is missing.
10. If Supabase variables are absent, analysis still works and sign-in is hidden.
11. UI is usable by keyboard and on a 375 px wide screen.
12. Result can be copied as Markdown; UI states that a human must review findings and that free-tier inputs may be used by Google.

## Non-goals (v1)
PDF/DOCX parsing, ISO 27001, social login, sharing reports between users, claims of legal compliance.

## Revision log (after review)
- **R1:** Added evidence guard after review showed models can paraphrase instead of quoting. (Criterion 2)
- **R2:** Added `not_assessed` status so missing model output is not silently treated as a gap. (Criterion 4)
- **R3:** Switched AI engine to Gemini free tier and added friendly 429/503 handling. (Criterion 5)
- **R4:** Added Supabase sign-in and saved reports, storing results only, never policy text, protected by Row Level Security. (Criteria 6, 7)
- **[ADD: one revision from your own review or peer feedback.]**
