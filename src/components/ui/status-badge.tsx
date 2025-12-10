import { cn } from "@/lib/utils";
import { SubmissionStatus, QuestionnaireStatus, ValidationStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: SubmissionStatus | QuestionnaireStatus | ValidationStatus | string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "Submitted":
      case "Reviewed":
      case "OK":
        return "status-submitted";
      case "In Progress":
      case "Draft":
      case "Ready for Review":
        return "status-in-progress";
      case "Not Started":
        return "status-not-started";
      case "Late Submission":
      case "Submitted - Updated after Due Date":
      case "Warnings":
        return "status-late";
      case "Not Submitted":
      case "Errors":
        return "status-error";
      default:
        return "status-not-started";
    }
  };

  return (
    <span 
      className={cn(
        "status-badge",
        getStatusStyles(),
        size === "sm" && "px-2 py-0.5 text-[10px]"
      )}
    >
      {status}
    </span>
  );
}
