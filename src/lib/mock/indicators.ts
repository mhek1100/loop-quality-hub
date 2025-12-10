import { QI_QUESTIONNAIRE, getSectionByCode } from "../questionnaire/definitions";
import { SectionCode, QuestionDefinition, ResponseType } from "../types/questionnaire";

// Legacy indicator code type for backward compatibility
export type IndicatorCode = SectionCode;

export interface IndicatorDefinition {
  code: IndicatorCode;
  name: string;
  shortName: string;
  category: "Clinical" | "Experience" | "Workforce";
  description: string;
}

// Build INDICATORS from QI_QUESTIONNAIRE for backward compatibility
export const INDICATORS: IndicatorDefinition[] = QI_QUESTIONNAIRE.sections.map(section => ({
  code: section.code,
  name: section.text,
  shortName: section.text.length > 20 ? section.text.substring(0, 17) + "..." : section.text,
  category: section.category,
  description: section.description
}));

export const getIndicatorByCode = (code: IndicatorCode): IndicatorDefinition | undefined => {
  return INDICATORS.find(i => i.code === code);
};

export const getIndicatorCategory = (code: IndicatorCode): string => {
  const indicator = INDICATORS.find(i => i.code === code);
  return indicator?.category || "Clinical";
};

// Legacy QuestionAnswer interface for backward compatibility with existing code
export interface LegacyQuestionAnswer {
  linkId: string;
  promptText: string;
  responseType: ResponseType;
  required: boolean;
  groupId: string;
  groupName: string;
}

// Build INDICATOR_QUESTIONS from QI_QUESTIONNAIRE for backward compatibility
export const INDICATOR_QUESTIONS: Record<IndicatorCode, LegacyQuestionAnswer[]> = {} as Record<IndicatorCode, LegacyQuestionAnswer[]>;

for (const section of QI_QUESTIONNAIRE.sections) {
  const questions: LegacyQuestionAnswer[] = [];
  for (const subSection of section.subSections) {
    for (const question of subSection.questions) {
      questions.push({
        linkId: question.linkId,
        promptText: question.text,
        responseType: question.responseType,
        required: question.required,
        groupId: subSection.linkId,
        groupName: subSection.text
      });
    }
  }
  INDICATOR_QUESTIONS[section.code] = questions;
}

// Helper to get questions for a specific section
export const getQuestionsForIndicator = (code: IndicatorCode): LegacyQuestionAnswer[] => {
  return INDICATOR_QUESTIONS[code] || [];
};

// Helper to get all subsections for an indicator
export const getSubSectionsForIndicator = (code: IndicatorCode) => {
  const section = getSectionByCode(code);
  if (!section) return [];
  return section.subSections;
};

// Helper to check if higher values are "better" for a given indicator (for KPI coloring)
export const isHigherBetter = (code: IndicatorCode): boolean => {
  // These indicators are "bad" when higher - lower is better
  const lowerIsBetter: IndicatorCode[] = ["PI", "RP", "UPWL", "FALL", "MM", "IC", "HP"];
  return !lowerIsBetter.includes(code);
};
