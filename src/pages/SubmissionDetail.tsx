import { useState, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2 } from "lucide-react";
import { getSubmission, getFacilityById, getReportingPeriodById } from "@/lib/mock/data";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { WorkflowStepper, WorkflowStepId, WORKFLOW_STEPS } from "@/components/submission/workflow/WorkflowStepper";
import { StepDataEntry } from "@/components/submission/workflow/steps/StepDataEntry";
import { StepPreview } from "@/components/submission/workflow/steps/StepPreview";
import { StepPostInProgress } from "@/components/submission/workflow/steps/StepPostInProgress";
import { StepFinalSubmission } from "@/components/submission/workflow/steps/StepFinalSubmission";
import { Submission } from "@/lib/types";

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

  // Calculate completed steps
  const completedSteps = useMemo((): WorkflowStepId[] => {
    if (!submission) return [];
    const completed: WorkflowStepId[] = [];

    // Data entry is complete if we have values
    const hasData = submission.questionnaires.some((q) =>
      q.questions.some((qu) => qu.finalValue !== null && qu.finalValue !== "")
    );
    if (hasData) completed.push("data-entry");

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
  }, [submission]);

  // Calculate locked steps
  const lockedSteps = useMemo((): WorkflowStepId[] => {
    if (!submission) return ["preview", "post-in-progress", "final-submission"];
    const locked: WorkflowStepId[] = [];

    // Can't go to final if no QR ID or not in-progress
    if (!submission.questionnaireResponseId || submission.fhirStatus !== "in-progress") {
      locked.push("final-submission");
    }

    return locked;
  }, [submission]);

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
                      ? { ...qu, finalValue: value, isOverridden: true, userValue: value }
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
            isOverridden: false,
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
  }, []);

  const handleSaveProgress = () => {
    toast({ title: "Progress saved" });
  };

  const handlePostComplete = (qrId: string) => {
    setSubmission((prev) => (prev ? { ...prev, questionnaireResponseId: qrId } : prev));
  };

  const handleSubmitComplete = () => {
    setSubmission((prev) =>
      prev ? { ...prev, fhirStatus: "completed", status: "Submitted" } : prev
    );
    toast({ title: "Submission complete!" });
  };

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
      </div>

      {/* Workflow Stepper */}
      <Card>
        <CardContent className="p-6">
          <WorkflowStepper
            currentStep={currentStep}
            completedSteps={completedSteps}
            lockedSteps={lockedSteps}
            onStepClick={handleStepClick}
          />
        </CardContent>
      </Card>

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
          />
        )}

        {currentStep === "preview" && (
          <StepPreview
            submission={submission}
            onBack={() => setCurrentStep("data-entry")}
            onContinue={() => setCurrentStep("post-in-progress")}
          />
        )}

        {currentStep === "post-in-progress" && (
          <StepPostInProgress
            submission={submission}
            onBack={() => setCurrentStep("preview")}
            onContinue={() => setCurrentStep("final-submission")}
            onPostComplete={handlePostComplete}
          />
        )}

        {currentStep === "final-submission" && (
          <StepFinalSubmission
            submission={submission}
            onBack={() => setCurrentStep("post-in-progress")}
            onSubmitComplete={handleSubmitComplete}
          />
        )}
      </div>
    </div>
  );
};

export default SubmissionDetail;
