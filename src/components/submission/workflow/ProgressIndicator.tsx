import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { Submission } from "@/lib/types";
import { Check, AlertCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  submission: Submission;
  className?: string;
}

export function ProgressIndicator({ submission, className }: ProgressIndicatorProps) {
  const stats = useMemo(() => {
    const allQuestions = submission.questionnaires.flatMap((q) => q.questions);
    const total = allQuestions.length;
    // Count as complete: has value AND no errors (warnings are OK)
    const complete = allQuestions.filter(
      (q) => q.finalValue !== null && q.finalValue !== "" && q.errors.length === 0
    ).length;
    const errors = allQuestions.filter((q) => q.errors.length > 0).length;
    const warnings = allQuestions.filter((q) => q.warnings.length > 0 && q.errors.length === 0).length;
    const percentage = total > 0 ? Math.round((complete / total) * 100) : 0;

    return { total, complete, errors, warnings, percentage };
  }, [submission.questionnaires]);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Progress</span>
        <span className="font-medium">{stats.percentage}%</span>
      </div>
      <Progress value={stats.percentage} className="h-1.5" />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{stats.complete}/{stats.total} complete</span>
        <div className="flex items-center gap-2">
          {stats.percentage === 100 && stats.errors === 0 && (
            <span className="flex items-center gap-0.5 text-success">
              <Check className="h-3 w-3" />
            </span>
          )}
          {stats.errors > 0 && (
            <span className="flex items-center gap-0.5 text-destructive">
              <AlertCircle className="h-3 w-3" />
              {stats.errors}
            </span>
          )}
          {stats.warnings > 0 && (
            <span className="flex items-center gap-0.5 text-warning">
              <AlertTriangle className="h-3 w-3" />
              {stats.warnings}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
