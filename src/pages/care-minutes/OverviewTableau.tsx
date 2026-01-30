import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Users, Clock, Building2, AlertTriangle } from "lucide-react";

// Mock data for Australian aged care facilities
const facilities = [
  { name: "Johnsonchester", id: 1 },
  { name: "New Ashleychester", id: 2 },
  { name: "North Ryan", id: 3 },
  { name: "Rileyville", id: 4 },
];

// KPI Summary data
const kpiSummary = {
  portfolioCompliance: { value: 94.2, status: "good" as const },
  facilitiesMeetingTarget: { value: 75, count: 3, total: 4, status: "warning" as const },
  avgDailyCareMinutes: { value: 207, target: 215, status: "warning" as const },
  rnCompliance: { value: 88.5, status: "warning" as const },
  facilitiesAtRisk: { value: 1, status: "danger" as const },
  overallTrend: { value: 2.3, direction: "up" as const },
};

// Star ratings for overview (1-5 scale)
const overviewRatings: Record<string, Record<string, number>> = {
  Johnsonchester: { thisWeek: 2, lastWeek: 5, thisMonth: 2, lastMonth: 2, last2Months: 3, thisQuarter: 2 },
  "New Ashleychester": { thisWeek: 2, lastWeek: 5, thisMonth: 2, lastMonth: 1, last2Months: 4, thisQuarter: 2 },
  "North Ryan": { thisWeek: 2, lastWeek: 5, thisMonth: 2, lastMonth: 1, last2Months: 4, thisQuarter: 2 },
  Rileyville: { thisWeek: 2, lastWeek: 5, thisMonth: 2, lastMonth: 1, last2Months: 3, thisQuarter: 2 },
};

// Performance summary data (percentages with status)
const performanceSummary: Record<string, Record<string, { value: number; status: "good" | "warning" | "danger" }>> = {
  Johnsonchester: {
    thisWeek: { value: 103, status: "good" },
    lastWeek: { value: 185, status: "good" },
    thisMonth: { value: 100, status: "good" },
    lastMonth: { value: 104, status: "good" },
    last2Months: { value: 104, status: "good" },
    thisQuarter: { value: 103, status: "good" },
  },
  "New Ashleychester": {
    thisWeek: { value: 92, status: "danger" },
    lastWeek: { value: 163, status: "good" },
    thisMonth: { value: 89, status: "danger" },
    lastMonth: { value: 92, status: "danger" },
    last2Months: { value: 96, status: "danger" },
    thisQuarter: { value: 92, status: "danger" },
  },
  "North Ryan": {
    thisWeek: { value: 88, status: "danger" },
    lastWeek: { value: 153, status: "good" },
    thisMonth: { value: 86, status: "danger" },
    lastMonth: { value: 87, status: "danger" },
    last2Months: { value: 90, status: "danger" },
    thisQuarter: { value: 88, status: "danger" },
  },
  Rileyville: {
    thisWeek: { value: 98, status: "warning" },
    lastWeek: { value: 180, status: "good" },
    thisMonth: { value: 98, status: "warning" },
    lastMonth: { value: 96, status: "danger" },
    last2Months: { value: 99, status: "warning" },
    thisQuarter: { value: 98, status: "warning" },
  },
};

// Care minutes delivered data
const careMinutesDelivered: Record<string, Record<string, { delivered: number; overUnder: number }>> = {
  Johnsonchester: {
    thisWeek: { delivered: 161.57, overUnder: -53.43 },
    lastWeek: { delivered: 317.45, overUnder: 102.45 },
    thisMonth: { delivered: 160.22, overUnder: -54.78 },
    lastMonth: { delivered: 147.67, overUnder: -67.33 },
    last2Months: { delivered: 179.22, overUnder: -35.78 },
    thisQuarter: { delivered: 161.57, overUnder: -53.43 },
  },
  "New Ashleychester": {
    thisWeek: { delivered: 137.73, overUnder: -77.27 },
    lastWeek: { delivered: 279.77, overUnder: 64.77 },
    thisMonth: { delivered: 139.10, overUnder: -75.90 },
    lastMonth: { delivered: 119.22, overUnder: -95.78 },
    last2Months: { delivered: 164.33, overUnder: -50.67 },
    thisQuarter: { delivered: 137.73, overUnder: -77.27 },
  },
  "North Ryan": {
    thisWeek: { delivered: 138.05, overUnder: -76.95 },
    lastWeek: { delivered: 263.38, overUnder: 48.38 },
    thisMonth: { delivered: 138.62, overUnder: -76.38 },
    lastMonth: { delivered: 124.02, overUnder: -90.98 },
    last2Months: { delivered: 154.48, overUnder: -60.52 },
    thisQuarter: { delivered: 138.05, overUnder: -76.95 },
  },
  Rileyville: {
    thisWeek: { delivered: 153.39, overUnder: -61.61 },
    lastWeek: { delivered: 308.67, overUnder: 93.67 },
    thisMonth: { delivered: 157.08, overUnder: -57.92 },
    lastMonth: { delivered: 137.48, overUnder: -77.52 },
    last2Months: { delivered: 169.81, overUnder: -45.19 },
    thisQuarter: { delivered: 153.39, overUnder: -61.61 },
  },
};

