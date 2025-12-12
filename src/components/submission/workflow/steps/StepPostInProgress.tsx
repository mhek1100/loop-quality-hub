import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { FhirPayloadModal } from "../FhirPayloadModal";
import { Submission } from "@/lib/types";
import { getFacilityById, getReportingPeriodById } from "@/lib/mock/data";
import { useUser } from "@/contexts/UserContext";
import { Upload, ArrowLeft, ArrowRight, Info, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";

import { OperationOutcome } from "@/lib/types";

interface StepPostInProgressProps {
  submission: Submission;
  onBack: () => void;
  onContinue: () => void;
  onPostComplete: (questionnaireResponseId: string) => void;
  onGovernmentErrors?: (errors: OperationOutcome[]) => void;
}

export function StepPostInProgress({
  submission,
  onBack,
  onContinue,
  onPostComplete,
  onGovernmentErrors,
}: StepPostInProgressProps) {
  const [isPosting, setIsPosting] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [postResponse, setPostResponse] = useState<object | null>(null);

  const facility = getFacilityById(submission.facilityId);
  const period = getReportingPeriodById(submission.reportingPeriodId);
  const { currentUser, getGpmsHeaders, canPostInProgress } = useUser();

  const headers = getGpmsHeaders();

  // Generate FHIR payload
  const fhirPayload = useMemo(() => ({
    resourceType: "QuestionnaireResponse",
    status: "in-progress",
    questionnaire: `Questionnaire/${submission.questionnaireId}`,
    subject: {
      reference: submission.healthcareServiceReference,
    },
    authored: new Date().toISOString(),
    author: {
      reference: `Practitioner/${currentUser.id}`,
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
  }), [submission, currentUser.id]);

  const handlePost = async () => {
    setIsPosting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock response
    const newQrId = submission.questionnaireResponseId || `QIQR-${Date.now()}`;
    const mockResponse = {
      resourceType: "QuestionnaireResponse",
      id: newQrId,
      status: "in-progress",
      questionnaire: `Questionnaire/${submission.questionnaireId}`,
      subject: {
        reference: submission.healthcareServiceReference,
      },
      authored: new Date().toISOString(),
      meta: {
        versionId: "1",
        lastUpdated: new Date().toISOString(),
      },
    };

    setPostResponse(mockResponse);
    setIsPosting(false);
    setShowResultModal(true);
    onPostComplete(newQrId);

    toast({
      title: "Successfully submitted to Government",
      description: `QuestionnaireResponse ID: ${newQrId}`,
    });
  };

  const handleContinueFromModal = () => {
    setShowResultModal(false);
    onContinue();
  };

  // Mock validation warnings from server
  const serverValidationIssues = [
    {
      severity: "warning" as const,
      message: "Optional field 'UPWL-06 Comments' is empty but recommended",
      location: "UPWL → UPWL-06",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Guidance Text */}
      <Alert className="bg-info/10 border-info/30">
        <Info className="h-4 w-4 text-info-foreground" />
        <AlertDescription>
          This sends your QuestionnaireResponse to the Department for validation. The Government returns a QuestionnaireResponseId and any warnings.
        </AlertDescription>
      </Alert>

      {/* Purpose Text */}
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            In this step, the system sends a <strong>POST request</strong> to Government to create a new in-progress QuestionnaireResponse record. The server will validate the payload and return any errors or warnings.
          </p>
        </CardContent>
      </Card>

      {/* Submission Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Submission Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Questionnaire ID</p>
              <code className="text-sm font-mono">{submission.questionnaireId}</code>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">HealthcareService ID</p>
              <code className="text-sm font-mono">{submission.healthcareServiceReference}</code>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reporting Period</p>
              <p className="font-medium">{period?.quarter}</p>
              <p className="text-xs text-muted-foreground">
                {period?.startDate} to {period?.endDate}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Facility</p>
              <p className="font-medium">{facility?.name}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GPMS Identity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            GPMS Identity
          </CardTitle>
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

      {/* Submit Button */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={handlePost}
              size="lg"
              className="gap-2"
              disabled={!canPostInProgress || isPosting}
            >
              {isPosting ? (
                <>
                  <Upload className="h-5 w-5 animate-pulse" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  Submit In-Progress (POST)
                </>
              )}
            </Button>
            {!canPostInProgress && (
              <p className="text-sm text-destructive">
                You do not have permission to submit in-progress data.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Preview
        </Button>
        <Button
          onClick={onContinue}
          disabled={!submission.questionnaireResponseId}
        >
          Continue to Final Submission
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Result Modal */}
      <FhirPayloadModal
        open={showResultModal}
        onOpenChange={setShowResultModal}
        title="POST Request Complete"
        description="In-progress QuestionnaireResponse created successfully"
        requestPayload={fhirPayload}
        responsePayload={postResponse || undefined}
        validationIssues={serverValidationIssues}
        httpMethod="POST"
        endpoint={`/fhir/QuestionnaireResponse`}
        headers={headers}
        onContinue={handleContinueFromModal}
        continueLabel="Continue to Final Submission"
        canContinue={true}
      />
    </div>
  );
}
