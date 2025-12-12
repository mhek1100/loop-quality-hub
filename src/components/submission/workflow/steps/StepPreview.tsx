import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { FhirPayloadModal } from "../FhirPayloadModal";
import { Submission, QuestionAnswer } from "@/lib/types";
import { getFacilityById, getReportingPeriodById } from "@/lib/mock/data";
import { FileJson, ArrowLeft, ArrowRight, Eye, Info, AlertTriangle, AlertCircle, Check } from "lucide-react";

interface StepPreviewProps {
  submission: Submission;
  onBack: () => void;
  onContinue: () => void;
  canProceed?: boolean;
}

export function StepPreview({ submission, onBack, onContinue, canProceed }: StepPreviewProps) {
  const [showPayloadModal, setShowPayloadModal] = useState(false);
  const [hasBuiltPreview, setHasBuiltPreview] = useState(false);

  const facility = getFacilityById(submission.facilityId);
  const period = getReportingPeriodById(submission.reportingPeriodId);

  // Calculate validation summary
  const validationSummary = useMemo(() => {
    const allQuestions = submission.questionnaires.flatMap((q) => q.questions);
    const errors = allQuestions.filter((q) => q.errors.length > 0);
    const warnings = allQuestions.filter((q) => q.warnings.length > 0);
    const filled = allQuestions.filter((q) => q.finalValue !== null && q.finalValue !== "");
    const required = allQuestions.filter((q) => q.required && (q.finalValue === null || q.finalValue === ""));
    
    return {
      totalQuestions: allQuestions.length,
      filledQuestions: filled.length,
      errorCount: errors.length,
      warningCount: warnings.length,
      missingRequired: required.length,
      canContinue: required.length === 0 && errors.length === 0,
    };
  }, [submission.questionnaires]);

  // Generate FHIR payload
  const fhirPayload = useMemo(() => ({
    resourceType: "QuestionnaireResponse",
    id: submission.questionnaireResponseId || undefined,
    status: "in-progress",
    questionnaire: `Questionnaire/${submission.questionnaireId}`,
    subject: {
      reference: submission.healthcareServiceReference,
    },
    authored: new Date().toISOString(),
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
  }), [submission]);

  // Generate validation issues for modal
  const validationIssues = useMemo(() => {
    const issues: { severity: "error" | "warning"; message: string; location?: string }[] = [];
    
    for (const questionnaire of submission.questionnaires) {
      for (const question of questionnaire.questions) {
        for (const error of question.errors) {
          issues.push({
            severity: "error",
            message: error,
            location: `${questionnaire.indicatorCode} → ${question.linkId}`,
          });
        }
        for (const warning of question.warnings) {
          issues.push({
            severity: "warning",
            message: warning,
            location: `${questionnaire.indicatorCode} → ${question.linkId}`,
          });
        }
      }
    }
    
    // Add missing required fields
    for (const questionnaire of submission.questionnaires) {
      for (const question of questionnaire.questions) {
        if (question.required && (question.finalValue === null || question.finalValue === "")) {
          issues.push({
            severity: "error",
            message: `Required field is empty: ${question.promptText}`,
            location: `${questionnaire.indicatorCode} → ${question.linkId}`,
          });
        }
      }
    }
    
    return issues;
  }, [submission]);

  const handleBuildPreview = () => {
    setHasBuiltPreview(true);
    setShowPayloadModal(true);
  };

  const handleContinueFromModal = () => {
    setShowPayloadModal(false);
    onContinue();
  };

  return (
    <div className="space-y-6">
      {/* Guidance Text */}
      <Alert className="bg-info/10 border-info/30">
        <Info className="h-4 w-4 text-info-foreground" />
        <AlertDescription>
          Build and review the QuestionnaireResponse that will be sent to the Government API.
        </AlertDescription>
      </Alert>

      {/* Summary Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Submission Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Facility</p>
              <p className="font-medium">{facility?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reporting Period</p>
              <p className="font-medium">{period?.quarter}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Questionnaire ID</p>
              <code className="text-sm font-mono">{submission.questionnaireId}</code>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">QuestionnaireResponse ID</p>
              <code className="text-sm font-mono">{submission.questionnaireResponseId || "Not yet created"}</code>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">FHIR Status</p>
              <Badge variant="secondary">{submission.fhirStatus}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data Completeness</p>
              <p className="font-medium">
                {validationSummary.filledQuestions}/{validationSummary.totalQuestions} questions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Validation Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className={`p-2 rounded-full ${validationSummary.errorCount > 0 ? "bg-destructive/20" : "bg-success/20"}`}>
                {validationSummary.errorCount > 0 ? (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                ) : (
                  <Check className="h-4 w-4 text-success" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Errors</p>
                <p className="text-xl font-bold">{validationSummary.errorCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className={`p-2 rounded-full ${validationSummary.warningCount > 0 ? "bg-warning/20" : "bg-success/20"}`}>
                {validationSummary.warningCount > 0 ? (
                  <AlertTriangle className="h-4 w-4 text-warning" />
                ) : (
                  <Check className="h-4 w-4 text-success" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Warnings</p>
                <p className="text-xl font-bold">{validationSummary.warningCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className={`p-2 rounded-full ${validationSummary.missingRequired > 0 ? "bg-destructive/20" : "bg-success/20"}`}>
                {validationSummary.missingRequired > 0 ? (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                ) : (
                  <Check className="h-4 w-4 text-success" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Missing Required</p>
                <p className="text-xl font-bold">{validationSummary.missingRequired}</p>
              </div>
            </div>
          </div>

          {!validationSummary.canContinue && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please fix all errors and complete required fields before continuing.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Build Preview Button */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4">
            <Button onClick={handleBuildPreview} size="lg" className="gap-2">
              <Eye className="h-5 w-5" />
              Build QuestionnaireResponse Preview
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              This will generate and display the FHIR QuestionnaireResponse payload with validation results
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Data Entry
        </Button>
        <Button onClick={onContinue} disabled={canProceed === false || !validationSummary.canContinue}>
          Continue to Step 3
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* FHIR Payload Modal */}
      <FhirPayloadModal
        open={showPayloadModal}
        onOpenChange={setShowPayloadModal}
        title="QuestionnaireResponse Preview"
        description={`${facility?.name} • ${period?.quarter}`}
        requestPayload={fhirPayload}
        validationIssues={validationIssues}
        onContinue={handleContinueFromModal}
        continueLabel="Continue to Submit In-Progress"
        canContinue={validationSummary.canContinue}
      />
    </div>
  );
}
