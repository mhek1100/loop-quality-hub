import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { UserSwitcher } from "./UserSwitcher";
import { getFacilityById, getReportingPeriodById, getSubmission } from "@/lib/mock/data";
import { useSubmissionsStore } from "@/contexts/SubmissionsStoreContext";
import { getIndicatorByCode } from "@/lib/mock/indicators";

export function AppHeader() {
  const location = useLocation();
  const { getCreatedById } = useSubmissionsStore();

  const { title, subtitle } = useMemo(() => {
    const path = location.pathname;

    if (path === "/") {
      return { title: "Submissions", subtitle: "Manage and review NQIP submissions" };
    }

    if (path === "/kpi") {
      return { title: "KPI Dashboard", subtitle: "Performance analytics across quality indicators" };
    }

    if (path === "/audit") {
      return { title: "Audit Log", subtitle: "Track all system activity" };
    }

    if (path === "/help") {
      return { title: "Help & Resources", subtitle: "Learn about NQIP submissions and get support" };
    }

    if (path.startsWith("/settings")) {
      const settingsLabelByPath: Record<string, string> = {
        "/settings/api-variables": "API Variables",
        "/settings/pipeline": "CIS Data Pipeline",
        "/settings/users": "Users & Roles",
        "/settings/conformance": "Conformance",
      };
      return {
        title: "Settings",
        subtitle: settingsLabelByPath[path] || "Manage system configuration",
      };
    }

    if (path === "/dev/validation") {
      return { title: "Questionnaire Validation", subtitle: "Developer tools" };
    }

    const indicatorMatch = path.match(/^\/submissions\/([^/]+)\/indicator\/([^/]+)$/);
    if (indicatorMatch) {
      const [, submissionId, indicatorCode] = indicatorMatch;
      const submission = getCreatedById(submissionId) ?? getSubmission(submissionId);
      const facility = submission ? getFacilityById(submission.facilityId) : undefined;
      const indicator = getIndicatorByCode(indicatorCode as any);
      return {
        title: indicator?.name || `Indicator ${indicatorCode}`,
        subtitle: facility ? `${facility.name} • Editor` : "Editor",
      };
    }

    const submissionMatch = path.match(/^\/submissions\/([^/]+)$/);
    if (submissionMatch) {
      const [, submissionId] = submissionMatch;
      const submission = getCreatedById(submissionId) ?? getSubmission(submissionId);
      const facility = submission ? getFacilityById(submission.facilityId) : undefined;
      const period = submission ? getReportingPeriodById(submission.reportingPeriodId) : undefined;
      return {
        title: facility?.name || "Submission",
        subtitle: period ? `${period.quarter} Submission` : "Submission workflow",
      };
    }

    return { title: "Loop Quality Hub", subtitle: "" };
  }, [location.pathname, getCreatedById]);

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between shrink-0">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold text-foreground truncate">{title}</h1>
        {subtitle ? (
          <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
        ) : null}
      </div>

      <div className="flex items-center gap-4">
        <UserSwitcher />
      </div>
    </header>
  );
}
