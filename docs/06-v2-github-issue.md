# GitHub Issue to create (title and body)

**Title:** v2: Support PDF/DOCX upload and ISO 27001:2022 Annex A mapping

**Body:**
### Problem
Analysts hold policies as PDF/Word, and many organizations map to ISO 27001 or local regulator requirements, not only NIST CSF 2.0.

### Proposal
- Parse PDF and DOCX server-side (size and page caps, no storage)
- Add selectable framework: ISO 27001:2022 Annex A (93 controls) via a framework registry in `lib/controls.ts`
- Batch large policies by section to stay within model limits and free-tier token caps

### Acceptance criteria
- [ ] Upload .pdf and .docx up to 5 MB
- [ ] Framework selector with at least 2 frameworks
- [ ] Evidence guard still enforced for all frameworks
- [ ] New unit tests for parsing and framework registry

### Labels
enhancement, v2
