import { 
  Facility, 
  ReportingPeriod, 
  Submission, 
  User, 
  Role, 
  AuditLogEntry,
  QuestionnaireResponse,
  QuestionAnswer,
  IndicatorCode,
  PipelineConfig,
  SyncJob,
  KpiData,
  DataSource,
  IndicatorComparison
} from "../types";
import { INDICATORS, INDICATOR_QUESTIONS, getIndicatorCategory, isHigherBetter } from "./indicators";

// Facilities
export const facilities: Facility[] = [
  {
    id: "fac-001",
    name: "Riverbend Aged Care",
    providerName: "Riverbend Healthcare Group",
    address: "123 River Road, Melbourne VIC 3000",
    serviceId: "HS-RIVERBEND-001",
    abn: "12 345 678 901",
    gpmsProviderId: "GPMS-001",
    cisSystemName: "Telstra Health CIS"
  },
  {
    id: "fac-002",
    name: "Coastal View Lodge",
    providerName: "Coastal Care Pty Ltd",
    address: "456 Ocean Drive, Brighton VIC 3186",
    serviceId: "HS-COASTAL-002",
    abn: "23 456 789 012",
    gpmsProviderId: "GPMS-002",
    cisSystemName: "Telstra Health CIS"
  },
  {
    id: "fac-003",
    name: "Harbour Heights Home",
    providerName: "Harbour Healthcare Services",
    address: "789 Harbour Street, Geelong VIC 3220",
    serviceId: "HS-HARBOUR-003",
    abn: "34 567 890 123",
    gpmsProviderId: "GPMS-003",
    cisSystemName: "Telstra Health CIS"
  }
];

export const DEFAULT_COMPARISON_FACILITY_ID = facilities[0].id;

// Reporting Periods - sorted by date descending (latest first)
export const reportingPeriods: ReportingPeriod[] = [
  {
    id: "rp-q4-2025",
    quarter: "Q4 2025",
    startDate: "2025-10-01",
    endDate: "2025-12-31",
    dueDate: "2026-01-21",
    status: "In Progress"
  },
  {
    id: "rp-q3-2025",
    quarter: "Q3 2025",
    startDate: "2025-07-01",
    endDate: "2025-09-30",
    dueDate: "2025-10-21",
    status: "Submitted"
  },
  {
    id: "rp-q2-2025",
    quarter: "Q2 2025",
    startDate: "2025-04-01",
    endDate: "2025-06-30",
    dueDate: "2025-07-21",
    status: "Submitted"
  },
  {
    id: "rp-q1-2025",
    quarter: "Q1 2025",
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    dueDate: "2025-04-21",
    status: "Submitted"
  },
  {
    id: "rp-q4-2024",
    quarter: "Q4 2024",
    startDate: "2024-10-01",
    endDate: "2024-12-31",
    dueDate: "2025-01-21",
    status: "Submitted"
  },
  {
    id: "rp-q3-2024",
    quarter: "Q3 2024",
    startDate: "2024-07-01",
    endDate: "2024-09-30",
    dueDate: "2024-10-21",
    status: "Submitted"
  },
  {
    id: "rp-q2-2024",
    quarter: "Q2 2024",
    startDate: "2024-04-01",
    endDate: "2024-06-30",
    dueDate: "2024-07-21",
    status: "Submitted"
  },
  {
    id: "rp-q1-2024",
    quarter: "Q1 2024",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    dueDate: "2024-04-21",
    status: "Submitted"
  }
];

// Get latest reporting period (first in list)
export const getLatestReportingPeriod = (): ReportingPeriod => reportingPeriods[0];

// Roles
export const roles: Role[] = [
  {
    id: "role-sys-admin",
    name: "System Administrator",
    description: "Full system access including user management and pipeline configuration",
    permissions: ["CONFIGURE_PIPELINE", "MANAGE_USERS", "VIEW_SUBMISSIONS", "VIEW_AUDIT_LOGS"]
  },
  {
    id: "role-data-admin",
    name: "Data Administrator",
    description: "Manages data pipeline and can edit questionnaires",
    permissions: ["CONFIGURE_PIPELINE", "VIEW_SUBMISSIONS", "EDIT_QUESTIONNAIRE", "VIEW_AUDIT_LOGS"]
  },
  {
    id: "role-data-entry",
    name: "Data Entry / Clinical Staff",
    description: "Enters and edits questionnaire data",
    permissions: ["VIEW_SUBMISSIONS", "EDIT_QUESTIONNAIRE"]
  },
  {
    id: "role-reviewer",
    name: "Data Reviewer",
    description: "Reviews submissions before final approval, can POST in-progress",
    permissions: ["VIEW_SUBMISSIONS", "EDIT_QUESTIONNAIRE", "REVIEW_SUBMISSION", "POST_IN_PROGRESS", "VIEW_AUDIT_LOGS"]
  },
  {
    id: "role-submitter",
    name: "QI Submitter",
    description: "Authorised to submit data to government",
    permissions: ["VIEW_SUBMISSIONS", "EDIT_QUESTIONNAIRE", "REVIEW_SUBMISSION", "POST_IN_PROGRESS", "FINAL_SUBMIT_GOVERNMENT", "VIEW_AUDIT_LOGS"]
  },
  {
    id: "role-compliance",
    name: "Compliance Officer",
    description: "Views submissions and audit logs for compliance purposes",
    permissions: ["VIEW_SUBMISSIONS", "VIEW_AUDIT_LOGS"]
  },
  {
    id: "role-executive",
    name: "Executive Viewer",
    description: "Read-only access to summaries and dashboards",
    permissions: ["VIEW_SUBMISSIONS"]
  }
];

// Users
export const users: User[] = [
  {
    id: "user-003",
    name: "Chris",
    email: "chris@loop.health",
    roleIds: ["role-data-entry"],
    isActive: true
  },
  {
    id: "user-005",
    name: "Morgan",
    email: "morgan@loop.health",
    federatedId: "morgan@digitalid.gov.au",
    roleIds: ["role-submitter"],
    isActive: true
  },
  {
    id: "user-006",
    name: "Sam",
    email: "sam@loop.health",
    roleIds: ["role-reviewer", "role-compliance"],
    isActive: true
  }
];

// Current user (simulated logged in user)
export const currentUser = users.find((u) => u.id === "user-005") || users[0]; // Morgan - QI Submitter

// Demo Scenario Types for documentation
export interface DemoScenario {
  id: string;
  type: "clean" | "warnings" | "reject" | "late";
  name: string;
  description: string;
  submissionId: string;
  workflowSteps: string[];
  expectedBehavior: string;
}

