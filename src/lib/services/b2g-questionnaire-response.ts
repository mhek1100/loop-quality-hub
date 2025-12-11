// B2G QI QuestionnaireResponse Service - Core submission workflow
import { FhirStatus, OperationOutcome, Submission, User, ApiActivityLogEntry } from "../types";

const QR_ENDPOINT = "https://api.health.gov.au/quality-indicators/v2/QuestionnaireResponse";

// In-memory store for QuestionnaireResponses
const storedResponses: Map<string, any> = new Map();

// Activity log
let apiActivityLog: ApiActivityLogEntry[] = [];

function generateQuestionnaireResponseId(): string {
  return `QIQR-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

function generateMockValidation(submission: Submission): OperationOutcome[] {
  const outcomes: OperationOutcome[] = [];
  
  // Check for existing warnings/errors in questionnaires
  submission.questionnaires.forEach((q) => {
    q.questions.forEach((question) => {
      question.errors.forEach((err) => {
        outcomes.push({
          severity: "error",
          code: "required",
          diagnostics: err,
          indicatorCode: q.indicatorCode,
          questionLinkId: question.linkId,
          location: `${q.indicatorCode}/${question.linkId}`,
        });
      });
      question.warnings.forEach((warn) => {
        outcomes.push({
          severity: "warning",
          code: "informational",
          diagnostics: warn,
          indicatorCode: q.indicatorCode,
          questionLinkId: question.linkId,
          location: `${q.indicatorCode}/${question.linkId}`,
        });
      });
    });
  });

  return outcomes;
}

function logApiActivity(
  entry: Omit<ApiActivityLogEntry, "id" | "timestamp">
): ApiActivityLogEntry {
  const logEntry: ApiActivityLogEntry = {
    id: `api-log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };
  apiActivityLog.unshift(logEntry);
  return logEntry;
}

