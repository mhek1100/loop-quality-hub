import { Submission, FhirStatus, SubmissionStatus } from "@/lib/types";

export type SubmissionScenario = 
  | "first-submission" 
  | "re-submit" 
  | "late-submission" 
  | "updated-after-due";

export interface SubmissionScenarioConfig {
  value: SubmissionScenario;
  label: string;
  additionalMessage: string;
  fhirTargetStatus: FhirStatus;
  description: string;
  submissionStatus: SubmissionStatus;
}

export const SUBMISSION_SCENARIO_CONFIG: Record<SubmissionScenario, SubmissionScenarioConfig> = {
  "first-submission": {
    value: "first-submission",
    label: "Submission Confirmation",
    additionalMessage: "",
    fhirTargetStatus: "completed",
    description: "First submission within the reporting period",
    submissionStatus: "Submitted",
  },
  "re-submit": {
    value: "re-submit",
    label: "Re-submit Confirmation",
    additionalMessage: "To update a previously submitted Quality Indicator data submission, ensure all changes are accurate before proceeding.",
    fhirTargetStatus: "amended",
    description: "Resubmission within the reporting period",
    submissionStatus: "Submitted",
  },
  "late-submission": {
    value: "late-submission",
    label: "Late Submission",
    additionalMessage: "This submission is being made after the due date for the reporting period. Please ensure all data is accurate before proceeding.",
    fhirTargetStatus: "completed",
    description: "First submission after the due date",
    submissionStatus: "Late Submission",
  },
  "updated-after-due": {
    value: "updated-after-due",
    label: "Submitted – Updated after Due Date",
    additionalMessage: "This is an update to a previously submitted Quality Indicator data submission made after the due date. Please ensure all changes are accurate before proceeding.",
    fhirTargetStatus: "amended",
    description: "Resubmission after the due date",
    submissionStatus: "Submitted - Updated after Due Date",
  },
};

/**
 * Determines the submission scenario based on submission history and timing
 * Per the Quality Indicator Submission Lifecycle document:
 * - First submission within period → "Submission Confirmation"
 * - Re-submission within period → "Re-submit Confirmation"
 * - First submission after due date → "Late Submission"
 * - Re-submission after due date → "Submitted – Updated after Due Date"
 */
export function getSubmissionScenario(
  submission: Submission,
  reportingPeriodDueDate: Date,
  currentDate: Date = new Date()
): SubmissionScenario {
  const isAfterDueDate = currentDate > reportingPeriodDueDate;
  
  // Check if this is a first submission or a re-submission
  // A first submission is when there's no previous lastSubmittedDate
  // and fhirStatus is not completed/amended
  const hasBeenSubmittedBefore = 
    submission.lastSubmittedDate !== undefined || 
    submission.fhirStatus === "completed" || 
    submission.fhirStatus === "amended";

  if (!hasBeenSubmittedBefore) {
    return isAfterDueDate ? "late-submission" : "first-submission";
  } else {
    return isAfterDueDate ? "updated-after-due" : "re-submit";
  }
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use getSubmissionScenario(submission, dueDate) instead
 */
export function getSubmissionScenarioLegacy(
  isFirstSubmission: boolean,
  reportingPeriodDueDate: Date,
  currentDate: Date = new Date()
): SubmissionScenario {
  const isAfterDueDate = currentDate > reportingPeriodDueDate;

  if (isFirstSubmission) {
    return isAfterDueDate ? "late-submission" : "first-submission";
  } else {
    return isAfterDueDate ? "updated-after-due" : "re-submit";
  }
}

/**
 * Get the appropriate QI status label based on submission state
 * Per the lifecycle document status mapping
 */
export function getQiStatusLabel(
  submission: Submission,
  reportingPeriodDueDate: Date
): string {
  const scenario = getSubmissionScenario(submission, reportingPeriodDueDate);
  return SUBMISSION_SCENARIO_CONFIG[scenario].label;
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
