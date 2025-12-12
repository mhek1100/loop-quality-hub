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
  KpiData
} from "../types";
import { INDICATORS, INDICATOR_QUESTIONS, getIndicatorCategory } from "./indicators";

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
    id: "user-001",
    name: "Admin Alice",
    email: "alice.admin@loop.health",
    federatedId: "alice.admin@digitalid.gov.au",
    roleIds: ["role-sys-admin"],
    isActive: true
  },
  {
    id: "user-002",
    name: "Dana",
    email: "dana@loop.health",
    federatedId: "dana@digitalid.gov.au",
    roleIds: ["role-data-admin"],
    isActive: true
  },
  {
    id: "user-003",
    name: "Chris",
    email: "chris@loop.health",
    roleIds: ["role-data-entry"],
    isActive: true
  },
  {
    id: "user-004",
    name: "Riley",
    email: "riley@loop.health",
    federatedId: "riley@digitalid.gov.au",
    roleIds: ["role-reviewer"],
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
    roleIds: ["role-compliance"],
    isActive: true
  },
  {
    id: "user-007",
    name: "Eva",
    email: "eva@loop.health",
    roleIds: ["role-executive"],
    isActive: true
  }
];

// Current user (simulated logged in user)
export const currentUser = users[4]; // Morgan - QI Submitter

// Demo Scenario Types for documentation
export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  submissionId: string;
  workflowSteps: string[];
  expectedBehavior: string;
}

// Demo scenarios for testing and showcasing
export const demoScenarios: DemoScenario[] = [
  {
    id: "scenario-happy-path",
    name: "Happy Path - Clean Submission",
    description: "Complete submission workflow with no errors or warnings. All data is valid.",
    submissionId: "sub-003",
    workflowSteps: [
      "1. Open workflow from Submissions page",
      "2. Review pre-filled data in Data Entry",
      "3. Preview the QuestionnaireResponse",
      "4. Submit In-Progress - receives QR ID",
      "5. Final Submission - status changes to 'completed'"
    ],
    expectedBehavior: "All steps complete successfully, green checkmarks throughout."
  },
  {
    id: "scenario-govt-validation-errors",
    name: "Government Validation Errors",
    description: "Submission has data issues that Government API rejects. Shows error mapping back to questions.",
    submissionId: "sub-007",
    workflowSteps: [
      "1. Open workflow - see validation errors in Data Entry",
      "2. Attempt to proceed - blocked due to errors",
      "3. Fix PI-01 (Total residents) - was 0, change to valid number",
      "4. Submit In-Progress - Government returns additional error on PI-02",
      "5. Workflow reverts to Data Entry with mapped errors",
      "6. Fix PI-02 and re-submit"
    ],
    expectedBehavior: "Shows error blocking, government validation response, error mapping."
  },
  {
    id: "scenario-warnings-only",
    name: "Warnings Only - Can Proceed",
    description: "Submission has warnings but no blocking errors. User can acknowledge and proceed.",
    submissionId: "sub-001",
    workflowSteps: [
      "1. Open workflow - see warning indicators",
      "2. Preview shows warnings in yellow",
      "3. Submit In-Progress - succeeds with warnings",
      "4. Final Submission - user acknowledges warnings"
    ],
    expectedBehavior: "Warnings displayed but don't block progression. Yellow indicators shown."
  },
  {
    id: "scenario-empty-questionnaire",
    name: "Fresh Start - Empty Questionnaire",
    description: "New submission with no data. Shows pre-fill functionality.",
    submissionId: "sub-008",
    workflowSteps: [
      "1. Open workflow - all fields empty",
      "2. Click 'Pre-fill Entire Questionnaire'",
      "3. Data populates from CIS pipeline",
      "4. Make manual edits - shows 'Manually Edited' badge",
      "5. Proceed through workflow"
    ],
    expectedBehavior: "Demonstrates pre-fill, manual editing, and data source tracking."
  },
  {
    id: "scenario-post-in-progress-rejected",
    name: "Government Rejection on POST",
    description: "Step 3 POST is rejected by Government with validation errors.",
    submissionId: "sub-009",
    workflowSteps: [
      "1. Complete Data Entry with some borderline values",
      "2. Preview looks okay locally",
      "3. Submit In-Progress - Government API returns 422",
      "4. Errors displayed in modal",
      "5. Workflow reverts to Data Entry with Government errors mapped",
      "6. Fix issues and re-attempt"
    ],
    expectedBehavior: "Shows POST rejection handling and error recovery flow."
  },
  {
    id: "scenario-late-amendment",
    name: "Late Amendment After Submission",
    description: "Previously submitted data needs correction after due date.",
    submissionId: "sub-010",
    workflowSteps: [
      "1. Open already-submitted workflow",
      "2. Make corrections to submitted data",
      "3. Submit as 'amended'",
      "4. Status shows 'Submitted - Updated after Due Date'"
    ],
    expectedBehavior: "Shows amendment workflow for previously completed submissions."
  }
];