// Demo scenarios for testing and showcasing
export const demoScenarios: DemoScenario[] = [
  {
    id: "demo-clean-on-time",
    type: "clean",
    name: "Clean On-Time Submission (Start Empty)",
    description: "Walk the full workflow from a blank questionnaire, then pre-fill and submit successfully.",
    submissionId: "sub-007",
    workflowSteps: [
      "1) Open the submission",
      "2) Click Pre-fill Entire Questionnaire",
      "3) Click Initial Submission",
      "4) Click Go to validation page",
      "5) Tick attestation and submit final data"
    ],
    expectedBehavior: "Initial and final submissions succeed; status becomes Submitted."
  },
  {
    id: "demo-warnings-only",
    type: "warnings",
    name: "Warnings Only (Start Empty)",
    description: "Government returns warnings (no blocking errors). You can proceed after acknowledging warnings.",
    submissionId: "sub-008",
    workflowSteps: [
      "1) Open the submission",
      "2) Click Pre-fill Entire Questionnaire",
      "3) Click Initial Submission (warnings returned)",
      "4) Go to validation page and review issues",
      "5) Submit final data after acknowledgement"
    ],
    expectedBehavior: "Warnings are visible and do not block; submission still completes."
  },
  {
    id: "demo-reject-total-zero",
    type: "reject",
    name: "Reject: Total Count = 0 (Start Empty)",
    description: "Government rejects the initial submission when a required total count is zero.",
    submissionId: "sub-009",
    workflowSteps: [
      "1) Open the submission",
      "2) Click Pre-fill Entire Questionnaire",
      "3) Click Initial Submission (rejected)",
      "4) Fix the highlighted field(s) and retry Initial Submission"
    ],
    expectedBehavior: "Initial submission is blocked; errors map back to the correct questions."
  },
  {
    id: "demo-final-submission-rejected",
    type: "reject",
    name: "Reject: Final Submission (Step 2)",
    description: "Initial submission succeeds, but Government rejects the final PATCH in Step 2 with mapped errors.",
    submissionId: "sub-010",
    workflowSteps: [
      "1) Open the submission",
      "2) Click Pre-fill Entire Questionnaire",
      "3) Click Initial Submission (succeeds)",
      "4) Go to validation page and click Submit Final Data (rejected)",
      "5) Review mapped Government errors and correct data"
    ],
    expectedBehavior: "Final submission fails with Government errors mapped to specific questions."
  },
  {
    id: "demo-late-submission",
    type: "late",
    name: "Late Submission (Start Empty)",
    description: "Complete a submission for an older quarter; final status should be Late Submission.",
    submissionId: "sub-011",
    workflowSteps: [
      "1) Open the submission",
      "2) Click Pre-fill Entire Questionnaire",
      "3) Click Initial Submission",
      "4) Go to validation page and submit final data"
    ],
    expectedBehavior: "Final status label is Late Submission with the matching attestation."
  }
];

// Helper to generate mock question data with configurable scenarios
type ValidationScenario = "clean" | "errors" | "warnings" | "govt-errors" | "empty" | "partial";

// Deterministic pseudo-random based on seed
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const ensureManualOverrides = (questions: QuestionAnswer[], targetOverrides: number) => {
  if (targetOverrides <= 0) return;

  let overrides = questions.filter((q) => q.isOverridden && q.finalValue !== null).length;
  if (overrides >= targetOverrides) return;

  for (const question of questions) {
    if (overrides >= targetOverrides) break;
    if (question.finalValue === null || question.isOverridden) continue;

    if (typeof question.finalValue === "number") {
      question.isOverridden = true;
      question.userValue = question.finalValue + 1;
      question.finalValue = question.userValue;
      overrides++;
      continue;
    }

    if (typeof question.finalValue === "boolean") {
      question.isOverridden = true;
      question.userValue = !question.finalValue;
      question.finalValue = question.userValue;
      overrides++;
      continue;
    }

    if (typeof question.finalValue === "string") {
      question.isOverridden = true;
      question.userValue = `${question.finalValue} (manual review)`;
      question.finalValue = question.userValue;
      overrides++;
    }
  }
};

const generateQuestionAnswers = (
  indicatorCode: IndicatorCode, 
  scenario: ValidationScenario = "clean",
  seed: number = 1
): QuestionAnswer[] => {
  const questions = INDICATOR_QUESTIONS[indicatorCode];
  const overrideRatio = scenario === "empty" ? 0 : scenario === "partial" ? 0.15 : 0.3;
  const targetOverrides = Math.max(0, Math.ceil(questions.length * overrideRatio));

  const generated = questions.map((q, idx) => {
    const questionSeed = seed + idx + indicatorCode.charCodeAt(0);
    const rand = seededRandom(questionSeed);
    
    // Generate realistic auto values based on question type
    let autoValue: string | number | boolean | null = null;
    
    if (q.responseType === "integer") {
      // Generate realistic values based on linkId patterns
      if (q.linkId.includes("01")) autoValue = Math.floor(rand * 100) + 50; // Total residents: 50-150
      else if (q.linkId.includes("02")) autoValue = Math.floor(rand * 20) + 5; // Subset counts: 5-25
      else if (q.linkId.includes("03")) autoValue = Math.floor(rand * 10); // Smaller counts: 0-10
      else if (q.linkId.includes("04")) autoValue = Math.floor(rand * 5); // Very small: 0-5
      else autoValue = Math.floor(rand * 30) + 10;
    } else if (q.responseType === "boolean") {
      autoValue = rand > 0.3;
    } else if (q.responseType === "date") {
      autoValue = "2025-01-15";
    } else if (q.responseType === "string") {
      if (q.linkId.includes("Comment")) {
        autoValue = rand > 0.6 ? "Verified by clinical team during quarterly review." : "";
      } else {
        autoValue = "Standard procedure followed";
      }
    }
    
    // For partial scenario, randomly make some fields empty
    if (scenario === "partial" && rand > 0.5) {
      autoValue = null;
    }
    
    // Determine if user manually overrode
    // For "empty" scenario, treat answers as user-managed (blank) so they don't appear as auto-filled.
    let isOverridden = scenario !== "empty" && scenario !== "partial" && rand > 0.7;
    let userValue: string | number | boolean | null = null;
    
    if (isOverridden && autoValue !== null) {
      if (q.responseType === "integer" && typeof autoValue === "number") {
        userValue = autoValue + Math.floor(seededRandom(questionSeed + 100) * 10) - 5; // ±5 adjustment
      } else {
        userValue = autoValue;
      }
    }
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Apply scenario-specific validation
    switch (scenario) {
      case "errors":
        // Add errors to specific fields
        if (idx === 0 && q.required) {
          autoValue = 0;
          userValue = null;
          errors.push("Value cannot be zero for required field");
        }
        if (indicatorCode === "PI" && q.linkId === "PI-02") {
          errors.push("Stage 2+ count exceeds total count - please verify");
        }
        if (indicatorCode === "FALL" && q.linkId === "FALL-01" && rand > 0.5) {
          errors.push("Total falls count missing - required field");
        }
        break;
        
      case "warnings":
        if (q.linkId === "UPWL-04" || q.linkId === "FALL-03") {
          warnings.push("Value is higher than industry average - please confirm");
        }
        if (indicatorCode === "PI" && q.linkId === "PI-03" && rand > 0.5) {
          warnings.push("Stage 3 count seems elevated compared to previous quarters");
        }
        if (q.linkId.includes("Comment") && !userValue && !autoValue) {
          warnings.push("Comment recommended for context");
        }
        break;
        
      case "govt-errors":
        // These are errors that Government API would return
        if (indicatorCode === "PI" && q.linkId === "PI-01") {
          autoValue = -5; // Invalid value
          errors.push("[GOVT] Value must be a non-negative integer");
        }
        if (indicatorCode === "PI" && q.linkId === "PI-02") {
          errors.push("[GOVT] Stage 2+ count cannot exceed total residents assessed");
        }
        if (indicatorCode === "RP" && q.linkId === "RP-02") {
          errors.push("[GOVT] Percentage cannot exceed 100%");
        }
        if (indicatorCode === "FALL" && q.linkId === "FALL-02") {
          errors.push("[GOVT] Falls with injury count exceeds total falls");
        }
        break;
        
      case "partial":
        // Some fields filled, some empty - good for showing pre-fill
        if (autoValue === null && q.required) {
          warnings.push("Required field not yet completed");
          errors.push("Required response missing - please provide a value");
        }
        break;
        
      case "empty":
        userValue = null;
        isOverridden = true;
        break;
        
      case "clean":
      default:
        // No issues, all data present
        break;
    }
    
    const questionAnswer: QuestionAnswer = {
      ...q,
      autoValue,
      userValue,
      finalValue: scenario === "empty" ? null : (userValue ?? autoValue),
      isOverridden,
      warnings,
      errors
    };

    return questionAnswer;
  });

  ensureManualOverrides(generated, targetOverrides);
  return generated;
};

