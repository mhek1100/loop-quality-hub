import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { FhirPayloadModal } from "../FhirPayloadModal";
import { Submission } from "@/lib/types";
import { getFacilityById, getReportingPeriodById } from "@/lib/mock/data";
import { useUser } from "@/contexts/UserContext";
import { Send, ArrowLeft, Info, Shield, AlertTriangle, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { 
  SUBMISSION_SCENARIO_CONFIG, 
  getSubmissionScenario 
} from "@/lib/submission-utils";
import { ServerDataPanel } from "./ServerDataPanel";

const ATTESTATION_BULLETS = [
  "Confirm that you have collected, and are reporting, the quality indicator data in accordance with National Aged Care Mandatory Quality Indicator Program Manual 3.0 and all applicable laws, in accordance with the Aged Care Act 1997, Records Principles 2014 and Accountability Principles 2014.",
  "Confirm that any information you have provided does not contain any personal information as defined under Privacy Act 1988.",
];

interface StepFinalSubmissionProps {
  submission: Submission;
  onBack: () => void;
  onSubmitComplete: () => void;
}

export function StepFinalSubmission({
  submission,
  onBack,
  onSubmitComplete,
}: StepFinalSubmissionProps) {
  const facility = getFacilityById(submission.facilityId);
  const period = getReportingPeriodById(submission.reportingPeriodId);
  const { currentUser, getGpmsHeaders, canFinalSubmit, isAuthorizedSubmitter } = useUser();

  // Auto-determine the submission scenario based on submission history and timing
  const periodDueDate = period ? new Date(period.dueDate) : new Date();
  const submissionScenario = useMemo(
    () => getSubmissionScenario(submission, periodDueDate),
    [submission, periodDueDate]
  );
  const scenarioConfig = SUBMISSION_SCENARIO_CONFIG[submissionScenario];

  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [patchResponse, setPatchResponse] = useState<object | null>(null);
  const [serverDataVerified, setServerDataVerified] = useState(false);

  const headers = getGpmsHeaders();

  const canProceed =
    submission.questionnaireResponseId &&
    submission.fhirStatus === "in-progress" &&
    isAuthorizedSubmitter &&
    canFinalSubmit;

  // Generate FHIR PATCH payload
  const patchPayload = useMemo(() => ({
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
  }), [submission, currentUser.id, submissionScenario, scenarioConfig]);

  const handleSubmit = async () => {
    if (!confirmed) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock response
    const mockResponse = {
      resourceType: "QuestionnaireResponse",
      id: submission.questionnaireResponseId,
      status: scenarioConfig.fhirTargetStatus,
      questionnaire: `Questionnaire/${submission.questionnaireId}`,
      subject: {
        reference: submission.healthcareServiceReference,
      },
      authored: new Date().toISOString(),
      meta: {
        versionId: "2",
        lastUpdated: new Date().toISOString(),
        tag: [
          {
            system: "submission-type",
            code: submissionScenario,
            display: scenarioConfig.label,
          },
        ],
      },
    };

    setPatchResponse(mockResponse);
    setIsSubmitting(false);
    setShowResultModal(true);

    toast({
      title: "Successfully submitted to Government",
      description: `${scenarioConfig.label} - QuestionnaireResponse status changed to ${scenarioConfig.fhirTargetStatus}`,
    });
  };

  const handleCloseModal = () => {
    setShowResultModal(false);
    onSubmitComplete();
  };

  if (!canProceed) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {!submission.questionnaireResponseId && "No QuestionnaireResponseId exists. Please complete Step 3 first."}
            {submission.questionnaireResponseId && submission.fhirStatus !== "in-progress" && "FHIR status must be 'in-progress' to submit."}
            {!isAuthorizedSubmitter && "You must be an authorized submitter with valid GPMS credentials."}
            {!canFinalSubmit && "You do not have permission to perform final submissions."}
          </AlertDescription>
        </Alert>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Guidance Text */}
      <Alert className="bg-info/10 border-info/30">
        <Info className="h-4 w-4 text-info-foreground" />
        <AlertDescription>
          Submit the approved QuestionnaireResponse using PATCH. You must confirm the required attestations.
        </AlertDescription>
      </Alert>

      {/* Submission Type - Auto-determined */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Submission Type
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Badge variant="outline" className="text-sm font-medium">
              {scenarioConfig.label}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {scenarioConfig.description}
            </span>
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

      {/* Server Data Verification - GET Operation */}
      <ServerDataPanel 
        submission={submission} 
        onDataRetrieved={() => setServerDataVerified(true)} 
      />

      {/* Attestation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Attestation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <p className="text-sm font-medium">By submitting Quality Indicators data you:</p>
            <ul className="space-y-3">
              {ATTESTATION_BULLETS.map((bullet, index) => (
                <li key={index} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
            <Checkbox
              checked={confirmed}
              onCheckedChange={(checked) => setConfirmed(checked === true)}
            />
            <span className="text-sm font-medium">I confirm the above statements.</span>
          </label>
        </CardContent>
      </Card>

      {/* GPMS Headers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">GPMS Headers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-muted/30 rounded-lg font-mono text-sm space-y-2">
            {headers["X-User-Email"] && (
              <p>
                X-User-Email: <Badge variant="secondary">{headers["X-User-Email"]}</Badge>
              </p>
            )}
            {headers["X-Federated-Id"] && (
              <p>
                X-Federated-Id: <Badge variant="secondary">{headers["X-Federated-Id"]}</Badge>
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* QuestionnaireResponse Info */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">QuestionnaireResponse ID</p>
              <code className="text-sm font-mono">{submission.questionnaireResponseId}</code>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current FHIR Status</p>
              <Badge variant="secondary">{submission.fhirStatus}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={handleSubmit}
              size="lg"
              className="gap-2"
              disabled={!confirmed || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Send className="h-5 w-5 animate-pulse" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Submit Final (PATCH)
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-start pt-4 border-t">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Result Modal */}
      <FhirPayloadModal
        open={showResultModal}
        onOpenChange={handleCloseModal}
        title="PATCH Request Complete"
        description="QuestionnaireResponse submitted successfully"
        requestPayload={patchPayload}
        responsePayload={patchResponse || undefined}
        validationIssues={[]}
        httpMethod="PATCH"
        endpoint={`/fhir/QuestionnaireResponse/${submission.questionnaireResponseId}`}
        headers={headers}
        onContinue={handleCloseModal}
        continueLabel="Done"
        canContinue={true}
      />
    </div>
  );
}
