# Reflection (1 page): DRAFT, rewrite in your own voice

> This draft reflects the design decisions made in this build. Replace bracketed items with your actual experience; graders want your learning, not generic text.

**What I built.** Policy Gap Checker, a web app that checks pasted policy text against 22 NIST CSF 2.0 categories and returns status, verbatim evidence, rationale, and a recommendation for each, with a coverage score and Markdown export.

**Key learnings.**
1. *Trust is a product feature.* The most valuable component was not the prompt but the evidence guard: a few lines of code that check quotes against the source made the output auditable. [ADD: a moment during testing where this mattered.]
2. *Constrain the model.* A fixed control catalog, JSON schema, and temperature 0 produced far more consistent results than open-ended prompting. [ADD: what you observed.]
3. *Design for privacy and free-tier reality.* I used Gemini's free tier, which may use inputs to improve Google products, so I warn users and avoid storing policy text; Supabase stores only results, protected by Row Level Security. [ADD: what you learned setting up Supabase or Gemini.]
4. *AI-assisted coding workflow.* Writing the PRD, spec, and CLAUDE.md/.cursorrules first made AI-generated code easier to review. [ADD: where AI-generated code needed correction.]

**Challenges.** [ADD: e.g., deployment/env var issues, model returning malformed JSON, getting policy samples that are not confidential, time spent on UI.]

**What the pilot showed.** [ADD: results from 2 to 3 peer testers: agreement rate, comments, surprises.]

**Limitations I am honest about.** Category-level mapping is coarser than subcategory-level; the model judges only what is written, not what is practiced; in-memory rate limiting does not hold across serverless instances; free-tier AI and database limits can interrupt service; output is a draft requiring human review.

**Next version (see GitHub issue).** PDF/DOCX parsing; ISO 27001:2022 Annex A and local regulator mappings; subcategory-level assessment; a shared rate-limit store; evaluation set of labeled policies to measure accuracy over time; paid or private model option for confidential documents.
