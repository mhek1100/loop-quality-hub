import { useState } from "react";
import { Clock, User, FileCheck, FileEdit, FilePlus, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  const [isOpen, setIsOpen] = useState(false);
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

  const latestVersion = versions[versions.length - 1];
  const olderVersions = versions.slice(0, -1).reverse();

  return (
    <Card className={cn("", className)}>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          Version History
          <Badge variant="secondary" className="ml-auto text-xs">
            v{submission.submissionVersionNumber}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-0">
          {/* Latest version - always visible */}
          <div className="flex items-start gap-3 py-3 border-b border-border">
            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                getActionColor(latestVersion.action)
              )}
            >
              {getActionIcon(latestVersion.action)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm">
                  Version {latestVersion.version}
                </span>
                <Badge variant="outline" className="text-xs h-5">
                  {getActionLabel(latestVersion.action)}
                </Badge>
                {latestVersion.fhirStatus && (
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                    {latestVersion.fhirStatus}
                  </code>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{getUserName(latestVersion.userId)}</span>
                <span>•</span>
                <span>
                  {new Date(latestVersion.timestamp).toLocaleDateString()}{" "}
                  {new Date(latestVersion.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          </div>

          {/* Older versions - collapsible */}
          {olderVersions.length > 0 && (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer w-full py-2">
                <ChevronDown className={cn("h-3 w-3 transition-transform", isOpen && "rotate-180")} />
                {isOpen ? "Hide" : "Show"} {olderVersions.length} older version{olderVersions.length !== 1 ? "s" : ""}
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="space-y-0 border-t border-border">
                  {olderVersions.map((entry, index) => (
                    <div 
                      key={entry.version} 
                      className={cn(
                        "flex items-start gap-3 py-3",
                        index < olderVersions.length - 1 && "border-b border-border"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                          getActionColor(entry.action)
                        )}
                      >
                        {getActionIcon(entry.action)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">
                            Version {entry.version}
                          </span>
                          <Badge variant="outline" className="text-xs h-5">
                            {getActionLabel(entry.action)}
                          </Badge>
                          {entry.fhirStatus && (
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                              {entry.fhirStatus}
                            </code>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
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
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
