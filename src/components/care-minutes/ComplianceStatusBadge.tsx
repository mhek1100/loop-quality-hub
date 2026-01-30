import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ComplianceStatus, RiskLevel } from "@/lib/care-minutes/types";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

interface ComplianceStatusBadgeProps {
  status: ComplianceStatus;
  showIcon?: boolean;
  size?: "sm" | "md";
}

const statusConfig: Record<ComplianceStatus, { 
  label: string; 
  className: string;
  icon: typeof CheckCircle2;
}> = {
  "compliant": { 
    label: "Compliant", 
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200",
    icon: CheckCircle2,
  },
  "at-risk": { 
    label: "At Risk", 
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200",
    icon: AlertTriangle,
  },
  "non-compliant": { 
    label: "Non-Compliant", 
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200",
    icon: XCircle,
  },
};

export function ComplianceStatusBadge({ status, showIcon = false, size = "md" }: ComplianceStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-medium",
        config.className,
        size === "sm" && "px-2 py-0.5 text-xs"
      )}
    >
      {showIcon && <Icon className={cn("mr-1.5", size === "sm" ? "h-3 w-3" : "h-4 w-4")} />}
      {config.label}
    </Badge>
  );
}

// Risk badge variant
interface RiskBadgeProps {
  level: RiskLevel;
  size?: "sm" | "md";
}

const riskConfig: Record<RiskLevel, { label: string; className: string }> = {
  "low": { 
    label: "Low Risk", 
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200" 
  },
  "medium": { 
    label: "At Risk", 
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200" 
  },
  "high": { 
    label: "High Risk", 
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200" 
  },
};

export function RiskBadge({ level, size = "md" }: RiskBadgeProps) {
  const config = riskConfig[level];
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-medium",
        config.className,
        size === "sm" && "px-2 py-0.5 text-xs"
      )}
    >
      {config.label}
    </Badge>
  );
}
