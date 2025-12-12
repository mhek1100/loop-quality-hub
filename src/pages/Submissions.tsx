import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/ui/status-badge";
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
  FileCheck,
  FileX,
  Copy
} from "lucide-react";
import { 
  facilities, 
  submissions, 
  reportingPeriods, 
  getFacilityById, 
  getReportingPeriodById,
  getLatestReportingPeriod,
  currentUser,
  roles
} from "@/lib/mock/data";
import { INDICATORS } from "@/lib/mock/indicators";
import { toast } from "@/hooks/use-toast";
import { Submission } from "@/lib/types";
import { DemoScenariosPanel } from "@/components/submissions/DemoScenariosPanel";

const ITEMS_PER_PAGE = 5;

const Submissions = () => {
  // Default to latest reporting period
  const latestPeriod = getLatestReportingPeriod();
  const [selectedQuarter, setSelectedQuarter] = useState(latestPeriod.id);
  const [selectedFacility, setSelectedFacility] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedIndicator, setSelectedIndicator] = useState("all");
  const [hasWarningsFilter, setHasWarningsFilter] = useState(false);
  const [hasErrorsFilter, setHasErrorsFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Check user permissions
  const userRoles = roles.filter(r => currentUser.roleIds.includes(r.id));
  const canEdit = userRoles.some(r => r.permissions.includes("EDIT_QUESTIONNAIRE"));

  // Calculate stats for KPI cards
  const stats = {
    inProgress: submissions.filter(s => s.status === "In Progress").length,
    submitted: submissions.filter(s => ["Submitted", "Late Submission", "Submitted - Updated after Due Date"].includes(s.status)).length,
    notStarted: submissions.filter(s => s.status === "Not Started" || s.status === "Not Submitted").length,
  };

  // Filter submissions
  const filteredSubmissions = submissions.filter(sub => {
    const facility = getFacilityById(sub.facilityId);
    
    if (selectedQuarter !== "all" && sub.reportingPeriodId !== selectedQuarter) return false;
    if (selectedFacility !== "all" && sub.facilityId !== selectedFacility) return false;
    if (selectedStatus !== "all" && sub.status !== selectedStatus) return false;
    if (hasWarningsFilter && !sub.hasWarnings) return false;
    if (hasErrorsFilter && !sub.hasErrors) return false;
    if (searchQuery && !facility?.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    if (selectedIndicator !== "all") {
      const hasIndicator = sub.questionnaires.some(q => 
        q.indicatorCode === selectedIndicator && q.validationStatus !== "OK"
      );
      if (!hasIndicator) return false;
    }
    
    return true;
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filteredSubmissions.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredSubmissions.length);
  const paginatedSubmissions = filteredSubmissions.slice(startIndex, endIndex);

  // Generate page numbers
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

  const statuses = [
    "Not Started",
    "In Progress",
    "Submitted",
    "Late Submission",
    "Submitted - Updated after Due Date",
    "Not Submitted"
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Submissions</h1>
        <p className="text-muted-foreground">
          Manage and review NQIP submissions across all facilities
        </p>
      </div>

      {/* Demo Scenarios Panel */}
      <DemoScenariosPanel />

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-info/20">
                <Clock className="h-6 w-6 text-info-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-3xl font-bold text-foreground">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/20">
                <FileCheck className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="text-3xl font-bold text-foreground">{stats.submitted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-muted">
                <FileX className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Not Started</p>
                <p className="text-3xl font-bold text-foreground">{stats.notStarted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
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
                  {reportingPeriods.slice(0, 4).map(period => (
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
                  {facilities.map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
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
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Indicator</label>
              <Select value={selectedIndicator} onValueChange={setSelectedIndicator}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All indicators" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Indicators</SelectItem>
                  {INDICATORS.map(ind => (
                    <SelectItem key={ind.code} value={ind.code}>{ind.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox 
                  checked={hasWarningsFilter} 
                  onCheckedChange={(checked) => setHasWarningsFilter(checked === true)}
                />
                <span className="text-sm flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-warning" />
                  Warnings
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox 
                  checked={hasErrorsFilter} 
                  onCheckedChange={(checked) => setHasErrorsFilter(checked === true)}
                />
                <span className="text-sm flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-destructive" />
                  Errors
                </span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {filteredSubmissions.length} Submission{filteredSubmissions.length !== 1 ? "s" : ""}
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{endIndex} of {filteredSubmissions.length}
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">QR ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">FHIR Status</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Issues</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last Updated</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSubmissions.map(sub => {
                  const facility = getFacilityById(sub.facilityId);
                  const period = getReportingPeriodById(sub.reportingPeriodId);
                  const warningsCount = sub.questionnaires.reduce((acc, q) => 
                    acc + q.questions.reduce((a, qu) => a + qu.warnings.length, 0), 0
                  );
                  const errorsCount = sub.questionnaires.reduce((acc, q) => 
                    acc + q.questions.reduce((a, qu) => a + qu.errors.length, 0), 0
                  );
                  
                  return (
                    <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
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
                        <div className="flex items-center gap-1">
                          <code className="text-xs bg-muted px-2 py-1 rounded truncate max-w-[100px] block" title={sub.questionnaireResponseId}>
                            {sub.questionnaireResponseId || "Not yet submitted"}
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
                        <StatusBadge status={sub.status} />
                      </td>
                      <td className="py-3 px-4">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {sub.fhirStatus}
                        </code>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {warningsCount > 0 && (
                            <span className="flex items-center gap-1 text-warning text-sm">
                              <AlertTriangle className="h-3 w-3" />
                              {warningsCount}
                            </span>
                          )}
                          {errorsCount > 0 && (
                            <span className="flex items-center gap-1 text-destructive text-sm">
                              <AlertCircle className="h-3 w-3" />
                              {errorsCount}
                            </span>
                          )}
                          {warningsCount === 0 && errorsCount === 0 && (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {new Date(sub.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/submissions/${sub.id}`}>
                            <Eye className="mr-1 h-3 w-3" />
                            Open Workflow
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

          {/* Pagination */}
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
    </div>
  );
};

export default Submissions;
