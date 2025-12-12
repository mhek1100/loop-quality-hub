import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { FhirPayloadModal } from "../FhirPayloadModal";
import { Submission, OperationOutcome } from "@/lib/types";
import { getFacilityById, getReportingPeriodById } from "@/lib/mock/data";
import { useUser } from "@/contexts/UserContext";
import { Upload, ArrowLeft, ArrowRight, Info, Shield, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock Government validation scenarios based on submission data
function generateMockGovernmentValidation(submission: Submission): {
  success: boolean;
  errors: OperationOutcome[];
  warnings: OperationOutcome[];
} {
  const errors: OperationOutcome[] = [];
  const warnings: OperationOutcome[] = [];

  // Check for specific validation scenarios in the data
  submission.questionnaires.forEach((q) => {
    q.questions.forEach((question) => {
      // Scenario: Negative values are rejected by government
      if (typeof question.finalValue === "number" && question.finalValue < 0) {
        errors.push({
          severity: "error",
          code: "invalid",
          diagnostics: `[GOVT] Value must be a non-negative integer. Received: ${question.finalValue}`,
          indicatorCode: q.indicatorCode,
          questionLinkId: question.linkId,
          location: `${q.indicatorCode}/${question.linkId}`,
        });
      }

      // Scenario: Zero for total residents is rejected
      if (question.linkId.includes("-01") && question.finalValue === 0) {
        errors.push({
          severity: "error",
          code: "business-rule",
          diagnostics: `[GOVT] Total count cannot be zero for indicator ${q.indicatorCode}`,
          indicatorCode: q.indicatorCode,
          questionLinkId: question.linkId,
          location: `${q.indicatorCode}/${question.linkId}`,
        });
      }

      // Scenario: Stage 2+ exceeds total (PI indicator)
      if (q.indicatorCode === "PI" && question.linkId === "PI-02") {
        const totalQuestion = q.questions.find((qu) => qu.linkId === "PI-01");
        if (
          totalQuestion &&
          typeof question.finalValue === "number" &&
          typeof totalQuestion.finalValue === "number" &&
          question.finalValue > totalQuestion.finalValue
        ) {
          errors.push({
            severity: "error",
            code: "business-rule",
            diagnostics: `[GOVT] Stage 2+ count (${question.finalValue}) cannot exceed total pressure injuries (${totalQuestion.finalValue})`,
            indicatorCode: q.indicatorCode,
            questionLinkId: question.linkId,
            location: `${q.indicatorCode}/${question.linkId}`,
          });
        }
      }

      // Scenario: Percentage values over 100
      if (
        question.linkId.includes("Rate") ||
        question.linkId.includes("Percent")
      ) {
        if (typeof question.finalValue === "number" && question.finalValue > 100) {
          errors.push({
            severity: "error",
            code: "invalid",
            diagnostics: `[GOVT] Percentage value cannot exceed 100%. Received: ${question.finalValue}%`,
            indicatorCode: q.indicatorCode,
            questionLinkId: question.linkId,
            location: `${q.indicatorCode}/${question.linkId}`,
          });
        }
      }

      // Scenario: Empty comment when a high value is reported (warning)
      if (question.linkId.includes("Comment") && !question.finalValue) {
        const numericQuestions = q.questions.filter(
          (qu) => typeof qu.finalValue === "number" && qu.finalValue > 50
        );
        if (numericQuestions.length > 0) {
          warnings.push({
            severity: "warning",
            code: "informational",
            diagnostics: `[GOVT] Comment recommended when reporting high values in ${q.indicatorCode}`,
            indicatorCode: q.indicatorCode,
            questionLinkId: question.linkId,
            location: `${q.indicatorCode}/${question.linkId}`,
          });
        }
      }

      // Forward existing errors/warnings that look like government errors
      question.errors
        .filter((e) => e.includes("[GOVT]"))
        .forEach((e) => {
          errors.push({
            severity: "error",
            code: "validation",
            diagnostics: e,
            indicatorCode: q.indicatorCode,
            questionLinkId: question.linkId,
            location: `${q.indicatorCode}/${question.linkId}`,
          });
        });
    });
  });

  // Add a generic warning for optional fields
  warnings.push({
    severity: "warning",
    code: "informational",
    diagnostics: "Optional comment fields are empty but recommended for context",
    indicatorCode: "UPWL",
    questionLinkId: "UPWL-06",
    location: "UPWL/UPWL-06",
  });

  return {
    success: errors.length === 0,
    errors,
    warnings,
  };
}

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
  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    errors: OperationOutcome[];
    warnings: OperationOutcome[];
  } | null>(null);

  const facility = getFacilityById(submission.facilityId);
  const period = getReportingPeriodById(submission.reportingPeriodId);
  const { currentUser, getGpmsHeaders, canPostInProgress } = useUser();

  const headers = getGpmsHeaders();

  // Generate FHIR payload
  const fhirPayload = useMemo(
    () => ({
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
    }),
    [submission, currentUser.id]
  );

  const handlePost = async () => {
    setIsPosting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Run mock government validation
    const validation = generateMockGovernmentValidation(submission);
    setValidationResult(validation);

    if (validation.success) {
      // Success - generate QR ID
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
        issue: validation.warnings.map((w) => ({
          severity: "warning",
          code: w.code,
          diagnostics: w.diagnostics,
          location: [w.location],
        })),
      };

      setPostResponse(mockResponse);
      setIsPosting(false);
      setShowResultModal(true);
      onPostComplete(newQrId);

      toast({
        title: "Successfully submitted to Government",
        description: `QuestionnaireResponse ID: ${newQrId}${
          validation.warnings.length > 0
            ? ` (${validation.warnings.length} warnings)`
            : ""
        }`,
      });
    } else {
      // Failure - return 422 with validation errors
      const errorResponse = {
        resourceType: "OperationOutcome",
        issue: validation.errors.map((e) => ({
          severity: "error",
          code: e.code,
          diagnostics: e.diagnostics,
          location: [e.location],
        })),
      };

      setPostResponse(errorResponse);
      setIsPosting(false);
      setShowResultModal(true);

      // Call the error handler to map errors back to questions
      if (onGovernmentErrors) {
        onGovernmentErrors(validation.errors);
      }

      toast({
        title: "Government Validation Failed",
        description: `${validation.errors.length} error(s) must be fixed before continuing.`,
        variant: "destructive",
      });
    }
  };

  const handleContinueFromModal = () => {
    setShowResultModal(false);
    if (validationResult?.success) {
      onContinue();
    }
    // If validation failed, the modal will close and user stays on this step
    // The parent component will have already been notified via onGovernmentErrors
    // and will revert to data entry step
  };

  // Convert validation result to modal format
  const serverValidationIssues = useMemo(() => {
    if (!validationResult) return [];
    return [
      ...validationResult.errors.map((e) => ({
        severity: "error" as const,
        message: e.diagnostics,
        location: e.location,
      })),
      ...validationResult.warnings.map((w) => ({
        severity: "warning" as const,
        message: w.diagnostics,
        location: w.location,
      })),
    ];
  }, [validationResult]);

  return (
    <div className="space-y-6">
      {/* Guidance Text */}
      <Alert className="bg-info/10 border-info/30">
        <Info className="h-4 w-4 text-info-foreground" />
        <AlertDescription>
          This sends your QuestionnaireResponse to the Department for
          validation. The Government returns a QuestionnaireResponseId and any
          warnings or errors.
        </AlertDescription>
      </Alert>

      {/* Purpose Text */}
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            In this step, the system sends a <strong>POST request</strong> to
            Government to create a new in-progress QuestionnaireResponse record.
            The server will validate the payload and return any errors or
            warnings.
          </p>
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-info-foreground" />
              Demo Note
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              This mock simulates government validation. Errors will be returned
              for: negative values, zero totals, stage counts exceeding totals,
              and percentages over 100%.
            </p>
          </div>
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
              <code className="text-sm font-mono">
                {submission.questionnaireId}
              </code>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                HealthcareService ID
              </p>
              <code className="text-sm font-mono">
                {submission.healthcareServiceReference}
              </code>
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
                X-User-Email:{" "}
                <Badge variant="secondary">{headers["X-User-Email"]}</Badge>
              </p>
            )}
            {headers["X-Federated-Id"] && (
              <p>
                X-Federated-Id:{" "}
                <Badge variant="secondary">{headers["X-Federated-Id"]}</Badge>
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
        title={
          validationResult?.success
            ? "POST Request Complete"
            : "POST Request Failed"
        }
        description={
          validationResult?.success
            ? "In-progress QuestionnaireResponse created successfully"
            : "Government validation returned errors"
        }
        requestPayload={fhirPayload}
        responsePayload={postResponse || undefined}
        validationIssues={serverValidationIssues}
        httpMethod="POST"
        endpoint={`/fhir/QuestionnaireResponse`}
        headers={headers}
        onContinue={handleContinueFromModal}
        continueLabel={
          validationResult?.success
            ? "Continue to Final Submission"
            : "Return to Fix Errors"
        }
        canContinue={true}
      />
    </div>
  );
}
