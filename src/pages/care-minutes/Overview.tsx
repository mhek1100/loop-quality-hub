import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  Clock,
  Activity,
  ShieldCheck,
  ShieldAlert,
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  Area,
} from "recharts";

// ============================================
// MOCK DATA - Australian Aged Care (AN-ACC)
// ============================================

const portfolioKPIs = {
  totalCareCompliance: 94.2,
  rnCompliance: 87.5,
  facilitiesMeetingCare: 3,
  facilitiesMeetingRN: 2,
  facilitiesAtRisk: 1,
  totalFacilities: 4,
};

// Weekly compliance trend data (last 12 weeks)
const complianceTrendData = [
  { week: "W1", totalCare: 91.2, rn: 82.4, target: 100 },
  { week: "W2", totalCare: 92.5, rn: 84.1, target: 100 },
  { week: "W3", totalCare: 90.8, rn: 81.9, target: 100 },
  { week: "W4", totalCare: 93.1, rn: 85.2, target: 100 },
  { week: "W5", totalCare: 94.5, rn: 86.8, target: 100 },
  { week: "W6", totalCare: 93.8, rn: 84.5, target: 100 },
  { week: "W7", totalCare: 95.2, rn: 88.1, target: 100 },
  { week: "W8", totalCare: 94.1, rn: 86.3, target: 100 },
  { week: "W9", totalCare: 93.6, rn: 85.9, target: 100 },
  { week: "W10", totalCare: 94.8, rn: 87.2, target: 100 },
  { week: "W11", totalCare: 95.1, rn: 88.4, target: 100 },
  { week: "W12", totalCare: 94.2, rn: 87.5, target: 100 },
];

// Facility comparison data
const facilityData = [
  {
    name: "Sunrise Gardens",
    totalCareCompliance: 98.4,
    rnCompliance: 96.2,
    avgDailyMinutes: 207,
    targetMinutes: 200,
    trend: "up" as const,
    riskStatus: "low" as const,
    rnMinutes: 42,
    nonRnMinutes: 165,
    rnTarget: 40,
  },
  {
    name: "Harbour View",
    totalCareCompliance: 95.1,
    rnCompliance: 91.8,
    avgDailyMinutes: 198,
    targetMinutes: 200,
    trend: "flat" as const,
    riskStatus: "medium" as const,
    rnMinutes: 38,
    nonRnMinutes: 160,
    rnTarget: 40,
  },
  {
    name: "Mountain Lodge",
    totalCareCompliance: 92.8,
    rnCompliance: 84.5,
    avgDailyMinutes: 189,
    targetMinutes: 200,
    trend: "down" as const,
    riskStatus: "high" as const,
    rnMinutes: 32,
    nonRnMinutes: 157,
    rnTarget: 40,
  },
  {
    name: "Coastal Haven",
    totalCareCompliance: 96.7,
    rnCompliance: 93.4,
    avgDailyMinutes: 202,
    targetMinutes: 200,
    trend: "up" as const,
    riskStatus: "low" as const,
    rnMinutes: 41,
    nonRnMinutes: 161,
    rnTarget: 40,
  },
];

// RN vs Non-RN breakdown for stacked chart
const rnBreakdownData = facilityData.map(f => ({
  name: f.name.split(" ")[0], // Short name for chart
  fullName: f.name,
  rnMinutes: f.rnMinutes,
  nonRnMinutes: f.nonRnMinutes,
  rnTarget: f.rnTarget,
  totalTarget: f.targetMinutes,
}));

// Auto-generated insights
const insights = [
  {
    type: "warning" as const,
    message: "Mountain Lodge has shown continuous RN underperformance for 6 weeks, currently at 84.5% compliance.",
  },
  {
    type: "success" as const,
    message: "3 of 4 facilities are meeting total care minute targets this month.",
  },
  {
    type: "warning" as const,
    message: "2 facilities meet total care minutes but are failing RN minute targets — suggests skill mix adjustment needed.",
  },
  {
    type: "info" as const,
    message: "Overall portfolio compliance improved 3.0% since W1, but RN compliance improved only 5.1%.",
  },
  {
    type: "success" as const,
    message: "Sunrise Gardens leads portfolio performance with 98.4% total care and 96.2% RN compliance.",
  },
];

// ============================================
// HELPER COMPONENTS
// ============================================

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  status: "good" | "warning" | "danger";
  icon: React.ReactNode;
}

