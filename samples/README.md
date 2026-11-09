# Sample data: how data flows through the app

| # | File | What it is | Real or illustrative |
|---|---|---|---|
| 1 | `01-sample-policy.md` | Input: the policy text a user pastes (same as the "Load sample policy" button) | Sample written for the app |
| 2 | `02-nist-csf-2.0-controls.md` | Reference data: the 22 NIST CSF 2.0 categories the policy is checked against (source: `lib/controls.ts`) | Real catalogue used by the app |
| 3 | `03-api-request.json` | What the browser sends to `POST /api/analyze` | Real format |
| 4 | `04-prompt-sent-to-model.txt` | Exact system and user prompts sent to Gemini | Real prompts |
| 5 | `05-example-model-output.json` | What Gemini returns (raw JSON) | **Illustrative, hand-written.** Includes one fabricated quote (DE.CM) and one missing control (RC.CO) to show error handling |
| 6 | `06-analysis-result.json` | What the API returns to the browser after validation, the evidence guard and scoring. This is also what is saved to the Supabase `reports.result` column | **Real pipeline output** run on file 5 |
| 7 | `07-report.md` | The Markdown report from the "Copy report" button | **Real pipeline output** from file 6 |

## What to notice
- **Evidence guard:** in file 5, DE.CM claims "covered" with a quote that does not exist in the policy. In file 6 it becomes `gap` and a warning is added.
- **Completeness:** file 5 omits RC.CO. File 6 includes it as `not_assessed`, so there are always 22 findings.
- **Score:** (4 covered + 0.5 x 4 partial) / 21 assessed = 29 out of 100.

Your live app will produce real model output in the same shape as file 5, so results will differ in wording. Replace file 5 to 7 with a real run from your deployed app if you want actual-output evidence in your submission (copy the report, and keep a screenshot).

Regenerate files 1 to 7 with: `npx tsx scripts/generate-samples.ts`