// Generate questionnaire responses for a submission with scenario
const generateQuestionnaireResponses = (
  submissionId: string,
  scenario: ValidationScenario = "clean"
): QuestionnaireResponse[] => {
  // Use submission ID to create deterministic seed
  const baseSeed = submissionId.split("-").reduce((acc, part) => acc + parseInt(part.replace(/\D/g, "") || "0"), 0);
  
  return INDICATORS.map((indicator, idx) => {
    // Apply different scenarios to different indicators for variety
    let indicatorScenario = scenario;
    if (scenario === "warnings" && idx > 2) indicatorScenario = "clean";
    if (scenario === "errors" && idx > 1) indicatorScenario = "clean";
    if (scenario === "govt-errors" && idx > 2) indicatorScenario = "clean";
    if (scenario === "partial" && idx > 3) indicatorScenario = "clean";
    
    const questions = generateQuestionAnswers(indicator.code, indicatorScenario, baseSeed + idx * 10);
    const hasErrors = questions.some(q => q.errors.length > 0);
    const hasWarnings = questions.some(q => q.warnings.length > 0);
    const hasData = questions.some(q => q.finalValue !== null);
    
    // Determine source based on data availability
    const sourceRand = seededRandom(baseSeed + idx);
    const source: DataSource = hasData 
      ? (sourceRand > 0.3 ? "CIS Pipeline" : "Mixed") 
      : "Manual Only";
    
    return {
      id: `qr-${submissionId}-${indicator.code}`,
      submissionId,
      indicatorCode: indicator.code,
      indicatorName: indicator.name,
      status: hasErrors ? "Draft" : hasWarnings ? "Ready for Review" : hasData ? "Reviewed" : "Not Started",
      source,
      prefillAvailable: true,
      validationStatus: hasErrors ? "Errors" : hasWarnings ? "Warnings" : "OK",
      lastReviewedByUserId: hasErrors || !hasData ? undefined : "user-006",
      lastReviewedAt: hasErrors || !hasData ? undefined : new Date().toISOString(),
      questions,
      fhirRawJson: JSON.stringify({ resourceType: "QuestionnaireResponse", status: "in-progress" }),
      comments: hasData && seededRandom(baseSeed + idx + 50) > 0.7 ? "Reviewed and verified by nursing staff." : ""
    } as QuestionnaireResponse;
  });
};

type DemoPipelineOverrideValue = string | number | boolean | null;
type DemoPipelineOverrideMap = Record<string, DemoPipelineOverrideValue>;

const DEMO_PIPELINE_OVERRIDES_BY_SUBMISSION_ID: Record<string, DemoPipelineOverrideMap> = {
  // Warnings-only: high numeric + empty comment triggers a government warning
  "sub-008": {
    "PI/PI-01": 120,
    "PI/PI-18": "",
  },
  // Reject: total count cannot be zero
  "sub-009": {
    "PI/PI-01": 0,
    // Keep related sub-counts at 0 so we only demo the "total cannot be zero" rule.
    "PI/PI-02": 0,
    // Extra safety: allow matching by linkId-only if indicator code mapping changes.
    "PI-02": 0,
  },
  // Final submission rejected demo: keep initial clean but make the failing value obvious after pre-fill.
  "sub-010": {
    "UPWL/UPWL-12": 1002,
  },
};

const applyDemoPipelineOverrides = (
  submissionId: string,
  questionnaires: QuestionnaireResponse[]
): QuestionnaireResponse[] => {
  const overrides = DEMO_PIPELINE_OVERRIDES_BY_SUBMISSION_ID[submissionId];
  if (!overrides) return questionnaires;

  return questionnaires.map((q) => ({
    ...q,
    questions: q.questions.map((qu) => {
      const key = `${q.indicatorCode}/${qu.linkId}`;
      const hasKey = Object.prototype.hasOwnProperty.call(overrides, key);
      const hasLinkIdKey = Object.prototype.hasOwnProperty.call(overrides, qu.linkId);
      if (!hasKey && !hasLinkIdKey) return qu;

      const overrideValue = hasKey ? overrides[key] : overrides[qu.linkId];
      return { ...qu, autoValue: overrideValue };
    }),
  }));
};

const createDemoEmptySubmissionQuestionnaires = (submissionId: string): QuestionnaireResponse[] => {
  const empty = generateQuestionnaireResponses(submissionId, "empty");
  return applyDemoPipelineOverrides(submissionId, empty);
};