// RN performance summary data
const rnPerformanceSummary: Record<string, Record<string, { value: number; status: "good" | "warning" | "danger" }>> = {
  Johnsonchester: {
    thisWeek: { value: 85, status: "danger" },
    lastWeek: { value: 208, status: "good" },
    thisMonth: { value: 92, status: "danger" },
    lastMonth: { value: 63, status: "danger" },
    last2Months: { value: 106, status: "good" },
    thisQuarter: { value: 85, status: "danger" },
  },
  "New Ashleychester": {
    thisWeek: { value: 94, status: "danger" },
    lastWeek: { value: 257, status: "good" },
    thisMonth: { value: 102, status: "good" },
    lastMonth: { value: 57, status: "danger" },
    last2Months: { value: 143, status: "good" },
    thisQuarter: { value: 94, status: "danger" },
  },
  "North Ryan": {
    thisWeek: { value: 77, status: "danger" },
    lastWeek: { value: 179, status: "good" },
    thisMonth: { value: 82, status: "danger" },
    lastMonth: { value: 55, status: "danger" },
    last2Months: { value: 101, status: "good" },
    thisQuarter: { value: 77, status: "danger" },
  },
  Rileyville: {
    thisWeek: { value: 85, status: "danger" },
    lastWeek: { value: 201, status: "good" },
    thisMonth: { value: 89, status: "danger" },
    lastMonth: { value: 62, status: "danger" },
    last2Months: { value: 110, status: "good" },
    thisQuarter: { value: 85, status: "danger" },
  },
};

// RN minutes delivered data
const rnMinutesDelivered: Record<string, Record<string, { delivered: number; overUnder: number }>> = {
  Johnsonchester: {
    thisWeek: { delivered: 37.34, overUnder: -6.66 },
    lastWeek: { delivered: 91.45, overUnder: 47.45 },
    thisMonth: { delivered: 40.54, overUnder: -3.46 },
    lastMonth: { delivered: 27.70, overUnder: -16.30 },
    last2Months: { delivered: 46.61, overUnder: 2.61 },
    thisQuarter: { delivered: 37.34, overUnder: -6.66 },
  },
  "New Ashleychester": {
    thisWeek: { delivered: 41.39, overUnder: -2.61 },
    lastWeek: { delivered: 112.87, overUnder: 68.87 },
    thisMonth: { delivered: 44.79, overUnder: 0.79 },
    lastMonth: { delivered: 24.92, overUnder: -19.08 },
    last2Months: { delivered: 62.94, overUnder: 18.94 },
    thisQuarter: { delivered: 41.39, overUnder: -2.61 },
  },
  "North Ryan": {
    thisWeek: { delivered: 34.08, overUnder: -9.92 },
    lastWeek: { delivered: 78.93, overUnder: 34.93 },
    thisMonth: { delivered: 36.11, overUnder: -7.89 },
    lastMonth: { delivered: 24.19, overUnder: -19.81 },
    last2Months: { delivered: 44.48, overUnder: 0.48 },
    thisQuarter: { delivered: 34.08, overUnder: -9.92 },
  },
  Rileyville: {
    thisWeek: { delivered: 37.38, overUnder: -6.62 },
    lastWeek: { delivered: 88.24, overUnder: 44.24 },
    thisMonth: { delivered: 39.15, overUnder: -4.85 },
    lastMonth: { delivered: 27.27, overUnder: -16.73 },
    last2Months: { delivered: 48.23, overUnder: 4.23 },
    thisQuarter: { delivered: 37.38, overUnder: -6.62 },
  },
};

