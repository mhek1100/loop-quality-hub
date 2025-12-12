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
    <div className={cn("flex items-center gap-4", className)}>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Progress:</span>
        <span className="font-medium">
          {stats.complete}/{stats.total}
        </span>
      </div>
      <Progress value={stats.percentage} className="h-2 w-32 flex-shrink-0" />
      <span className="text-sm text-muted-foreground">{stats.percentage}%</span>
      
      <div className="flex items-center gap-3 text-xs">
        {stats.percentage === 100 && stats.errors === 0 && (
          <span className="flex items-center gap-1 text-success">
            <Check className="h-3.5 w-3.5" />
            Complete
          </span>
        )}
        {stats.errors > 0 && (
          <span className="flex items-center gap-1 text-destructive">
            <AlertCircle className="h-3.5 w-3.5" />
            {stats.errors} error{stats.errors !== 1 ? "s" : ""}
          </span>
        )}
        {stats.warnings > 0 && (
          <span className="flex items-center gap-1 text-warning">
            <AlertTriangle className="h-3.5 w-3.5" />
            {stats.warnings} warning{stats.warnings !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
}