// Submissions - comprehensive scenarios for Q1-Q4 2025
export const submissions: Submission[] = [
  // ===== Q4 2025 - CURRENT PERIOD (In Progress) =====
  
  // Scenario: Warnings Only - Can Proceed
  {
    id: "sub-001",
    facilityId: "fac-001",
    reportingPeriodId: "rp-q4-2025",
    status: "In Progress",
    fhirStatus: "in-progress",
    createdAt: "2025-10-01T00:00:00Z",
    updatedAt: "2025-12-10T14:30:00Z",
    createdByUserId: "user-003",
    hasWarnings: true,
    hasErrors: false,
    submissionVersionNumber: 2,
    questionnaires: generateQuestionnaireResponses("sub-001", "warnings"),
    questionnaireResponseId: "QIQR-2025-Q4-RB001",
    questionnaireId: "QI-020",
    healthcareServiceReference: "HealthcareService/HS-001",
    apiWorkflowStep: "in-progress-posted"
  },
  
  // Scenario: Not Started - Empty
  {
    id: "sub-002",
    facilityId: "fac-002",
    reportingPeriodId: "rp-q4-2025",
    status: "Not Started",
    fhirStatus: "in-progress",
    createdAt: "2025-10-01T00:00:00Z",
    updatedAt: "2025-10-01T00:00:00Z",
    createdByUserId: "user-003",
    hasWarnings: false,
    hasErrors: false,
    submissionVersionNumber: 1,
    questionnaires: generateQuestionnaireResponses("sub-002", "empty"),
    questionnaireId: "QI-020",
    healthcareServiceReference: "HealthcareService/HS-002",
    apiWorkflowStep: "data-collection"
  },
  
  // Scenario: Happy Path - Clean Submission (just submitted)
  {
    id: "sub-003",
    facilityId: "fac-003",
    reportingPeriodId: "rp-q4-2025",
    status: "Submitted",
    fhirStatus: "completed",
    createdAt: "2025-10-01T00:00:00Z",
    updatedAt: "2025-12-08T09:00:00Z",
    createdByUserId: "user-003",
    submittedByUserId: "user-005",
    lastSubmittedDate: "2025-12-08T09:00:00Z",
    hasWarnings: false,
    hasErrors: false,
    submissionVersionNumber: 3,
    questionnaires: generateQuestionnaireResponses("sub-003", "clean"),
    questionnaireResponseId: "QIQR-2025-Q4-HH003",
    questionnaireId: "QI-020",
    healthcareServiceReference: "HealthcareService/HS-003",
    apiWorkflowStep: "submitted"
  },
  
  // ===== Q3 2025 - All Submitted =====
  {
    id: "sub-004",
    facilityId: "fac-001",
    reportingPeriodId: "rp-q3-2025",
    status: "Submitted",
    fhirStatus: "completed",
    createdAt: "2025-07-01T00:00:00Z",
    updatedAt: "2025-10-15T10:00:00Z",
    createdByUserId: "user-003",
    submittedByUserId: "user-005",
    lastSubmittedDate: "2025-10-15T10:00:00Z",
    hasWarnings: false,
    hasErrors: false,
    submissionVersionNumber: 4,
    questionnaires: generateQuestionnaireResponses("sub-004", "clean"),
    questionnaireResponseId: "QIQR-2025-Q3-RB004",
    questionnaireId: "QI-020",
    healthcareServiceReference: "HealthcareService/HS-001",
    apiWorkflowStep: "submitted"
  },
  {
    id: "sub-005",
    facilityId: "fac-002",
    reportingPeriodId: "rp-q3-2025",
    status: "Submitted",
    fhirStatus: "completed",
    createdAt: "2025-07-01T00:00:00Z",
    updatedAt: "2025-10-18T11:00:00Z",
    createdByUserId: "user-003",
    submittedByUserId: "user-005",
    lastSubmittedDate: "2025-10-18T11:00:00Z",
    hasWarnings: false,
    hasErrors: false,
    submissionVersionNumber: 2,
    questionnaires: generateQuestionnaireResponses("sub-005", "clean"),
    questionnaireResponseId: "QIQR-2025-Q3-CV005",
    questionnaireId: "QI-020",
    healthcareServiceReference: "HealthcareService/HS-002",
    apiWorkflowStep: "submitted"
  },
  {
    id: "sub-006",
    facilityId: "fac-003",
    reportingPeriodId: "rp-q3-2025",
    status: "Late Submission",
    fhirStatus: "completed",
    createdAt: "2025-07-01T00:00:00Z",
    updatedAt: "2025-10-25T08:00:00Z",
    createdByUserId: "user-003",
    submittedByUserId: "user-005",
    lastSubmittedDate: "2025-10-25T08:00:00Z",
    hasWarnings: false,
    hasErrors: false,
    submissionVersionNumber: 5,
    questionnaires: generateQuestionnaireResponses("sub-006", "clean"),
    questionnaireResponseId: "QIQR-2025-Q3-HH006",
    questionnaireId: "QI-020",
    healthcareServiceReference: "HealthcareService/HS-003",
    apiWorkflowStep: "submitted"
  },
  
  // ===== SPECIAL DEMO SCENARIOS =====
  
  // Demo: Clean On-Time Submission (start empty)
  {
    id: "sub-007",
    facilityId: "fac-001",
    reportingPeriodId: "rp-q4-2025",
    isDemo: true,
    status: "Not Started",
    fhirStatus: "in-progress",
    createdAt: "2025-10-01T00:00:00Z",
    updatedAt: "2025-10-01T00:00:00Z",
    createdByUserId: "user-003",
    hasWarnings: false,
    hasErrors: false,
    submissionVersionNumber: 1,
    questionnaires: createDemoEmptySubmissionQuestionnaires("sub-007"),
    questionnaireId: "QI-020",
    healthcareServiceReference: "HealthcareService/HS-001",
    apiWorkflowStep: "data-collection"
  },
  
  // Demo: Warnings Only (start empty)
  {
    id: "sub-008",
    facilityId: "fac-002",
    reportingPeriodId: "rp-q4-2025",
    isDemo: true,
    status: "Not Started",
    fhirStatus: "in-progress",
    createdAt: "2025-10-01T00:00:00Z",
    updatedAt: "2025-10-01T00:00:00Z",
    createdByUserId: "user-003",
    hasWarnings: false,
    hasErrors: false,
    submissionVersionNumber: 1,
    questionnaires: createDemoEmptySubmissionQuestionnaires("sub-008"),
    questionnaireId: "QI-020",
    healthcareServiceReference: "HealthcareService/HS-002",
    apiWorkflowStep: "data-collection"
  },
  
  // Demo: Reject Total Count = 0 (start empty)
  {
    id: "sub-009",
    facilityId: "fac-003",
    reportingPeriodId: "rp-q4-2025",
    isDemo: true,
    status: "Not Started",
    fhirStatus: "in-progress",
    createdAt: "2025-10-01T00:00:00Z",
    updatedAt: "2025-10-01T00:00:00Z",
    createdByUserId: "user-003",
    hasWarnings: false,
    hasErrors: false,
    submissionVersionNumber: 1,
    questionnaires: createDemoEmptySubmissionQuestionnaires("sub-009"),
    questionnaireId: "QI-020",
    healthcareServiceReference: "HealthcareService/HS-003",
    apiWorkflowStep: "data-collection"
  },
  
  // Demo: Reject Inconsistent Counts (start empty)
  {
    id: "sub-010",
    facilityId: "fac-002",
    reportingPeriodId: "rp-q4-2025",
    isDemo: true,
    status: "Not Started",
    fhirStatus: "in-progress",
    createdAt: "2025-10-01T00:00:00Z",
    updatedAt: "2025-10-01T00:00:00Z",
    createdByUserId: "user-003",
    hasWarnings: false,
    hasErrors: false,
    submissionVersionNumber: 1,
    questionnaires: createDemoEmptySubmissionQuestionnaires("sub-010"),
    questionnaireId: "QI-020",
    healthcareServiceReference: "HealthcareService/HS-002",
    apiWorkflowStep: "data-collection"
  },

  // Demo: Late Submission (start empty, older reporting period)
  {
    id: "sub-011",
    facilityId: "fac-003",
    reportingPeriodId: "rp-q2-2025",
    isDemo: true,
    status: "Not Started",
    fhirStatus: "in-progress",
    createdAt: "2025-04-01T00:00:00Z",
    updatedAt: "2025-04-01T00:00:00Z",
    createdByUserId: "user-003",
    hasWarnings: false,
    hasErrors: false,
    submissionVersionNumber: 1,
    questionnaires: createDemoEmptySubmissionQuestionnaires("sub-011"),
    questionnaireId: "QI-020",
    healthcareServiceReference: "HealthcareService/HS-003",
    apiWorkflowStep: "data-collection",
  },
  
  // ===== Q1 2025 - Historical =====
  {
    id: "sub-011",
    facilityId: "fac-002",
    reportingPeriodId: "rp-q1-2025",
    status: "Submitted",
    fhirStatus: "completed",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-04-18T11:00:00Z",
    createdByUserId: "user-003",
    submittedByUserId: "user-005",
    lastSubmittedDate: "2025-04-18T11:00:00Z",
    hasWarnings: false,
    hasErrors: false,
    submissionVersionNumber: 2,
    questionnaires: generateQuestionnaireResponses("sub-011", "clean"),
    questionnaireResponseId: "QIQR-2025-Q1-CV011",
    questionnaireId: "QI-020",
    healthcareServiceReference: "HealthcareService/HS-002",
    apiWorkflowStep: "submitted"
  },
  {
    id: "sub-012",
    facilityId: "fac-003",
    reportingPeriodId: "rp-q1-2025",
    status: "Submitted",
    fhirStatus: "completed",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-04-20T09:00:00Z",
    createdByUserId: "user-003",
    submittedByUserId: "user-005",
    lastSubmittedDate: "2025-04-20T09:00:00Z",
    hasWarnings: false,
    hasErrors: false,
    submissionVersionNumber: 3,
    questionnaires: generateQuestionnaireResponses("sub-012", "clean"),
    questionnaireResponseId: "QIQR-2025-Q1-HH012",
    questionnaireId: "QI-020",
    healthcareServiceReference: "HealthcareService/HS-003",
    apiWorkflowStep: "submitted"
  },
  
  // ===== Q4 2024 - Historical =====
  {
    id: "sub-013",
    facilityId: "fac-001",
    reportingPeriodId: "rp-q4-2024",
    status: "Submitted",
    fhirStatus: "completed",
    createdAt: "2024-10-01T00:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
    createdByUserId: "user-003",
    submittedByUserId: "user-005",
    lastSubmittedDate: "2025-01-15T10:00:00Z",
    hasWarnings: false,
    hasErrors: false,
    submissionVersionNumber: 2,
    questionnaires: generateQuestionnaireResponses("sub-013", "clean"),
    questionnaireResponseId: "QIQR-2024-Q4-RB013",
    questionnaireId: "QI-019",
    healthcareServiceReference: "HealthcareService/HS-001",
    apiWorkflowStep: "submitted"
  },
  {
    id: "sub-014",
    facilityId: "fac-002",
    reportingPeriodId: "rp-q4-2024",
    status: "Submitted",
    fhirStatus: "completed",
    createdAt: "2024-10-01T00:00:00Z",
    updatedAt: "2025-01-18T11:00:00Z",
    createdByUserId: "user-003",
    submittedByUserId: "user-005",
    lastSubmittedDate: "2025-01-18T11:00:00Z",
    hasWarnings: false,
    hasErrors: false,
    submissionVersionNumber: 2,
    questionnaires: generateQuestionnaireResponses("sub-014", "clean"),
    questionnaireResponseId: "QIQR-2024-Q4-CV014",
    questionnaireId: "QI-019",
    healthcareServiceReference: "HealthcareService/HS-002",
    apiWorkflowStep: "submitted"
  },
  {
    id: "sub-015",
    facilityId: "fac-003",
    reportingPeriodId: "rp-q4-2024",
    status: "Submitted",
    fhirStatus: "completed",
    createdAt: "2024-10-01T00:00:00Z",
    updatedAt: "2025-01-20T09:00:00Z",
    createdByUserId: "user-003",
    submittedByUserId: "user-005",
    lastSubmittedDate: "2025-01-20T09:00:00Z",
    hasWarnings: false,
    hasErrors: false,
    submissionVersionNumber: 3,
    questionnaires: generateQuestionnaireResponses("sub-015", "clean"),
    questionnaireResponseId: "QIQR-2024-Q4-HH015",
    questionnaireId: "QI-019",
    healthcareServiceReference: "HealthcareService/HS-003",
    apiWorkflowStep: "submitted"
  },

  // ===== Q3 2024 - Historical =====
  {
    id: "sub-016",
    facilityId: "fac-001",
    reportingPeriodId: "rp-q3-2024",
    status: "Submitted",
    fhirStatus: "completed",
    createdAt: "2024-07-01T00:00:00Z",
    updatedAt: "2024-10-18T10:00:00Z",
    createdByUserId: "user-003",
    submittedByUserId: "user-005",
    lastSubmittedDate: "2024-10-18T10:00:00Z",
    hasWarnings: false,
    hasErrors: false,
    submissionVersionNumber: 2,
    questionnaires: generateQuestionnaireResponses("sub-016", "clean"),
    questionnaireResponseId: "QIQR-2024-Q3-RB016",
    questionnaireId: "QI-018",
    healthcareServiceReference: "HealthcareService/HS-001",
    apiWorkflowStep: "submitted"
  },
  {
    id: "sub-017",
    facilityId: "fac-002",
    reportingPeriodId: "rp-q3-2024",
    status: "Not Submitted",
    fhirStatus: "in-progress",
    createdAt: "2024-07-01T00:00:00Z",
    updatedAt: "2024-10-25T09:00:00Z",
    createdByUserId: "user-003",
    hasWarnings: true,
    hasErrors: true,
    submissionVersionNumber: 1,
    questionnaires: generateQuestionnaireResponses("sub-017", "partial"),
    questionnaireId: "QI-018",
    healthcareServiceReference: "HealthcareService/HS-002",
    apiWorkflowStep: "data-collection"
  },
  {
    id: "sub-018",
    facilityId: "fac-003",
    reportingPeriodId: "rp-q3-2024",
    status: "Submitted",
    fhirStatus: "completed",
    createdAt: "2024-07-01T00:00:00Z",
    updatedAt: "2024-10-19T08:00:00Z",
    createdByUserId: "user-003",
    submittedByUserId: "user-005",
    lastSubmittedDate: "2024-10-19T08:00:00Z",
    hasWarnings: false,
    hasErrors: false,
    submissionVersionNumber: 3,
    questionnaires: generateQuestionnaireResponses("sub-018", "clean"),
    questionnaireResponseId: "QIQR-2024-Q3-HH018",
    questionnaireId: "QI-018",
    healthcareServiceReference: "HealthcareService/HS-003",
    apiWorkflowStep: "submitted"
  },

  // ===== Q2 2024 - Historical =====
  {
    id: "sub-019",
    facilityId: "fac-001",
    reportingPeriodId: "rp-q2-2024",
    status: "Submitted",
    fhirStatus: "completed",
    createdAt: "2024-04-01T00:00:00Z",
    updatedAt: "2024-07-18T10:00:00Z",
    createdByUserId: "user-003",
    submittedByUserId: "user-005",
    lastSubmittedDate: "2024-07-18T10:00:00Z",
    hasWarnings: false,
    hasErrors: false,
    submissionVersionNumber: 2,
    questionnaires: generateQuestionnaireResponses("sub-019", "clean"),
    questionnaireResponseId: "QIQR-2024-Q2-RB019",
    questionnaireId: "QI-017",
    healthcareServiceReference: "HealthcareService/HS-001",
    apiWorkflowStep: "submitted"
  },
  {
    id: "sub-020",
    facilityId: "fac-002",
    reportingPeriodId: "rp-q2-2024",
    status: "Late Submission",
    fhirStatus: "completed",
    createdAt: "2024-04-01T00:00:00Z",
    updatedAt: "2024-07-28T09:30:00Z",
    createdByUserId: "user-003",
    submittedByUserId: "user-005",
    lastSubmittedDate: "2024-07-28T09:30:00Z",
    hasWarnings: true,
    hasErrors: false,
    submissionVersionNumber: 3,
    questionnaires: generateQuestionnaireResponses("sub-020", "warnings"),
    questionnaireResponseId: "QIQR-2024-Q2-CV020",
    questionnaireId: "QI-017",
    healthcareServiceReference: "HealthcareService/HS-002",
    apiWorkflowStep: "submitted"
  },
  {
    id: "sub-021",
    facilityId: "fac-003",
    reportingPeriodId: "rp-q2-2024",
    status: "Submitted",
    fhirStatus: "completed",
    createdAt: "2024-04-01T00:00:00Z",
    updatedAt: "2024-07-15T08:45:00Z",
    createdByUserId: "user-003",
    submittedByUserId: "user-005",
    lastSubmittedDate: "2024-07-15T08:45:00Z",
    hasWarnings: false,
    hasErrors: false,
    submissionVersionNumber: 2,
    questionnaires: generateQuestionnaireResponses("sub-021", "clean"),
    questionnaireResponseId: "QIQR-2024-Q2-HH021",
    questionnaireId: "QI-017",
    healthcareServiceReference: "HealthcareService/HS-003",
    apiWorkflowStep: "submitted"
  },

  // ===== Q1 2024 - Historical =====
  {
    id: "sub-022",
    facilityId: "fac-001",
    reportingPeriodId: "rp-q1-2024",
    status: "Submitted",
    fhirStatus: "completed",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-04-18T10:00:00Z",
    createdByUserId: "user-003",
    submittedByUserId: "user-005",
    lastSubmittedDate: "2024-04-18T10:00:00Z",
    hasWarnings: false,
    hasErrors: false,
    submissionVersionNumber: 2,
    questionnaires: generateQuestionnaireResponses("sub-022", "clean"),
    questionnaireResponseId: "QIQR-2024-Q1-RB022",
    questionnaireId: "QI-016",
    healthcareServiceReference: "HealthcareService/HS-001",
    apiWorkflowStep: "submitted"
  },
  {
    id: "sub-023",
    facilityId: "fac-002",
    reportingPeriodId: "rp-q1-2024",
    status: "Submitted",
    fhirStatus: "completed",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-04-20T11:20:00Z",
    createdByUserId: "user-003",
    submittedByUserId: "user-005",
    lastSubmittedDate: "2024-04-20T11:20:00Z",
    hasWarnings: false,
    hasErrors: false,
    submissionVersionNumber: 2,
    questionnaires: generateQuestionnaireResponses("sub-023", "clean"),
    questionnaireResponseId: "QIQR-2024-Q1-CV023",
    questionnaireId: "QI-016",
    healthcareServiceReference: "HealthcareService/HS-002",
    apiWorkflowStep: "submitted"
  },
  {
    id: "sub-024",
    facilityId: "fac-003",
    reportingPeriodId: "rp-q1-2024",
    status: "Submitted",
    fhirStatus: "completed",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-04-22T09:15:00Z",
    createdByUserId: "user-003",
    submittedByUserId: "user-005",
    lastSubmittedDate: "2024-04-22T09:15:00Z",
    hasWarnings: false,
    hasErrors: false,
    submissionVersionNumber: 3,
    questionnaires: generateQuestionnaireResponses("sub-024", "clean"),
    questionnaireResponseId: "QIQR-2024-Q1-HH024",
    questionnaireId: "QI-016",
    healthcareServiceReference: "HealthcareService/HS-003",
    apiWorkflowStep: "submitted"
  }
];

