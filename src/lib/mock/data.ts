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

// Reporting Periods
export const reportingPeriods: ReportingPeriod[] = [
  {
    id: "rp-q1-2025",
    quarter: "Q1 2025",
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    dueDate: "2025-04-21",
    status: "Submitted"
  },
  {
    id: "rp-q2-2025",
    quarter: "Q2 2025",
    startDate: "2025-04-01",
    endDate: "2025-06-30",
    dueDate: "2025-07-21",
    status: "In Progress"
  },
  {
    id: "rp-q3-2025",
    quarter: "Q3 2025",
    startDate: "2025-07-01",
    endDate: "2025-09-30",
    dueDate: "2025-10-21",
    status: "Not Started"
  },
  {
    id: "rp-q4-2025",
    quarter: "Q4 2025",
    startDate: "2025-10-01",
    endDate: "2025-12-31",
    dueDate: "2026-01-21",
    status: "Not Started"
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
    description: "Reviews submissions before final approval",
    permissions: ["VIEW_SUBMISSIONS", "EDIT_QUESTIONNAIRE", "REVIEW_SUBMISSION", "VIEW_AUDIT_LOGS"]
  },
  {
    id: "role-submitter",
    name: "QI Submitter",
    description: "Authorised to submit data to government",
    permissions: ["VIEW_SUBMISSIONS", "EDIT_QUESTIONNAIRE", "REVIEW_SUBMISSION", "FINAL_SUBMIT_GOVERNMENT", "VIEW_AUDIT_LOGS"]
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
    roleIds: ["role-sys-admin"],
    isActive: true
  },
  {
    id: "user-002",
    name: "Dana",
    email: "dana@loop.health",
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
    roleIds: ["role-reviewer"],
    isActive: true
  },
  {
    id: "user-005",
    name: "Morgan",
    email: "morgan@loop.health",
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

// Helper to generate mock question data
const generateQuestionAnswers = (indicatorCode: IndicatorCode, hasErrors = false, hasWarnings = false): QuestionAnswer[] => {
  const questions = INDICATOR_QUESTIONS[indicatorCode];
  return questions.map((q, idx) => {
    const autoValue = q.responseType === "integer" ? Math.floor(Math.random() * 100) : 
                      q.responseType === "boolean" ? Math.random() > 0.5 :
                      q.responseType === "date" ? "2025-01-01" :
                      q.responseType === "string" ? (q.linkId.includes("Comment") ? "" : "Sample response") : "";
    
    const isOverridden = Math.random() > 0.7;
    const userValue = isOverridden ? (q.responseType === "integer" ? Math.floor(Math.random() * 100) : autoValue) : null;
    
    // Special handling for UPWL comment logic
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (hasErrors && idx === 0 && q.required) {
      errors.push("This field is required");
    }
    
    if (hasWarnings && q.linkId === "UPWL-04") {
      // Only show warning if UPWL-06 is empty
      warnings.push("Comment required - Please provide additional context");
    }
    
    return {
      ...q,
      autoValue,
      userValue,
      finalValue: userValue ?? autoValue,
      isOverridden,
      warnings,
      errors
    };
  });
};

// Generate questionnaire responses for a submission
const generateQuestionnaireResponses = (submissionId: string, hasIssues = false): QuestionnaireResponse[] => {
  return INDICATORS.map((indicator, idx) => {
    const hasErrors = hasIssues && idx === 0;
    const hasWarnings = hasIssues && idx === 2;
    const questions = generateQuestionAnswers(indicator.code, hasErrors, hasWarnings);
    
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

// Submissions
export const submissions: Submission[] = [
  // Riverbend - Q2 2025 - In Progress with warnings
  {
    id: "sub-001",
    facilityId: "fac-001",
    reportingPeriodId: "rp-q2-2025",
    status: "In Progress",
    fhirStatus: "in-progress",
    createdAt: "2025-04-01T00:00:00Z",
    updatedAt: "2025-06-15T14:30:00Z",
    createdByUserId: "user-003",
    hasWarnings: true,
    hasErrors: false,
    submissionVersionNumber: 2,
    questionnaires: generateQuestionnaireResponses("sub-001", true),
    // B2G API workflow fields
    questionnaireResponseId: "qr-2025-sub001-draft",
    questionnaireId: "qi-questionnaire-2025-v1",
    transportStatus: "Draft Sent (in-progress)",
    programPaymentEntityRef: "HealthcareService/HS-RIVERBEND-001",
    programPaymentEntityName: "Riverbend Aged Care - PPE",
    lastTransportActionAt: "2025-06-15T14:00:00Z",
    lastTransportActionByUserId: "user-005"
  },
  // Coastal View - Q2 2025 - Not Started
  {
    id: "sub-002",
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
    questionnaires: generateQuestionnaireResponses("sub-002", false),
    // B2G API workflow fields - not yet sent
    questionnaireResponseId: null,
    questionnaireId: null,
    transportStatus: "Not Sent",
    programPaymentEntityRef: null,
    programPaymentEntityName: null,
    lastTransportActionAt: null,
    lastTransportActionByUserId: null
  },
  // Harbour Heights - Q2 2025 - Submitted
  {
    id: "sub-003",
    facilityId: "fac-003",
    reportingPeriodId: "rp-q2-2025",
    status: "Submitted",
    fhirStatus: "completed",
    createdAt: "2025-04-01T00:00:00Z",
    updatedAt: "2025-06-20T09:00:00Z",
    createdByUserId: "user-003",
    submittedByUserId: "user-005",
    lastSubmittedDate: "2025-06-20T09:00:00Z",
    hasWarnings: false,
    hasErrors: false,
    submissionVersionNumber: 3,
    questionnaires: generateQuestionnaireResponses("sub-003", false),
    // B2G API workflow fields
    questionnaireResponseId: "qr-2025-sub003-final",
    questionnaireId: "qi-questionnaire-2025-v1",
    transportStatus: "Submitted (completed)",
    programPaymentEntityRef: "HealthcareService/HS-HARBOUR-003",
    programPaymentEntityName: "Harbour Heights Home - PPE",
    lastTransportActionAt: "2025-06-20T09:00:00Z",
    lastTransportActionByUserId: "user-005"
  },
  // Riverbend - Q1 2025 - Submitted
  {
    id: "sub-004",
    facilityId: "fac-001",
    reportingPeriodId: "rp-q1-2025",
    status: "Submitted",
    fhirStatus: "completed",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-04-15T10:00:00Z",
    createdByUserId: "user-003",
    submittedByUserId: "user-005",
    lastSubmittedDate: "2025-04-15T10:00:00Z",
    hasWarnings: false,
    hasErrors: false,
    submissionVersionNumber: 4,
    questionnaires: generateQuestionnaireResponses("sub-004", false),
    // B2G API workflow fields
    questionnaireResponseId: "qr-2025-sub004-final",
    questionnaireId: "qi-questionnaire-2025-v1",
    transportStatus: "Submitted (completed)",
    programPaymentEntityRef: "HealthcareService/HS-RIVERBEND-001",
    programPaymentEntityName: "Riverbend Aged Care - PPE",
    lastTransportActionAt: "2025-04-15T10:00:00Z",
    lastTransportActionByUserId: "user-005"
  },
  // Coastal View - Q1 2025 - Late Submission
  {
    id: "sub-005",
    facilityId: "fac-002",
    reportingPeriodId: "rp-q1-2025",
    status: "Late Submission",
    fhirStatus: "completed",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-04-25T11:00:00Z",
    createdByUserId: "user-003",
    submittedByUserId: "user-005",
    lastSubmittedDate: "2025-04-25T11:00:00Z",
    hasWarnings: false,
    hasErrors: false,
    submissionVersionNumber: 2,
    questionnaires: generateQuestionnaireResponses("sub-005", false),
    // B2G API workflow fields
    questionnaireResponseId: "qr-2025-sub005-final",
    questionnaireId: "qi-questionnaire-2025-v1",
    transportStatus: "Submitted (completed)",
    programPaymentEntityRef: "HealthcareService/HS-COASTAL-002",
    programPaymentEntityName: "Coastal View Lodge - PPE",
    lastTransportActionAt: "2025-04-25T11:00:00Z",
    lastTransportActionByUserId: "user-005"
  },
  // Harbour Heights - Q1 2025 - Submitted - Updated after Due Date
  {
    id: "sub-006",
    facilityId: "fac-003",
    reportingPeriodId: "rp-q1-2025",
    status: "Submitted - Updated after Due Date",
    fhirStatus: "amended",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-05-01T08:00:00Z",
    createdByUserId: "user-003",
    submittedByUserId: "user-005",
    lastSubmittedDate: "2025-05-01T08:00:00Z",
    hasWarnings: false,
    hasErrors: false,
    submissionVersionNumber: 5,
    questionnaires: generateQuestionnaireResponses("sub-006", false),
    // B2G API workflow fields
    questionnaireResponseId: "qr-2025-sub006-amended",
    questionnaireId: "qi-questionnaire-2025-v1",
    transportStatus: "Amended",
    programPaymentEntityRef: "HealthcareService/HS-HARBOUR-003",
    programPaymentEntityName: "Harbour Heights Home - PPE",
    lastTransportActionAt: "2025-05-01T08:00:00Z",
    lastTransportActionByUserId: "user-005"
  }
];

// Audit Log Entries
export const auditLogs: AuditLogEntry[] = [
  {
    id: "audit-001",
    timestamp: "2025-06-20T09:00:00Z",
    userId: "user-005",
    actionType: "SUBMISSION_SENT_TO_GOV",
    entityType: "Submission",
    entityId: "sub-003",
    details: "Submitted Q2 2025 data for Harbour Heights Home to government with status 'completed'"
  },
  {
    id: "audit-002",
    timestamp: "2025-06-19T16:30:00Z",
    userId: "user-004",
    actionType: "QUESTIONNAIRE_REVIEWED",
    entityType: "Questionnaire",
    entityId: "qr-sub-003-PI",
    details: "Reviewed Pressure Injuries questionnaire for Harbour Heights Home Q2 2025"
  },
  {
    id: "audit-003",
    timestamp: "2025-06-15T14:30:00Z",
    userId: "user-003",
    actionType: "QUESTION_EDITED",
    entityType: "Question",
    entityId: "PI-04",
    details: "Changed PI-04 from 12 to 14 in Q2 2025 submission for Riverbend Aged Care"
  },
  {
    id: "audit-004",
    timestamp: "2025-06-10T10:00:00Z",
    userId: "user-002",
    actionType: "PIPELINE_SYNC",
    entityType: "PipelineConfig",
    entityId: "pipe-001",
    details: "CIS pipeline sync completed successfully. 847 records imported for all facilities."
  },
  {
    id: "audit-005",
    timestamp: "2025-06-01T08:00:00Z",
    userId: "user-002",
    actionType: "PREFILL_APPLIED",
    entityType: "Submission",
    entityId: "sub-001",
    details: "Applied CIS pipeline prefill data to Riverbend Aged Care Q2 2025 submission"
  },
  {
    id: "audit-006",
    timestamp: "2025-05-01T08:00:00Z",
    userId: "user-005",
    actionType: "SUBMISSION_STATUS_CHANGED",
    entityType: "Submission",
    entityId: "sub-006",
    details: "Updated Harbour Heights Home Q1 2025 submission after due date. Status changed to 'Submitted - Updated after Due Date'"
  },
  {
    id: "audit-007",
    timestamp: "2025-04-25T11:00:00Z",
    userId: "user-005",
    actionType: "SUBMISSION_SENT_TO_GOV",
    entityType: "Submission",
    entityId: "sub-005",
    details: "Late submission for Coastal View Lodge Q1 2025 submitted to government"
  }
];

// Pipeline Config
export const pipelineConfigs: PipelineConfig[] = [
  {
    id: "pipe-001",
    facilityId: "fac-001",
    cisBaseUrl: "https://api.telstrahealth.com/cis/v2",
    apiKeyMasked: "****-****-****-7890",
    lastSyncDate: "2025-06-10T10:00:00Z",
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
    lastSyncDate: "2025-06-10T10:00:00Z",
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
    lastSyncDate: "2025-06-09T22:00:00Z",
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
    timestamp: "2025-06-10T10:00:00Z",
    status: "Success",
    recordsImported: 312,
    errors: [],
    warnings: []
  },
  {
    id: "sync-002",
    facilityId: "fac-002",
    timestamp: "2025-06-10T10:00:00Z",
    status: "Success",
    recordsImported: 287,
    errors: [],
    warnings: []
  },
  {
    id: "sync-003",
    facilityId: "fac-003",
    timestamp: "2025-06-09T22:00:00Z",
    status: "Failed",
    recordsImported: 0,
    errors: ["Connection timeout after 30s", "Unable to authenticate with CIS endpoint"],
    warnings: []
  },
  {
    id: "sync-004",
    facilityId: "fac-001",
    timestamp: "2025-06-03T10:00:00Z",
    status: "Partial",
    recordsImported: 248,
    errors: [],
    warnings: ["64 records skipped due to validation errors"]
  }
];

// KPI Data - Pre-generated stable mock data for dashboard
// Using a seeded approach to ensure consistent values across renders
const generateStableKpiData = (): KpiData[] => {
  const kpiData: KpiData[] = [];
  
  // All quarters we want to generate data for
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
  
  // Historical data for each indicator across all 8 quarters
  // Format: [Q1-2024, Q2-2024, Q3-2024, Q4-2024, Q1-2025, Q2-2025, Q3-2025, Q4-2025]
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
  
  // Generate data for each period, facility, and indicator
  allPeriods.forEach((period, periodIndex) => {
    facilities.forEach(facility => {
      INDICATORS.forEach(indicator => {
        const facilityHistory = historicalData[indicator.code]?.[facility.id];
        const currentValue = facilityHistory?.[periodIndex] || 25;
        const prevValue = periodIndex > 0 ? (facilityHistory?.[periodIndex - 1] || currentValue * 0.95) : currentValue;
        const delta = currentValue - prevValue;
        const deltaPercent = prevValue !== 0 ? (delta / prevValue) * 100 : 0;
        
        // For trend, show all historical values up to current period
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

// Pre-generate the KPI data once
const stableKpiData = generateStableKpiData();

// Get all KPI data for dashboard (returns stable pre-generated data)
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
