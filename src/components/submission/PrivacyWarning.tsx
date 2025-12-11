import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrivacyWarningProps {
  className?: string;
  compact?: boolean;
}

export function PrivacyWarning({ className, compact = false }: PrivacyWarningProps) {
  if (compact) {
    return (
      <p className={cn("text-xs text-muted-foreground italic flex items-center gap-1", className)}>
        <AlertTriangle className="h-3 w-3 text-warning shrink-0" />
        Please do not include names or information that might identify an individual.
      </p>
    );
  }

  return (
    <div
      className={cn(
        "flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20",
        className
      )}
    >
      <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
      <p className="text-sm text-warning-foreground">
        Please do not include names or information that might identify an individual.
      </p>
    </div>
  );
}