// Audit Log Entries
export const auditLogs: AuditLogEntry[] = [
  {
    id: "audit-001",
    timestamp: "2025-12-08T09:00:00Z",
    userId: "user-005",
    actionType: "SUBMISSION_SENT_TO_GOV",
    entityType: "Submission",
    entityId: "sub-003",
    details: "Submitted Q4 2025 data for Harbour Heights Home to government with status 'completed'"
  },
  {
    id: "audit-002",
    timestamp: "2025-12-07T16:30:00Z",
    userId: "user-006",
    actionType: "QUESTIONNAIRE_REVIEWED",
    entityType: "Questionnaire",
    entityId: "qr-sub-003-PI",
    details: "Reviewed Pressure Injuries questionnaire for Harbour Heights Home Q4 2025"
  },
  {
    id: "audit-003",
    timestamp: "2025-12-10T14:30:00Z",
    userId: "user-003",
    actionType: "QUESTION_EDITED",
    entityType: "Question",
    entityId: "PI-04",
    details: "Changed PI-04 from 12 to 14 in Q4 2025 submission for Riverbend Aged Care"
  },
  {
    id: "audit-004",
    timestamp: "2025-12-05T10:00:00Z",
    userId: "user-003",
    actionType: "PIPELINE_SYNC",
    entityType: "PipelineConfig",
    entityId: "pipe-001",
    details: "CIS pipeline sync completed successfully. 847 records imported for all facilities."
  },
  {
    id: "audit-005",
    timestamp: "2025-10-01T08:00:00Z",
    userId: "user-003",
    actionType: "PREFILL_APPLIED",
    entityType: "Submission",
    entityId: "sub-001",
    details: "Applied CIS pipeline prefill data to Riverbend Aged Care Q4 2025 submission"
  },
  {
    id: "audit-006",
    timestamp: "2025-05-15T08:00:00Z",
    userId: "user-005",
    actionType: "SUBMISSION_STATUS_CHANGED",
    entityType: "Submission",
    entityId: "sub-010",
    details: "Updated Riverbend Aged Care Q1 2025 submission after due date. Status changed to 'Submitted - Updated after Due Date'"
  },
  {
    id: "audit-007",
    timestamp: "2025-10-25T08:00:00Z",
    userId: "user-005",
    actionType: "SUBMISSION_SENT_TO_GOV",
    entityType: "Submission",
    entityId: "sub-006",
    details: "Late submission for Harbour Heights Home Q3 2025 submitted to government"
  }
];

