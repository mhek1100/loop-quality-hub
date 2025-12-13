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
import { SUBMISSION_SCENARIO_CONFIG, getSubmissionScenario } from "@/lib/submission-utils";
import {
  AlertCircle,
  AlertTriangle,
  Check,
  FileText,
  Info,
  Shield,
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
  const [showPreview, setShowPreview] = useState(false);
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

    if (!showPreview) {
      if (validationSummary.warningCount > 0 && !warningsAcknowledged) {
        setShowWarningsDialog(true);
        return;
      }
      setShowPreview(true);
      return;
    }

    executeFinalSubmission();
  };

  const executeFinalSubmission = async () => {
    setIsSubmitting(true);
    const result = await onFinalSubmit(finalPayload);
    setIsSubmitting(false);

    if (result.success) {
      setShowPreview(false);
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
    setShowPreview(false);
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
    ? showPreview
      ? "Submit Final Data"
      : "Review Final Submission"
    : "Only a QI Submitter can send final submission";

  const handleWarningsConfirm = () => {
    setWarningsAcknowledged(true);
    setShowWarningsDialog(false);
    setShowPreview(true);
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
            Submission Type
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Attestation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Confirm the conformance statements from the NQIP Conformance guide before sending your final submission.
          </p>
          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border">
            <Checkbox
              checked={attestationConfirmed}
              onCheckedChange={(value) => setAttestationConfirmed(value === true)}
            />
            <span className="text-sm">
              I confirm the submission meets the National Aged Care Mandatory Quality Indicator Program requirements.
            </span>
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">GPMS Headers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-muted/40 rounded-lg font-mono text-sm space-y-1">
            {headers["X-User-Email"] && <p>X-User-Email: {headers["X-User-Email"]}</p>}
            {headers["X-Federated-Id"] && <p>X-Federated-Id: {headers["X-Federated-Id"]}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-1 text-sm">
          <p className="font-medium">QuestionnaireResponse ID</p>
          <code className="text-xs bg-muted px-2 py-1 rounded">
            {submission.questionnaireResponseId || "Not yet submitted"}
          </code>
        </CardContent>
      </Card>

      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Send className="h-4 w-4" />
              Final Submission Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-xs uppercase">Method</p>
                <p className="font-mono text-sm">PATCH {requestEndpoint}</p>
              </div>
              <div>
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
              <pre className="bg-muted rounded-md p-3 overflow-auto text-xs font-mono">
                {formattedPayload}
              </pre>
            </div>
            <div className="p-3 rounded-lg bg-muted/40 text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground text-sm">Conformance checklist</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>QuestionnaireResponse ID {submission.questionnaireResponseId}</li>
                <li>Submission type: {scenarioConfig.label}</li>
                <li>Headers included: {Object.keys(headers).length || "None"}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

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