export const qiQuestionnaireResponseService = {
  /**
   * Simulates POST https://api.health.gov.au/quality-indicators/v2/QuestionnaireResponse
   * Creates a new QuestionnaireResponse with status = "in-progress"
   */
  async createQuestionnaireResponse(
    submission: Submission,
    user: User,
    headers?: Record<string, string>
  ): Promise<{
    success: boolean;
    questionnaireResponseId?: string;
    httpStatus: number;
    outcomes?: OperationOutcome[];
    error?: string;
    endpoint: string;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const questionnaireResponseId = generateQuestionnaireResponseId();
    const outcomes = generateMockValidation(submission);
    const hasErrors = outcomes.some((o) => o.severity === "error");

    // Store the response
    const storedPayload = {
      id: questionnaireResponseId,
      status: "in-progress" as FhirStatus,
      questionnaire: submission.questionnaireId,
      subject: submission.healthcareServiceReference,
      authored: new Date().toISOString(),
      submission: { ...submission },
    };
    storedResponses.set(questionnaireResponseId, storedPayload);

    // Log the activity
    logApiActivity({
      method: "POST",
      url: QR_ENDPOINT,
      questionnaireResponseId,
      httpStatus: hasErrors ? 422 : 201,
      warningsCount: outcomes.filter((o) => o.severity === "warning").length,
      errorsCount: outcomes.filter((o) => o.severity === "error").length,
      performedByUserId: user.id,
      performedByEmail: user.email,
      requestHeaders: headers,
    });

    console.log(`[B2G QR] POST ${QR_ENDPOINT} - Created ${questionnaireResponseId}`);

    return {
      success: !hasErrors,
      questionnaireResponseId,
      httpStatus: hasErrors ? 422 : 201,
      outcomes,
      endpoint: QR_ENDPOINT,
    };
  },

  /**
   * Simulates GET https://api.health.gov.au/quality-indicators/v2/QuestionnaireResponse/{id}
   * Fetches the stored QuestionnaireResponse for review
   */
  async getQuestionnaireResponse(
    questionnaireResponseId: string,
    user: User
  ): Promise<{
    success: boolean;
    data?: any;
    fhirStatus?: FhirStatus;
    httpStatus: number;
    outcomes?: OperationOutcome[];
    error?: string;
    endpoint: string;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const endpoint = `${QR_ENDPOINT}/${questionnaireResponseId}`;
    const stored = storedResponses.get(questionnaireResponseId);

    if (!stored) {
      logApiActivity({
        method: "GET",
        url: endpoint,
        questionnaireResponseId,
        httpStatus: 404,
        warningsCount: 0,
        errorsCount: 1,
        performedByUserId: user.id,
        performedByEmail: user.email,
      });

      return {
        success: false,
        httpStatus: 404,
        error: `QuestionnaireResponse ${questionnaireResponseId} not found`,
        endpoint,
      };
    }

    const outcomes = generateMockValidation(stored.submission);

    logApiActivity({
      method: "GET",
      url: endpoint,
      questionnaireResponseId,
      httpStatus: 200,
      warningsCount: outcomes.filter((o) => o.severity === "warning").length,
      errorsCount: outcomes.filter((o) => o.severity === "error").length,
      performedByUserId: user.id,
      performedByEmail: user.email,
    });

    console.log(`[B2G QR] GET ${endpoint}`);

    return {
      success: true,
      data: stored,
      fhirStatus: stored.status,
      httpStatus: 200,
      outcomes,
      endpoint,
    };
  },

  /**
   * Simulates PATCH https://api.health.gov.au/quality-indicators/v2/QuestionnaireResponse/{id}
   * Used for corrections and final submission (status = completed/amended)
   */
  async patchQuestionnaireResponse(
    questionnaireResponseId: string,
    patchData: { status: FhirStatus; submission?: Partial<Submission> },
    user: User,
    headers: Record<string, string>
  ): Promise<{
    success: boolean;
    httpStatus: number;
    outcomes?: OperationOutcome[];
    error?: string;
    endpoint: string;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const endpoint = `${QR_ENDPOINT}/${questionnaireResponseId}`;
    const stored = storedResponses.get(questionnaireResponseId);

    if (!stored) {
      logApiActivity({
        method: "PATCH",
        url: endpoint,
        questionnaireResponseId,
        httpStatus: 404,
        warningsCount: 0,
        errorsCount: 1,
        performedByUserId: user.id,
        performedByEmail: user.email,
        requestHeaders: headers,
      });

      return {
        success: false,
        httpStatus: 404,
        error: `QuestionnaireResponse ${questionnaireResponseId} not found`,
        endpoint,
      };
    }

    // Validate headers for final submission
    if (
      (patchData.status === "completed" || patchData.status === "amended") &&
      !headers["X-User-Email"] &&
      !headers["X-Federated-Id"]
    ) {
      return {
        success: false,
        httpStatus: 400,
        error: "Final submission requires X-User-Email or X-Federated-Id header",
        endpoint,
      };
    }

    // Update stored data
    stored.status = patchData.status;
    if (patchData.submission) {
      stored.submission = { ...stored.submission, ...patchData.submission };
    }
    stored.authored = new Date().toISOString();
    storedResponses.set(questionnaireResponseId, stored);

    const outcomes = generateMockValidation(stored.submission);
    const hasErrors = outcomes.some((o) => o.severity === "error");

    logApiActivity({
      method: "PATCH",
      url: endpoint,
      questionnaireResponseId,
      httpStatus: hasErrors ? 422 : 200,
      warningsCount: outcomes.filter((o) => o.severity === "warning").length,
      errorsCount: outcomes.filter((o) => o.severity === "error").length,
      performedByUserId: user.id,
      performedByEmail: user.email,
      requestHeaders: headers,
    });

    console.log(
      `[B2G QR] PATCH ${endpoint} - Status changed to ${patchData.status}`
    );

    return {
      success: !hasErrors,
      httpStatus: hasErrors ? 422 : 200,
      outcomes,
      endpoint,
    };
  },

  /**
   * Get API activity log
   */
  getApiActivityLog(): ApiActivityLogEntry[] {
    return [...apiActivityLog];
  },

  /**
   * Clear activity log (for testing)
   */
  clearActivityLog(): void {
    apiActivityLog = [];
  },

  /**
   * Get endpoint for display
   */
  getEndpoint(): string {
    return QR_ENDPOINT;
  },

  /**
   * Seed a QuestionnaireResponse for demo purposes
   */
  seedQuestionnaireResponse(
    questionnaireResponseId: string,
    status: FhirStatus,
    submission: Submission
  ): void {
    storedResponses.set(questionnaireResponseId, {
      id: questionnaireResponseId,
      status,
      questionnaire: submission.questionnaireId,
      subject: submission.healthcareServiceReference,
      authored: new Date().toISOString(),
      submission,
    });
  },
};
