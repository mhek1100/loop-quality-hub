import { Link } from "react-router-dom";
import { AlertCircle, AlertTriangle, ExternalLink, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OperationOutcome } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ValidationIssuesListProps {
  outcomes: OperationOutcome[];
  submissionId: string;
  onNavigateToIndicator?: (indicatorCode: string, questionLinkId?: string) => void;
  className?: string;
}

export function ValidationIssuesList({
  outcomes,
  submissionId,
  onNavigateToIndicator,
  className,
}: ValidationIssuesListProps) {
  const errors = outcomes.filter((o) => o.severity === "error");
  const warnings = outcomes.filter((o) => o.severity === "warning");

  if (outcomes.length === 0) return null;

  const handleViewAndFix = (indicatorCode: string, questionLinkId?: string) => {
    if (onNavigateToIndicator) {
      onNavigateToIndicator(indicatorCode, questionLinkId);
    }
  };

  return (
    <Card className={cn("border-destructive/20", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          Validation Issues
          <Badge variant="destructive" className="ml-2">
            {errors.length} Error{errors.length !== 1 ? "s" : ""}
          </Badge>
          {warnings.length > 0 && (
            <Badge variant="outline" className="text-warning border-warning">
              {warnings.length} Warning{warnings.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {errors.map((outcome, index) => (
          <div
            key={`error-${index}`}
            className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20"
          >
            <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {outcome.indicatorCode && (
                  <code className="text-xs bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">
                    {outcome.indicatorCode}
                  </code>
                )}
                {outcome.questionLinkId && (
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                    {outcome.questionLinkId}
                  </code>
                )}
                <Badge variant="destructive" className="text-[10px]">
                  Error
                </Badge>
              </div>
              <p className="text-sm text-destructive">{outcome.diagnostics}</p>
            </div>
            {outcome.indicatorCode && (
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleViewAndFix(outcome.indicatorCode!, outcome.questionLinkId)}
              >
                <ArrowRight className="h-3 w-3 mr-1" />
                View & Fix
              </Button>
            )}
          </div>
        ))}

        {warnings.map((outcome, index) => (
          <div
            key={`warning-${index}`}
            className="flex items-start gap-3 p-3 rounded-lg bg-warning/5 border border-warning/20"
          >
            <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {outcome.indicatorCode && (
                  <code className="text-xs bg-warning/10 text-warning px-1.5 py-0.5 rounded">
                    {outcome.indicatorCode}
                  </code>
                )}
                {outcome.questionLinkId && (
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                    {outcome.questionLinkId}
                  </code>
                )}
                <Badge
                  variant="outline"
                  className="text-[10px] text-warning border-warning"
                >
                  Warning
                </Badge>
              </div>
              <p className="text-sm text-warning">{outcome.diagnostics}</p>
            </div>
            {outcome.indicatorCode && (
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 text-warning hover:text-warning hover:bg-warning/10"
                onClick={() => handleViewAndFix(outcome.indicatorCode!, outcome.questionLinkId)}
              >
                <ArrowRight className="h-3 w-3 mr-1" />
                View & Fix
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
