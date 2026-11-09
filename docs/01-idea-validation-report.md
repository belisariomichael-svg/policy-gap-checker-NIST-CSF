# Idea Validation Report: Policy Gap Checker

> Items marked **[ADD]** need your real evidence (interviews, links, screenshots). Do not submit placeholders. The structure below uses a 7-step flow; rename the headings to match the exact step names in your course framework if they differ.

## Step 1. Define the specific user
**Primary user:** a second-line risk or compliance analyst (e.g., technology risk, TPRM, information security governance) at a bank or regulated firm who must assess internal policies against an external framework.
**Context:** reviews 5 to 30 policies per assessment cycle; works in Word/PDF and spreadsheets; has framework knowledge but little time.
**Secondary user:** small-company security lead preparing for a first audit.

## Step 2. Define the problem
Mapping a policy document to framework controls is manual, slow, and inconsistent between reviewers. Reviewers read each policy, search for relevant clauses, judge whether each control is covered, and write up gaps in a spreadsheet.
- **Pain:** time (hours per policy), inconsistency (two reviewers, two answers), and weak traceability (findings not tied to exact policy wording).
- **Frequency:** every audit/assessment cycle, plus whenever a policy is revised or a framework updates.

## Step 3. Gather evidence the problem is real
- First-hand domain experience: the author works in 2nd-line risk at a multilateral bank. **[ADD: 1 to 2 sentences on how often you do policy-to-control mapping and how long it takes, in your own words.]**
- Peer conversations: **[ADD: talk to 3 to 5 risk/compliance/audit peers. Record: role, how they do mapping today, time spent, biggest frustration. A table works.]**
- Public evidence: NIST published CSF 2.0 in February 2024 and added a Govern function, so many organizations are re-mapping policies. **[ADD: 1 to 2 links, e.g., NIST CSF 2.0 publication page, and a local regulator or industry reference. Verify every citation before submitting.]**

## Step 4. Map existing alternatives
| Alternative | Strength | Weakness for this user |
|---|---|---|
| Manual review in Excel/Word | Full control, trusted | Slow, inconsistent, poor traceability |
| GRC platforms (e.g., enterprise GRC suites) | Workflow, evidence repositories | Costly, heavy setup, mapping is still mostly manual **[ADD: verify with 1 to 2 vendor pages]** |
| Generic chatbots (paste policy, ask "is this compliant?") | Fast, free | No fixed control catalog, no verified quotes, can invent evidence, inconsistent format |
| Consultants | Expert judgment | Expensive, slow turnaround |

## Step 5. Differentiating angle
**A traceable first-pass reviewer, not a compliance oracle.** Differences from a generic chatbot:
1. Fixed control catalog (NIST CSF 2.0, 22 categories) so output is consistent run to run.
2. **Evidence guard:** every "covered" or "partial" claim must quote the policy verbatim; quotes that cannot be found in the text are automatically downgraded to a gap.
3. Structured, copy-ready report with coverage map; human review is explicit.

## Step 6. Why now
- NIST CSF 2.0 (2024) restructured the framework around Govern, prompting re-mapping.
- LLMs can now read long policy text and return structured JSON reliably, making first-pass mapping cheap.
- Regulators and auditors increasingly expect traceability to a recognized framework. **[ADD: cite one local regulator expectation you can verify.]**

## Step 7. Smallest test and success criteria
**MVP test:** 3 real (non-confidential or sanitized) policies run through the app and reviewed by 2 to 3 peers.
| Metric | Target |
|---|---|
| Time to first-pass gap list | under 2 minutes vs. your manual baseline **[ADD: baseline]** |
| Evidence quotes verifiable in source | 100% of "covered/partial" findings (enforced by guard) |
| Reviewer agreement with status (spot check of 10 findings) | 70% or higher **[ADD: actual result]** |
| Reviewer says they would use it again | 3 of 3 |

**Decision rule:** if agreement is under 50%, refine the prompt and control descriptions before adding features.
