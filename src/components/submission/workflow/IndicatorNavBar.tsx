import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { QI_QUESTIONNAIRE } from "@/lib/questionnaire/definitions";
import { AlertCircle, Check } from "lucide-react";

interface IndicatorNavBarProps {
  activeIndicator: string;
  onIndicatorClick: (code: string) => void;
  indicatorStatus: Record<string, { hasErrors: boolean; hasWarnings: boolean; isComplete: boolean }>;
  className?: string;
}

export function IndicatorNavBar({
  activeIndicator,
  onIndicatorClick,
  indicatorStatus,
  className,
}: IndicatorNavBarProps) {
  return (
    <div className={cn("flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg sticky top-0 z-10", className)}>
      {QI_QUESTIONNAIRE.sections.map((section) => {
        const status = indicatorStatus[section.code] || { hasErrors: false, hasWarnings: false, isComplete: false };
        const isActive = activeIndicator === section.code;

        return (
          <button
            key={section.code}
            onClick={() => onIndicatorClick(section.code)}
            className={cn(
              "relative px-3 py-1.5 rounded-full text-sm font-medium transition-all",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-background hover:bg-muted border border-border",
              status.hasErrors && !isActive && "border-destructive/50 text-destructive",
              status.hasWarnings && !status.hasErrors && !isActive && "border-warning/50 text-warning"
            )}
          >
            {section.code}
            {status.hasErrors && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full flex items-center justify-center">
                <AlertCircle className="h-2 w-2 text-destructive-foreground" />
              </span>
            )}
            {status.isComplete && !status.hasErrors && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full flex items-center justify-center">
                <Check className="h-2 w-2 text-success-foreground" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
