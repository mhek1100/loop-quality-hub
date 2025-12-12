import { Clock, User, FileCheck, FileEdit, FilePlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Submission } from "@/lib/types";
import { users, getReportingPeriodById } from "@/lib/mock/data";
import { cn } from "@/lib/utils";

interface VersionHistoryProps {
  submission: Submission;
  className?: string;
}

interface VersionEntry {
  version: number;
  timestamp: string;
  userId: string;
  action: "created" | "updated" | "submitted";
  fhirStatus: string;
}

export function VersionHistory({ submission, className }: VersionHistoryProps) {
  const period = getReportingPeriodById(submission.reportingPeriodId);
  
  // Generate mock version history based on submission data
  const versions: VersionEntry[] = [];
  
  // Initial creation
  versions.push({
    version: 1,
    timestamp: submission.createdAt,
    userId: submission.createdByUserId,
    action: "created",
    fhirStatus: "in-progress",
  });

  // Add intermediate versions if version number > 1
  for (let i = 2; i < submission.submissionVersionNumber; i++) {
    const daysOffset = i * 2;
    const date = new Date(submission.createdAt);
    date.setDate(date.getDate() + daysOffset);
    versions.push({
      version: i,
      timestamp: date.toISOString(),
      userId: submission.createdByUserId,
      action: "updated",
      fhirStatus: "in-progress",
    });
  }

  // Final version
  if (submission.submissionVersionNumber > 1) {
    versions.push({
      version: submission.submissionVersionNumber,
      timestamp: submission.updatedAt,
      userId: submission.submittedByUserId || submission.createdByUserId,
      action: submission.fhirStatus === "completed" || submission.fhirStatus === "amended" ? "submitted" : "updated",
      fhirStatus: submission.fhirStatus,
    });
  }

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user?.name || "Unknown User";
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "created":
        return <FilePlus className="h-4 w-4" />;
      case "submitted":
        return <FileCheck className="h-4 w-4" />;
      default:
        return <FileEdit className="h-4 w-4" />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case "created":
        return "Created";
      case "submitted":
        return "Submitted";
      default:
        return "Updated";
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "created":
        return "bg-info/20 text-info-foreground";
      case "submitted":
        return "bg-success/20 text-success";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Version History
          <Badge variant="secondary" className="ml-auto">
            v{submission.submissionVersionNumber}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          {/* Timeline line */}
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
          
          {versions.map((entry, index) => (
            <div key={entry.version} className="relative flex gap-4">
              {/* Timeline dot */}
              <div
                className={cn(
                  "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  getActionColor(entry.action)
                )}
              >
                {getActionIcon(entry.action)}
              </div>
              
              {/* Content */}
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">
                    Version {entry.version}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {getActionLabel(entry.action)}
                  </Badge>
                  {entry.fhirStatus && (
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                      {entry.fhirStatus}
                    </code>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>{getUserName(entry.userId)}</span>
                  <span>•</span>
                  <span>
                    {new Date(entry.timestamp).toLocaleDateString()}{" "}
                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
