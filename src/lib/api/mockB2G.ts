// Mock B2G API simulation
import { SubmissionApiCall, B2GOrganization, B2GProgramPaymentEntity } from "@/lib/types/api";

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Mock Organizations
export const mockOrganizations: B2GOrganization[] = [
  { id: "org-001", name: "Riverbend Healthcare Group", identifier: "ORG-RIVERBEND" },
  { id: "org-002", name: "Coastal Care Pty Ltd", identifier: "ORG-COASTAL" },
  { id: "org-003", name: "Harbour Healthcare Services", identifier: "ORG-HARBOUR" }
];

// Mock Program Payment Entities (HealthcareServices)
export const mockProgramPaymentEntities: B2GProgramPaymentEntity[] = [
  { id: "ppe-001", name: "Riverbend Aged Care - PPE", uri: "HealthcareService/HS-RIVERBEND-001", organizationId: "org-001" },
  { id: "ppe-002", name: "Coastal View Lodge - PPE", uri: "HealthcareService/HS-COASTAL-002", organizationId: "org-002" },
  { id: "ppe-003", name: "Harbour Heights Home - PPE", uri: "HealthcareService/HS-HARBOUR-003", organizationId: "org-003" }
];

// API Simulation Functions
export function simulateGetAccessToken(): { success: boolean; token: string; apiCall: SubmissionApiCall } {
  const apiCall: SubmissionApiCall = {
    id: generateId(),
    submissionId: "",
    timestamp: new Date().toISOString(),
    endpoint: "POST https://api.health.gov.au/authentication/v2/oauth2/AccessToken",
    method: "POST",
    requestSummary: "OAuth2 client credentials authentication",
    responseSummary: "Access token retrieved successfully",
    statusCode: 200,
    success: true
  };
  return { success: true, token: "mock-bearer-token-" + generateId(), apiCall };
}

export function simulateGetOrganizations(): { organizations: B2GOrganization[]; apiCall: SubmissionApiCall } {
  const apiCall: SubmissionApiCall = {
    id: generateId(),
    submissionId: "",
    timestamp: new Date().toISOString(),
    endpoint: "GET https://api.health.gov.au/Providers/v2/Organization",
    method: "GET",
    requestSummary: "Retrieve provider organizations",
    responseSummary: `Retrieved ${mockOrganizations.length} organizations`,
    statusCode: 200,
    success: true
  };
  return { organizations: mockOrganizations, apiCall };
}

export function simulateGetHealthcareServices(organizationId: string): { entities: B2GProgramPaymentEntity[]; apiCall: SubmissionApiCall } {
  const entities = mockProgramPaymentEntities.filter(p => p.organizationId === organizationId);
  const apiCall: SubmissionApiCall = {
    id: generateId(),
    submissionId: "",
    timestamp: new Date().toISOString(),
    endpoint: `GET https://api.health.gov.au/Providers/v2/HealthcareServices?organization=${organizationId}`,
    method: "GET",
    requestSummary: `Retrieve healthcare services for organization ${organizationId}`,
    responseSummary: `Retrieved ${entities.length} program payment entities`,
    statusCode: 200,
    success: true
  };
  return { entities, apiCall };
}

export function simulateGetQuestionnaires(): { questionnaireIds: string[]; apiCall: SubmissionApiCall } {
  const apiCall: SubmissionApiCall = {
    id: generateId(),
    submissionId: "",
    timestamp: new Date().toISOString(),
    endpoint: "GET https://api.health.gov.au/quality-indicators/v2/Questionnaire",
    method: "GET",
    requestSummary: "Retrieve available QI questionnaires",
    responseSummary: "Retrieved QI Questionnaire list (1 questionnaire)",
    statusCode: 200,
    success: true
  };
  return { questionnaireIds: ["qi-questionnaire-2025-v1"], apiCall };
}

export function simulateGetQuestionnaire(questionnaireId: string): { questionnaire: any; apiCall: SubmissionApiCall } {
  const apiCall: SubmissionApiCall = {
    id: generateId(),
    submissionId: "",
    timestamp: new Date().toISOString(),
    endpoint: `GET https://api.health.gov.au/quality-indicators/v2/Questionnaire/${questionnaireId}`,
    method: "GET",
    requestSummary: `Retrieve questionnaire ${questionnaireId}`,
    responseSummary: "Questionnaire structure retrieved successfully",
    statusCode: 200,
    success: true
  };
  return { 
    questionnaire: { 
      resourceType: "Questionnaire", 
      id: questionnaireId, 
      status: "active",
      title: "National Aged Care Mandatory Quality Indicator Program"
    }, 
    apiCall 
  };
}

export function simulatePostQuestionnaireResponse(
  submissionId: string, 
  payload: any
): { questionnaireResponseId: string; apiCall: SubmissionApiCall } {
  const questionnaireResponseId = `qr-${generateId()}`;
  const apiCall: SubmissionApiCall = {
    id: generateId(),
    submissionId,
    timestamp: new Date().toISOString(),
    endpoint: "POST https://api.health.gov.au/quality-indicators/v2/QuestionnaireResponse",
    method: "POST",
    requestSummary: `Create QuestionnaireResponse with status: ${payload.status}`,
    responseSummary: `QuestionnaireResponse created with ID: ${questionnaireResponseId}`,
    statusCode: 201,
    success: true,
    questionnaireResponseId
  };
  return { questionnaireResponseId, apiCall };
}

export function simulateGetQuestionnaireResponse(
  questionnaireResponseId: string
): { response: any; apiCall: SubmissionApiCall } {
  const apiCall: SubmissionApiCall = {
    id: generateId(),
    submissionId: "",
    timestamp: new Date().toISOString(),
    endpoint: `GET https://api.health.gov.au/quality-indicators/v2/QuestionnaireResponse/${questionnaireResponseId}`,
    method: "GET",
    requestSummary: `Retrieve QuestionnaireResponse ${questionnaireResponseId}`,
    responseSummary: "QuestionnaireResponse retrieved from Government system",
    statusCode: 200,
    success: true,
    questionnaireResponseId
  };
  return { 
    response: { 
      resourceType: "QuestionnaireResponse", 
      id: questionnaireResponseId, 
      status: "in-progress" 
    }, 
    apiCall 
  };
}

export function simulatePatchQuestionnaireResponse(
  submissionId: string,
  questionnaireResponseId: string, 
  newStatus: "completed" | "amended"
): { success: boolean; apiCall: SubmissionApiCall } {
  const apiCall: SubmissionApiCall = {
    id: generateId(),
    submissionId,
    timestamp: new Date().toISOString(),
    endpoint: `PATCH https://api.health.gov.au/quality-indicators/v2/QuestionnaireResponse/${questionnaireResponseId}`,
    method: "PATCH",
    requestSummary: `Update QuestionnaireResponse status to: ${newStatus}`,
    responseSummary: `QuestionnaireResponse ${questionnaireResponseId} updated to status: ${newStatus}`,
    statusCode: 200,
    success: true,
    questionnaireResponseId
  };
  return { success: true, apiCall };
}

export function getTransportStatusFromFhir(fhirStatus: string | null, questionnaireResponseId: string | null): string {
  if (!questionnaireResponseId) return "Not Sent";
  switch (fhirStatus) {
    case "in-progress": return "Draft Sent (in-progress)";
    case "completed": return "Submitted (completed)";
    case "amended": return "Amended";
    default: return "Not Sent";
  }
}
