import { useState, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, Copy } from "lucide-react";
import { getSubmission, getFacilityById, getReportingPeriodById } from "@/lib/mock/data";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { WorkflowStepper, WorkflowStepId, WORKFLOW_STEPS } from "@/components/submission/workflow/WorkflowStepper";
import { StepDataEntry } from "@/components/submission/workflow/steps/StepDataEntry";
import { StepPreview } from "@/components/submission/workflow/steps/StepPreview";
import { StepPostInProgress } from "@/components/submission/workflow/steps/StepPostInProgress";
import { StepFinalSubmission } from "@/components/submission/workflow/steps/StepFinalSubmission";
import { ProgressIndicator } from "@/components/submission/workflow/ProgressIndicator";
import { VersionHistory } from "@/components/submission/workflow/VersionHistory";
import { Submission, OperationOutcome } from "@/lib/types";

const SubmissionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [submission, setSubmission] = useState<Submission | undefined>(() => getSubmission(id || ""));
  const { canFinalSubmit } = useUser();

  // Determine initial step based on submission state
  const getInitialStep = (): WorkflowStepId => {
    if (!submission) return "data-entry";
    if (submission.fhirStatus === "completed" || submission.fhirStatus === "amended") {
      return "final-submission";
    }
    if (submission.questionnaireResponseId) {
      return "post-in-progress";
    }
    return "data-entry";
  };

  const [currentStep, setCurrentStep] = useState<WorkflowStepId>(getInitialStep);
  const [governmentErrors, setGovernmentErrors] = useState<OperationOutcome[]>([]);

  // Calculate validation state
  const validationState = useMemo(() => {
    if (!submission) return { hasErrors: false, hasWarnings: false, errorCount: 0, warningCount: 0, isComplete: false };
    
    let errorCount = 0;
    let warningCount = 0;
    let filledCount = 0;
    let totalRequired = 0;
    
    submission.questionnaires.forEach((q) => {
      q.questions.forEach((qu) => {
        if (qu.required) totalRequired++;
        if (qu.finalValue !== null && qu.finalValue !== "") filledCount++;
        errorCount += qu.errors.length;
        warningCount += qu.warnings.length;
      });
    });
    
    return {
      hasErrors: errorCount > 0,
      hasWarnings: warningCount > 0,
      errorCount,
      warningCount,
      isComplete: filledCount >= totalRequired
    };
  }, [submission]);

  // Calculate completed steps
  const completedSteps = useMemo((): WorkflowStepId[] => {
    if (!submission) return [];
    const completed: WorkflowStepId[] = [];

    // Data entry is complete if we have values and no errors
    const hasData = submission.questionnaires.some((q) =>
      q.questions.some((qu) => qu.finalValue !== null && qu.finalValue !== "")
    );
    if (hasData && !validationState.hasErrors) completed.push("data-entry");

    // Preview is complete if we've moved past it
    if (submission.questionnaireResponseId) {
      completed.push("preview");
      completed.push("post-in-progress");
    }

    // Final is complete if status is completed/amended
    if (submission.fhirStatus === "completed" || submission.fhirStatus === "amended") {
      completed.push("final-submission");
    }

    return completed;
  }, [submission, validationState.hasErrors]);

  // Calculate locked steps - stricter validation
  const lockedSteps = useMemo((): WorkflowStepId[] => {
    if (!submission) return ["preview", "post-in-progress", "final-submission"];
    
    // If already completed/amended, no steps are locked (read-only view)
    if (submission.fhirStatus === "completed" || submission.fhirStatus === "amended") {
      return [];
    }
    
    const locked: WorkflowStepId[] = [];

    // Can't proceed to preview if there are errors
    if (validationState.hasErrors) {
      locked.push("preview", "post-in-progress", "final-submission");
    } else {
      // Can't go to final if no QR ID or not in-progress
      if (!submission.questionnaireResponseId || submission.fhirStatus !== "in-progress") {
        locked.push("final-submission");
      }
    }

    return locked;
  }, [submission, validationState.hasErrors]);

  if (!submission) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-xl font-semibold">Submission not found</h2>
        <Button variant="outline" asChild className="mt-4">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Submissions
          </Link>
        </Button>
      </div>
    );
  }

  const facility = getFacilityById(submission.facilityId);
  const period = getReportingPeriodById(submission.reportingPeriodId);

  const handleStepClick = (stepId: WorkflowStepId) => {
    if (!lockedSteps.includes(stepId)) {
      setCurrentStep(stepId);
    }
  };

  const handleQuestionChange = useCallback(
    (indicatorCode: string, linkId: string, value: string | number | null) => {
      setSubmission((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          questionnaires: prev.questionnaires.map((q) =>
            q.indicatorCode === indicatorCode
              ? {
                  ...q,
                  questions: q.questions.map((qu) =>
                    qu.linkId === linkId
                      ? { ...qu, finalValue: value, isOverridden: true, userValue: value, errors: [], warnings: [] }
                      : qu
                  ),
                }
              : q
          ),
        };
      });
      // Clear government errors when user makes changes
      setGovernmentErrors([]);
    },
    []
  );

  const handleQuestionRevert = useCallback(
    (indicatorCode: string, linkId: string) => {
      setSubmission((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          questionnaires: prev.questionnaires.map((q) =>
            q.indicatorCode === indicatorCode
              ? {
                  ...q,
                  questions: q.questions.map((qu) =>
                    qu.linkId === linkId
                      ? { ...qu, finalValue: qu.autoValue, isOverridden: false, userValue: null }
                      : qu
                  ),
                }
              : q
          ),
        };
      });
    },
    []
  );

  const handlePrefillAll = useCallback(() => {
    setSubmission((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        questionnaires: prev.questionnaires.map((q) => ({
          ...q,
          questions: q.questions.map((qu) => ({
            ...qu,
            finalValue: qu.autoValue,
            isOverridden: false,
          })),
        })),
      };
    });
  }, []);

  const handlePrefillMissing = useCallback(() => {
    setSubmission((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        questionnaires: prev.questionnaires.map((q) => ({
          ...q,
          questions: q.questions.map((qu) =>
            qu.finalValue === null || qu.finalValue === ""
              ? { ...qu, finalValue: qu.autoValue, isOverridden: false }
              : qu
          ),
        })),
      };
    });
  }, []);

  const handleResetAll = useCallback(() => {
    setSubmission((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        questionnaires: prev.questionnaires.map((q) => ({
          ...q,
          questions: q.questions.map((qu) => ({
            ...qu,
            finalValue: null,
            userValue: null,
            isOverridden: true, // Mark as manually edited since user explicitly cleared values
          })),
        })),
      };
    });
  }, []);

  const handleRevertAllToPipeline = useCallback(() => {
    setSubmission((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        questionnaires: prev.questionnaires.map((q) => ({
          ...q,
          questions: q.questions.map((qu) => ({
            ...qu,
            finalValue: qu.autoValue,
            userValue: null,
            isOverridden: false,
          })),
        })),
      };
    });
    setGovernmentErrors([]);
  }, []);

  const handleSaveProgress = () => {
    toast({ title: "Progress saved" });
  };

  const handlePostComplete = (qrId: string) => {
    setSubmission((prev) => (prev ? { ...prev, questionnaireResponseId: qrId } : prev));
  };

  // Handle government validation errors - map back to questions and revert step
  const handleGovernmentErrors = useCallback((errors: OperationOutcome[]) => {
    setGovernmentErrors(errors);
    
    // Map errors back to questions
    setSubmission((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        questionnaires: prev.questionnaires.map((q) => ({
          ...q,
          questions: q.questions.map((qu) => {
            // Find matching government errors for this question
            const matchingErrors = errors.filter(
              (e) => e.indicatorCode === q.indicatorCode && e.questionLinkId === qu.linkId
            );
            const newErrors = matchingErrors
              .filter((e) => e.severity === "error")
              .map((e) => e.diagnostics);
            const newWarnings = matchingErrors
              .filter((e) => e.severity === "warning")
              .map((e) => e.diagnostics);
            
            return {
              ...qu,
              errors: [...qu.errors, ...newErrors],
              warnings: [...qu.warnings, ...newWarnings],
            };
          }),
        })),
      };
    });
    
    // Revert to data entry step
    setCurrentStep("data-entry");
    
    toast({
      title: "Government Validation Failed",
      description: `${errors.filter(e => e.severity === "error").length} error(s) require correction before proceeding.`,
      variant: "destructive",
    });
  }, []);

  const handleSubmitComplete = () => {
    setSubmission((prev) =>
      prev ? { ...prev, fhirStatus: "completed", status: "Submitted" } : prev
    );
    toast({ title: "Submission complete!" });
  };

  const handleCopyQrId = () => {
    if (submission.questionnaireResponseId) {
      navigator.clipboard.writeText(submission.questionnaireResponseId);
      toast({ title: "Copied to clipboard", description: submission.questionnaireResponseId });
    }
  };

  // Check if can proceed to next step
  const canProceedToPreview = !validationState.hasErrors && validationState.isComplete;
  const canProceedToPostInProgress = canProceedToPreview;
  const canProceedToFinal = !!submission.questionnaireResponseId && !validationState.hasErrors;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">{facility?.name}</h1>
              <p className="text-sm text-muted-foreground">{period?.quarter} Submission</p>
            </div>
          </div>
        </div>
        {submission.questionnaireResponseId && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">QR ID:</span>
            <code className="text-sm bg-muted px-2 py-1 rounded">{submission.questionnaireResponseId}</code>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopyQrId}>
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Workflow Stepper with Progress & Version */}
      <div className="flex items-start gap-4">
        <Card className="flex-1">
          <CardContent className="p-4">
            <WorkflowStepper
              currentStep={currentStep}
              completedSteps={completedSteps}
              lockedSteps={lockedSteps}
              onStepClick={handleStepClick}
            />
          </CardContent>
        </Card>
        <Card className="shrink-0 w-56">
          <CardContent className="p-3 space-y-3">
            <ProgressIndicator submission={submission} />
            <VersionHistory submission={submission} />
          </CardContent>
        </Card>
      </div>

      {/* Step Content */}
      <div className="min-h-[60vh]">
        {currentStep === "data-entry" && (
          <StepDataEntry
            submission={submission}
            onSaveProgress={handleSaveProgress}
            onContinue={() => setCurrentStep("preview")}
            onQuestionChange={handleQuestionChange}
            onQuestionRevert={handleQuestionRevert}
            onPrefillAll={handlePrefillAll}
            onPrefillMissing={handlePrefillMissing}
            onResetAll={handleResetAll}
            onRevertAllToPipeline={handleRevertAllToPipeline}
            canProceed={canProceedToPreview}
            governmentErrors={governmentErrors}
          />
        )}

        {currentStep === "preview" && (
          <StepPreview
            submission={submission}
            onBack={() => setCurrentStep("data-entry")}
            onContinue={() => setCurrentStep("post-in-progress")}
            canProceed={canProceedToPostInProgress}
          />
        )}

        {currentStep === "post-in-progress" && (
          <StepPostInProgress
            submission={submission}
            onBack={() => setCurrentStep("preview")}
            onContinue={() => setCurrentStep("final-submission")}
            onPostComplete={handlePostComplete}
            onGovernmentErrors={handleGovernmentErrors}
          />
        )}

        {currentStep === "final-submission" && (
          <StepFinalSubmission
            submission={submission}
            onBack={() => setCurrentStep("post-in-progress")}
            onSubmitComplete={handleSubmitComplete}
            canProceed={canProceedToFinal}
          />
        )}
      </div>
    </div>
  );
};

export default SubmissionDetail;