// Pipeline Config
export const pipelineConfigs: PipelineConfig[] = [
  {
    id: "pipe-001",
    facilityId: "fac-001",
    cisBaseUrl: "https://api.telstrahealth.com/cis/v2",
    apiKeyMasked: "****-****-****-7890",
    lastSyncDate: "2025-12-05T10:00:00Z",
    status: "Connected",
    facilityMappings: [
      { internalFacilityId: "fac-001", cisIdentifier: "CIS-RB-001" }
    ]
  },
  {
    id: "pipe-002",
    facilityId: "fac-002",
    cisBaseUrl: "https://api.telstrahealth.com/cis/v2",
    apiKeyMasked: "****-****-****-4567",
    lastSyncDate: "2025-12-05T10:00:00Z",
    status: "Connected",
    facilityMappings: [
      { internalFacilityId: "fac-002", cisIdentifier: "CIS-CV-002" }
    ]
  },
  {
    id: "pipe-003",
    facilityId: "fac-003",
    cisBaseUrl: "https://api.telstrahealth.com/cis/v2",
    apiKeyMasked: "****-****-****-1234",
    lastSyncDate: "2025-12-04T22:00:00Z",
    status: "Error",
    facilityMappings: [
      { internalFacilityId: "fac-003", cisIdentifier: "CIS-HH-003" }
    ]
  }
];

