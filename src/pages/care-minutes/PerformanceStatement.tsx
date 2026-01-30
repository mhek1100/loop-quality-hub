import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ReferenceLine, ResponsiveContainer } from "recharts";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Import shared data layer
import {
  getAllFacilities,
  getFacilityById,
  COMPLIANCE_TARGET,
  generateAllFacilityMetrics,
  generateMonthlyTrends,
  generateExecutiveCommentary,
  getComplianceStatus,
  calculatePortfolioSummary,
} from "@/lib/care-minutes";

// Import shared components
import {
  ComplianceStatusBadge,
  FacilityLink,
  TrendIcon,
} from "@/components/care-minutes";

import type { ComplianceStatus } from "@/lib/care-minutes/types";

export default function PerformanceStatement() {
  // Get all facilities for the Performance Statement
  const facilities = useMemo(() => getAllFacilities(), []);
  const facilityIds = useMemo(() => facilities.map(f => f.id), [facilities]);
  
  // Generate metrics for all facilities
  const facilityMetrics = useMemo(() => generateAllFacilityMetrics(facilityIds), [facilityIds]);
  
  // Calculate portfolio summary
  const portfolioMetrics = useMemo(() => 
    calculatePortfolioSummary(facilityMetrics, facilities.length), 
    [facilityMetrics, facilities.length]
  );

  // Monthly trend data
  const trendData = useMemo(() => generateMonthlyTrends(6), []);
  
  // Facilities with RN shortfall
  const rnShortfallFacilities = useMemo(() => {
    return facilityMetrics
      .filter(m => m.rnCompliance < COMPLIANCE_TARGET)
      .sort((a, b) => b.rnShortfallDays - a.rnShortfallDays)
      .slice(0, 3)
      .map(m => {
        const facility = getFacilityById(m.facilityId);
        const trend = m.rnShortfallDays > 10 ? "worsening" : m.rnShortfallDays > 5 ? "stable" : "improving";
        return {
          id: m.facilityId,
          name: facility?.name || "Unknown",
          shortfallDays: m.rnShortfallDays,
          trend,
          duration: m.rnShortfallDays > 10 ? "3+ months" : m.rnShortfallDays > 5 ? "6 weeks" : "2 weeks",
        };
      });
  }, [facilityMetrics]);
  
  // Executive commentary (dynamically generated)
  const executiveStatements = useMemo(() => 
    generateExecutiveCommentary(facilityMetrics), 
    [facilityMetrics]
  );

  // Get overall status
  const overallStatus = useMemo((): { label: string; variant: ComplianceStatus } => {
    if (portfolioMetrics.totalCareCompliance >= COMPLIANCE_TARGET && portfolioMetrics.rnCompliance >= COMPLIANCE_TARGET) {
      return { label: "Compliant", variant: "compliant" };
    } else if (portfolioMetrics.totalCareCompliance >= 95 && portfolioMetrics.rnCompliance >= 90) {
      return { label: "At Risk", variant: "at-risk" };
    }
    return { label: "Non-Compliant", variant: "non-compliant" };
  }, [portfolioMetrics]);

  const currentDate = new Date();
  const reportingPeriod = "Q4 FY2025-26 (Jan – Mar 2026)";

  // Fully compliant count
  const fullyCompliantCount = facilityMetrics.filter(m => 
    m.totalCareCompliance >= COMPLIANCE_TARGET && m.rnCompliance >= COMPLIANCE_TARGET
  ).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* 1. Statement Header */}
      <div className="border-b pb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Care Minutes Performance Statement</h1>
            <p className="text-muted-foreground mt-1">Reporting Period: {reportingPeriod}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{facilities.length} facilities included</p>
          </div>
          <div className="text-right">
            <Badge 
              className={cn(
                "text-sm px-3 py-1",
                overallStatus.variant === "compliant" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
                overallStatus.variant === "at-risk" && "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
                overallStatus.variant === "non-compliant" && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              )}
            >
              {overallStatus.variant === "compliant" && <CheckCircle2 className="h-4 w-4 mr-1.5" />}
              {overallStatus.variant === "at-risk" && <AlertTriangle className="h-4 w-4 mr-1.5" />}
              {overallStatus.variant === "non-compliant" && <XCircle className="h-4 w-4 mr-1.5" />}
              {overallStatus.label}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Generated: {currentDate.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Portfolio Compliance Summary */}
      <section>
        <h2 className="text-lg font-medium text-foreground mb-4">Portfolio Compliance Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-card">
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Care Compliance</p>
              <p className={cn(
                "text-2xl font-semibold mt-1 tabular-nums",
                portfolioMetrics.totalCareCompliance >= COMPLIANCE_TARGET ? "text-emerald-600" : "text-amber-600"
              )}>
                {portfolioMetrics.totalCareCompliance}%
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">RN Compliance</p>
              <p className={cn(
                "text-2xl font-semibold mt-1 tabular-nums",
                portfolioMetrics.rnCompliance >= COMPLIANCE_TARGET ? "text-emerald-600" : "text-amber-600"
              )}>
                {portfolioMetrics.rnCompliance}%
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Fully Compliant</p>
              <p className="text-2xl font-semibold mt-1 text-foreground tabular-nums">
                {fullyCompliantCount} / {facilities.length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">RN Shortfalls</p>
              <p className={cn(
                "text-2xl font-semibold mt-1 tabular-nums",
                rnShortfallFacilities.length > 0 ? "text-amber-600" : "text-foreground"
              )}>
                {rnShortfallFacilities.length} facilities
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Non-Compliance Days</p>
              <p className={cn(
                "text-2xl font-semibold mt-1 tabular-nums",
                portfolioMetrics.daysNonCompliance > 20 ? "text-red-600" : "text-amber-600"
              )}>
                {portfolioMetrics.daysNonCompliance}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 3. Facility-Level Compliance Table */}
      <section>
        <h2 className="text-lg font-medium text-foreground mb-4">Facility-Level Compliance</h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-medium">Facility</TableHead>
                <TableHead className="text-right font-medium">Total Care (%)</TableHead>
                <TableHead className="text-right font-medium">RN Minutes (%)</TableHead>
                <TableHead className="text-right font-medium">Total Variance</TableHead>
                <TableHead className="text-right font-medium">RN Variance</TableHead>
                <TableHead className="text-center font-medium">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facilityMetrics.map((metrics) => {
                const facility = getFacilityById(metrics.facilityId);
                const status = getComplianceStatus(Math.min(metrics.totalCareCompliance, metrics.rnCompliance));
                
                return (
                  <TableRow key={metrics.facilityId} className="hover:bg-muted/30">
                    <TableCell>
                      <FacilityLink 
                        facilityId={metrics.facilityId} 
                        facilityName={facility?.name || "Unknown"} 
                      />
                    </TableCell>
                    <TableCell className={cn(
                      "text-right tabular-nums",
                      metrics.totalCareCompliance < COMPLIANCE_TARGET && "text-red-600 font-medium"
                    )}>
                      {metrics.totalCareCompliance.toFixed(1)}%
                    </TableCell>
                    <TableCell className={cn(
                      "text-right tabular-nums",
                      metrics.rnCompliance < COMPLIANCE_TARGET && "text-red-600 font-medium"
                    )}>
                      {metrics.rnCompliance.toFixed(1)}%
                    </TableCell>
                    <TableCell className={cn(
                      "text-right tabular-nums",
                      metrics.totalVariance < 0 ? "text-red-600" : "text-emerald-600"
                    )}>
                      {metrics.totalVariance > 0 ? "+" : ""}{metrics.totalVariance} min
                    </TableCell>
                    <TableCell className={cn(
                      "text-right tabular-nums",
                      metrics.rnVariance < 0 ? "text-red-600" : "text-emerald-600"
                    )}>
                      {metrics.rnVariance > 0 ? "+" : ""}{metrics.rnVariance} min
                    </TableCell>
                    <TableCell className="text-center">
                      <ComplianceStatusBadge status={status} size="sm" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* 4. Compliance Over Time */}
      <section>
        <h2 className="text-lg font-medium text-foreground mb-4">Compliance Over Time</h2>
        <Card>
          <CardContent className="pt-6">
            <ChartContainer
              config={{
                totalCompliance: { label: "Total Care", color: "hsl(var(--primary))" },
                rnCompliance: { label: "RN Minutes", color: "hsl(var(--chart-2))" },
              }}
              className="h-[240px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[85, 105]} 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <ReferenceLine 
                    y={COMPLIANCE_TARGET} 
                    stroke="hsl(var(--muted-foreground))" 
                    strokeDasharray="4 4" 
                    label={{ value: `Target ${COMPLIANCE_TARGET}%`, position: "right", fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="totalCompliance" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ r: 4, fill: "hsl(var(--primary))" }}
                    name="Total Care"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rnCompliance" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    dot={{ r: 4, fill: "hsl(var(--chart-2))" }}
                    name="RN Minutes"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Total Care Minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-2))" }} />
                <span className="text-muted-foreground">RN Minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 border-t-2 border-dashed border-muted-foreground" />
                <span className="text-muted-foreground">{COMPLIANCE_TARGET}% Target</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 5. RN Minutes Compliance Focus */}
      {rnShortfallFacilities.length > 0 && (
        <section>
          <h2 className="text-lg font-medium text-foreground mb-4">RN Minutes Compliance Focus</h2>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-4">
                Facilities with persistent RN minute shortfalls requiring oversight attention.
              </p>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-medium">Facility</TableHead>
                    <TableHead className="text-right font-medium">Shortfall Days</TableHead>
                    <TableHead className="text-right font-medium">Duration</TableHead>
                    <TableHead className="text-center font-medium">Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rnShortfallFacilities.map((facility) => (
                    <TableRow key={facility.id} className="hover:bg-muted/30">
                      <TableCell>
                        <FacilityLink facilityId={facility.id} facilityName={facility.name} />
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-red-600 font-medium">
                        {facility.shortfallDays} days
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {facility.duration}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1.5">
                          <TrendIcon direction={facility.trend === "improving" ? "up" : facility.trend === "worsening" ? "down" : "flat"} />
                          <span className={cn(
                            "text-sm capitalize",
                            facility.trend === "improving" && "text-emerald-600",
                            facility.trend === "worsening" && "text-red-600",
                            facility.trend === "stable" && "text-muted-foreground"
                          )}>
                            {facility.trend}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      )}

      {/* 6. Executive Commentary */}
      <section>
        <h2 className="text-lg font-medium text-foreground mb-4">Executive Commentary</h2>
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <ul className="space-y-3">
              {executiveStatements.map((statement, index) => (
                <li key={index} className="flex gap-3 text-sm text-foreground leading-relaxed">
                  <span className="text-muted-foreground font-medium shrink-0">{index + 1}.</span>
                  <span>{statement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <div className="border-t pt-6 text-center text-xs text-muted-foreground">
        <p>This statement has been prepared in accordance with the Quality of Care Principles 2014.</p>
        <p className="mt-1">Care minutes data sourced from Loop Care Minutes Module • Target threshold: {COMPLIANCE_TARGET}%</p>
      </div>
    </div>
  );
}
