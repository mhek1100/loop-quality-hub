// B2G API Types for QI submission workflow

export type TransportStatus = 
  | "Not Sent" 
  | "Draft Sent (in-progress)" 
  | "Submitted (completed)" 
  | "Amended";

export interface SubmissionApiCall {
  id: string;
  submissionId: string;
  timestamp: string;
  endpoint: string;
  method: "GET" | "POST" | "PATCH";
  requestSummary: string;
  responseSummary: string;
  statusCode: number;
  success: boolean;
  questionnaireResponseId?: string;
}

export interface ApiRequestPreview {
  method: string;
  endpoint: string;
  headers: Record<string, string>;
  body?: any;
}

export interface B2GOrganization {
  id: string;
  name: string;
  identifier: string;
}

export interface B2GProgramPaymentEntity {
  id: string;
  name: string;
  uri: string;
  organizationId: string;
}

export interface WorkflowStep {
  id: number;
  label: string;
  description: string;
  status: "completed" | "current" | "pending" | "disabled";
  action?: string;
}

// Extended submission fields for B2G workflow
export interface SubmissionExtension {
  questionnaireResponseId: string | null;
  questionnaireId: string | null;
  transportStatus: TransportStatus;
  programPaymentEntityRef: string | null;
  programPaymentEntityName: string | null;
  lastTransportActionAt: string | null;
  lastTransportActionByUserId: string | null;
  apiCalls: SubmissionApiCall[];
}
