// B2G QI Questionnaire Service - Simulates Questionnaire discovery endpoints
import { B2GQuestionnaire } from "../types";

const QUESTIONNAIRE_LIST_ENDPOINT = "https://api.health.gov.au/quality-indicators/v2/Questionnaire";
const QUESTIONNAIRE_GET_ENDPOINT = "https://api.health.gov.au/quality-indicators/v2/Questionnaire";

// The Questionnaire ID is static across reporting periods
const QI_QUESTIONNAIRE_ID = "QI-020";

const mockQuestionnaires: B2GQuestionnaire[] = [
  {
    id: QI_QUESTIONNAIRE_ID,
    name: "National Aged Care Mandatory Quality Indicator Program Questionnaire",
    version: "3.0",
    status: "active",
    date: "2024-01-01",
  },
];

export const qiQuestionnaireService = {
  /**
   * Simulates GET https://api.health.gov.au/quality-indicators/v2/Questionnaire
   * Returns list of available QI Questionnaires
   */
  async listQuestionnaires(): Promise<{
    success: boolean;
    data?: B2GQuestionnaire[];
    error?: string;
    endpoint: string;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    console.log(`[B2G QI] GET ${QUESTIONNAIRE_LIST_ENDPOINT}`);

    return {
      success: true,
      data: mockQuestionnaires,
      endpoint: QUESTIONNAIRE_LIST_ENDPOINT,
    };
  },

  /**
   * Simulates GET https://api.health.gov.au/quality-indicators/v2/Questionnaire/{questionnaireId}
   * Returns the full Questionnaire definition
   */
  async getQuestionnaire(questionnaireId: string): Promise<{
    success: boolean;
    data?: B2GQuestionnaire;
    error?: string;
    endpoint: string;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const endpoint = `${QUESTIONNAIRE_GET_ENDPOINT}/${questionnaireId}`;
    console.log(`[B2G QI] GET ${endpoint}`);

    const questionnaire = mockQuestionnaires.find((q) => q.id === questionnaireId);

    if (!questionnaire) {
      return {
        success: false,
        error: `Questionnaire ${questionnaireId} not found`,
        endpoint,
      };
    }

    return {
      success: true,
      data: questionnaire,
      endpoint,
    };
  },

  /**
   * Get the static QI Questionnaire ID
   */
  getQuestionnaireId(): string {
    return QI_QUESTIONNAIRE_ID;
  },

  /**
   * Get endpoints for display
   */
  getEndpoints() {
    return {
      list: QUESTIONNAIRE_LIST_ENDPOINT,
      get: (id: string) => `${QUESTIONNAIRE_GET_ENDPOINT}/${id}`,
    };
  },
};