// Sync Jobs
export const syncJobs: SyncJob[] = [
  {
    id: "sync-001",
    facilityId: "fac-001",
    timestamp: "2025-12-05T10:00:00Z",
    status: "Success",
    recordsImported: 312,
    errors: [],
    warnings: []
  },
  {
    id: "sync-002",
    facilityId: "fac-002",
    timestamp: "2025-12-05T10:00:00Z",
    status: "Success",
    recordsImported: 287,
    errors: [],
    warnings: []
  },
  {
    id: "sync-003",
    facilityId: "fac-003",
    timestamp: "2025-12-04T22:00:00Z",
    status: "Failed",
    recordsImported: 0,
    errors: ["Connection timeout after 30s", "Unable to authenticate with CIS endpoint"],
    warnings: []
  },
  {
    id: "sync-004",
    facilityId: "fac-001",
    timestamp: "2025-11-28T10:00:00Z",
    status: "Partial",
    recordsImported: 248,
    errors: [],
    warnings: ["64 records skipped due to validation errors"]
  }
];

// KPI Data - Pre-generated stable mock data for dashboard
const generateStableKpiData = (): KpiData[] => {
  const kpiData: KpiData[] = [];
  
  const allPeriods = [
    { id: "rp-q1-2024", label: "Q1 2024" },
    { id: "rp-q2-2024", label: "Q2 2024" },
    { id: "rp-q3-2024", label: "Q3 2024" },
    { id: "rp-q4-2024", label: "Q4 2024" },
    { id: "rp-q1-2025", label: "Q1 2025" },
    { id: "rp-q2-2025", label: "Q2 2025" },
    { id: "rp-q3-2025", label: "Q3 2025" },
    { id: "rp-q4-2025", label: "Q4 2025" },
  ];
  
  const quarterLabels = allPeriods.map(p => p.label);
  
  const historicalData: Record<string, Record<string, number[]>> = {
    "PI": { 
      "fac-001": [10.5, 9.8, 9.2, 8.8, 8.5, 8.2, 7.9, 8.2],
      "fac-002": [11.2, 10.5, 10.1, 9.6, 9.2, 8.8, 8.5, 8.7],
      "fac-003": [9.8, 9.2, 8.8, 8.5, 8.1, 7.8, 7.5, 7.6]
    },
    "RP": { 
      "fac-001": [14.2, 13.5, 13.1, 12.8, 12.6, 12.5, 12.3, 12.5],
      "fac-002": [15.1, 14.2, 13.8, 13.4, 13.1, 12.8, 12.5, 12.8],
      "fac-003": [13.5, 12.8, 12.4, 12.1, 11.8, 11.5, 11.2, 11.4]
    },
    "UPWL": { 
      "fac-001": [17.2, 16.8, 16.1, 15.9, 15.8, 15.6, 15.3, 15.3],
      "fac-002": [18.5, 17.8, 17.2, 16.8, 16.5, 16.2, 15.8, 15.9],
      "fac-003": [16.1, 15.6, 15.2, 14.9, 14.6, 14.3, 14.1, 14.2]
    },
    "FALL": { 
      "fac-001": [28.2, 27.1, 26.5, 25.8, 25.2, 24.8, 24.6, 24.6],
      "fac-002": [30.5, 29.2, 28.5, 27.8, 27.2, 26.8, 26.4, 26.2],
      "fac-003": [26.8, 25.5, 24.8, 24.2, 23.8, 23.4, 23.1, 22.8]
    },
    "MM": { 
      "fac-001": [45.2, 44.5, 43.8, 43.1, 42.5, 42.1, 41.8, 42.1],
      "fac-002": [48.5, 47.2, 46.5, 45.8, 45.2, 44.8, 44.2, 44.5],
      "fac-003": [42.8, 42.1, 41.5, 40.9, 40.4, 40.1, 39.8, 40.2]
    },
    "ADL": { 
      "fac-001": [20.5, 19.8, 19.2, 18.8, 18.5, 18.2, 17.9, 18.4],
      "fac-002": [22.1, 21.2, 20.5, 20.1, 19.8, 19.4, 19.1, 19.5],
      "fac-003": [18.8, 18.2, 17.8, 17.4, 17.1, 16.8, 16.5, 16.8]
    },
    "IC": { 
      "fac-001": [24.2, 23.5, 22.8, 22.3, 21.8, 21.5, 22.1, 22.3],
      "fac-002": [26.5, 25.8, 25.1, 24.5, 24.1, 23.8, 24.2, 24.5],
      "fac-003": [22.1, 21.5, 21.1, 20.6, 20.2, 19.8, 20.2, 20.4]
    },
    "HP": { 
      "fac-001": [16.2, 15.8, 15.2, 14.8, 14.5, 14.2, 13.9, 14.8],
      "fac-002": [18.5, 17.8, 17.2, 16.8, 16.4, 16.1, 15.8, 16.5],
      "fac-003": [14.8, 14.2, 13.8, 13.4, 13.1, 12.8, 12.5, 13.2]
    },
    "WF": { 
      "fac-001": [18.5, 17.8, 17.2, 16.8, 16.4, 16.2, 15.9, 16.2],
      "fac-002": [20.2, 19.5, 18.8, 18.2, 17.8, 17.4, 17.1, 17.5],
      "fac-003": [16.8, 16.2, 15.8, 15.4, 15.1, 14.8, 14.5, 14.8]
    },
    "CE": { 
      "fac-001": [82.1, 83.5, 84.8, 85.6, 86.4, 87.3, 87.5, 87.5],
      "fac-002": [78.5, 80.2, 81.5, 82.8, 83.8, 84.5, 85.2, 85.8],
      "fac-003": [84.2, 85.5, 86.8, 87.5, 88.2, 88.8, 89.2, 89.5]
    },
    "QOL": { 
      "fac-001": [78.8, 79.5, 80.2, 81.2, 81.8, 82.3, 82.3, 82.3],
      "fac-002": [75.5, 76.8, 78.1, 79.2, 80.1, 80.8, 81.2, 81.5],
      "fac-003": [80.2, 81.5, 82.5, 83.2, 83.8, 84.2, 84.5, 84.8]
    },
    "AH": { 
      "fac-001": [74.2, 75.1, 76.5, 77.8, 78.2, 78.6, 78.6, 78.6],
      "fac-002": [70.5, 72.1, 73.8, 75.2, 76.5, 77.2, 77.8, 78.2],
      "fac-003": [76.8, 77.5, 78.5, 79.5, 80.2, 80.8, 81.2, 81.5]
    },
    "EN": { 
      "fac-001": [72.5, 73.2, 74.1, 75.5, 76.1, 76.8, 77.2, 77.2],
      "fac-002": [68.8, 70.2, 71.8, 73.2, 74.5, 75.5, 76.2, 76.8],
      "fac-003": [74.5, 75.5, 76.5, 77.8, 78.5, 79.2, 79.8, 80.2]
    },
    "LO": { 
      "fac-001": [68.2, 69.8, 71.5, 73.1, 74.7, 75.3, 75.8, 75.8],
      "fac-002": [64.5, 66.5, 68.5, 70.2, 72.1, 73.5, 74.5, 75.2],
      "fac-003": [70.5, 72.2, 74.1, 75.8, 77.2, 78.1, 78.8, 79.2]
    }
  };
  
  allPeriods.forEach((period, periodIndex) => {
    facilities.forEach(facility => {
      INDICATORS.forEach(indicator => {
        const facilityHistory = historicalData[indicator.code]?.[facility.id];
        const currentValue = facilityHistory?.[periodIndex] || 25;
        const prevValue = periodIndex > 0 ? (facilityHistory?.[periodIndex - 1] || currentValue * 0.95) : currentValue;
        const delta = currentValue - prevValue;
        const deltaPercent = prevValue !== 0 ? (delta / prevValue) * 100 : 0;
        
        const trendValues = facilityHistory?.slice(0, periodIndex + 1) || [currentValue];
        const trendLabels = quarterLabels.slice(0, periodIndex + 1);
        
        kpiData.push({
          indicatorCode: indicator.code,
          facilityId: facility.id,
          periodId: period.id,
          value: Number(currentValue.toFixed(1)),
          previousValue: Number(prevValue.toFixed(1)),
          delta: Number(delta.toFixed(1)),
          deltaPercent: Number(deltaPercent.toFixed(1)),
          trend: trendValues,
          trendPeriods: trendLabels,
          unit: indicator.code === "WF" ? "%" : "per 1,000 bed days",
          isComplete: !(facility.id === "fac-002" && indicator.code === "PI" && period.id === "rp-q4-2025")
        });
      });
    });
  });
  
  return kpiData;
};

