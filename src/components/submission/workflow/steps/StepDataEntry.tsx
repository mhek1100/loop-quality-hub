import { useState, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { IndicatorAccordion } from "../IndicatorAccordion";
import { QI_QUESTIONNAIRE } from "@/lib/questionnaire/definitions";
import { Submission, QuestionAnswer } from "@/lib/types";
import { Zap, RotateCcw, Save, ArrowRight, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface StepDataEntryProps {
  submission: Submission;
  onSaveProgress: () => void;
  onContinue: () => void;
  onQuestionChange: (indicatorCode: string, linkId: string, value: string | number | null) => void;
  onQuestionRevert: (indicatorCode: string, linkId: string) => void;
  onPrefillAll: () => void;
  onPrefillMissing: () => void;
  onResetAll: () => void;
}

export function StepDataEntry({
  submission,
  onSaveProgress,
  onContinue,
  onQuestionChange,
  onQuestionRevert,
  onPrefillAll,
  onPrefillMissing,
  onResetAll,
}: StepDataEntryProps) {
  const [activeIndicator, setActiveIndicator] = useState<string>(QI_QUESTIONNAIRE.sections[0].code);
  const [expandedIndicators, setExpandedIndicators] = useState<string[]>([QI_QUESTIONNAIRE.sections[0].code]);
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
    
    return { totalQuestions, filledQuestions, autoFilledQuestions };
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
            <Button onClick={handleResetAll} variant="ghost" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset All to Blank
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Questionnaire Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Questionnaire</CardTitle>
          <p className="text-sm text-muted-foreground">
            Review and complete answers for each quality indicator
          </p>
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

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t">
        <Button variant="outline" onClick={onSaveProgress}>
          <Save className="h-4 w-4 mr-2" />
          Save Progress
        </Button>
        <Button onClick={onContinue}>
          Continue to Step 2
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
