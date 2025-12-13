import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import { StatusBadge } from "@/components/ui/status-badge";
import { ProgressIndicator } from "@/components/submission/workflow/ProgressIndicator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Building2,
  Search,
  AlertTriangle,
  AlertCircle,
  Eye,
  Clock,
  Copy,
} from "lucide-react";
import {
  facilities,
  submissions,
  reportingPeriods,
  getFacilityById,
  getReportingPeriodById,
  getLatestReportingPeriod,
} from "@/lib/mock/data";

import { toast } from "@/hooks/use-toast";
import { Submission, SubmissionStatus, ReportingPeriod } from "@/lib/types";
import { DemoScenariosPanel } from "@/components/submissions/DemoScenariosPanel";
import { useUser } from "@/contexts/UserContext";

const ITEMS_PER_PAGE = 5;

const STATUS_DEFINITIONS: Record<SubmissionStatus, string> = {
  "Not Started": "Collection period started but no draft or submission exists yet.",
  "In Progress": "Draft created and being reviewed; not finalised.",
  "Submitted": "Final submission sent to Government within the period.",
  "Late Submission": "Final submission sent after the period ended.",
  "Submitted - Updated after Due Date": "Submitted within period, then amended after due date.",
  "Not Submitted": "Period ended with no final submission.",
};

type WorkflowStage =
  | "not-started"
  | "draft-review"
  | "awaiting-final"
  | "finalized"
  | "not-submitted";

interface WorkflowInfo {
  stage: WorkflowStage;
  nextStep: string;
  actionLabel: string;
  actionVariant: "default" | "outline";
  actionRequires: "edit" | "post-in-progress" | "final-submit" | null;
  priority: number;
}

const getWorkflowInfo = (submission: Submission): WorkflowInfo => {
  const isFinal =
    submission.fhirStatus === "completed" ||
    submission.fhirStatus === "amended" ||
    ["Submitted", "Late Submission", "Submitted - Updated after Due Date"].includes(submission.status);

  if (isFinal) {
    const nextStep =
      submission.status === "Late Submission"
        ? "Submitted late"
        : submission.status === "Submitted - Updated after Due Date"
        ? "Amended after due date"
        : "Complete";

    return {
      stage: "finalized",
      nextStep,
      actionLabel: "View",
      actionVariant: "outline",
      actionRequires: null,
      priority: 4,
    };
  }

  const hasPostedDraft =
    submission.apiWorkflowStep === "in-progress-posted" ||
    submission.apiWorkflowStep === "awaiting-approval" ||
    submission.apiWorkflowStep === "review-complete" ||
    submission.apiWorkflowStep === "submitted" ||
    !!submission.questionnaireResponseId;

  if (hasPostedDraft) {
    return {
      stage: "awaiting-final",
      nextStep: "Final review & submit to Government",
      actionLabel: "Final Review",
      actionVariant: "default",
      actionRequires: "final-submit",
      priority: 0,
    };
  }

  if (submission.status === "In Progress") {
    return {
      stage: "draft-review",
      nextStep: "Review data & send in-progress submission",
      actionLabel: "Review & Send",
      actionVariant: "default",
      actionRequires: "post-in-progress",
      priority: 1,
    };
  }

  if (submission.status === "Not Submitted") {
    return {
      stage: "not-submitted",
      nextStep: "Period ended with no final submission",
      actionLabel: "View",
      actionVariant: "outline",
      actionRequires: null,
      priority: 3,
    };
  }

  return {
    stage: "not-started",
    nextStep: "Start data review",
    actionLabel: "Start",
    actionVariant: "default",
    actionRequires: "edit",
    priority: 2,
  };
};

