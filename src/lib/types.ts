// Domain Models for NQIP Submissions

export interface Facility {
  id: string;
  name: string;
  providerName: string;
  address: string;
  serviceId: string;
  abn: string;
  gpmsProviderId: string;
  cisSystemName: string;
}

export interface ReportingPeriod {
  id: string;
  quarter: string;
  startDate: string;
  endDate: string;
  dueDate: string;
  status: ReportingPeriodStatus;
}

export type ReportingPeriodStatus = 
  | "Not Started"
  | "In Progress"
  | "Submitted"
  | "Late Submission"
  | "Submitted - Updated after Due Date"
  | "Not Submitted";

export interface Submission {
  id: string;
  facilityId: string;
  reportingPeriodId: string;
  status: SubmissionStatus;
  fhirStatus: FhirStatus;
  createdAt: string;
  updatedAt: string;
  createdByUserId: string;
  submittedByUserId?: string;
  lastSubmittedDate?: string;
  hasWarnings: boolean;
  hasErrors: boolean;
  submissionVersionNumber: number;
  questionnaires: QuestionnaireResponse[];
}

export type SubmissionStatus = 
  | "Not Started"
  | "In Progress"
  | "Submitted"
  | "Late Submission"
  | "Submitted - Updated after Due Date"
  | "Not Submitted";

export type FhirStatus = "in-progress" | "completed" | "amended" | "entered-in-error";

export interface QuestionnaireResponse {
  id: string;
  submissionId: string;
  indicatorCode: IndicatorCode;
  indicatorName: string;
  status: QuestionnaireStatus;
  source: DataSource;
  prefillAvailable: boolean;
  validationStatus: ValidationStatus;
  lastReviewedByUserId?: string;
  lastReviewedAt?: string;
  questions: QuestionAnswer[];
  fhirRawJson: string;
  comments: string;
}

export type IndicatorCode = 
  | "PI" // Pressure injuries
  | "RP" // Restrictive practices
  | "UPWL" // Unplanned weight loss
  | "FALL" // Falls and major injury
  | "MM" // Medication management
  | "ADL" // Activities of daily living
  | "IC" // Incontinence care
  | "HP" // Hospitalisation
  | "WF" // Workforce
  | "CE" // Consumer experience
  | "QOL" // Quality of life
  | "AH" // Allied health
  | "EN" // Enrolled nursing
  | "LO"; // Lifestyle officers

export type QuestionnaireStatus = 
  | "Not Started"
  | "Draft"
  | "Ready for Review"
  | "Reviewed"
  | "Submitted";

export type DataSource = "CIS Pipeline" | "Manual Only" | "Mixed";

export type ValidationStatus = "OK" | "Warnings" | "Errors";

export interface QuestionAnswer {
  linkId: string;
  promptText: string;
  responseType: ResponseType;
  required: boolean;
  autoValue: string | number | boolean | null;
  userValue: string | number | boolean | null;
  finalValue: string | number | boolean | null;
  isOverridden: boolean;
  warnings: string[];
  errors: string[];
  groupId?: string;
  groupName?: string;
}

export type ResponseType = "integer" | "string" | "date" | "boolean" | "choice";

export interface User {
  id: string;
  name: string;
  email: string;
  roleIds: string[];
  isActive: boolean;
  avatar?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export type Permission = 
  | "CONFIGURE_PIPELINE"
  | "VIEW_SUBMISSIONS"
  | "EDIT_QUESTIONNAIRE"
  | "REVIEW_SUBMISSION"
  | "FINAL_SUBMIT_GOVERNMENT"
  | "VIEW_AUDIT_LOGS"
  | "MANAGE_USERS";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  actionType: AuditActionType;
  entityType: EntityType;
  entityId: string;
  details: string;
}

export type AuditActionType = 
  | "QUESTION_EDITED"
  | "SUBMISSION_STATUS_CHANGED"
  | "PREFILL_APPLIED"
  | "SUBMISSION_SENT_TO_GOV"
  | "QUESTIONNAIRE_REVIEWED"
  | "USER_CREATED"
  | "USER_UPDATED"
  | "PIPELINE_CONFIGURED"
  | "PIPELINE_SYNC";

export type EntityType = "Submission" | "Questionnaire" | "Question" | "PipelineConfig" | "User";

export interface IndicatorDefinition {
  code: IndicatorCode;
  name: string;
  shortName: string;
  category: IndicatorCategory;
  description: string;
}

export type IndicatorCategory = "Clinical" | "Experience" | "Workforce";

export interface KpiData {
  indicatorCode: IndicatorCode;
  facilityId: string;
  periodId: string;
  value: number;
  previousValue: number;
  delta: number;
  deltaPercent: number;
  trend: number[];
  trendPeriods: string[];
  unit: string;
  isComplete: boolean;
}

export interface PipelineConfig {
  id: string;
  facilityId: string;
  cisBaseUrl: string;
  apiKeyMasked: string;
  lastSyncDate?: string;
  status: PipelineStatus;
  facilityMappings: FacilityMapping[];
}

export type PipelineStatus = "Connected" | "Disconnected" | "Error";

export interface FacilityMapping {
  internalFacilityId: string;
  cisIdentifier: string;
}

export interface SyncJob {
  id: string;
  facilityId: string;
  timestamp: string;
  status: SyncJobStatus;
  recordsImported: number;
  errors: string[];
  warnings: string[];
}

export type SyncJobStatus = "Success" | "Failed" | "Partial";