const timePeriods = ["thisWeek", "lastWeek", "thisMonth", "lastMonth", "last2Months", "thisQuarter"] as const;
const timePeriodLabels: Record<string, string> = {
  thisWeek: "This Week",
  lastWeek: "Last Week",
  thisMonth: "This Month",
  lastMonth: "Last Month",
  last2Months: "Last 2 Months",
  thisQuarter: "This Quarter",
};

// Star rating component
const StarRating = ({ count, max = 5 }: { count: number; max?: number }) => {
  return (
    <span className="text-amber-500 tracking-tight">
      {"★".repeat(count)}
      <span className="text-muted-foreground/30">{"★".repeat(max - count)}</span>
    </span>
  );
};

// Status dot component
const StatusDot = ({ status }: { status: "good" | "warning" | "danger" }) => {
  return (
    <span
      className={cn(
        "inline-block w-3 h-3 rounded-full",
        status === "good" && "bg-emerald-500",
        status === "warning" && "bg-amber-500",
        status === "danger" && "bg-red-500"
      )}
    />
  );
};

// KPI Card component
const KpiCard = ({
  title,
  value,
  suffix,
  subtitle,
  status,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string | number;
  suffix?: string;
  subtitle?: string;
  status: "good" | "warning" | "danger";
  icon: React.ElementType;
  trend?: { value: number; direction: "up" | "down" };
}) => {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{value}</span>
              {suffix && <span className="text-lg text-muted-foreground">{suffix}</span>}
            </div>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            {trend && (
              <div
                className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  trend.direction === "up" ? "text-emerald-600" : "text-red-600"
                )}
              >
                {trend.direction === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {trend.value}% vs last period
              </div>
            )}
          </div>
          <div
            className={cn(
              "p-2 rounded-lg",
              status === "good" && "bg-emerald-100 text-emerald-600",
              status === "warning" && "bg-amber-100 text-amber-600",
              status === "danger" && "bg-red-100 text-red-600"
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 h-1",
            status === "good" && "bg-emerald-500",
            status === "warning" && "bg-amber-500",
            status === "danger" && "bg-red-500"
          )}
        />
      </CardContent>
    </Card>
  );
};

