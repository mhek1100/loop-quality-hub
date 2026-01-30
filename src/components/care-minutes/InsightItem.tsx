import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, Lightbulb, AlertCircle, XCircle } from "lucide-react";
import type { Insight } from "@/lib/care-minutes/types";

interface InsightItemProps {
  insight: Insight;
}

const insightStyles = {
  success: { 
    bg: "bg-emerald-50 dark:bg-emerald-900/20", 
    border: "border-emerald-200 dark:border-emerald-800", 
    icon: CheckCircle2,
    iconClass: "text-emerald-600 dark:text-emerald-400",
  },
  warning: { 
    bg: "bg-amber-50 dark:bg-amber-900/20", 
    border: "border-amber-200 dark:border-amber-800", 
    icon: AlertTriangle,
    iconClass: "text-amber-600 dark:text-amber-400",
  },
  info: { 
    bg: "bg-blue-50 dark:bg-blue-900/20", 
    border: "border-blue-200 dark:border-blue-800", 
    icon: Lightbulb,
    iconClass: "text-blue-600 dark:text-blue-400",
  },
  alert: { 
    bg: "bg-orange-50 dark:bg-orange-900/20", 
    border: "border-orange-200 dark:border-orange-800", 
    icon: AlertCircle,
    iconClass: "text-orange-600 dark:text-orange-400",
  },
  critical: { 
    bg: "bg-red-50 dark:bg-red-900/20", 
    border: "border-red-200 dark:border-red-800", 
    icon: XCircle,
    iconClass: "text-red-600 dark:text-red-400",
  },
};

export function InsightItem({ insight }: InsightItemProps) {
  const style = insightStyles[insight.type];
  const Icon = style.icon;

  return (
    <div className={cn("flex items-start gap-3 p-3 rounded-lg border", style.bg, style.border)}>
      <div className="mt-0.5">
        <Icon className={cn("h-4 w-4", style.iconClass)} />
      </div>
      <div className="flex-1 space-y-1">
        {insight.title && (
          <p className="text-sm font-medium text-foreground">{insight.title}</p>
        )}
        <p className="text-sm text-foreground">{insight.message}</p>
        {insight.description && (
          <p className="text-xs text-muted-foreground">{insight.description}</p>
        )}
        {insight.action && (
          <p className="text-xs font-medium text-primary mt-1">→ {insight.action}</p>
        )}
      </div>
    </div>
  );
}
