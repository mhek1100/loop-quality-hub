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
import { CheckCircle2, AlertTriangle, XCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock facility data consistent with Overview v2 and Facility Drill-Down v2
const facilities = [
  { id: 1, name: "Sunrise Aged Care", totalCompliance: 98.2, rnCompliance: 96.5, totalVariance: 12, rnVariance: -8, status: "compliant" },
  { id: 2, name: "Harbour View Lodge", totalCompliance: 95.1, rnCompliance: 92.3, totalVariance: -22, rnVariance: -35, status: "partial" },
  { id: 3, name: "Mountain Rest Home", totalCompliance: 101.5, rnCompliance: 104.2, totalVariance: 45, rnVariance: 18, status: "compliant" },
  { id: 4, name: "Coastal Care Centre", totalCompliance: 88.4, rnCompliance: 78.9, totalVariance: -68, rnVariance: -95, status: "non-compliant" },
  { id: 5, name: "Valley Gardens", totalCompliance: 99.8, rnCompliance: 101.1, totalVariance: 5, rnVariance: 4, status: "compliant" },
  { id: 6, name: "Riverside Manor", totalCompliance: 94.2, rnCompliance: 89.7, totalVariance: -28, rnVariance: -42, status: "partial" },
  { id: 7, name: "Parkview Residence", totalCompliance: 102.3, rnCompliance: 98.9, totalVariance: 52, rnVariance: -5, status: "compliant" },
  { id: 8, name: "Greenfield House", totalCompliance: 97.6, rnCompliance: 95.8, totalVariance: -12, rnVariance: -18, status: "compliant" },
];

// Trend data for the reporting period
const trendData = [
  { month: "Jul", totalCompliance: 94.2, rnCompliance: 91.5 },
  { month: "Aug", totalCompliance: 95.8, rnCompliance: 93.2 },
  { month: "Sep", totalCompliance: 96.1, rnCompliance: 92.8 },
  { month: "Oct", totalCompliance: 97.3, rnCompliance: 94.5 },
  { month: "Nov", totalCompliance: 96.8, rnCompliance: 93.9 },
  { month: "Dec", totalCompliance: 97.1, rnCompliance: 94.8 },
];

// RN shortfall facilities
const rnShortfallFacilities = [
  { name: "Coastal Care Centre", shortfallDays: 18, trend: "worsening", duration: "3 months" },
  { name: "Riverside Manor", shortfallDays: 8, trend: "stable", duration: "6 weeks" },
  { name: "Harbour View Lodge", shortfallDays: 5, trend: "improving", duration: "2 weeks" },
];

// Executive commentary statements
const executiveStatements = [
  "The portfolio achieved 96.9% compliance with total care minute requirements for the reporting period, meeting the 95% target threshold.",
  "RN minutes compliance was 93.8% across the portfolio, with two facilities (Coastal Care Centre and Riverside Manor) consistently below target.",
  "Non-compliance events were concentrated on weekends and public holiday periods, accounting for 72% of shortfall days.",
  "Coastal Care Centre requires immediate attention with 18 days of RN shortfall and a worsening trend over the past quarter.",
  "Five of eight facilities (62.5%) achieved full compliance across both total care and RN minute requirements.",
];

// Calculate portfolio metrics
const portfolioMetrics = {
  totalCompliance: 96.9,
  rnCompliance: 93.8,
  facilitiesFullyCompliant: 5,
  facilitiesTotal: 8,
  facilitiesWithRnShortfall: 3,
  daysNonCompliance: 31,
};

function getOverallStatus() {
  if (portfolioMetrics.totalCompliance >= 95 && portfolioMetrics.rnCompliance >= 95) {
    return { label: "Compliant", variant: "compliant" as const };
  } else if (portfolioMetrics.totalCompliance >= 90 && portfolioMetrics.rnCompliance >= 85) {
    return { label: "Partial Compliance", variant: "partial" as const };
  }
  return { label: "Non-Compliant", variant: "non-compliant" as const };
}

function StatusBadge({ status }: { status: "compliant" | "partial" | "non-compliant" }) {
  const config = {
    compliant: { label: "Met", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
    partial: { label: "Partial", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" },
    "non-compliant": { label: "Not Met", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
  };
  
  return (
    <Badge className={cn("font-medium", config[status].className)}>
      {config[status].label}
    </Badge>
  );
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "improving") return <TrendingUp className="h-4 w-4 text-emerald-600" />;
  if (trend === "worsening") return <TrendingDown className="h-4 w-4 text-red-600" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

export default function PerformanceStatement() {
  const overallStatus = getOverallStatus();
  const currentDate = new Date();
  const reportingPeriod = `Q2 FY2024-25 (Oct – Dec 2024)`;

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
                overallStatus.variant === "partial" && "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
                overallStatus.variant === "non-compliant" && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              )}
            >
              {overallStatus.variant === "compliant" && <CheckCircle2 className="h-4 w-4 mr-1.5" />}
              {overallStatus.variant === "partial" && <AlertTriangle className="h-4 w-4 mr-1.5" />}
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
                "text-2xl font-semibold mt-1",
                portfolioMetrics.totalCompliance >= 95 ? "text-emerald-600" : "text-amber-600"
              )}>
                {portfolioMetrics.totalCompliance}%
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">RN Compliance</p>
              <p className={cn(
                "text-2xl font-semibold mt-1",
                portfolioMetrics.rnCompliance >= 95 ? "text-emerald-600" : "text-amber-600"
              )}>
                {portfolioMetrics.rnCompliance}%
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Fully Compliant</p>
              <p className="text-2xl font-semibold mt-1 text-foreground">
                {portfolioMetrics.facilitiesFullyCompliant} / {portfolioMetrics.facilitiesTotal}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">RN Shortfalls</p>
              <p className={cn(
                "text-2xl font-semibold mt-1",
                portfolioMetrics.facilitiesWithRnShortfall > 0 ? "text-amber-600" : "text-foreground"
              )}>
                {portfolioMetrics.facilitiesWithRnShortfall} facilities
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Non-Compliance Days</p>
              <p className={cn(
                "text-2xl font-semibold mt-1",
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
              {facilities.map((facility) => (
                <TableRow key={facility.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{facility.name}</TableCell>
                  <TableCell className={cn(
                    "text-right tabular-nums",
                    facility.totalCompliance < 95 && "text-red-600 font-medium"
                  )}>
                    {facility.totalCompliance.toFixed(1)}%
                  </TableCell>
                  <TableCell className={cn(
                    "text-right tabular-nums",
                    facility.rnCompliance < 95 && "text-red-600 font-medium"
                  )}>
                    {facility.rnCompliance.toFixed(1)}%
                  </TableCell>
                  <TableCell className={cn(
                    "text-right tabular-nums",
                    facility.totalVariance < 0 ? "text-red-600" : "text-emerald-600"
                  )}>
                    {facility.totalVariance > 0 ? "+" : ""}{facility.totalVariance} min
                  </TableCell>
                  <TableCell className={cn(
                    "text-right tabular-nums",
                    facility.rnVariance < 0 ? "text-red-600" : "text-emerald-600"
                  )}>
                    {facility.rnVariance > 0 ? "+" : ""}{facility.rnVariance} min
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={facility.status as "compliant" | "partial" | "non-compliant"} />
                  </TableCell>
                </TableRow>
              ))}
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
                    y={95} 
                    stroke="hsl(var(--muted-foreground))" 
                    strokeDasharray="4 4" 
                    label={{ value: "Target 95%", position: "right", fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
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
                <span className="text-muted-foreground">95% Target</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 5. RN Minutes Compliance Focus */}
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
                  <TableRow key={facility.name} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{facility.name}</TableCell>
                    <TableCell className="text-right tabular-nums text-red-600 font-medium">
                      {facility.shortfallDays} days
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {facility.duration}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1.5">
                        <TrendIcon trend={facility.trend} />
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
      <div className="border-t pt-4 text-xs text-muted-foreground">
        <p>This statement is generated from operational data and is subject to final reconciliation. Data sources: Care minutes rostering system, AN-ACC classification records.</p>
      </div>
    </div>
  );
}
