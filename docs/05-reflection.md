# Reflection

**What I built.** Policy Gap Checker, a web app that checks pasted security policy text against the 22 NIST CSF 2.0 categories. Each category gets a status, the exact supporting policy wording, a rationale and a recommended fix, plus a coverage score and Markdown export. On top of the starter project I added my own contribution: a dark security-console theme, a landing-page layout with step cards, and a second sample policy.

**Key learnings.**
1. *Trust is a product feature.* The most valuable component was the evidence guard, a few lines of code that check each quote against the policy and downgrade claims that cannot be verified. It makes the output auditable rather than just plausible.
2. *Constraining the model helps, but does not remove variation.* A fixed control catalog, a JSON schema and temperature 0 gave consistent structure, yet the same sample policy scored 27 on some runs and 30 on another. That is why the app states that a human reviewer must validate every finding.
3. *Free tiers shape the design.* Gemini's free tier may use inputs to improve Google products, so the app warns users and never stores policy text. Supabase stores only results, protected by Row Level Security; a two-account test confirmed users see only their own reports.
4. *AI and guide instructions go stale.* The setup guide's default model, gemini-2.5-flash-lite, returned a 404 because it was no longer available to new users. Switching to gemini-3.5-flash-lite fixed it.

**Challenges.** The longer sample policy once failed with a malformed-JSON error from the model and worked on later runs, including on the live site, so version 2 needs an automatic retry. The first GitHub Actions build failed while downloading Google Fonts and passed on re-run. I edited a file on GitHub's website while my local copy was behind, which got my push rejected, and git pull --rebase fixed it. I also showed an API key in a screenshot while debugging with an AI assistant, so I now treat any key that appears in a screenshot as exposed and rotate it.

**What my testing showed.** I did not run a formal study with outside testers. My evidence is my own testing and my years of doing this review by hand. The app returned a first-pass gap list in about 4 to 12 seconds, and in my experience the manual version takes much longer, even after allowing for a human to validate the draft. That is a significant time saving. The score separated a weak sample policy (27 to 30) from a stronger one (82), and lint, type checks, unit tests and the build pass in CI. Details are in `docs/07-user-testing-log.md`.

**Limitations I am honest about.** I have not measured agreement with outside reviewers; mapping is category-level, not subcategory-level; the model judges only what is written, not what is practised; in-memory rate limiting does not hold across serverless instances; free-tier limits can interrupt service; output is a draft needing human review.

**Next version (see GitHub issue).** Peer review to measure agreement; PDF and DOCX parsing; ISO 27001:2022 Annex A and local regulator mappings; subcategory-level assessment; a shared rate-limit store; automatic retry on malformed model output.