function KPICard({ title, value, subtitle, status, icon }: KPICardProps) {
  const statusColors = {
    good: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    warning: "bg-amber-500/10 text-amber-600 border-amber-200",
    danger: "bg-red-500/10 text-red-600 border-red-200",
  };

  const iconBgColors = {
    good: "bg-emerald-100 text-emerald-600",
    warning: "bg-amber-100 text-amber-600",
    danger: "bg-red-100 text-red-600",
  };

  return (
    <Card className={cn("border-l-4", statusColors[status])}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className={cn("p-2 rounded-lg", iconBgColors[status])}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TrendIcon({ trend }: { trend: "up" | "down" | "flat" }) {
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-emerald-600" />;
  if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-600" />;
  return <Minus className="h-4 w-4 text-amber-600" />;
}

function RiskBadge({ status }: { status: "low" | "medium" | "high" }) {
  const styles = {
    low: "bg-emerald-100 text-emerald-700 border-emerald-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    high: "bg-red-100 text-red-700 border-red-200",
  };
  const labels = { low: "Low Risk", medium: "At Risk", high: "High Risk" };
  
  return (
    <Badge variant="outline" className={cn("text-xs font-medium", styles[status])}>
      {labels[status]}
    </Badge>
  );
}

function ComplianceBar({ value, showLabel = true }: { value: number; showLabel?: boolean }) {
  const getColor = (v: number) => {
    if (v >= 95) return "bg-emerald-500";
    if (v >= 90) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all", getColor(value))}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      {showLabel && (
        <span className={cn(
          "text-sm font-medium min-w-[45px] text-right",
          value >= 95 ? "text-emerald-600" : value >= 90 ? "text-amber-600" : "text-red-600"
        )}>
          {value.toFixed(1)}%
        </span>
      )}
    </div>
  );
}

