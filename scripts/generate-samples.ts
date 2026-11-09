// Generates the files in /samples by running the REAL processing pipeline
// (validation, normalisation, evidence guard, scoring, report) on a hand-written
// example of what the model returns. No API call is made.
import { writeFileSync } from "fs";
import { CONTROLS } from "../lib/controls";
import { SAMPLE_POLICY } from "../lib/sample";
import { validatePolicyText } from "../lib/validate";
import { buildResult } from "../lib/result";
import { toMarkdown } from "../lib/report";
import { SYSTEM_PROMPT, buildUserPrompt } from "../lib/prompt";

const w = (name: string, content: string) => writeFileSync(`samples/${name}`, content.endsWith("\n") ? content : content + "\n");

// 01 sample policy
w("01-sample-policy.md", SAMPLE_POLICY);

// 02 control catalogue
const cat = ["# NIST CSF 2.0 categories used by the app (22)", "", "| ID | Function | Category | Description |", "|---|---|---|---|"];
for (const c of CONTROLS) cat.push(`| ${c.id} | ${c.function} | ${c.name} | ${c.description} |`);
w("02-nist-csf-2.0-controls.md", cat.join("\n"));

// 03 API request body (what the browser sends)
const check = validatePolicyText(SAMPLE_POLICY);
if (!check.ok) throw new Error(check.error);
w("03-api-request.json", JSON.stringify({ text: check.text }, null, 2));

// 04 exact prompts sent to the model
w("04-prompt-sent-to-model.txt", `=== SYSTEM PROMPT ===\n${SYSTEM_PROMPT}\n\n=== USER PROMPT ===\n${buildUserPrompt(check.text)}`);

// 05 example raw model output (HAND-WRITTEN illustration, not a real API response).
// Deliberately includes: one fabricated quote (DE.CM) and one omitted control (RC.CO)
// to show how the pipeline handles bad model output.
const f = (control_id: string, status: string, evidence: string, rationale: string, recommendation: string) => ({ control_id, status, evidence, rationale, recommendation });
const raw = {
  summary:
    "The policy covers access control, training and basic role ownership well. Governance, risk assessment, monitoring, response and recovery are mostly missing or thin. Priority fixes are an incident response process, asset inventory and a risk assessment requirement.",
  findings: [
    f("GV.OC", "partial", "supports our regulatory obligations", "Mentions regulatory obligations but names no specific laws, regulators or stakeholder expectations.", "List the applicable regulations and stakeholder requirements this policy supports."),
    f("GV.RM", "gap", "", "No risk appetite, tolerance or risk management strategy is stated.", "Add a section linking this policy to the organisation's risk appetite and risk management strategy."),
    f("GV.RR", "covered", "The Chief Information Security Officer (CISO) is accountable for this policy.", "Names the accountable role and assigns department head responsibilities.", ""),
    f("GV.PO", "covered", "This policy is reviewed annually by the CISO.", "Policy has an owner and a defined annual review cycle.", ""),
    f("GV.OV", "gap", "", "No reporting or management review of security risk results is described.", "Require periodic reporting of security metrics and risks to senior management."),
    f("GV.SC", "partial", "Third parties with access to company data must sign a confidentiality agreement.", "Only confidentiality agreements are required; no due diligence, risk tiering or monitoring of suppliers.", "Add supplier risk assessment, security requirements in contracts, and periodic reviews."),
    f("ID.AM", "gap", "", "No asset inventory or data classification requirement.", "Require an inventory of systems, data and services with an owner for each."),
    f("ID.RA", "gap", "", "No requirement to assess threats, vulnerabilities or impact.", "Require periodic cybersecurity risk assessments with documented results."),
    f("ID.IM", "gap", "", "No mechanism to improve security from tests, audits or incidents.", "Add a lessons-learned and corrective action process."),
    f("PR.AA", "covered", "Access to systems is granted on a least-privilege basis and requires approval from the line manager.", "Covers least privilege, approval, MFA for remote access and periodic access reviews.", ""),
    f("PR.AT", "covered", "All employees must complete security awareness training when they join and once a year.", "Defines training at onboarding and annually.", ""),
    f("PR.DS", "partial", "Confidential data must be encrypted in transit.", "Covers encryption in transit only; nothing on data at rest, retention or disposal.", "Add requirements for encryption at rest, retention and secure disposal."),
    f("PR.PS", "gap", "", "No configuration, patching, logging or secure development requirements.", "Add baseline configuration, patch management and logging requirements."),
    f("PR.IR", "gap", "", "No resilience or network architecture requirements.", "Add requirements for segmentation, redundancy and backups."),
    f("DE.CM", "covered", "24/7 security monitoring is performed by the Security Operations Center.", "Policy states continuous monitoring.", ""),
    f("DE.AE", "gap", "", "No process to analyse events and identify incidents.", "Define how alerts are triaged and declared as incidents."),
    f("RS.MA", "partial", "Employees must report suspected security incidents to the IT service desk immediately.", "Reporting is covered but there is no incident response process, roles or severity levels.", "Add an incident response procedure with roles, severity levels and escalation."),
    f("RS.AN", "gap", "", "No investigation, forensics or root cause analysis requirement.", "Require investigation and root cause analysis for significant incidents."),
    f("RS.CO", "gap", "", "No internal or external incident communication requirements.", "Define who is notified, when, and by whom, including regulators and customers."),
    f("RS.MI", "gap", "", "No containment or mitigation requirements.", "Add containment and eradication steps to the incident procedure."),
    f("RC.RP", "gap", "", "No recovery or business continuity requirements.", "Add recovery objectives and require tested recovery plans."),
    // RC.CO intentionally omitted by the "model"
  ],
};
w("05-example-model-output.json", JSON.stringify(raw, null, 2));

// 06 final processed result (what the API returns to the browser)
const result = buildResult(raw, check.text);
w("06-analysis-result.json", JSON.stringify(result, null, 2));

// 07 Markdown report (what the Copy report button produces)
w("07-report.md", toMarkdown(result));
console.log("score", result.score, "counts", result.counts, "warnings", result.warnings);
