// NIST Cybersecurity Framework 2.0 categories (22). Category-level for MVP.
export type Control = { id: string; function: string; name: string; description: string };

export const CONTROLS: Control[] = [
  { id: "GV.OC", function: "Govern", name: "Organizational Context", description: "Mission, stakeholder expectations, and legal/regulatory requirements that shape cybersecurity risk decisions are understood." },
  { id: "GV.RM", function: "Govern", name: "Risk Management Strategy", description: "Risk appetite, tolerance, and the strategy for managing cybersecurity risk are established and communicated." },
  { id: "GV.RR", function: "Govern", name: "Roles, Responsibilities, and Authorities", description: "Cybersecurity roles, responsibilities, and authorities are established, communicated, and enforced." },
  { id: "GV.PO", function: "Govern", name: "Policy", description: "Cybersecurity policy is established, communicated, enforced, and reviewed on a defined cycle." },
  { id: "GV.OV", function: "Govern", name: "Oversight", description: "Results of cybersecurity risk management are reviewed to inform and adjust strategy." },
  { id: "GV.SC", function: "Govern", name: "Cybersecurity Supply Chain Risk Management", description: "Supply chain and third-party risks are identified, assessed, and managed." },
  { id: "ID.AM", function: "Identify", name: "Asset Management", description: "Assets (hardware, software, data, services) are inventoried and managed by importance to objectives." },
  { id: "ID.RA", function: "Identify", name: "Risk Assessment", description: "Cybersecurity risk to the organization, assets, and individuals is understood through threat, vulnerability, and impact analysis." },
  { id: "ID.IM", function: "Identify", name: "Improvement", description: "Improvements to cybersecurity risk management are identified from evaluations, tests, and lessons learned." },
  { id: "PR.AA", function: "Protect", name: "Identity Management, Authentication, and Access Control", description: "Access to assets is limited to authorized users, services, and hardware and managed by risk." },
  { id: "PR.AT", function: "Protect", name: "Awareness and Training", description: "Personnel are given cybersecurity awareness and role-based training." },
  { id: "PR.DS", function: "Protect", name: "Data Security", description: "Data is managed to protect confidentiality, integrity, and availability (at rest, in transit, in use)." },
  { id: "PR.PS", function: "Protect", name: "Platform Security", description: "Hardware, software, and services are managed per risk (configuration, patching, logging, secure development)." },
  { id: "PR.IR", function: "Protect", name: "Technology Infrastructure Resilience", description: "Security architectures are managed to protect asset confidentiality, integrity, availability, and resilience." },
  { id: "DE.CM", function: "Detect", name: "Continuous Monitoring", description: "Assets are monitored to find anomalies, indicators of compromise, and other adverse events." },
  { id: "DE.AE", function: "Detect", name: "Adverse Event Analysis", description: "Anomalies and potential adverse events are analyzed to characterize them and detect incidents." },
  { id: "RS.MA", function: "Respond", name: "Incident Management", description: "Responses to detected incidents are managed (triage, escalation, declaration)." },
  { id: "RS.AN", function: "Respond", name: "Incident Analysis", description: "Investigations support effective response and recovery, including forensics and root cause." },
  { id: "RS.CO", function: "Respond", name: "Incident Response Reporting and Communication", description: "Response activities are coordinated with internal and external stakeholders." },
  { id: "RS.MI", function: "Respond", name: "Incident Mitigation", description: "Activities are performed to prevent expansion of an event and mitigate its effects." },
  { id: "RC.RP", function: "Recover", name: "Incident Recovery Plan Execution", description: "Restoration activities are performed to ensure operational availability of affected systems." },
  { id: "RC.CO", function: "Recover", name: "Incident Recovery Communication", description: "Recovery activities and progress are communicated to stakeholders." },
];

export const CONTROL_IDS = CONTROLS.map((c) => c.id);