const OverviewTableau = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold">Care Minutes Overview (Tableau)</h1>
        <p className="text-muted-foreground mt-1">
          Portfolio-wide compliance and performance across all facilities
        </p>
      </div>

      {/* Top Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard
          title="Portfolio Compliance"
          value={kpiSummary.portfolioCompliance.value}
          suffix="%"
          status={kpiSummary.portfolioCompliance.status}
          icon={TrendingUp}
          trend={{ value: 2.3, direction: "up" }}
        />
        <KpiCard
          title="Facilities Meeting Target"
          value={`${kpiSummary.facilitiesMeetingTarget.count}/${kpiSummary.facilitiesMeetingTarget.total}`}
          subtitle={`${kpiSummary.facilitiesMeetingTarget.value}%`}
          status={kpiSummary.facilitiesMeetingTarget.status}
          icon={Building2}
        />
        <KpiCard
          title="Avg Daily Care Mins"
          value={kpiSummary.avgDailyCareMinutes.value}
          subtitle={`Target: ${kpiSummary.avgDailyCareMinutes.target}`}
          status={kpiSummary.avgDailyCareMinutes.status}
          icon={Clock}
        />
        <KpiCard
          title="RN Compliance"
          value={kpiSummary.rnCompliance.value}
          suffix="%"
          status={kpiSummary.rnCompliance.status}
          icon={Users}
        />
        <KpiCard
          title="Facilities At Risk"
          value={kpiSummary.facilitiesAtRisk.value}
          subtitle="Requires attention"
          status={kpiSummary.facilitiesAtRisk.status}
          icon={AlertTriangle}
        />
        <KpiCard
          title="Overall Trend"
          value={`+${kpiSummary.overallTrend.value}`}
          suffix="%"
          subtitle="Improving"
          status="good"
          icon={TrendingUp}
        />
      </div>

      {/* Care Minutes Overview - Star Ratings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Care Minutes Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[180px]">Location</TableHead>
                {timePeriods.map((period) => (
                  <TableHead key={period} className="text-center">
                    {timePeriodLabels[period]}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {facilities.map((facility) => (
                <TableRow key={facility.id}>
                  <TableCell className="font-medium">{facility.name}</TableCell>
                  {timePeriods.map((period) => (
                    <TableCell key={period} className="text-center">
                      <StarRating count={overviewRatings[facility.name]?.[period] || 0} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Total Care Minutes Performance Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Total Care Minutes Performance Summary{" "}
            <span className="text-muted-foreground font-normal">(incl. RN Minutes)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[180px]">Location</TableHead>
                {timePeriods.map((period) => (
                  <TableHead key={period} className="text-center" colSpan={1}>
                    {timePeriodLabels[period]}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {facilities.map((facility) => (
                <TableRow key={facility.id}>
                  <TableCell className="font-medium">{facility.name}</TableCell>
                  {timePeriods.map((period) => {
                    const data = performanceSummary[facility.name]?.[period];
                    return (
                      <TableCell key={period} className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <StatusDot status={data?.status || "danger"} />
                          <span>{data?.value || 0}%</span>
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Total Care Minutes Delivered */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Total Care Minutes Delivered{" "}
            <span className="text-muted-foreground font-normal">(Daily Avg. Target is 215)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[180px]" rowSpan={2}>
                  Location
                </TableHead>
                {timePeriods.map((period) => (
                  <TableHead key={period} className="text-center border-l" colSpan={2}>
                    {timePeriodLabels[period]}
                  </TableHead>
                ))}
              </TableRow>
              <TableRow className="bg-muted/50">
                {timePeriods.map((period) => (
                  <React.Fragment key={period}>
                    <TableHead className="text-center text-xs border-l bg-violet-100 text-violet-700">
                      Delivered
                    </TableHead>
                    <TableHead className="text-center text-xs bg-violet-50 text-violet-600">
                      Over/Under
                    </TableHead>
                  </React.Fragment>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {facilities.map((facility) => (
                <TableRow key={facility.id}>
                  <TableCell className="font-medium">{facility.name}</TableCell>
                  {timePeriods.map((period) => {
                    const data = careMinutesDelivered[facility.name]?.[period];
                    return (
                      <React.Fragment key={period}>
                        <TableCell className="text-center border-l">
                          {data?.delivered.toFixed(2)}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "text-center font-medium",
                            (data?.overUnder || 0) >= 0 ? "text-emerald-600" : "text-red-600"
                          )}
                        >
                          {(data?.overUnder || 0) >= 0 ? "+" : ""}
                          {data?.overUnder.toFixed(2)}
                        </TableCell>
                      </React.Fragment>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* RN Minutes Performance Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">RN Minutes Performance Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[180px]">Location</TableHead>
                {timePeriods.map((period) => (
                  <TableHead key={period} className="text-center">
                    {timePeriodLabels[period]}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {facilities.map((facility) => (
                <TableRow key={facility.id}>
                  <TableCell className="font-medium">{facility.name}</TableCell>
                  {timePeriods.map((period) => {
                    const data = rnPerformanceSummary[facility.name]?.[period];
                    return (
                      <TableCell key={period} className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <StatusDot status={data?.status || "danger"} />
                          <span>{data?.value || 0}%</span>
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* RN Minutes Delivered */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            RN Minutes Delivered{" "}
            <span className="text-muted-foreground font-normal">(Daily Avg. Target is 44)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[180px]" rowSpan={2}>
                  Location
                </TableHead>
                {timePeriods.map((period) => (
                  <TableHead key={period} className="text-center border-l" colSpan={2}>
                    {timePeriodLabels[period]}
                  </TableHead>
                ))}
              </TableRow>
              <TableRow className="bg-muted/50">
                {timePeriods.map((period) => (
                  <React.Fragment key={period}>
                    <TableHead className="text-center text-xs border-l bg-violet-100 text-violet-700">
                      Delivered
                    </TableHead>
                    <TableHead className="text-center text-xs bg-violet-50 text-violet-600">
                      Over/Under
                    </TableHead>
                  </React.Fragment>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {facilities.map((facility) => (
                <TableRow key={facility.id}>
                  <TableCell className="font-medium">{facility.name}</TableCell>
                  {timePeriods.map((period) => {
                    const data = rnMinutesDelivered[facility.name]?.[period];
                    return (
                      <React.Fragment key={period}>
                        <TableCell className="text-center border-l">
                          {data?.delivered.toFixed(2)}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "text-center font-medium",
                            (data?.overUnder || 0) >= 0 ? "text-emerald-600" : "text-red-600"
                          )}
                        >
                          {(data?.overUnder || 0) >= 0 ? "+" : ""}
                          {data?.overUnder.toFixed(2)}
                        </TableCell>
                      </React.Fragment>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTableau;
