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
import { StepValidation } from "@/components/submission/workflow/steps/StepValidation";
import { StepCompletion } from "@/components/submission/workflow/steps/StepCompletion";
import { ProgressIndicator } from "@/components/submission/workflow/ProgressIndicator";
import { VersionHistory } from "@/components/submission/workflow/VersionHistory";
import { Submission, OperationOutcome } from "@/lib/types";
import { SUBMISSION_SCENARIO_CONFIG, getSubmissionScenario } from "@/lib/submission-utils";

const GOV_PREFIX = "[GOVT]";

interface GovernmentValidationResult {
  success: boolean;
  errors: OperationOutcome[];
  warnings: OperationOutcome[];
}

const generateMockGovernmentValidation = (submission: Submission): GovernmentValidationResult => {
  const errors: OperationOutcome[] = [];
  const warnings: OperationOutcome[] = [];

  submission.questionnaires.forEach((q) => {
    q.questions.forEach((question) => {
      if (typeof question.finalValue === "number" && question.finalValue < 0) {
        errors.push({
          severity: "error",
          code: "invalid",
          diagnostics: `${GOV_PREFIX} Value must be a non-negative integer. Received: ${question.finalValue}`,
          indicatorCode: q.indicatorCode,
          questionLinkId: question.linkId,
          location: `${q.indicatorCode}/${question.linkId}`,
        });
      }

      if (question.linkId.includes("-01") && question.finalValue === 0) {
        errors.push({
          severity: "error",
          code: "business-rule",
          diagnostics: `${GOV_PREFIX} Total count cannot be zero for indicator ${q.indicatorCode}`,
          indicatorCode: q.indicatorCode,
          questionLinkId: question.linkId,
          location: `${q.indicatorCode}/${question.linkId}`,
        });
      }

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
            diagnostics: `${GOV_PREFIX} Stage 2+ count (${question.finalValue}) cannot exceed total pressure injuries (${totalQuestion.finalValue})`,
            indicatorCode: q.indicatorCode,
            questionLinkId: question.linkId,
            location: `${q.indicatorCode}/${question.linkId}`,
          });
        }
      }

      if (question.linkId.includes("Rate") || question.linkId.includes("Percent")) {
        if (typeof question.finalValue === "number" && question.finalValue > 100) {
          errors.push({
            severity: "error",
            code: "invalid",
            diagnostics: `${GOV_PREFIX} Percentage value cannot exceed 100%. Received: ${question.finalValue}%`,
            indicatorCode: q.indicatorCode,
            questionLinkId: question.linkId,
            location: `${q.indicatorCode}/${question.linkId}`,
          });
        }
      }

      if (question.linkId.includes("Comment") && !question.finalValue) {
        const numericQuestions = q.questions.filter(
          (qu) => typeof qu.finalValue === "number" && qu.finalValue > 50
        );
        if (numericQuestions.length > 0) {
          warnings.push({
            severity: "warning",
            code: "informational",
            diagnostics: `${GOV_PREFIX} Comment recommended when reporting high values in ${q.indicatorCode}`,
            indicatorCode: q.indicatorCode,
            questionLinkId: question.linkId,
            location: `${q.indicatorCode}/${question.linkId}`,
          });
        }
      }
    });
  });

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
};

const SubmissionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [submission, setSubmission] = useState<Submission | undefined>(() => getSubmission(id || ""));
  const { currentUser, canPostInProgress } = useUser();

  // Determine initial step based on submission state
  const getInitialStep = (): WorkflowStepId => {
    if (!submission) return "data-entry";
    if (submission.fhirStatus === "completed" || submission.fhirStatus === "amended") {
      return "completion";
    }
    if (submission.questionnaireResponseId) {
      return "validation";
    }
    return "data-entry";
  };

  const [currentStep, setCurrentStep] = useState<WorkflowStepId>(getInitialStep);
  const [governmentIssues, setGovernmentIssues] = useState<OperationOutcome[]>([]);
  const [initialSubmitStatus, setInitialSubmitStatus] = useState<"idle" | "submitting" | "submitted">(
    submission?.questionnaireResponseId ? "submitted" : "idle"
  );
  const [initialSubmissionMeta, setInitialSubmissionMeta] = useState<{ submittedAt?: string }>({
    submittedAt: submission?.questionnaireResponseId ? submission.lastSubmittedDate : undefined,
  });

  // Calculate validation state
  const validationState = useMemo(() => {
    if (!submission) {
      return {
        hasErrors: false,
        hasWarnings: false,
        errorCount: 0,
        warningCount: 0,
        missingRequired: 0,
        totalQuestions: 0,
        filledCount: 0,
        isComplete: false,
      };
    }

    let errorCount = 0;
    let warningCount = 0;
    let filledCount = 0;
    let missingRequired = 0;
    let totalQuestions = 0;

    submission.questionnaires.forEach((q) => {
      q.questions.forEach((qu) => {
        totalQuestions++;
        if (qu.required && (qu.finalValue === null || qu.finalValue === "")) {
          missingRequired++;
        }
        if (qu.finalValue !== null && qu.finalValue !== "") {
          filledCount++;
        }
        errorCount += qu.errors.length;
        warningCount += qu.warnings.length;
      });
    });

    return {
      hasErrors: errorCount > 0,
      hasWarnings: warningCount > 0,
      errorCount,
      warningCount,
      missingRequired,
      totalQuestions,
      filledCount,
      isComplete: missingRequired === 0,
    };
  }, [submission]);

  // Calculate completed steps
  const initialButtonReady = !validationState.hasErrors && validationState.missingRequired === 0;
  const hasInitialSubmission = !!submission?.questionnaireResponseId;
  const validationSummaryForStep = {
    totalQuestions: validationState.totalQuestions,
    filledQuestions: validationState.filledCount,
    errorCount: validationState.errorCount,
    warningCount: validationState.warningCount,
    missingRequired: validationState.missingRequired,
  };

  const completedSteps = useMemo((): WorkflowStepId[] => {
    if (!submission) return [];
    const completed: WorkflowStepId[] = [];

    if (submission.questionnaireResponseId) {
      completed.push("data-entry");
    }

    if (submission.fhirStatus === "completed" || submission.fhirStatus === "amended") {
      completed.push("validation", "completion");
    }

    return completed;
  }, [submission]);

  // Calculate locked steps - stricter validation
  const lockedSteps = useMemo((): WorkflowStepId[] => {
    if (!submission) return ["validation", "completion"];

    if (submission.fhirStatus === "completed" || submission.fhirStatus === "amended") {
      return [];
    }

    const locked: WorkflowStepId[] = [];

    if (!submission.questionnaireResponseId) {
      locked.push("validation", "completion");
    } else {
      locked.push("completion");
    }

    return locked;
  }, [submission]);

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
      setGovernmentIssues([]);
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
    setGovernmentIssues([]);
  }, []);

  const handleSaveProgress = () => {
    toast({ title: "Progress saved" });
  };

  const handleGovernmentIssues = useCallback((issues: OperationOutcome[]) => {
    setGovernmentIssues(issues);

    setSubmission((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        questionnaires: prev.questionnaires.map((q) => ({
          ...q,
          questions: q.questions.map((qu) => {
            const matching = issues.filter(
              (issue) => issue.indicatorCode === q.indicatorCode && issue.questionLinkId === qu.linkId
            );

            const govErrors = matching
              .filter((issue) => issue.severity === "error")
              .map((issue) => issue.diagnostics);
            const govWarnings = matching
              .filter((issue) => issue.severity === "warning")
              .map((issue) => issue.diagnostics);

            return {
              ...qu,
              errors: [
                ...qu.errors.filter((msg) => !msg.includes(GOV_PREFIX)),
                ...govErrors,
              ],
              warnings: [
                ...qu.warnings.filter((msg) => !msg.includes(GOV_PREFIX)),
                ...govWarnings,
              ],
            };
          }),
        })),
      };
    });
  }, []);

  const handleInitialSubmission = useCallback(async () => {
    if (!submission) return;
    setInitialSubmitStatus("submitting");

    await new Promise((resolve) => setTimeout(resolve, 1200));

    const validation = generateMockGovernmentValidation(submission);
    handleGovernmentIssues([...validation.errors, ...validation.warnings]);

    if (validation.success) {
      const qrId = submission.questionnaireResponseId || `QIQR-${Date.now()}`;
      const timestamp = new Date().toISOString();
      setSubmission((prev) =>
        prev
          ? {
              ...prev,
              questionnaireResponseId: qrId,
              fhirStatus: "in-progress",
              apiWorkflowStep: "in-progress-posted",
              lastApiOperation: {
                timestamp,
                method: "POST",
                endpoint: "/fhir/QuestionnaireResponse",
                httpStatus: 201,
                questionnaireResponseId: qrId,
                warningsCount: validation.warnings.length,
                errorsCount: 0,
                performedByUserId: currentUser.id,
                performedByEmail: currentUser.email || "",
                roles: [],
              },
            }
          : prev
      );
      setInitialSubmitStatus("submitted");
      setInitialSubmissionMeta({ submittedAt: timestamp });
      setCurrentStep("validation");
      toast({
        title: "Initial submission sent",
        description:
          validation.warnings.length > 0
            ? `${validation.warnings.length} warning(s) returned from Government.`
            : "Government accepted the initial payload.",
      });
    } else {
      setInitialSubmitStatus("idle");
      setCurrentStep("data-entry");
      toast({
        title: "Government validation failed",
        description: `${validation.errors.length} error(s) require correction before proceeding.`,
        variant: "destructive",
      });
    }
  }, [submission, currentUser.id, currentUser.email, handleGovernmentIssues]);

  const handleFinalSubmission = useCallback(
    async (_payload: object) => {
      if (!submission) return { success: false };

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const validation = generateMockGovernmentValidation(submission);
      handleGovernmentIssues([...validation.errors, ...validation.warnings]);

      if (!validation.success) {
        toast({
          title: "Final submission blocked",
          description: `${validation.errors.length} error(s) must be resolved.`,
          variant: "destructive",
        });
        return { success: false };
      }

      const period = getReportingPeriodById(submission.reportingPeriodId);
      const periodDueDate = period ? new Date(period.dueDate) : new Date();
      const submissionScenario = getSubmissionScenario(submission, periodDueDate);
      const scenarioConfig = SUBMISSION_SCENARIO_CONFIG[submissionScenario];

      const timestamp = new Date().toISOString();
      setSubmission((prev) =>
        prev
          ? {
              ...prev,
              fhirStatus: scenarioConfig.fhirTargetStatus,
              status: scenarioConfig.submissionStatus,
              lastSubmittedDate: timestamp,
              apiWorkflowStep: "submitted",
              lastApiOperation: {
                timestamp,
                method: "PATCH",
                endpoint: `/fhir/QuestionnaireResponse/${prev.questionnaireResponseId}`,
                httpStatus: 200,
                questionnaireResponseId: prev.questionnaireResponseId,
                warningsCount: validation.warnings.length,
                errorsCount: 0,
                performedByUserId: currentUser.id,
                performedByEmail: currentUser.email || "",
                roles: [],
              },
            }
          : prev
      );

      setCurrentStep("completion");
      toast({
        title: "Submission complete!",
        description:
          validation.warnings.length > 0
            ? `${scenarioConfig.label} completed with ${validation.warnings.length} warning(s).`
            : `${scenarioConfig.label} accepted by Government.`,
      });

      return { success: true };
    },
    [submission, currentUser.id, currentUser.email, handleGovernmentIssues]
  );

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

  const handleCopyQrId = () => {
    if (submission.questionnaireResponseId) {
      navigator.clipboard.writeText(submission.questionnaireResponseId);
      toast({ title: "Copied to clipboard", description: submission.questionnaireResponseId });
    }
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
            onInitialSubmit={handleInitialSubmission}
            onProceedToValidation={() => setCurrentStep("validation")}
            onQuestionChange={handleQuestionChange}
            onQuestionRevert={handleQuestionRevert}
            onPrefillAll={handlePrefillAll}
            onPrefillMissing={handlePrefillMissing}
            onResetAll={handleResetAll}
            onRevertAllToPipeline={handleRevertAllToPipeline}
            canInitialSubmit={canPostInProgress && initialButtonReady}
            initialSubmitStatus={initialSubmitStatus}
            initialSubmissionMeta={initialSubmissionMeta}
            governmentIssues={governmentIssues}
          />
        )}

        {currentStep === "validation" && (
          <StepValidation
            submission={submission}
            validationSummary={validationSummaryForStep}
            governmentIssues={governmentIssues}
            onFinalSubmit={handleFinalSubmission}
            hasInitialSubmission={hasInitialSubmission}
          />
        )}

        {currentStep === "completion" && <StepCompletion submission={submission} />}
      </div>
    </div>
  );
};

export default SubmissionDetail;
