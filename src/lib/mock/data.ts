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
  IndicatorComparison,
  IndicatorDetailData
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
  
  // Values are integer counts (residents/staff), NOT percentages.
  // PI-04: residents with ≥1 pressure injury | RP-PR-04: residents subjected to RP
  // UPWL-05: residents with ≥5% weight loss | FALL-FMI-03: residents with ≥1 fall
  // MM-04: residents on 9+ meds | ADL-06: residents with ADL decline
  // IC-IAD-04: residents with incontinence | HP-03: residents with ≥1 ED presentation
  // WF: staff who worked any hours | CE/QOL: residents who completed assessment
  // AH/EN/LO: staff/resident counts
  // Values per facility across 8 quarters: Q1 2024 → Q4 2025
  // Facilities have meaningful spread to create realistic variation in benchmarks
  const historicalData: Record<string, Record<string, number[]>> = {
    "PI": {
      "fac-001": [12, 11, 10, 9, 9, 8, 7, 6],   // Best performer, steady decline
      "fac-002": [22, 20, 19, 18, 17, 16, 15, 14], // Worst performer, high burden
      "fac-003": [14, 13, 12, 12, 11, 10, 9, 9]   // Mid performer
    },
    "RP": {
      "fac-001": [15, 14, 13, 13, 12, 11, 10, 9],
      "fac-002": [24, 22, 21, 20, 19, 19, 18, 18],
      "fac-003": [18, 17, 16, 15, 14, 14, 13, 13]
    },
    "UPWL": {
      "fac-001": [17, 16, 15, 14, 14, 13, 12, 11],
      "fac-002": [26, 25, 24, 23, 22, 22, 21, 20],
      "fac-003": [21, 20, 19, 18, 17, 17, 16, 15]
    },
    "FALL": {
      "fac-001": [27, 25, 24, 23, 22, 21, 20, 18],
      "fac-002": [42, 40, 38, 37, 36, 35, 34, 32],
      "fac-003": [31, 30, 29, 28, 27, 26, 25, 24]
    },
    "MM": {
      "fac-001": [47, 46, 45, 44, 42, 41, 38, 35],
      "fac-002": [65, 63, 61, 59, 57, 56, 54, 52],
      "fac-003": [54, 52, 50, 49, 47, 46, 45, 44]
    },
    "ADL": {
      "fac-001": [20, 19, 18, 17, 16, 15, 14, 13],
      "fac-002": [30, 29, 28, 27, 26, 25, 25, 24],
      "fac-003": [24, 23, 22, 21, 20, 20, 19, 18]
    },
    "IC": {
      "fac-001": [24, 23, 22, 21, 20, 19, 18, 17],
      "fac-002": [35, 34, 33, 32, 31, 30, 29, 28],
      "fac-003": [28, 27, 26, 25, 24, 24, 23, 22]
    },
    "HP": {
      "fac-001": [17, 15, 14, 13, 13, 12, 11, 10],
      "fac-002": [26, 25, 24, 23, 22, 22, 21, 20],
      "fac-003": [20, 19, 18, 17, 17, 16, 16, 15]
    },
    "WF": {
      "fac-001": [10, 11, 11, 12, 12, 13, 13, 14],
      "fac-002": [15, 15, 16, 16, 17, 17, 19, 20],
      "fac-003": [13, 13, 14, 14, 15, 15, 16, 17]
    },
    "CE": {
      "fac-001": [70, 73, 75, 77, 79, 81, 82, 84],
      "fac-002": [58, 60, 63, 65, 67, 68, 70, 71],
      "fac-003": [67, 70, 72, 74, 76, 77, 78, 79]
    },
    "QOL": {
      "fac-001": [64, 67, 69, 72, 74, 76, 78, 80],
      "fac-002": [52, 55, 57, 59, 62, 63, 65, 67],
      "fac-003": [60, 63, 66, 68, 70, 72, 73, 74]
    },
    "AH": {
      "fac-001": [60, 62, 65, 67, 69, 71, 73, 76],
      "fac-002": [48, 51, 53, 55, 57, 58, 60, 62],
      "fac-003": [57, 59, 62, 64, 66, 68, 69, 71]
    },
    "EN": {
      "fac-001": [56, 58, 60, 62, 64, 66, 69, 72],
      "fac-002": [44, 46, 49, 51, 53, 55, 57, 60],
      "fac-003": [52, 54, 56, 58, 60, 62, 64, 66]
    },
    "LO": {
      "fac-001": [57, 59, 62, 64, 66, 68, 71, 74],
      "fac-002": [42, 44, 47, 49, 52, 53, 55, 57],
      "fac-003": [51, 53, 56, 58, 61, 62, 63, 65]
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
          value: Math.round(currentValue),
          previousValue: Math.round(prevValue),
          delta: Math.round(delta),
          deltaPercent: Number(deltaPercent.toFixed(1)),
          trend: trendValues.map(v => Math.round(v)),
          trendPeriods: trendLabels,
          unit: ["CE", "QOL", "AH", "EN", "LO"].includes(indicator.code) ? "residents" : indicator.code === "WF" ? "staff" : "residents",
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

  // National benchmarks represent sector-wide averages, intentionally distinct from our facility values
  // Clinical indicators (lower is better): national avg is higher than best facilities
  // Satisfaction/workforce (higher is better): national avg is below our top performers
  const nationalBenchmarks: Record<IndicatorCode, number> = {
    "PI": 12,   // Our facilities: 6, 14, 9 (2 below national, 1 above)
    "RP": 15,   // Our facilities: 9, 18, 13
    "UPWL": 17, // Our facilities: 11, 20, 15
    "FALL": 27, // Our facilities: 18, 32, 24
    "MM": 47,   // Our facilities: 35, 52, 44
    "ADL": 20,  // Our facilities: 13, 24, 18
    "IC": 24,   // Our facilities: 17, 28, 22
    "HP": 16,   // Our facilities: 10, 20, 15
    "WF": 15,   // Our facilities: 14, 20, 17
    "CE": 75,   // Our facilities: 84, 71, 79 (satisfaction, higher is better)
    "QOL": 71,  // Our facilities: 80, 67, 74
    "AH": 67,   // Our facilities: 76, 62, 71
    "EN": 64,   // Our facilities: 72, 60, 66
    "LO": 60,   // Our facilities: 74, 57, 65
  };
  const benchmarkValue = nationalBenchmarks[indicatorCode] ?? facilityValue;

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
    rockpoolNumber: Math.round(facilityValue),
    benchmarkValue: Math.round(benchmarkValue),
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

// --- Restrictive Practices daily data ---

export interface RpDailyEntry {
  date: string;   // "DD MMM" e.g. "01 Jan"
  count: number;  // residents subjected to RP on this day
  isOptimalWindow: boolean;
}

export interface RpDailyResult {
  entries: RpDailyEntry[];
  optimalWindowStart: number; // index of first day in optimal 3-day window
}

const quarterStartMonths: Record<string, number> = {
  "q1": 0,  // January
  "q2": 3,  // April
  "q3": 6,  // July
  "q4": 9,  // October
};

// Seeded RNG for deterministic daily counts
const seededRng = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// Quarter has 90 days; generate realistic daily RP counts (0-8) with weekly rhythm
const generateDailyCounts = (facilityId: string, periodId: string): number[] => {
  const facilityOffset = facilityId === "fac-001" ? 0 : facilityId === "fac-002" ? 100 : 200;
  const periodOffset = hashString(periodId);
  const days = 90;
  return Array.from({ length: days }, (_, i) => {
    const seed = facilityOffset + periodOffset + i;
    const base = seededRng(seed);
    // Weekend suppression: days 5,6,12,13... have lower counts
    const weekdayFactor = (i % 7 < 5) ? 1.0 : 0.5;
    // Slow downward trend over the quarter
    const trendFactor = 1 - (i / days) * 0.1;
    const raw = base * 8 * weekdayFactor * trendFactor;
    return Math.round(raw);
  });
};

// Find the 3 consecutive days with the lowest total count
const findOptimalWindow = (counts: number[]): number => {
  let bestStart = 0;
  let bestSum = Infinity;
  for (let i = 0; i <= counts.length - 3; i++) {
    const sum = counts[i] + counts[i + 1] + counts[i + 2];
    if (sum < bestSum) {
      bestSum = sum;
      bestStart = i;
    }
  }
  return bestStart;
};

export const getRpDailyData = (facilityId: string, periodId: string): RpDailyResult => {
  // Derive year and quarter from periodId e.g. "rp-q2-2025"
  const parts = periodId.split("-");
  const quarterKey = parts[1] ?? "q1";
  const year = parseInt(parts[2] ?? "2025", 10);
  const startMonth = quarterStartMonths[quarterKey] ?? 0;
  const startDate = new Date(year, startMonth, 1);

  const counts = generateDailyCounts(facilityId, periodId);
  const optimalWindowStart = findOptimalWindow(counts);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const entries: RpDailyEntry[] = counts.map((count, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const day = String(d.getDate()).padStart(2, "0");
    const mon = monthNames[d.getMonth()];
    return {
      date: `${day} ${mon}`,
      count,
      isOptimalWindow: i >= optimalWindowStart && i < optimalWindowStart + 3,
    };
  });

  return { entries, optimalWindowStart };
};

// --- Pressure Injuries: daily observation data ---

export interface PiDailyEntry {
  date: string;          // "DD MMM" e.g. "15 Apr"
  count: number;         // PI observations on this day
  isOptimalDay: boolean; // true only for the single best collection day
}

export interface PiDailyResult {
  entries: PiDailyEntry[];
  optimalDayIndex: number;
}

const generatePiDailyCounts = (facilityId: string, periodId: string): number[] => {
  const facilityOffset = facilityId === "fac-001" ? 0 : facilityId === "fac-002" ? 100 : 200;
  const periodOffset = hashString("pi-" + periodId);
  const days = 90;
  return Array.from({ length: days }, (_, i) => {
    const seed = facilityOffset + periodOffset + i + 5000;
    const base = seededRng(seed);
    const trendFactor = 1 - (i / days) * 0.05;
    const raw = base * 4 * trendFactor;
    return Math.round(raw);
  });
};

const findOptimalDay = (counts: number[]): number => {
  let bestIndex = 0;
  let bestCount = Infinity;
  for (let i = 0; i < counts.length; i++) {
    if (counts[i] < bestCount) {
      bestCount = counts[i];
      bestIndex = i;
    }
  }
  return bestIndex;
};

export const getPiDailyData = (facilityId: string, periodId: string): PiDailyResult => {
  const parts = periodId.split("-");
  const quarterKey = parts[1] ?? "q1";
  const year = parseInt(parts[2] ?? "2025", 10);
  const startMonth = quarterStartMonths[quarterKey] ?? 0;
  const startDate = new Date(year, startMonth, 1);

  const counts = generatePiDailyCounts(facilityId, periodId);
  const optimalDayIndex = findOptimalDay(counts);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const entries: PiDailyEntry[] = counts.map((count, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const day = String(d.getDate()).padStart(2, "0");
    const mon = monthNames[d.getMonth()];
    return {
      date: `${day} ${mon}`,
      count,
      isOptimalDay: i === optimalDayIndex,
    };
  });

  return { entries, optimalDayIndex };
};

// --- Indicator Detail Data (NQIP field-level counts) ---

const seededRand = (seed: number): number => {
  const x = Math.sin(seed * 7919) * 10000;
  return x - Math.floor(x);
};

const randInt = (seed: number, min: number, max: number): number =>
  min + Math.floor(seededRand(seed) * (max - min + 1));

const generateIndicatorDetailData = (): IndicatorDetailData[] => {
  const result: IndicatorDetailData[] = [];

  reportingPeriods.forEach((period, periodIdx) => {
    facilities.forEach((facility, facIdx) => {
      const base = hashString(`${facility.id}-${period.id}`);

      // --- PI (Pressure Injuries) ---
      const piTotal = randInt(base + 1, 75, 130);
      const piExcl2 = randInt(base + 2, 1, 5);
      const piExcl3 = randInt(base + 3, 1, 4);
      const piDenom = Math.max(1, piTotal - piExcl2 - piExcl3);
      // Use actual KpiData value for PI-04 for consistency
      const piKpi = stableKpiData.find(k => k.indicatorCode === "PI" && k.facilityId === facility.id && k.periodId === period.id);
      const piWith = piKpi ? piKpi.value : randInt(base + 4, 3, Math.floor(piDenom * 0.15));
      const piSevere = Math.min(piWith, randInt(base + 5, 1, Math.max(1, Math.floor(piWith * 0.5))));
      const pi07 = Math.min(piSevere, randInt(base + 6, 0, piSevere));
      const pi08 = Math.min(piSevere - pi07, randInt(base + 7, 0, piSevere - pi07));
      const pi09 = Math.min(piSevere - pi07 - pi08, randInt(base + 8, 0, piSevere - pi07 - pi08));
      const pi10 = piSevere - pi07 - pi08 - pi09;
      const pi11 = Math.min(piWith, randInt(base + 9, 0, Math.max(0, Math.floor(piWith * 0.3))));
      result.push({
        indicatorCode: "PI",
        facilityId: facility.id,
        periodId: period.id,
        fields: {
          "PI-01": piTotal, "PI-02": piExcl2, "PI-03": piExcl3,
          "PI-04": piWith, "PI-07": pi07, "PI-08": pi08, "PI-09": pi09, "PI-10": pi10, "PI-11": pi11
        }
      });

      // --- RP (Restrictive Practices) ---
      const rpTotal = randInt(base + 10, 80, 120);
      const rpExcl = randInt(base + 11, 1, 6);
      const rpDenom = Math.max(1, rpTotal - rpExcl);
      const rpKpi = stableKpiData.find(k => k.indicatorCode === "RP" && k.facilityId === facility.id && k.periodId === period.id);
      const rpWith = rpKpi ? rpKpi.value : randInt(base + 12, 5, Math.floor(rpDenom * 0.2));
      const rpSecured = Math.min(rpWith, randInt(base + 13, 1, Math.max(1, Math.floor(rpWith * 0.6))));
      result.push({
        indicatorCode: "RP",
        facilityId: facility.id,
        periodId: period.id,
        fields: {
          "PR-02": rpTotal, "PR-03": rpExcl, "PR-04": rpWith, "PR-05": rpSecured
        }
      });

      // --- FALL (Falls & Major Injury) ---
      const fallTotal = randInt(base + 20, 80, 120);
      const fallExcl = randInt(base + 21, 1, 5);
      const fallDenom = Math.max(1, fallTotal - fallExcl);
      const fallKpi = stableKpiData.find(k => k.indicatorCode === "FALL" && k.facilityId === facility.id && k.periodId === period.id);
      const fallWith = fallKpi ? fallKpi.value : randInt(base + 22, 5, Math.floor(fallDenom * 0.25));
      const fallMajor = Math.min(fallWith, randInt(base + 23, 0, Math.max(0, Math.floor(fallWith * 0.3))));
      result.push({
        indicatorCode: "FALL",
        facilityId: facility.id,
        periodId: period.id,
        fields: {
          "FMI-01": fallTotal, "FMI-02": fallExcl, "FMI-03": fallWith, "FMI-04": fallMajor
        }
      });

      // --- UPWL (Unplanned Weight Loss) ---
      const upwlTotal = randInt(base + 30, 70, 115);
      const upwlRefused = randInt(base + 31, 1, 4);
      const upwlMissing = randInt(base + 32, 1, 6);
      const upwlKpi = stableKpiData.find(k => k.indicatorCode === "UPWL" && k.facilityId === facility.id && k.periodId === period.id);
      const upwlSig = upwlKpi ? upwlKpi.value : randInt(base + 33, 3, Math.floor(upwlTotal * 0.15));
      const upwlConsecTotal = randInt(base + 34, 60, 100);
      const upwlConsecKpi = Math.min(upwlConsecTotal, randInt(base + 35, 2, Math.floor(upwlConsecTotal * 0.12)));
      result.push({
        indicatorCode: "UPWL",
        facilityId: facility.id,
        periodId: period.id,
        fields: {
          "UPWL-01": upwlTotal, "UPWL-02": upwlRefused, "UPWL-04": upwlMissing,
          "UPWL-05": upwlSig, "UPWL-08": upwlConsecTotal, "UPWL-12": upwlConsecKpi
        }
      });

      // --- MM (Medication Management) ---
      const mmPolyTotal = randInt(base + 40, 80, 120);
      const mmPolyExcl = randInt(base + 41, 1, 5);
      const mmPolyDenom = Math.max(1, mmPolyTotal - mmPolyExcl);
      const mmKpi = stableKpiData.find(k => k.indicatorCode === "MM" && k.facilityId === facility.id && k.periodId === period.id);
      const mmPoly = mmKpi ? mmKpi.value : randInt(base + 42, 10, Math.floor(mmPolyDenom * 0.4));
      const mmApTotal = randInt(base + 43, 80, 120);
      const mmAp = Math.min(mmApTotal, randInt(base + 44, 5, Math.floor(mmApTotal * 0.25)));
      const mmApJustified = Math.min(mmAp, randInt(base + 45, Math.floor(mmAp * 0.5), mmAp));
      result.push({
        indicatorCode: "MM",
        facilityId: facility.id,
        periodId: period.id,
        fields: {
          "MM-02": mmPolyTotal, "MM-03": mmPolyExcl, "MM-04": mmPoly,
          "MM-08": mmApTotal, "MM-10": mmAp, "MM-11": mmApJustified
        }
      });

      // --- ADL (Activities of Daily Living) ---
      const adlTotal = randInt(base + 50, 80, 120);
      const adl02 = randInt(base + 51, 1, 4); // new admit
      const adl03 = randInt(base + 52, 1, 3); // palliative
      const adl04 = randInt(base + 53, 2, 8); // no previous assessment
      const adl05 = randInt(base + 54, 1, 3); // other exclusion
      const adlDenom = Math.max(1, adlTotal - adl02 - adl03 - adl04 - adl05);
      const adlKpi = stableKpiData.find(k => k.indicatorCode === "ADL" && k.facilityId === facility.id && k.periodId === period.id);
      const adlDecline = adlKpi ? adlKpi.value : randInt(base + 55, 3, Math.floor(adlDenom * 0.2));
      result.push({
        indicatorCode: "ADL",
        facilityId: facility.id,
        periodId: period.id,
        fields: {
          "ADL-01": adlTotal, "ADL-02": adl02, "ADL-03": adl03,
          "ADL-04": adl04, "ADL-05": adl05, "ADL-06": adlDecline
        }
      });

      // --- IC (Incontinence Care / IAD) ---
      const icTotal = randInt(base + 60, 80, 120);
      const icContinent = Math.min(icTotal, randInt(base + 61, 30, Math.floor(icTotal * 0.65)));
      const icIad = Math.min(icContinent, randInt(base + 62, 2, Math.floor(icContinent * 0.2)));
      const icInfect = Math.min(icIad, randInt(base + 63, 0, Math.max(0, Math.floor(icIad * 0.3))));
      const icSevereNoInfect = Math.min(icIad - icInfect, randInt(base + 64, 0, Math.max(0, Math.floor((icIad - icInfect) * 0.4))));
      const icSevereInfect = Math.min(icInfect, randInt(base + 65, 0, Math.floor(icInfect * 0.5)));
      result.push({
        indicatorCode: "IC",
        facilityId: facility.id,
        periodId: period.id,
        fields: {
          "IAD-01": icTotal, "IAD-04": icContinent, "IAD-05": icIad,
          "IAD-07": icInfect, "IAD-08": icSevereNoInfect, "IAD-09": icSevereInfect
        }
      });

      // --- HP (Hospitalisation) ---
      const hpTotal = randInt(base + 70, 80, 120);
      const hpExcl = randInt(base + 71, 1, 5);
      const hpDenom = Math.max(1, hpTotal - hpExcl);
      const hpKpi = stableKpiData.find(k => k.indicatorCode === "HP" && k.facilityId === facility.id && k.periodId === period.id);
      const hpEdOrAdm = hpKpi ? hpKpi.value : randInt(base + 72, 3, Math.floor(hpDenom * 0.15));
      const hpEd = Math.min(hpEdOrAdm, randInt(base + 73, Math.floor(hpEdOrAdm * 0.4), hpEdOrAdm));
      result.push({
        indicatorCode: "HP",
        facilityId: facility.id,
        periodId: period.id,
        fields: {
          "HP-01": hpTotal, "HP-02": hpExcl, "HP-03": hpEd, "HP-04": hpEdOrAdm
        }
      });

      // --- WF (Workforce) ---
      const wfRN = randInt(base + 80, 8, 20);
      const wfEN = randInt(base + 81, 4, 12);
      const wfPCW = randInt(base + 82, 20, 45);
      const wfOther = randInt(base + 83, 5, 15);
      const wfRNFte = randInt(base + 84, 5, wfRN);
      const wfENFte = randInt(base + 85, 3, wfEN);
      const wfPCWFte = randInt(base + 86, 15, wfPCW);
      const wfOtherFte = randInt(base + 87, 3, wfOther);
      const wfRNCont = randInt(base + 88, Math.floor(wfRNFte * 0.5), wfRNFte);
      const wfENCont = randInt(base + 89, Math.floor(wfENFte * 0.5), wfENFte);
      const wfPCWCont = randInt(base + 90, Math.floor(wfPCWFte * 0.5), wfPCWFte);
      const wfOtherCont = randInt(base + 91, Math.floor(wfOtherFte * 0.5), wfOtherFte);
      result.push({
        indicatorCode: "WF",
        facilityId: facility.id,
        periodId: period.id,
        fields: {
          "WF-01": wfRN, "WF-02": wfEN, "WF-03": wfPCW, "WF-04": wfOther,
          "WF-05": wfRNFte, "WF-06": wfENFte, "WF-07": wfPCWFte, "WF-08": wfOtherFte,
          "WF-09": wfRNCont, "WF-10": wfENCont, "WF-11": wfPCWCont, "WF-12": wfOtherCont
        }
      });

      void periodIdx; void facIdx;
    });
  });

  return result;
};

const stableDetailData = generateIndicatorDetailData();

export const getIndicatorDetailData = (
  indicatorCode: IndicatorCode,
  facilityId: string,
  periodId: string
): IndicatorDetailData | null => {
  if (facilityId === "all") {
    const records = stableDetailData.filter(
      d => d.indicatorCode === indicatorCode && d.periodId === periodId
    );
    if (records.length === 0) return null;
    const aggregated: Record<string, number> = {};
    records.forEach(record => {
      Object.entries(record.fields).forEach(([key, val]) => {
        aggregated[key] = (aggregated[key] ?? 0) + val;
      });
    });
    return { indicatorCode, facilityId: "all", periodId, fields: aggregated };
  }
  return stableDetailData.find(
    d => d.indicatorCode === indicatorCode && d.facilityId === facilityId && d.periodId === periodId
  ) ?? null;
};
