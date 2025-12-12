import { Submission } from "@/lib/types";

export type SubmissionScenario = 
  | "first-submission" 
  | "re-submit" 
  | "late-submission" 
  | "updated-after-due";

export interface SubmissionScenarioConfig {
  value: SubmissionScenario;
  label: string;
  additionalMessage: string;
}

export const SUBMISSION_SCENARIO_CONFIG: Record<SubmissionScenario, SubmissionScenarioConfig> = {
  "first-submission": {
    value: "first-submission",
    label: "Submission Confirmation",
    additionalMessage: "",
  },
  "re-submit": {
    value: "re-submit",
    label: "Re-submit Confirmation",
    additionalMessage: "To update a previously submitted Quality Indicator data submission, ensure all changes are accurate before proceeding.",
  },
  "late-submission": {
    value: "late-submission",
    label: "Late Submission",
    additionalMessage: "This submission is being made after the due date for the reporting period. Please ensure all data is accurate before proceeding.",
  },
  "updated-after-due": {
    value: "updated-after-due",
    label: "Submitted – Updated after Due Date",
    additionalMessage: "This is an update to a previously submitted Quality Indicator data submission made after the due date. Please ensure all changes are accurate before proceeding.",
  },
};

/**
 * Determines the submission scenario based on submission history and timing
 */
export function getSubmissionScenario(
  isFirstSubmission: boolean,
  reportingPeriodEndDate: Date,
  currentDate: Date = new Date()
): SubmissionScenario {
  const isAfterDueDate = currentDate > reportingPeriodEndDate;

  if (isFirstSubmission) {
    return isAfterDueDate ? "late-submission" : "first-submission";
  } else {
    return isAfterDueDate ? "updated-after-due" : "re-submit";
  }
}

/**
 * Check if a question is a comment field based on linkId or text
 */
export function isCommentField(linkId: string, text: string): boolean {
  const commentLinkIds = ["PI-18", "PR-06", "UPWL-06"];
  const isCommentById = commentLinkIds.some(id => linkId.toUpperCase().includes(id));
  const isCommentByText = text.toLowerCase().includes("comment");
  
  return isCommentById || isCommentByText;
}
