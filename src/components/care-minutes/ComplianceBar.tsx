import { cn } from "@/lib/utils";
import { getComplianceBgClass, getComplianceColorClass } from "@/lib/care-minutes/metrics";

interface ComplianceBarProps {
  value: number;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export function ComplianceBar({ value, showLabel = true, size = "md" }: ComplianceBarProps) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        "flex-1 bg-muted rounded-full overflow-hidden",
        size === "sm" ? "h-1.5" : "h-2"
      )}>
        <div 
          className={cn("h-full rounded-full transition-all", getComplianceBgClass(value))}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      {showLabel && (
        <span className={cn(
          "font-medium min-w-[45px] text-right tabular-nums",
          size === "sm" ? "text-xs" : "text-sm",
          getComplianceColorClass(value)
        )}>
          {value.toFixed(1)}%
        </span>
      )}
    </div>
  );
}