const stableKpiData = generateStableKpiData();

export const getAllKpiData = (): KpiData[] => {
  return stableKpiData;
};

const resolveComparisonFacility = (facilityId: string): string => {
  if (!facilityId || facilityId === "all") return DEFAULT_COMPARISON_FACILITY_ID;
  return facilityId;
};

// Seeded random for deterministic percentile generation
const seededRandomForComparison = (seed: number): number => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

// Hash string to number for seeding
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// Generate deterministic but varied percentile based on facility, indicator, and period
const generateVariedPercentile = (
  indicatorCode: IndicatorCode,
  facilityId: string,
  periodId: string,
  facilityValue: number,
  benchmarkValue: number,
  higherIsBetter: boolean
): number => {
  // Create unique seed combining all factors
  const combinedSeed = hashString(`${indicatorCode}-${facilityId}-${periodId}`);
  
  // Base percentile from actual performance vs benchmark
  let basePercentile: number;
  if (higherIsBetter) {
    // Higher value = better = higher percentile
    basePercentile = facilityValue >= benchmarkValue 
      ? 0.5 + (Math.min((facilityValue - benchmarkValue) / benchmarkValue, 0.5) * 0.8)
      : 0.5 - (Math.min((benchmarkValue - facilityValue) / benchmarkValue, 0.5) * 0.8);
  } else {
    // Lower value = better = higher percentile
    basePercentile = facilityValue <= benchmarkValue 
      ? 0.5 + (Math.min((benchmarkValue - facilityValue) / benchmarkValue, 0.5) * 0.8)
      : 0.5 - (Math.min((facilityValue - benchmarkValue) / benchmarkValue, 0.5) * 0.8);
  }
  
  // Add deterministic variation based on the combined seed (±0.25)
  const variation = (seededRandomForComparison(combinedSeed) - 0.5) * 0.5;
  
  // Clamp final percentile
  return Math.max(0.05, Math.min(0.95, basePercentile + variation));
};

const computePercentile = (nationalValues: number[], facilityValue: number, higherIsBetter: boolean): number => {
  if (nationalValues.length === 0) return 0.5;
  const sorted = [...nationalValues].sort((a, b) => a - b);
  let rank: number;
  if (higherIsBetter) {
    rank = sorted.filter(value => value <= facilityValue).length;
  } else {
    rank = sorted.filter(value => value >= facilityValue).length;
  }
  return rank / sorted.length;
};

// Inspired by the manual entries sample but generated purely from mock KPI data
const buildComparisonRecord = (
  indicatorCode: IndicatorCode,
  facilityId: string,
  periodId: string
): IndicatorComparison => {
  const relevantRecords = stableKpiData.filter(
    record => record.indicatorCode === indicatorCode && record.periodId === periodId
  );
  const fallbackRecord = relevantRecords[0];
  const facilityRecord =
    relevantRecords.find(record => record.facilityId === facilityId) ?? fallbackRecord;

  const facilityValue = facilityRecord?.value ?? fallbackRecord?.value ?? 0;
  
  // Calculate benchmark from actual facilities
  const benchmarkValue = relevantRecords.length
    ? relevantRecords.reduce((sum, record) => sum + record.value, 0) / relevantRecords.length
    : facilityValue;

  const higherIsBetterFlag = isHigherBetter(indicatorCode);
  
  // Generate varied percentile based on facility, indicator, and period
  const percentile = generateVariedPercentile(
    indicatorCode,
    facilityId,
    periodId,
    facilityValue,
    benchmarkValue,
    higherIsBetterFlag
  );
  
  const safePercentile = Math.max(0.01, Math.min(0.99, percentile));
  const quintile = Math.max(1, Math.min(5, Math.ceil(safePercentile * 5)));

  return {
    indicatorCode,
    facilityId,
    periodId,
    rockpoolNumber: Number(facilityValue.toFixed(1)),
    benchmarkValue: Number(benchmarkValue.toFixed(1)),
    rockpoolProportion: Number(safePercentile.toFixed(4)),
    quintile,
  };
};

export const getIndicatorComparison = (
  indicatorCode: IndicatorCode,
  facilityId: string,
  periodId: string
): IndicatorComparison => {
  const resolved = resolveComparisonFacility(facilityId);
  return buildComparisonRecord(indicatorCode, resolved, periodId);
};

export const getIndicatorComparisons = (
  facilityId: string,
  periodId: string
): IndicatorComparison[] => {
  const resolved = resolveComparisonFacility(facilityId);
  return INDICATORS.map(indicator => buildComparisonRecord(indicator.code, resolved, periodId));
};

// Helper functions
export const getFacilityById = (id: string): Facility | undefined => {
  return facilities.find(f => f.id === id);
};

export const getReportingPeriodById = (id: string): ReportingPeriod | undefined => {
  return reportingPeriods.find(rp => rp.id === id);
};

export const getUserById = (id: string): User | undefined => {
  return users.find(u => u.id === id);
};

export const getSubmissionsByFacility = (facilityId: string): Submission[] => {
  return submissions.filter(s => s.facilityId === facilityId);
};

export const getSubmissionsByPeriod = (periodId: string): Submission[] => {
  return submissions.filter(s => s.reportingPeriodId === periodId);
};

export const getSubmission = (submissionId: string): Submission | undefined => {
  return submissions.find(s => s.id === submissionId);
};

export const createEmptySubmissionQuestionnaires = (submissionId: string): QuestionnaireResponse[] => {
  return generateQuestionnaireResponses(submissionId, "empty");
};

export const getDemoScenarios = (): DemoScenario[] => {
  return demoScenarios;
};