// Helper to generate mock question data with configurable scenarios
type ValidationScenario = "clean" | "errors" | "warnings" | "govt-errors" | "empty";

const generateQuestionAnswers = (
  indicatorCode: IndicatorCode, 
  scenario: ValidationScenario = "clean"
): QuestionAnswer[] => {
  const questions = INDICATOR_QUESTIONS[indicatorCode];
  
  return questions.map((q, idx) => {
    // Base auto values
    let autoValue: string | number | boolean | null = 
      q.responseType === "integer" ? Math.floor(Math.random() * 50) + 10 : 
      q.responseType === "boolean" ? Math.random() > 0.3 :
      q.responseType === "date" ? "2025-01-01" :
      q.responseType === "string" ? (q.linkId.includes("Comment") ? "" : "Sample response") : "";
    
    const isOverridden = scenario !== "empty" && Math.random() > 0.7;
    let userValue: string | number | boolean | null = isOverridden 
      ? (q.responseType === "integer" ? Math.floor(Math.random() * 50) + 10 : autoValue) 
      : null;
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Apply scenario-specific validation
    switch (scenario) {
      case "errors":
        // Add errors to first required field
        if (idx === 0 && q.required) {
          autoValue = 0;
          userValue = null;
          errors.push("Value cannot be zero for required field");
        }
        if (indicatorCode === "PI" && q.linkId === "PI-02") {
          errors.push("Stage 2+ count exceeds total count - please verify");
        }
        break;
        
      case "warnings":
        if (q.linkId === "UPWL-04" || q.linkId === "FALL-03") {
          warnings.push("Value is higher than industry average - please confirm");
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
        if (indicatorCode === "RP" && q.linkId === "RP-02") {
          errors.push("[GOVT] Percentage cannot exceed 100%");
        }
        break;
        
      case "empty":
        autoValue = null;
        userValue = null;
        break;
        
      case "clean":
      default:
        // No issues
        break;
    }
    
    return {
      ...q,
      autoValue,
      userValue,
      finalValue: scenario === "empty" ? null : (userValue ?? autoValue),
      isOverridden,
      warnings,
      errors
    };
  });
};

// Generate questionnaire responses for a submission with scenario
const generateQuestionnaireResponses = (
  submissionId: string, 
  scenario: ValidationScenario = "clean"
): QuestionnaireResponse[] => {
  return INDICATORS.map((indicator, idx) => {
    // Apply different scenarios to different indicators for variety
    let indicatorScenario = scenario;
    if (scenario === "warnings" && idx > 2) indicatorScenario = "clean";
    if (scenario === "errors" && idx > 1) indicatorScenario = "clean";
    
    const questions = generateQuestionAnswers(indicator.code, indicatorScenario);
    const hasErrors = questions.some(q => q.errors.length > 0);
    const hasWarnings = questions.some(q => q.warnings.length > 0);
    
    return {
      id: `qr-${submissionId}-${indicator.code}`,
      submissionId,
      indicatorCode: indicator.code,
      indicatorName: indicator.name,
      status: hasErrors ? "Draft" : hasWarnings ? "Ready for Review" : "Reviewed",
      source: Math.random() > 0.3 ? "CIS Pipeline" : "Mixed",
      prefillAvailable: Math.random() > 0.2,
      validationStatus: hasErrors ? "Errors" : hasWarnings ? "Warnings" : "OK",
      lastReviewedByUserId: hasErrors ? undefined : "user-004",
      lastReviewedAt: hasErrors ? undefined : new Date().toISOString(),
      questions,
      fhirRawJson: JSON.stringify({ resourceType: "QuestionnaireResponse", status: "in-progress" }),
      comments: ""
    };
  });
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
    createdByUserId: "user-002",
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
  
  // Scenario: Government Validation Errors - for demo
  {
    id: "sub-007",
    facilityId: "fac-001",
    reportingPeriodId: "rp-q2-2025",
    status: "In Progress",
    fhirStatus: "in-progress",
    createdAt: "2025-04-01T00:00:00Z",
    updatedAt: "2025-06-15T14:30:00Z",
    createdByUserId: "user-003",
    hasWarnings: false,
    hasErrors: true,
    submissionVersionNumber: 3,
    questionnaires: generateQuestionnaireResponses("sub-007", "govt-errors"),
    questionnaireResponseId: "QIQR-2025-Q2-RB007",
    questionnaireId: "QI-020",
    healthcareServiceReference: "HealthcareService/HS-001",
    apiWorkflowStep: "in-progress-posted"
  },
  
  // Scenario: Fresh Start - Empty Questionnaire
  {
    id: "sub-008",
    facilityId: "fac-002",
    reportingPeriodId: "rp-q2-2025",
    status: "Not Started",
    fhirStatus: "in-progress",
    createdAt: "2025-04-01T00:00:00Z",
    updatedAt: "2025-04-01T00:00:00Z",
    createdByUserId: "user-002",
    hasWarnings: false,
    hasErrors: false,
    submissionVersionNumber: 1,
    questionnaires: generateQuestionnaireResponses("sub-008", "empty"),
    questionnaireId: "QI-020",
    healthcareServiceReference: "HealthcareService/HS-002",
    apiWorkflowStep: "data-collection"
  },
  
  // Scenario: POST Rejection Demo
  {
    id: "sub-009",
    facilityId: "fac-003",
    reportingPeriodId: "rp-q2-2025",
    status: "In Progress",
    fhirStatus: "in-progress",
    createdAt: "2025-04-01T00:00:00Z",
    updatedAt: "2025-06-18T09:00:00Z",
    createdByUserId: "user-003",
    hasWarnings: true,
    hasErrors: true,
    submissionVersionNumber: 2,
    questionnaires: generateQuestionnaireResponses("sub-009", "errors"),
    questionnaireId: "QI-020",
    healthcareServiceReference: "HealthcareService/HS-003",
    apiWorkflowStep: "data-collection"
  },
  
  // Scenario: Late Amendment
  {
    id: "sub-010",
    facilityId: "fac-001",
    reportingPeriodId: "rp-q1-2025",
    status: "Submitted - Updated after Due Date",
    fhirStatus: "amended",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-05-15T08:00:00Z",
    createdByUserId: "user-003",
    submittedByUserId: "user-005",
    lastSubmittedDate: "2025-05-15T08:00:00Z",
    hasWarnings: false,
    hasErrors: false,
    submissionVersionNumber: 6,
    questionnaires: generateQuestionnaireResponses("sub-010", "clean"),
    questionnaireResponseId: "QIQR-2025-Q1-RB010",
    questionnaireId: "QI-020",
    healthcareServiceReference: "HealthcareService/HS-001",
    apiWorkflowStep: "submitted"
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
    userId: "user-004",
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
    userId: "user-002",
    actionType: "PIPELINE_SYNC",
    entityType: "PipelineConfig",
    entityId: "pipe-001",
    details: "CIS pipeline sync completed successfully. 847 records imported for all facilities."
  },
  {
    id: "audit-005",
    timestamp: "2025-10-01T08:00:00Z",
    userId: "user-002",
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

export const getDemoScenarios = (): DemoScenario[] => {
  return demoScenarios;
};
