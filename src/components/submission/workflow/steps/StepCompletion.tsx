import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Submission } from "@/lib/types";
import { getReportingPeriodById } from "@/lib/mock/data";
import { useUser } from "@/contexts/UserContext";
import { CheckCircle2, Send } from "lucide-react";
import { SUBMISSION_SCENARIO_CONFIG, getSubmissionScenario } from "@/lib/submission-utils";

interface StepCompletionProps {
  submission: Submission;
}

export function StepCompletion({ submission }: StepCompletionProps) {
  const period = getReportingPeriodById(submission.reportingPeriodId);
  const { getGpmsHeaders, currentUser } = useUser();
  const headers = getGpmsHeaders();

  const periodDueDate = useMemo(
    () => (period ? new Date(period.dueDate) : new Date()),
    [period]
  );
  const submissionScenario = useMemo(
    () => getSubmissionScenario(submission, periodDueDate),
    [submission, periodDueDate]
  );
  const scenarioConfig = SUBMISSION_SCENARIO_CONFIG[submissionScenario];

  const requestEndpoint = submission.questionnaireResponseId
    ? `/fhir/QuestionnaireResponse/${submission.questionnaireResponseId}`
    : "/fhir/QuestionnaireResponse/{id}";

  const finalPayload = useMemo(
    () => ({
      resourceType: "QuestionnaireResponse",
      id: submission.questionnaireResponseId,
      status: submission.fhirStatus,
      questionnaire: `Questionnaire/${submission.questionnaireId}`,
      subject: {
        reference: submission.healthcareServiceReference,
      },
      authored: submission.lastSubmittedDate || submission.updatedAt,
      author: {
        reference: `Practitioner/${submission.submittedByUserId || currentUser.id}`,
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
    [submission, submissionScenario, scenarioConfig.label, currentUser.id]
  );

  const formattedPayload = useMemo(() => JSON.stringify(finalPayload, null, 2), [finalPayload]);

  const submittedOn = submission.lastSubmittedDate
    ? new Date(submission.lastSubmittedDate).toLocaleString()
    : new Date(submission.updatedAt).toLocaleString();

  return (
    <div className="space-y-6">
      <Alert className="bg-success/10 border-success/30">
        <CheckCircle2 className="h-4 w-4 text-success" />
        <AlertDescription>
          Submission is complete. Keep this confirmation for your records.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Send className="h-4 w-4" />
            Final Submission Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-3 rounded-lg bg-muted/40 space-y-1">
              <p className="text-muted-foreground text-xs uppercase">Method</p>
              <code className="text-xs block">PATCH {requestEndpoint}</code>
            </div>
            <div className="p-3 rounded-lg bg-muted/40 space-y-1">
              <p className="text-muted-foreground text-xs uppercase">QuestionnaireResponse ID</p>
              <code className="text-xs block">{submission.questionnaireResponseId || "N/A"}</code>
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
            <div className="p-3 rounded-lg bg-muted/40 space-y-1">
              <p className="text-muted-foreground text-xs uppercase">Submitted On</p>
              <p className="text-xs">{submittedOn}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/40 space-y-1">
              <p className="text-muted-foreground text-xs uppercase">FHIR Status</p>
              <Badge className="bg-success/10 text-success border-success/30">
                {submission.fhirStatus}
              </Badge>
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
    </div>
  );
}
