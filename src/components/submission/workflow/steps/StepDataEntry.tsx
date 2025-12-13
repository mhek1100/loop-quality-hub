import { useState, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { IndicatorAccordion } from "../IndicatorAccordion";
import { DataEntryStats } from "../DataEntryStats";
import { RevertConfirmDialog } from "../RevertConfirmDialog";
import { QI_QUESTIONNAIRE } from "@/lib/questionnaire/definitions";
import { Submission } from "@/lib/types";
import { Zap, RotateCcw, Save, Upload, Info, ChevronsUpDown, ChevronsDownUp, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

import { OperationOutcome } from "@/lib/types";

interface StepDataEntryProps {
  submission: Submission;
  onSaveProgress: () => void;
  onInitialSubmit: () => Promise<void> | void;
  onQuestionChange: (indicatorCode: string, linkId: string, value: string | number | null) => void;
  onQuestionRevert: (indicatorCode: string, linkId: string) => void;
  onPrefillAll: () => void;
  onPrefillMissing: () => void;
  onResetAll: () => void;
  onRevertAllToPipeline: () => void;
  canInitialSubmit?: boolean;
  initialSubmitStatus?: "idle" | "submitting" | "submitted";
  initialSubmitLabel?: string;
  governmentIssues?: OperationOutcome[];
  initialSubmissionMeta?: { submittedAt?: string };
}

export function StepDataEntry({
  submission,
  onSaveProgress,
  onInitialSubmit,
  onQuestionChange,
  onQuestionRevert,
  onPrefillAll,
  onPrefillMissing,
  onResetAll,
  onRevertAllToPipeline,
  canInitialSubmit = true,
  initialSubmitStatus = "idle",
  initialSubmitLabel = "Initial Submission",
  governmentIssues = [],
  initialSubmissionMeta,
}: StepDataEntryProps) {
  const [activeIndicator, setActiveIndicator] = useState<string>(QI_QUESTIONNAIRE.sections[0].code);
  const [expandedIndicators, setExpandedIndicators] = useState<string[]>([]);
  const [showRevertDialog, setShowRevertDialog] = useState(false);
  const indicatorRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Calculate indicator status
  const indicatorStatus = useMemo(() => {
    const status: Record<string, { hasErrors: boolean; hasWarnings: boolean; isComplete: boolean }> = {};
    
    for (const questionnaire of submission.questionnaires) {
      const hasErrors = questionnaire.questions.some((q) => q.errors.length > 0);
      const hasWarnings = questionnaire.questions.some((q) => q.warnings.length > 0);
      const isComplete = questionnaire.questions.every((q) => q.finalValue !== null && q.finalValue !== "");
      
      status[questionnaire.indicatorCode] = { hasErrors, hasWarnings, isComplete };
    }
    
    return status;
  }, [submission.questionnaires]);

  // Calculate total stats
  const stats = useMemo(() => {
    const allQuestions = submission.questionnaires.flatMap((q) => q.questions);
    const totalQuestions = allQuestions.length;
    const filledQuestions = allQuestions.filter((q) => q.finalValue !== null && q.finalValue !== "").length;
    const autoFilledQuestions = allQuestions.filter((q) => !q.isOverridden && q.autoValue !== null).length;
    const manuallyEditedQuestions = allQuestions.filter((q) => q.isOverridden).length;
    
    return { totalQuestions, filledQuestions, autoFilledQuestions, manuallyEditedQuestions };
  }, [submission.questionnaires]);

  const handleIndicatorClick = useCallback((code: string) => {
    setActiveIndicator(code);
    if (!expandedIndicators.includes(code)) {
      setExpandedIndicators([...expandedIndicators, code]);
    }
    
    // Scroll to indicator
    const ref = indicatorRefs.current[code];
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [expandedIndicators]);

  const toggleIndicator = useCallback((code: string) => {
    setExpandedIndicators((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  }, []);

  const handleExpandAll = useCallback(() => {
    setExpandedIndicators(QI_QUESTIONNAIRE.sections.map((s) => s.code));
  }, []);

  const handleCollapseAll = useCallback(() => {
    setExpandedIndicators([]);
  }, []);

  const handlePrefillAll = () => {
    onPrefillAll();
    toast({ title: "Pre-filled entire questionnaire with pipeline data" });
  };

  const handlePrefillMissing = () => {
    onPrefillMissing();
    toast({ title: "Pre-filled missing values with pipeline data" });
  };

  const handleResetAll = () => {
    onResetAll();
    toast({ title: "Reset all values to blank" });
  };

  const handleRevertAllToPipeline = () => {
    setShowRevertDialog(false);
    onRevertAllToPipeline();
    toast({ title: "Reverted all values to pipeline data" });
  };

  const serverIssueCounts = useMemo(() => {
    const errorCount = governmentIssues.filter((issue) => issue.severity === "error").length;
    const warningCount = governmentIssues.filter((issue) => issue.severity === "warning").length;
    return { errorCount, warningCount };
  }, [governmentIssues]);

  const buttonDisabled =
    !canInitialSubmit || initialSubmitStatus === "submitted" || initialSubmitStatus === "submitting";

  const statusLabel =
    initialSubmitStatus === "submitted"
      ? `Initial submission sent${initialSubmissionMeta?.submittedAt ? ` on ${new Date(initialSubmissionMeta.submittedAt).toLocaleString()}` : ""}`
      : initialSubmitStatus === "submitting"
      ? "Submitting initial payload…"
      : canInitialSubmit
      ? "Ready to send to Government"
      : "Resolve outstanding issues to continue";

  return (
    <div className="space-y-6">
      {/* Guidance Text */}
      <Alert className="bg-info/10 border-info/30">
        <Info className="h-4 w-4 text-info-foreground" />
        <AlertDescription>
          Enter all required indicator values. You may edit pipeline data if needed.
        </AlertDescription>
      </Alert>

      {/* Pre-fill Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Pre-fill from Data Pipeline
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Import answers from your internal data systems. Pipeline data is available for {stats.autoFilledQuestions} of {stats.totalQuestions} questions.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handlePrefillAll} variant="default" size="sm">
              <Zap className="h-4 w-4 mr-2" />
              Pre-fill Entire Questionnaire
            </Button>
            <Button onClick={handlePrefillMissing} variant="outline" size="sm">
              <Zap className="h-4 w-4 mr-2" />
              Pre-fill Missing Only ({stats.totalQuestions - stats.filledQuestions})
            </Button>
            <Button 
              onClick={() => setShowRevertDialog(true)} 
              variant="outline" 
              size="sm"
              disabled={stats.manuallyEditedQuestions === 0}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Revert All to Pipeline ({stats.manuallyEditedQuestions})
            </Button>
            <Button onClick={handleResetAll} variant="ghost" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset All to Blank
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Display */}
      <DataEntryStats submission={submission} />

      {/* Questionnaire Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Questionnaire</CardTitle>
              <p className="text-sm text-muted-foreground">
                Review and complete answers for each quality indicator
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExpandAll}
                className="gap-1 text-xs"
              >
                <ChevronsUpDown className="h-3.5 w-3.5" />
                Expand All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCollapseAll}
                className="gap-1 text-xs"
              >
                <ChevronsDownUp className="h-3.5 w-3.5" />
                Collapse All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Indicator Accordions */}
          <div className="space-y-4">
            {QI_QUESTIONNAIRE.sections.map((section) => {
              const questionnaire = submission.questionnaires.find(
                (q) => q.indicatorCode === section.code
              );
              if (!questionnaire) return null;

              return (
                <IndicatorAccordion
                  key={section.code}
                  id={`indicator-${section.code}`}
                  ref={(el) => (indicatorRefs.current[section.code] = el)}
                  section={section}
                  questions={questionnaire.questions}
                  onQuestionChange={(linkId, value) => onQuestionChange(section.code, linkId, value)}
                  onQuestionRevert={(linkId) => onQuestionRevert(section.code, linkId)}
                  isExpanded={expandedIndicators.includes(section.code)}
                  onToggle={() => toggleIndicator(section.code)}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Outstanding validation alert */}
      {governmentIssues.length > 0 && (
        <Alert className={serverIssueCounts.errorCount > 0 ? "border-destructive/50 bg-destructive/5" : "border-warning/50 bg-warning/5"}>
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm">
            Government validation returned {serverIssueCounts.errorCount} error{serverIssueCounts.errorCount === 1 ? "" : "s"} and{" "}
            {serverIssueCounts.warningCount} warning{serverIssueCounts.warningCount === 1 ? "" : "s"}. Issues are highlighted next to each question.
          </AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <div className="flex flex-col items-center gap-4 pt-6 pb-10 border-t text-center">
        <div className="flex flex-wrap items-center justify-center gap-4 w-full">
          <Button variant="outline" onClick={onSaveProgress} className="min-w-[200px] h-12 text-base">
            <Save className="h-4 w-4 mr-2" />
            Save Progress
          </Button>
          <Button
            onClick={onInitialSubmit}
            disabled={buttonDisabled}
            size="lg"
            className="min-w-[260px] h-12 text-base"
          >
            {initialSubmitStatus === "submitting" ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : initialSubmitStatus === "submitted" ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Initial Submission Sent
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                {initialSubmitLabel}
              </>
            )}
          </Button>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {initialSubmitStatus === "submitted" ? (
              <CheckCircle2 className="h-4 w-4 text-success" />
            ) : initialSubmitStatus === "submitting" ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <Upload className="h-4 w-4 text-muted-foreground" />
            )}
            <span>{statusLabel}</span>
          </div>
        </div>
      </div>

      {/* Revert Confirmation Dialog */}
      <RevertConfirmDialog
        open={showRevertDialog}
        onOpenChange={setShowRevertDialog}
        onConfirm={handleRevertAllToPipeline}
        editedCount={stats.manuallyEditedQuestions}
      />
    </div>
  );
}
