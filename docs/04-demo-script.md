# 2-Minute Demo Script

**0:00 to 0:15, Problem.** "Mapping a policy to framework controls is slow and inconsistent. I built Policy Gap Checker to give risk analysts a traceable first pass against NIST CSF 2.0."

**0:15 to 0:35, Input.** Show the live URL in an incognito window. Click *Load sample policy*. Point out the character counter and the privacy note.

**0:35 to 1:15, Core feature.** Click *Check policy*. When results load: read the score; show the coverage map (green covered, amber partial, red gap); click a red control and read the recommendation; click a green control and show the verbatim quote highlighted in the policy text.

**1:15 to 1:40, Trust and accounts.** Explain the evidence guard: "If the model cites wording that isn't in the policy, the app downgrades it to a gap." Filter to *Gap*. Sign in (Supabase Auth), click *Save report*, and show it under *Your saved reports*. Optionally copy the report as Markdown.

**1:40 to 1:52, Under the hood.** Show the GitHub repo: green CI run, tests, README, no secrets (`.env.example` only). Mention Gemini free tier, Supabase and Vercel.

**1:52 to 2:00, Close.** "v2: PDF and DOCX upload and ISO 27001 mapping. Human review stays in the loop."

Tip: record with Loom, Zoom, or Teams; rehearse once; keep under 2:00; test the share link while logged out.