const getDueInfo = (period?: ReportingPeriod) => {
  if (!period?.dueDate) {
    return { label: "-", tone: "normal" as const, daysUntil: null as number | null };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(period.dueDate);
  due.setHours(0, 0, 0, 0);

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysUntil = Math.ceil((due.getTime() - today.getTime()) / msPerDay);

  if (daysUntil < 0) {
    const overdueDays = Math.abs(daysUntil);
    return {
      label: `Overdue by ${overdueDays} day${overdueDays === 1 ? "" : "s"}`,
      tone: "overdue" as const,
      daysUntil,
    };
  }

  if (daysUntil === 0) {
    return { label: "Due today", tone: "warning" as const, daysUntil };
  }

  if (daysUntil <= 7) {
    return { label: `Due in ${daysUntil} days`, tone: "warning" as const, daysUntil };
  }

  return {
    label: `Due ${due.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`,
    tone: "normal" as const,
    daysUntil,
  };
};

type DueTone = "normal" | "warning" | "overdue" | "success";

const FINAL_STATUSES: SubmissionStatus[] = [
  "Submitted",
  "Late Submission",
  "Submitted - Updated after Due Date",
];

const isFinalSubmission = (submission: Submission) =>
  FINAL_STATUSES.includes(submission.status) ||
  submission.fhirStatus === "completed" ||
  submission.fhirStatus === "amended";

const formatDateLabel = (dateString?: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getDueDisplay = (submission: Submission, period?: ReportingPeriod) => {
  const dueInfo = getDueInfo(period);

  if (isFinalSubmission(submission)) {
    const submittedAt = submission.lastSubmittedDate || submission.updatedAt;
    const formatted = formatDateLabel(submittedAt);
    let label = formatted ? `Submitted ${formatted}` : "Submitted";
    let tone: DueTone = "success";

    if (submission.status === "Late Submission") {
      label = formatted ? `Submitted late ${formatted}` : "Submitted late";
      tone = "warning";
    } else if (submission.status === "Submitted - Updated after Due Date") {
      label = formatted ? `Amended ${formatted}` : "Amended after due date";
      tone = "warning";
    }

    return { label, tone };
  }

  return { label: dueInfo.label, tone: dueInfo.tone };
};

const getDueToneClass = (tone: DueTone) => {
  switch (tone) {
    case "overdue":
      return "text-sm font-medium text-destructive";
    case "warning":
      return "text-sm font-medium text-warning";
    case "success":
      return "text-sm font-medium text-success";
    default:
      return "text-sm text-muted-foreground";
  }
};

const Submissions = () => {
  const latestPeriod = getLatestReportingPeriod();
  const [selectedQuarter, setSelectedQuarter] = useState(latestPeriod.id);
  const [selectedFacility, setSelectedFacility] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [hasWarningsFilter, setHasWarningsFilter] = useState(false);
  const [hasErrorsFilter, setHasErrorsFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { canEdit, canPostInProgress, canFinalSubmit } = useUser();
  const [currentPage, setCurrentPage] = useState(1);

  const stats = useMemo(() => {
    let needsReview = 0;
    let awaitingFinal = 0;
    let overdueOrMissing = 0;

    submissions.forEach((s) => {
      const period = getReportingPeriodById(s.reportingPeriodId);
      const due = getDueInfo(period);
      const workflow = getWorkflowInfo(s);

      if (workflow.stage === "finalized") return;
      if (workflow.stage === "awaiting-final") {
        awaitingFinal++;
        return;
      }
      if (workflow.stage === "not-submitted" || due.tone === "overdue") {
        overdueOrMissing++;
        return;
      }
      needsReview++;
    });

    return { needsReview, awaitingFinal, overdueOrMissing };
  }, []);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const facility = getFacilityById(sub.facilityId);

      if (selectedQuarter !== "all" && sub.reportingPeriodId !== selectedQuarter) return false;
      if (selectedFacility !== "all" && sub.facilityId !== selectedFacility) return false;
      if (selectedStatus !== "all" && sub.status !== selectedStatus) return false;
      if (hasWarningsFilter && !sub.hasWarnings) return false;
      if (hasErrorsFilter && !sub.hasErrors) return false;
      if (searchQuery && !facility?.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;

      return true;
    });
  }, [selectedQuarter, selectedFacility, selectedStatus, hasWarningsFilter, hasErrorsFilter, searchQuery]);

  const sortedSubmissions = useMemo(() => {
    return filteredSubmissions.slice().sort((a, b) => {
      const wa = getWorkflowInfo(a);
      const wb = getWorkflowInfo(b);
      if (wa.priority !== wb.priority) return wa.priority - wb.priority;

      const pa = getReportingPeriodById(a.reportingPeriodId);
      const pb = getReportingPeriodById(b.reportingPeriodId);
      const da = getDueInfo(pa).daysUntil ?? 9999;
      const db = getDueInfo(pb).daysUntil ?? 9999;
      return da - db;
    });
  }, [filteredSubmissions]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedQuarter, selectedFacility, selectedStatus, hasWarningsFilter, hasErrorsFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(sortedSubmissions.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, sortedSubmissions.length);
  const paginatedSubmissions = sortedSubmissions.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages: number[] = [];
    const showPages = 5;

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) end = 4;
      if (currentPage >= totalPages - 2) start = totalPages - 3;

      if (start > 2) pages.push(-1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push(-1);
      pages.push(totalPages);
    }
    return pages;
  };

  const handleCopyQrId = (qrId: string) => {
    navigator.clipboard.writeText(qrId);
    toast({ title: "Copied to clipboard", description: qrId });
  };

  const statuses: SubmissionStatus[] = [
    "Not Started",
    "In Progress",
    "Submitted",
    "Late Submission",
    "Submitted - Updated after Due Date",
    "Not Submitted",
  ];

  const showingStart = filteredSubmissions.length === 0 ? 0 : startIndex + 1;
  const showingEnd = filteredSubmissions.length === 0 ? 0 : endIndex;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Submissions</h1>
        <p className="text-muted-foreground">
          Manage and review NQIP submissions across all facilities
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-info/20">
                <Clock className="h-6 w-6 text-info-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Needs Review</p>
                <p className="text-3xl font-bold text-foreground">{stats.needsReview}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-warning/20">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Awaiting Final Submit</p>
                <p className="text-3xl font-bold text-foreground">{stats.awaitingFinal}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overdue / Not Submitted</p>
                <p className="text-3xl font-bold text-foreground">{stats.overdueOrMissing}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm text-muted-foreground mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search facilities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Quarter</label>
              <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All quarters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Quarters</SelectItem>
                  {reportingPeriods.slice(0, 4).map((period) => (
                    <SelectItem key={period.id} value={period.id}>
                      {period.quarter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Facility</label>
              <Select value={selectedFacility} onValueChange={setSelectedFacility}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All facilities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Facilities</SelectItem>
                  {facilities.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={hasWarningsFilter ? "default" : "outline"}
                size="sm"
                onClick={() => setHasWarningsFilter(!hasWarningsFilter)}
                className={hasWarningsFilter ? "bg-warning hover:bg-warning/90 text-warning-foreground" : ""}
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                Warnings
              </Button>
              <Button
                variant={hasErrorsFilter ? "default" : "outline"}
                size="sm"
                onClick={() => setHasErrorsFilter(!hasErrorsFilter)}
                className={hasErrorsFilter ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" : ""}
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                Errors
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {filteredSubmissions.length} Submission{filteredSubmissions.length !== 1 ? "s" : ""}
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              Showing {showingStart}-{showingEnd} of {filteredSubmissions.length}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Facility</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Quarter</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Due</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Govt QR ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Next Step</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Progress</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSubmissions.map((sub) => {
                  const facility = getFacilityById(sub.facilityId);
                  const period = getReportingPeriodById(sub.reportingPeriodId);
                  const workflow = getWorkflowInfo(sub);
                  const dueDisplay = getDueDisplay(sub, period);

                  let actionLabel = workflow.actionLabel;
                  let actionVariant = workflow.actionVariant;
                  let nextStep = workflow.nextStep;

                  if (workflow.actionRequires === "edit" && !canEdit) {
                    actionLabel = "View";
                    actionVariant = "outline";
                    nextStep = "Awaiting data entry by staff";
                  }
                  if (workflow.actionRequires === "post-in-progress" && !canPostInProgress) {
                    actionLabel = "View";
                    actionVariant = "outline";
                    nextStep = "Awaiting in-progress submission by reviewer";
                  }
                  if (workflow.actionRequires === "final-submit" && !canFinalSubmit) {
                    actionLabel = "Review";
                    actionVariant = "outline";
                    nextStep = "Awaiting final submit by authorised submitter";
                  }

                  return (
                    <tr
                      key={sub.id}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Building2 className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <span className="font-medium">{facility?.name}</span>
                            <p className="text-xs text-muted-foreground">{facility?.providerName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{period?.quarter}</td>
                      <td className="py-3 px-4">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={getDueToneClass(dueDisplay.tone)}>{dueDisplay.label}</span>
                          </TooltipTrigger>
                          {period && (
                            <TooltipContent>
                              <div className="text-xs space-y-1">
                                <div>Start: {new Date(period.startDate).toLocaleDateString()}</div>
                                <div>End: {new Date(period.endDate).toLocaleDateString()}</div>
                                <div>Due: {new Date(period.dueDate).toLocaleDateString()}</div>
                              </div>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <code
                            className="text-xs bg-muted px-2 py-1 rounded truncate max-w-[100px] block"
                            title={sub.questionnaireResponseId}
                          >
                            {sub.questionnaireResponseId || "Not posted yet"}
                          </code>
                          {sub.questionnaireResponseId && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleCopyQrId(sub.questionnaireResponseId!)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <StatusBadge status={sub.status} />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-[220px]">{STATUS_DEFINITIONS[sub.status]}</p>
                          </TooltipContent>
                        </Tooltip>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">{nextStep}</div>
                      </td>
                      <td className="py-3 px-4 min-w-[160px]">
                        <ProgressIndicator submission={sub} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant={actionVariant} size="sm" asChild>
                          <Link to={`/submissions/${sub.id}`}>
                            <Eye className="mr-1 h-3 w-3" />
                            {actionLabel}
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {filteredSubmissions.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted-foreground">
                      No submissions found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 pt-4 border-t">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                      {page === -1 ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="pt-8 mt-8 border-t-2 border-dashed border-muted-foreground/20">
        <DemoScenariosPanel />
      </div>
    </div>
  );
};

export default Submissions;
