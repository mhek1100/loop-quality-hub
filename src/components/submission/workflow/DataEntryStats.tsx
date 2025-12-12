import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Submission } from "@/lib/types";
import { CheckCircle, Edit3, Zap, AlertCircle } from "lucide-react";

interface DataEntryStatsProps {
  submission: Submission;
}

export function DataEntryStats({ submission }: DataEntryStatsProps) {
  const stats = useMemo(() => {
    const allQuestions = submission.questionnaires.flatMap((q) => q.questions);
    
    const totalQuestions = allQuestions.length;
    const filledQuestions = allQuestions.filter(
      (q) => q.finalValue !== null && q.finalValue !== ""
    ).length;
    const autoFilledQuestions = allQuestions.filter(
      (q) => !q.isOverridden && q.finalValue !== null && q.finalValue !== "" && q.autoValue !== null
    ).length;
    const manuallyEditedQuestions = allQuestions.filter((q) => q.isOverridden).length;
    const emptyQuestions = totalQuestions - filledQuestions;
    const errorsCount = allQuestions.filter((q) => q.errors.length > 0).length;
    const warningsCount = allQuestions.filter((q) => q.warnings.length > 0).length;
    
    const completionPercent = totalQuestions > 0 
      ? Math.round((filledQuestions / totalQuestions) * 100) 
      : 0;

    return {
      totalQuestions,
      filledQuestions,
      autoFilledQuestions,
      manuallyEditedQuestions,
      emptyQuestions,
      errorsCount,
      warningsCount,
      completionPercent,
    };
  }, [submission.questionnaires]);

  return (
    <div className="flex flex-wrap items-center gap-3 p-3 bg-muted/30 rounded-lg">
      <div className="flex items-center gap-1.5">
        <CheckCircle className="h-4 w-4 text-success" />
        <span className="text-sm font-medium">{stats.completionPercent}%</span>
        <span className="text-sm text-muted-foreground">complete</span>
      </div>
      
      <span className="text-muted-foreground">•</span>
      
      <div className="flex items-center gap-1.5">
        <Zap className="h-4 w-4 text-primary" />
        <Badge variant="secondary" className="text-xs">
          {stats.autoFilledQuestions} auto-filled
        </Badge>
      </div>
      
      <div className="flex items-center gap-1.5">
        <Edit3 className="h-4 w-4 text-info" />
        <Badge variant="outline" className="text-xs">
          {stats.manuallyEditedQuestions} manually edited
        </Badge>
      </div>
      
      {stats.emptyQuestions > 0 && (
        <Badge variant="secondary" className="text-xs text-muted-foreground">
          {stats.emptyQuestions} empty
        </Badge>
      )}
      
      {stats.errorsCount > 0 && (
        <div className="flex items-center gap-1.5">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <Badge variant="destructive" className="text-xs">
            {stats.errorsCount} {stats.errorsCount === 1 ? "error" : "errors"}
          </Badge>
        </div>
      )}
    </div>
  );
}