# Idea Validation Report: Policy Gap Checker

This report follows a 7-step validation flow. The evidence comes from my own professional experience and from public sources that I checked.

## Step 1. Define the specific user
**Primary user:** a second-line risk or compliance analyst (for example technology risk, third-party risk, or information security governance) at a bank or regulated firm who must assess internal policies against an external framework.
**Context:** reviews 5 to 30 policies per assessment cycle; works in Word/PDF and spreadsheets; has framework knowledge but little time.
**Secondary user:** a small-company security lead preparing for a first audit.

## Step 2. Define the problem
Mapping a policy document to framework controls is manual, slow, and inconsistent between reviewers. Reviewers read each policy, search for relevant clauses, judge whether each control is covered, and write up gaps in a spreadsheet.
- **Pain:** time, inconsistency (two reviewers, two answers), and weak traceability (findings not tied to exact policy wording).
- **Frequency:** every audit or assessment cycle, plus whenever a policy is revised or a framework is updated.

## Step 3. Gather evidence the problem is real
- **First-hand experience:** I work in a second-line risk function and have done this policy-to-framework mapping by hand for years. Having used the tool on sample policies, my experience is that it brings significant efficiency and time savings compared with the manual process, because the reading, cross-referencing and first draft of the gap list are done in seconds. A human reviewer still has to validate every finding.
- **Peer conversations:** I did not run formal peer interviews for this version. The problem evidence rests on my own experience and the public sources below. Peer interviews and a measured agreement rate are a next step.
- **Public evidence:** NIST released Cybersecurity Framework 2.0 on 26 February 2024. It added a sixth function, Govern, and has 22 categories (down from 23 in version 1.1). Organizations that mapped policies to CSF 1.1 have a reason to re-map them. Source: NIST, *The NIST Cybersecurity Framework (CSF) 2.0*, https://csrc.nist.gov/pubs/cswp/29/the-nist-cybersecurity-framework-csf-20/final

## Step 4. Map existing alternatives
| Alternative | Strength | Weakness for this user |
|---|---|---|
| Manual review in Excel/Word | Full control, trusted | Slow, inconsistent, poor traceability |
| Enterprise GRC platforms | Workflow and evidence repositories | Typically need licences and setup effort; built around workflow rather than reading a policy text. I did not evaluate specific products. |
| Generic chatbots (paste policy, ask "is this compliant?") | Fast, free | No fixed control catalog, no verified quotes, can invent evidence, inconsistent format |
| Consultants | Expert judgment | Expensive, slow turnaround |

## Step 5. Differentiating angle
**A traceable first-pass reviewer, not a compliance oracle.** Differences from a generic chatbot:
1. Fixed control catalog (NIST CSF 2.0, 22 categories) so output follows the same structure every run.
2. **Evidence guard:** every "covered" or "partial" claim must quote the policy verbatim; quotes that cannot be found in the text are automatically downgraded to a gap.
3. Structured, copy-ready report with a coverage map; human review is stated explicitly.

## Step 6. Why now
- NIST CSF 2.0 (February 2024) restructured the framework around Govern, including a category for cybersecurity supply chain risk management, so policies need re-mapping.
- Language models can now read long policy text and return structured JSON, which makes a first-pass mapping cheap.
- Regulators expect documented, governed information security. In the Philippines, BSP Circular No. 982 (Series of 2017), the Enhanced Guidelines on Information Security Management, requires BSP-supervised financial institutions to adopt an information security risk management framework with board and senior management oversight. Example coverage: https://business.inquirer.net/?p=240053 (the circular itself is published by the Bangko Sentral ng Pilipinas).

## Step 7. Smallest test and success criteria
**MVP test:** the app was run on two sample policies (a basic one and a stronger one) locally and on the live site, and its security and storage behaviour was tested. Details and measured results are in `docs/07-user-testing-log.md`.

| Metric | Target | Result |
|---|---|---|
| Time to first-pass gap list | Under 2 minutes | Met: about 4 to 12 seconds per analysis in my runs. In my experience the manual version takes much longer, even after allowing for human validation. |
| Evidence quotes verifiable in source | 100% of "covered" and "partial" findings | Enforced in code: quotes that cannot be verified are downgraded and counted as warnings |
| Score separates weak from strong policies | Clear separation | Basic sample scored 27 to 30; stronger sample scored 82 |
| Reviewer agreement with status | Measure in a later version | Not measured in this version |

**Observation:** the basic sample scored 27 on some runs and 30 on another, so the score can move by a few points between runs of the same text. This is why a human must review every finding.

**Decision rule:** if a later peer review shows agreement under 50%, refine the prompt and control descriptions before adding features.
