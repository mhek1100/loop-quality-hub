import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ValidationIssuesList } from "../../ValidationIssuesList";
import { Submission, OperationOutcome } from "@/lib/types";
import { useUser } from "@/contexts/UserContext";
import { getFacilityById, getReportingPeriodById } from "@/lib/mock/data";
import { SUBMISSION_SCENARIO_CONFIG, getSubmissionScenario, SubmissionScenario } from "@/lib/submission-utils";
import {
  AlertCircle,
  AlertTriangle,
  Check,
  FileText,
  Info,
  Send,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ValidationSummary {
  totalQuestions: number;
  filledQuestions: number;
  errorCount: number;
  warningCount: number;
  missingRequired: number;
}

interface StepValidationProps {
  submission: Submission;
  validationSummary: ValidationSummary;
  governmentIssues: OperationOutcome[];
  onFinalSubmit: (payload: object) => Promise<{ success: boolean }>;
  hasInitialSubmission: boolean;
}

const ATTESTATION_CONTENT: Record<SubmissionScenario, { intro: string; bullets: string[]; note?: string }> = {
  "first-submission": {
    intro: "By submitting Quality Indicators data you:",
    bullets: [
      "Confirm that you have collected, and are reporting, the quality indicator data in accordance with National Aged Care Mandatory Quality Indicator Program Manual 3.0 and all applicable laws, in accordance with the Aged Care Act 1997, Records Principles 2014 and Accountability Principles 2014.",
      "Confirm that any information you have provided does not contain any personal information as defined under Privacy Act 1988.",
    ],
  },
  "re-submit": {
    intro: "By submitting Quality Indicators data you:",
    bullets: [
      "Confirm that you have collected, and are reporting, the quality indicator data in accordance with National Aged Care Mandatory Quality Indicator Program Manual 3.0 and all applicable laws, in accordance with the Aged Care Act 1997, Records Principles 2014, Accountability Principles 2014.",
      "Confirm that any information you have provided does not contain any personal information as defined under Privacy Act 1988.",
    ],
    note: "This will result in a new version of the QI data submission, with an updated date.",
  },
  "updated-after-due": {
    intro: "By submitting Quality Indicators data you:",
    bullets: [
      "Confirm that you have collected, and are reporting, the quality indicator data in accordance with National Aged Care Mandatory Quality Indicator Program Manual 3.0 and all applicable laws, in accordance with the Aged Care Act 1997, Records Principles 2014 and Accountability Principles 2014.",
      "Confirm that any information you have provided does not contain any personal information as defined under Privacy Act 1988.",
    ],
    note: "This will result in a new version of the QI data submission, with the label 'Submitted - Updated after Due Date'.",
  },
  "late-submission": {
    intro: "By submitting Quality Indicators data you:",
    bullets: [
      "Confirm that you have collected, and are reporting, the quality indicator data in accordance with National Aged Care Mandatory Quality Indicator Program Manual 3.0 and all applicable laws, in accordance with the Aged Care Act 1997, Records Principles 2014 and Accountability Principles 2014.",
      "Confirm that any information you have provided does not contain any personal information as defined under Privacy Act 1988.",
    ],
    note: "This will result in QI data submission, with the label 'Late Submission'.",
  },
};

export function StepValidation({
  submission,
  validationSummary,
  governmentIssues,
  onFinalSubmit,
  hasInitialSubmission,
}: StepValidationProps) {
  const facility = getFacilityById(submission.facilityId);
  const period = getReportingPeriodById(submission.reportingPeriodId);
  const {
    currentUser,
    getGpmsHeaders,
    canFinalSubmit,
    isAuthorizedSubmitter,
  } = useUser();

  const headers = getGpmsHeaders();
  const [attestationConfirmed, setAttestationConfirmed] = useState(false);
  const [showWarningsDialog, setShowWarningsDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warningsAcknowledged, setWarningsAcknowledged] = useState(false);

  const periodDueDate = useMemo(
    () => (period ? new Date(period.dueDate) : new Date()),
    [period]
  );
  const submissionScenario = useMemo(
    () => getSubmissionScenario(submission, periodDueDate),
    [submission, periodDueDate]
  );
  const scenarioConfig = SUBMISSION_SCENARIO_CONFIG[submissionScenario];
  const attestationCopy = ATTESTATION_CONTENT[submissionScenario];

  const finalPayload = useMemo(
    () => ({
      resourceType: "QuestionnaireResponse",
      id: submission.questionnaireResponseId,
      status: scenarioConfig.fhirTargetStatus,
      questionnaire: `Questionnaire/${submission.questionnaireId}`,
      subject: {
        reference: submission.healthcareServiceReference,
      },
      authored: new Date().toISOString(),
      author: {
        reference: `Practitioner/${currentUser.id}`,
      },
      meta: {
        tag: [
          {
            system: "submission-type",
            code: submissionScenario,
            display: scenarioConfig.label,
          },
        ],
      },
      item: submission.questionnaires.map((q) => ({
        linkId: q.indicatorCode,
        text: q.indicatorName,
        item: q.questions
          .filter((qu) => qu.finalValue !== null && qu.finalValue !== "")
          .map((qu) => ({
            linkId: qu.linkId,
            text: qu.promptText,
            answer: [
              qu.responseType === "integer"
                ? { valueInteger: qu.finalValue }
                : qu.responseType === "boolean"
                ? { valueBoolean: qu.finalValue }
                : qu.responseType === "date"
                ? { valueDate: qu.finalValue }
                : { valueString: qu.finalValue },
            ],
          })),
      })),
    }),
    [submission, submissionScenario, scenarioConfig, currentUser.id]
  );

  const formattedPayload = useMemo(() => JSON.stringify(finalPayload, null, 2), [finalPayload]);

  const hasSubmitterRole = canFinalSubmit && isAuthorizedSubmitter;

  const canAttemptFinal =
    hasInitialSubmission &&
    submission.questionnaireResponseId &&
    hasSubmitterRole &&
    attestationConfirmed;

  const hasBlockingErrors = validationSummary.errorCount > 0 || validationSummary.missingRequired > 0;

  const handlePrimaryAction = () => {
    if (!hasInitialSubmission || !submission.questionnaireResponseId) {
      toast({
        title: "Initial submission required",
        description: "Send the initial submission from Step 1 before finalising.",
        variant: "destructive",
      });
      return;
    }

    if (hasBlockingErrors) {
      toast({
        title: "Fix errors before submitting",
        description: "Resolve all errors and required fields in Step 1.",
        variant: "destructive",
      });
      return;
    }

    if (validationSummary.warningCount > 0 && !warningsAcknowledged) {
      setShowWarningsDialog(true);
      return;
    }

    executeFinalSubmission();
  };

  const executeFinalSubmission = async () => {
    setIsSubmitting(true);
    const result = await onFinalSubmit(finalPayload);
    setIsSubmitting(false);

    if (result.success) {
      setWarningsAcknowledged(false);
    }
  };

  const warningSummary = (
    <span>
      There are {validationSummary.warningCount} warning
      {validationSummary.warningCount === 1 ? "" : "s"}. Proceed with submission?
    </span>
  );

  const isAlreadyCompleted =
    submission.fhirStatus === "completed" || submission.fhirStatus === "amended";

  useEffect(() => {
    setWarningsAcknowledged(false);
  }, [
    submission.id,
    submission.questionnaireResponseId,
    validationSummary.warningCount,
    validationSummary.errorCount,
  ]);

  const requestEndpoint = submission.questionnaireResponseId
    ? `/fhir/QuestionnaireResponse/${submission.questionnaireResponseId}`
    : "/fhir/QuestionnaireResponse/{id}";

  const primaryButtonLabel = hasSubmitterRole
    ? "Submit Final Data"
    : "Only a QI Submitter can send final submission";

  const handleWarningsConfirm = async () => {
    setWarningsAcknowledged(true);
    setShowWarningsDialog(false);
    await executeFinalSubmission();
  };

  if (isAlreadyCompleted) {
    return (
      <Alert className="bg-success/10 border-success/30">
        <Check className="h-4 w-4 text-success" />
        <AlertDescription>
          Submission is complete. Review confirmation details in Step 3.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Alert className="bg-info/10 border-info/30">
        <Info className="h-4 w-4 text-info-foreground" />
        <AlertDescription>
          Validate your data and send the final PATCH request once errors are resolved.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Validation Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryStat
              label="Questions answered"
              value={`${validationSummary.filledQuestions}/${validationSummary.totalQuestions}`}
            />
            <SummaryStat
              label="Missing required"
              value={validationSummary.missingRequired}
              tone={validationSummary.missingRequired > 0 ? "error" : "ok"}
            />
            <SummaryStat
              label="Errors"
              value={validationSummary.errorCount}
              tone={validationSummary.errorCount > 0 ? "error" : "ok"}
            />
            <SummaryStat
              label="Warnings"
              value={validationSummary.warningCount}
              tone={validationSummary.warningCount > 0 ? "warning" : "ok"}
            />
          </div>
          {hasBlockingErrors && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Fix all errors and missing required answers in Step 1 before attempting final submission.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <ValidationIssuesList
        outcomes={governmentIssues}
        submissionId={submission.id}
        className="border-dashed"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Submission Type & Attestation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Badge variant="outline">{scenarioConfig.label}</Badge>
            <span className="text-sm text-muted-foreground">{scenarioConfig.description}</span>
          </div>
          {scenarioConfig.additionalMessage && (
            <Alert className="bg-warning/10 border-warning/30">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <AlertDescription className="text-sm">
                {scenarioConfig.additionalMessage}
              </AlertDescription>
            </Alert>
          )}
          <div className="p-4 rounded-lg border bg-muted/20 space-y-3">
            <p className="text-sm font-medium text-foreground">{attestationCopy.intro}</p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              {attestationCopy.bullets.map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ul>
            {attestationCopy.note && (
              <p className="text-xs text-muted-foreground italic">{attestationCopy.note}</p>
            )}
          </div>
          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border">
            <Checkbox
              checked={attestationConfirmed}
              onCheckedChange={(value) => setAttestationConfirmed(value === true)}
            />
            <span className="text-sm">
              I confirm the statements above are true and complete.
            </span>
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Send className="h-4 w-4" />
            Final Submission Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-muted/40 space-y-1">
              <p className="text-muted-foreground text-xs uppercase">Method</p>
              <code className="text-xs block">
                PATCH {requestEndpoint}
              </code>
            </div>
            <div className="p-3 rounded-lg bg-muted/40 space-y-1">
              <p className="text-muted-foreground text-xs uppercase">QuestionnaireResponse ID</p>
              <code className="text-xs block">
                {submission.questionnaireResponseId || "Not yet submitted"}
              </code>
            </div>
            <div className="p-3 rounded-lg bg-muted/40 space-y-1">
              <p className="text-muted-foreground text-xs uppercase">Headers</p>
              {Object.keys(headers).length > 0 ? (
                <ul className="font-mono text-xs space-y-1">
                  {Object.entries(headers).map(([key, value]) => (
                    <li key={key}>
                      {key}: {value}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No GPMS headers attached</p>
              )}
            </div>
          </div>
          <div>
            <p className="text-muted-foreground text-xs uppercase mb-2">Payload</p>
            <pre className="bg-muted rounded-md p-3 overflow-auto text-xs font-mono max-h-64">
              {formattedPayload}
            </pre>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center pt-6 pb-10 border-t">
        <Button
          size="lg"
          onClick={handlePrimaryAction}
          disabled={!canAttemptFinal || isSubmitting}
          className="min-w-[260px] h-12 text-base"
        >
          <Send className="h-4 w-4 mr-2" />
          {primaryButtonLabel}
        </Button>
      </div>

      <AlertDialog open={showWarningsDialog} onOpenChange={setShowWarningsDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Warnings detected</AlertDialogTitle>
            <AlertDialogDescription>{warningSummary}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Review</AlertDialogCancel>
            <AlertDialogAction onClick={handleWarningsConfirm}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface SummaryStatProps {
  label: string;
  value: string | number;
  tone?: "ok" | "warning" | "error";
}

function SummaryStat({ label, value, tone = "ok" }: SummaryStatProps) {
  const toneClasses =
    tone === "error"
      ? "text-destructive"
      : tone === "warning"
      ? "text-warning"
      : "text-foreground";

  return (
    <div className="p-3 rounded-lg bg-muted/40">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-xl font-semibold ${toneClasses}`}>{value}</p>
    </div>
  );
}
