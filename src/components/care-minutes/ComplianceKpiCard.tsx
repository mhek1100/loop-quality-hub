import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface ComplianceKpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  target?: string;
  status: "good" | "warning" | "danger";
  icon?: LucideIcon;
}

export function ComplianceKpiCard({ 
  title, 
  value, 
  subtitle,
  target, 
  status, 
  icon: Icon 
}: ComplianceKpiCardProps) {
  const statusColors = {
    good: "border-l-emerald-500 bg-emerald-500/5",
    warning: "border-l-amber-500 bg-amber-500/5",
    danger: "border-l-red-500 bg-red-500/5",
  };

  const iconBgColors = {
    good: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    warning: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    danger: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  };

  const valueColors = {
    good: "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
    danger: "text-red-600 dark:text-red-400",
  };

  return (
    <Card className={cn("border-l-4", statusColors[status])}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={cn("text-2xl font-bold", valueColors[status])}>{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            {target && <p className="text-xs text-muted-foreground">{target}</p>}
          </div>
          {Icon && (
            <div className={cn("p-2 rounded-lg", iconBgColors[status])}>
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper to determine status from compliance value
export function getKpiStatus(value: number): "good" | "warning" | "danger" {
  if (value >= 100) return "good";
  if (value >= 95) return "warning";
  return "danger";
}

// Helper to determine status from count metrics
export function getCountStatus(current: number, total: number, inverse: boolean = false): "good" | "warning" | "danger" {
  const ratio = current / total;
  if (inverse) {
    if (current === 0) return "good";
    if (current <= 1) return "warning";
    return "danger";
  }
  if (ratio >= 1) return "good";
  if (ratio >= 0.75) return "warning";
  return "danger";
}
