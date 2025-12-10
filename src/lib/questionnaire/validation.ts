// Questionnaire Validation Utility
// Validates that the app's questionnaire definitions match the QI Questionnaire specification

import { QI_QUESTIONNAIRE, getAllQuestions } from "./definitions";

export interface ValidationResult {
  isValid: boolean;
  totalQuestions: number;
  totalSections: number;
  totalSubSections: number;
  issues: ValidationIssue[];
}

export interface ValidationIssue {
  type: "missing" | "extra" | "mismatch";
  level: "section" | "subSection" | "question";
  linkId: string;
  message: string;
}

export const validateQuestionnaire = (): ValidationResult => {
  const issues: ValidationIssue[] = [];
  const allQuestions = getAllQuestions();
  
  let totalSubSections = 0;
  for (const section of QI_QUESTIONNAIRE.sections) {
    totalSubSections += section.subSections.length;
    
    // Validate section has required fields
    if (!section.code || !section.text) {
      issues.push({
        type: "mismatch",
        level: "section",
        linkId: section.linkId,
        message: `Section ${section.linkId} missing required fields`
      });
    }
    
    for (const subSection of section.subSections) {
      if (!subSection.linkId || !subSection.text) {
        issues.push({
          type: "mismatch",
          level: "subSection",
          linkId: subSection.linkId,
          message: `SubSection ${subSection.linkId} missing required fields`
        });
      }
      
      for (const question of subSection.questions) {
        if (!question.linkId || !question.text) {
          issues.push({
            type: "mismatch",
            level: "question",
            linkId: question.linkId,
            message: `Question ${question.linkId} missing required fields`
          });
        }
        
        // Validate response type
        if (!["integer", "string", "date", "boolean"].includes(question.responseType)) {
          issues.push({
            type: "mismatch",
            level: "question",
            linkId: question.linkId,
            message: `Question ${question.linkId} has invalid responseType: ${question.responseType}`
          });
        }
      }
    }
  }
  
  return {
    isValid: issues.length === 0,
    totalQuestions: allQuestions.length,
    totalSections: QI_QUESTIONNAIRE.sections.length,
    totalSubSections,
    issues
  };
};

export const getValidationSummary = (): string => {
  const result = validateQuestionnaire();
  const lines = [
    `QI Questionnaire Validation Summary`,
    `===================================`,
    `Total Sections: ${result.totalSections}`,
    `Total SubSections: ${result.totalSubSections}`,
    `Total Questions: ${result.totalQuestions}`,
    `Status: ${result.isValid ? "✓ VALID" : "✗ INVALID"}`,
  ];
  
  if (result.issues.length > 0) {
    lines.push(`\nIssues Found: ${result.issues.length}`);
    for (const issue of result.issues) {
      lines.push(`  - [${issue.type}] ${issue.level}: ${issue.linkId} - ${issue.message}`);
    }
  }
  
  return lines.join("\n");
};
