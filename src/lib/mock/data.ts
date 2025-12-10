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
    questionnaires: generateQuestionnaireResponses("sub-001", true)
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
    questionnaires: generateQuestionnaireResponses("sub-002", false)
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
    questionnaires: generateQuestionnaireResponses("sub-003", false)
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
    questionnaires: generateQuestionnaireResponses("sub-004", false)
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
    questionnaires: generateQuestionnaireResponses("sub-005", false)
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
    questionnaires: generateQuestionnaireResponses("sub-006", false)
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

// KPI Data - Mock aggregated data for dashboard
export const generateKpiData = (indicatorCode: IndicatorCode, facilityId: string): KpiData => {
  const baseValue = Math.random() * 50 + 10;
  const previousValue = baseValue * (0.9 + Math.random() * 0.2);
  const delta = baseValue - previousValue;
  const deltaPercent = (delta / previousValue) * 100;
  
  // Generate trend data for past 8 quarters
  const trend: number[] = [];
  const trendPeriods: string[] = [];
  let trendValue = baseValue * 0.7;
  
  const quarters = ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024", "Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025"];
  quarters.forEach(q => {
    trendValue = trendValue * (0.95 + Math.random() * 0.15);
    trend.push(Number(trendValue.toFixed(1)));
    trendPeriods.push(q);
  });
  
  return {
    indicatorCode,
    facilityId,
    periodId: "rp-q2-2025",
    value: Number(baseValue.toFixed(1)),
    previousValue: Number(previousValue.toFixed(1)),
    delta: Number(delta.toFixed(1)),
    deltaPercent: Number(deltaPercent.toFixed(1)),
    trend,
    trendPeriods,
    unit: indicatorCode === "WF" ? "%" : "per 1,000 bed days",
    isComplete: Math.random() > 0.2
  };
};

// Get all KPI data for dashboard
export const getAllKpiData = (): KpiData[] => {
  const kpiData: KpiData[] = [];
  
  facilities.forEach(facility => {
    INDICATORS.forEach(indicator => {
      kpiData.push(generateKpiData(indicator.code, facility.id));
    });
  });
  
  return kpiData;
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
