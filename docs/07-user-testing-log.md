# Testing Log

Live app: https://cyber-policy-gap-checker.vercel.app

This log records the testing I did on the app. I did not run a formal study with outside testers for this version. All tests used the built-in sample policies, never real organizational documents. The figures below come from the application's own logs (`analysis_ok` and `analysis_failed` events).

## 1. Analysis runs
| Environment | Policy | Characters | Result | Time |
|---|---|---|---|---|
| Local | Sample A (basic) | 1,048 | Score 30 | 12.1 s |
| Local | Sample A (basic) | 1,048 | Score 27 (4 covered, 4 partial, 14 gaps) | 6.2 s |
| Local | Sample B (stronger) | 2,429 | Failed: malformed JSON from the model | 5.2 s |
| Live (Vercel) | Sample B (stronger) | 2,429 | Score 82 | 4.2 s |
| Live (Vercel) | Sample A (basic) | 1,048 | Score 27 | 4.7 s |

**What this shows**
- A first-pass gap list takes about 4 to 12 seconds, against the 2-minute target.
- The score separates the weak sample (27 to 30) from the stronger sample (82).
- The same sample scored 27 on some runs and 30 on another, so output varies slightly between runs even with a fixed catalog.
- One run of the longer sample failed because the model returned malformed JSON. It succeeded on later runs, including on the live site. Version 2 needs an automatic retry.

## 2. Feature and security checks
| Check | Result |
|---|---|
| Run a check without signing in | Works |
| Create an account, save a report, open it, delete it, sign out | Works |
| Two-account privacy test (Row Level Security) | Each account saw only its own saved reports |
| Input limits (200 to 30,000 characters) | Check button stays disabled outside the limits |
| `.env.local` ignored by Git | `git check-ignore` matched `.gitignore`; `git ls-files` showed only `.env.example` |
| Search of full Git history for key patterns | No matches |
| Logs contain no policy text | Logs record only event name, character count, time, score and warning count |
| GitHub Actions (lint, type check, tests, build) | Passes. One earlier run failed while downloading Google Fonts and passed on re-run |

## 3. Issues found and fixed
| Issue found during testing | Fix |
|---|---|
| The default model `gemini-2.5-flash-lite` returned a 404 because it was no longer available to new users | Changed the default and the `GEMINI_MODEL` setting to `gemini-3.5-flash-lite` (commits "Update GEMINI_MODEL to version 3.5-flash-lite" and "Update Gemini model version in analysis route") |
| Longer policies can fail on malformed model output | Logged as a version 2 improvement (automatic retry) |

## 4. Not done in this version
- Peer review of findings by outside testers, and a measured agreement rate.
- Testing with long real-world policies and PDF or DOCX files (version 1 handles text only).