function InsightItem({ type, message }: { type: "success" | "warning" | "info"; message: string }) {
  const styles = {
    success: { bg: "bg-emerald-50", border: "border-emerald-200", icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" /> },
    warning: { bg: "bg-amber-50", border: "border-amber-200", icon: <AlertTriangle className="h-4 w-4 text-amber-600" /> },
    info: { bg: "bg-blue-50", border: "border-blue-200", icon: <Lightbulb className="h-4 w-4 text-blue-600" /> },
  };

  return (
    <div className={cn("flex items-start gap-3 p-3 rounded-lg border", styles[type].bg, styles[type].border)}>
      <div className="mt-0.5">{styles[type].icon}</div>
      <p className="text-sm text-foreground">{message}</p>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function CareMinutesOverview() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Care Minutes Overview</h1>
        <p className="text-muted-foreground">
          Portfolio compliance and performance analysis • Current Month: January 2026
        </p>
      </div>

      {/* Section 1: Portfolio Health Summary */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Portfolio Health Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <KPICard
            title="Total Care Compliance"
            value={`${portfolioKPIs.totalCareCompliance}%`}
            subtitle="Portfolio average"
            status={portfolioKPIs.totalCareCompliance >= 95 ? "good" : portfolioKPIs.totalCareCompliance >= 90 ? "warning" : "danger"}
            icon={<Activity className="h-5 w-5" />}
          />
          <KPICard
            title="RN Minutes Compliance"
            value={`${portfolioKPIs.rnCompliance}%`}
            subtitle="Portfolio average"
            status={portfolioKPIs.rnCompliance >= 95 ? "good" : portfolioKPIs.rnCompliance >= 90 ? "warning" : "danger"}
            icon={<Users className="h-5 w-5" />}
          />
          <KPICard
            title="Meeting Care Target"
            value={`${portfolioKPIs.facilitiesMeetingCare} / ${portfolioKPIs.totalFacilities}`}
            subtitle="Facilities"
            status={portfolioKPIs.facilitiesMeetingCare === portfolioKPIs.totalFacilities ? "good" : portfolioKPIs.facilitiesMeetingCare >= 3 ? "warning" : "danger"}
            icon={<ShieldCheck className="h-5 w-5" />}
          />
          <KPICard
            title="Meeting RN Target"
            value={`${portfolioKPIs.facilitiesMeetingRN} / ${portfolioKPIs.totalFacilities}`}
            subtitle="Facilities"
            status={portfolioKPIs.facilitiesMeetingRN === portfolioKPIs.totalFacilities ? "good" : portfolioKPIs.facilitiesMeetingRN >= 3 ? "warning" : "danger"}
            icon={<Clock className="h-5 w-5" />}
          />
          <KPICard
            title="At Compliance Risk"
            value={portfolioKPIs.facilitiesAtRisk}
            subtitle="Facilities requiring attention"
            status={portfolioKPIs.facilitiesAtRisk === 0 ? "good" : portfolioKPIs.facilitiesAtRisk === 1 ? "warning" : "danger"}
            icon={<ShieldAlert className="h-5 w-5" />}
          />
        </div>
      </section>

      {/* Section 2: Compliance Trend Over Time */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Compliance Trend Over Time</CardTitle>
            <CardDescription>Weekly portfolio compliance (last 12 weeks) • Target: 100%</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={complianceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="week" 
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <YAxis 
                    domain={[75, 105]} 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `${v}%`}
                    className="text-muted-foreground"
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(1)}%`]}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <ReferenceLine 
                    y={100} 
                    stroke="hsl(var(--primary))" 
                    strokeDasharray="5 5" 
                    label={{ value: "Target", position: "right", fontSize: 11 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="totalCare" 
                    name="Total Care Minutes" 
                    fill="hsl(142 76% 36% / 0.2)" 
                    stroke="hsl(142 76% 36%)"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rn" 
                    name="RN Minutes" 
                    stroke="hsl(221 83% 53%)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 3: Facility Comparison Matrix */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Facility Comparison</CardTitle>
            <CardDescription>Side-by-side performance across all facilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Facility</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Total Care Compliance</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">RN Compliance</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Avg Daily (vs Target)</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Trend</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Risk Status</th>
                  </tr>
                </thead>
                <tbody>
                  {facilityData.map((facility) => (
                    <tr key={facility.name} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-4 font-medium">{facility.name}</td>
                      <td className="py-4 px-4 w-48">
                        <ComplianceBar value={facility.totalCareCompliance} />
                      </td>
                      <td className="py-4 px-4 w-48">
                        <ComplianceBar value={facility.rnCompliance} />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={cn(
                          "font-medium",
                          facility.avgDailyMinutes >= facility.targetMinutes ? "text-emerald-600" : "text-red-600"
                        )}>
                          {facility.avgDailyMinutes}
                        </span>
                        <span className="text-muted-foreground"> / {facility.targetMinutes} min</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center">
                          <TrendIcon trend={facility.trend} />
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center">
                          <RiskBadge status={facility.riskStatus} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 4: RN vs Total Care Minutes Diagnosis */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>RN vs Non-RN Care Minutes Breakdown</CardTitle>
            <CardDescription>
              Understand whether shortfalls are driven by RN staffing or overall care minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rnBreakdownData} layout="vertical" barGap={0}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={true} vertical={false} />
                  <XAxis 
                    type="number" 
                    domain={[0, 220]}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `${v} min`}
                    className="text-muted-foreground"
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    width={80}
                    className="text-muted-foreground"
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      `${value} min`,
                      name === "rnMinutes" ? "RN Minutes" : "Non-RN Care Minutes"
                    ]}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend 
                    formatter={(value) => value === "rnMinutes" ? "RN Minutes" : "Non-RN Care Minutes"}
                  />
                  <Bar 
                    dataKey="rnMinutes" 
                    stackId="a" 
                    fill="hsl(221 83% 53%)" 
                    radius={[0, 0, 0, 0]}
                    name="rnMinutes"
                  />
                  <Bar 
                    dataKey="nonRnMinutes" 
                    stackId="a" 
                    fill="hsl(142 76% 36%)" 
                    radius={[0, 4, 4, 0]}
                    name="nonRnMinutes"
                  />
                  <ReferenceLine 
                    x={200} 
                    stroke="hsl(var(--destructive))" 
                    strokeDasharray="5 5"
                    label={{ value: "Target: 200 min", position: "top", fontSize: 10 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500" />
                <span>RN Minutes (Target: 40 min/resident/day)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-emerald-500" />
                <span>Non-RN Care Minutes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 5: Action-Oriented Insights */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Key Insights & Recommendations
            </CardTitle>
            <CardDescription>
              Auto-generated observations based on current performance data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {insights.map((insight, index) => (
                <InsightItem key={index} type={insight.type} message={insight.message} />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
