import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Users,
  Activity,
  Calendar,
  Lightbulb,
  Target,
  UserCheck,
  AlertCircle,
} from "lucide-react";

// Mock facilities data (consistent with Overview v2)
const facilities = [
  { id: "north-ryan", name: "North Ryan Aged Care", target: 200, rnTarget: 44 },
  { id: "evansville", name: "Evansville Manor", target: 200, rnTarget: 44 },
  { id: "west-haven", name: "West Haven Lodge", target: 200, rnTarget: 44 },
  { id: "sunrise-gardens", name: "Sunrise Gardens", target: 200, rnTarget: 44 },
];

// Generate deterministic daily data for the last 30 days
const generateDailyData = (facilityId: string) => {
  const data = [];
  const today = new Date();
  
  // Seed based on facility for consistent but varied data
  const seed = facilityId.charCodeAt(0) + facilityId.charCodeAt(facilityId.length - 1);
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Create variation based on day and facility
    const dayFactor = (date.getDay() === 0 || date.getDay() === 6) ? 0.85 : 1; // Weekends lower
    const facilityFactor = 0.9 + (seed % 20) / 100; // 0.9 - 1.1 range
    const randomFactor = 0.95 + ((i * seed) % 15) / 100; // Slight daily variation
    
    const baseTotal = 200;
    const baseRn = 44;
    
    const actualTotal = Math.round(baseTotal * dayFactor * facilityFactor * randomFactor);
    const actualRn = Math.round(baseRn * dayFactor * facilityFactor * randomFactor * (0.9 + ((i + seed) % 20) / 100));
    const actualNonRn = actualTotal - actualRn;
    
    data.push({
      date: date.toISOString().split('T')[0],
      dayOfWeek: date.toLocaleDateString('en-AU', { weekday: 'short' }),
      dayOfMonth: date.getDate(),
      month: date.toLocaleDateString('en-AU', { month: 'short' }),
      actualTotal,
      actualRn,
      actualNonRn,
      targetTotal: 200,
      targetRn: 44,
      complianceTotal: Math.round((actualTotal / 200) * 100),
      complianceRn: Math.round((actualRn / 44) * 100),
    });
  }
  
  return data;
};

// Generate staffing data
const generateStaffingData = (facilityId: string) => {
  const seed = facilityId.charCodeAt(0);
  return [
    { role: "RN", planned: 4 + (seed % 2), required: 5, gap: -(1 - (seed % 2)), status: seed % 2 === 0 ? "shortfall" : "ok" },
    { role: "EN", planned: 6, required: 6, gap: 0, status: "ok" },
    { role: "PCW", planned: 12 + (seed % 3), required: 14, gap: -(2 - (seed % 3)), status: seed % 3 === 0 ? "ok" : "shortfall" },
    { role: "Allied Health", planned: 2, required: 2, gap: 0, status: "ok" },
  ];
};

// Status helpers
const getComplianceStatus = (value: number) => {
  if (value >= 100) return { status: "success", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" };
  if (value >= 95) return { status: "warning", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" };
  return { status: "error", icon: XCircle, color: "text-red-600", bg: "bg-red-50" };
};

const getCalendarCellColor = (compliance: number) => {
  if (compliance >= 100) return "bg-emerald-500";
  if (compliance >= 95) return "bg-amber-400";
  if (compliance >= 90) return "bg-orange-500";
  return "bg-red-500";
};

const CareMinutesFacilities = () => {
  const [selectedFacility, setSelectedFacility] = useState(facilities[0].id);
  const [dateRange, setDateRange] = useState("30");

  const facility = facilities.find(f => f.id === selectedFacility) || facilities[0];
  const dailyData = useMemo(() => generateDailyData(selectedFacility), [selectedFacility]);
  const staffingData = useMemo(() => generateStaffingData(selectedFacility), [selectedFacility]);

  // Calculate KPIs from daily data
  const kpis = useMemo(() => {
    const avgTotal = dailyData.reduce((sum, d) => sum + d.actualTotal, 0) / dailyData.length;
    const avgRn = dailyData.reduce((sum, d) => sum + d.actualRn, 0) / dailyData.length;
    const daysBelowTarget = dailyData.filter(d => d.complianceTotal < 100).length;
    const rnShortfallDays = dailyData.filter(d => d.complianceRn < 100).length;
    
    return {
      totalCompliance: Math.round((avgTotal / 200) * 100),
      rnCompliance: Math.round((avgRn / 44) * 100),
      avgDailyMinutes: Math.round(avgTotal),
      daysBelowTarget,
      rnShortfallDays,
    };
  }, [dailyData]);

  // Generate insights based on data
  const insights = useMemo(() => {
    const result = [];
    
    // Check RN compliance
    if (kpis.rnCompliance < kpis.totalCompliance) {
      result.push({
        type: "warning",
        title: "RN minutes are the primary constraint",
        description: `RN compliance (${kpis.rnCompliance}%) is ${kpis.totalCompliance - kpis.rnCompliance}% lower than total care minutes. Consider prioritizing RN recruitment or agency coverage.`,
        action: "Review RN rostering gaps",
      });
    }
    
    // Check weekend patterns
    const weekendData = dailyData.filter(d => d.dayOfWeek === 'Sat' || d.dayOfWeek === 'Sun');
    const weekendAvg = weekendData.reduce((sum, d) => sum + d.complianceTotal, 0) / weekendData.length;
    if (weekendAvg < 95) {
      result.push({
        type: "alert",
        title: "Weekend staffing underperformance",
        description: `Weekend compliance averages ${Math.round(weekendAvg)}%, significantly below target. This pattern suggests rostering gaps on Saturdays and Sundays.`,
        action: "Increase weekend RN coverage",
      });
    }
    
    // Check for persistent issues
    if (kpis.daysBelowTarget > 10) {
      result.push({
        type: "critical",
        title: "Persistent compliance shortfall",
        description: `${kpis.daysBelowTarget} of the last 30 days were below target. This is a structural issue requiring workforce planning intervention.`,
        action: "Schedule workforce planning review",
      });
    }
    
    // Skill mix observation
    const avgRnRatio = dailyData.reduce((sum, d) => sum + (d.actualRn / d.actualTotal), 0) / dailyData.length;
    if (avgRnRatio < 0.22) {
      result.push({
        type: "info",
        title: "Skill mix adjustment recommended",
        description: `RN minutes represent only ${Math.round(avgRnRatio * 100)}% of total care minutes (target: 22%). Consider rebalancing staff allocation.`,
        action: "Adjust skill mix ratios",
      });
    }
    
    // Positive insight if applicable
    if (kpis.totalCompliance >= 100 && kpis.rnCompliance >= 100) {
      result.push({
        type: "success",
        title: "Facility meeting all targets",
        description: "This facility is currently compliant across both total care and RN minutes. Maintain current staffing levels and rostering patterns.",
        action: "Continue monitoring",
      });
    }
    
    return result.slice(0, 4);
  }, [dailyData, kpis]);

  // Prepare weekly aggregated data for skill mix chart
  const weeklySkillMixData = useMemo(() => {
    const weeks: { [key: string]: { rn: number; nonRn: number; count: number } } = {};
    
    dailyData.forEach((d, i) => {
      const weekNum = Math.floor(i / 7);
      const weekLabel = `Week ${weekNum + 1}`;
      if (!weeks[weekLabel]) {
        weeks[weekLabel] = { rn: 0, nonRn: 0, count: 0 };
      }
      weeks[weekLabel].rn += d.actualRn;
      weeks[weekLabel].nonRn += d.actualNonRn;
      weeks[weekLabel].count += 1;
    });
    
    return Object.entries(weeks).map(([week, data]) => ({
      week,
      rn: Math.round(data.rn / data.count),
      nonRn: Math.round(data.nonRn / data.count),
      rnTarget: 44,
      totalTarget: 200,
    }));
  }, [dailyData]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Facility Drill-Down</h1>
          <p className="text-muted-foreground mt-1">
            Detailed compliance analysis and operational diagnostics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedFacility} onValueChange={setSelectedFacility}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select facility" />
            </SelectTrigger>
            <SelectContent>
              {facilities.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Section 1: Facility Health Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KpiCard
          title="Total Care Compliance"
          value={`${kpis.totalCompliance}%`}
          target="Target: 100%"
          status={getComplianceStatus(kpis.totalCompliance)}
          icon={Activity}
        />
        <KpiCard
          title="RN Minutes Compliance"
          value={`${kpis.rnCompliance}%`}
          target="Target: 100%"
          status={getComplianceStatus(kpis.rnCompliance)}
          icon={UserCheck}
        />
        <KpiCard
          title="Avg Daily Minutes"
          value={`${kpis.avgDailyMinutes}`}
          target="Target: 200 min"
          status={getComplianceStatus((kpis.avgDailyMinutes / 200) * 100)}
          icon={Clock}
        />
        <KpiCard
          title="Days Below Target"
          value={`${kpis.daysBelowTarget}`}
          target="Last 30 days"
          status={kpis.daysBelowTarget <= 3 ? getComplianceStatus(100) : kpis.daysBelowTarget <= 7 ? getComplianceStatus(96) : getComplianceStatus(90)}
          icon={Calendar}
        />
        <KpiCard
          title="RN Shortfall Days"
          value={`${kpis.rnShortfallDays}`}
          target="Last 30 days"
          status={kpis.rnShortfallDays <= 3 ? getComplianceStatus(100) : kpis.rnShortfallDays <= 7 ? getComplianceStatus(96) : getComplianceStatus(90)}
          icon={Users}
        />
      </div>

      {/* Section 2: Calendar Heatmap */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                Daily Compliance Calendar
              </CardTitle>
              <CardDescription>
                Identify patterns and clusters of underperformance
              </CardDescription>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-emerald-500" />
                <span className="text-muted-foreground">≥100%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-amber-400" />
                <span className="text-muted-foreground">95-99%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-orange-500" />
                <span className="text-muted-foreground">90-94%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-red-500" />
                <span className="text-muted-foreground">&lt;90%</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1.5">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
                {day}
              </div>
            ))}
            {/* Add empty cells to align with correct day of week */}
            {Array.from({ length: new Date(dailyData[0]?.date).getDay() === 0 ? 6 : new Date(dailyData[0]?.date).getDay() - 1 }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {dailyData.map((day, i) => (
              <div
                key={day.date}
                className={cn(
                  "aspect-square rounded-md flex flex-col items-center justify-center text-white text-xs font-medium cursor-pointer transition-transform hover:scale-105 relative group",
                  getCalendarCellColor(day.complianceTotal)
                )}
              >
                <span>{day.dayOfMonth}</span>
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                  <div className="bg-popover text-popover-foreground text-xs rounded-lg shadow-lg p-3 whitespace-nowrap border">
                    <div className="font-semibold mb-1">{day.dayOfWeek}, {day.dayOfMonth} {day.month}</div>
                    <div className="space-y-0.5">
                      <div>Total: {day.actualTotal} / {day.targetTotal} min</div>
                      <div>RN: {day.actualRn} / {day.targetRn} min</div>
                      <div className="pt-1 border-t mt-1">
                        Compliance: {day.complianceTotal}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Daily Care Minutes Trend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            Care Minutes Trend
          </CardTitle>
          <CardDescription>
            Daily total and RN minutes against targets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dailyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="dayOfMonth" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value, i) => dailyData[i]?.dayOfWeek?.charAt(0) || value}
                />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 250]} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const data = payload[0]?.payload;
                    return (
                      <div className="bg-popover text-popover-foreground text-xs rounded-lg shadow-lg p-3 border">
                        <div className="font-semibold mb-2">{data?.dayOfWeek}, {data?.dayOfMonth} {data?.month}</div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span>Total: {data?.actualTotal} min</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>RN: {data?.actualRn} min</span>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
                <ReferenceLine y={200} stroke="hsl(var(--primary))" strokeDasharray="5 5" label={{ value: "Total Target", position: "right", fontSize: 10 }} />
                <ReferenceLine y={44} stroke="hsl(142.1 76.2% 36.3%)" strokeDasharray="5 5" label={{ value: "RN Target", position: "right", fontSize: 10 }} />
                <Area
                  type="monotone"
                  dataKey="actualTotal"
                  fill="hsl(var(--primary) / 0.1)"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Total Care Minutes"
                />
                <Line
                  type="monotone"
                  dataKey="actualRn"
                  stroke="hsl(142.1 76.2% 36.3%)"
                  strokeWidth={2}
                  dot={false}
                  name="RN Minutes"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: RN vs Non-RN Skill Mix */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            RN vs Non-RN Skill Mix Breakdown
          </CardTitle>
          <CardDescription>
            Weekly average care minutes by staff type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySkillMixData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 250]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const data = payload[0]?.payload;
                    const total = (data?.rn || 0) + (data?.nonRn || 0);
                    const rnRatio = Math.round(((data?.rn || 0) / total) * 100);
                    return (
                      <div className="bg-popover text-popover-foreground text-xs rounded-lg shadow-lg p-3 border">
                        <div className="font-semibold mb-2">{data?.week}</div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>RN: {data?.rn} min ({rnRatio}%)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-sky-500" />
                            <span>Non-RN: {data?.nonRn} min ({100 - rnRatio}%)</span>
                          </div>
                          <div className="pt-1 border-t mt-1">
                            Total: {total} min (Target: 200)
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
                <Legend />
                <ReferenceLine y={200} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" />
                <Bar dataKey="rn" stackId="a" fill="hsl(142.1 76.2% 36.3%)" name="RN Minutes" radius={[0, 0, 0, 0]} />
                <Bar dataKey="nonRn" stackId="a" fill="hsl(199 89% 48%)" name="Non-RN Minutes" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500" />
              <span className="text-muted-foreground">RN target: 44 min (22%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-sky-500" />
              <span className="text-muted-foreground">Non-RN: 156 min (78%)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Staffing & Capacity Signals */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-muted-foreground" />
            Staffing & Capacity Signals
          </CardTitle>
          <CardDescription>
            Current staffing levels vs requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {staffingData.map((role) => (
              <div
                key={role.role}
                className={cn(
                  "p-4 rounded-lg border",
                  role.status === "shortfall" ? "border-red-200 bg-red-50" : "border-border bg-muted/30"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{role.role}</span>
                  {role.status === "shortfall" ? (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  )}
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Planned:</span>
                    <span className="font-medium">{role.planned}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Required:</span>
                    <span className="font-medium">{role.required}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t">
                    <span className="text-muted-foreground">Gap:</span>
                    <span className={cn(
                      "font-semibold",
                      role.gap < 0 ? "text-red-600" : "text-emerald-600"
                    )}>
                      {role.gap === 0 ? "—" : role.gap > 0 ? `+${role.gap}` : role.gap}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Actionable Insights & Recommendations */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Actionable Insights & Recommendations
          </CardTitle>
          <CardDescription>
            Auto-generated observations based on current data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={cn(
                  "p-4 rounded-lg border flex gap-4",
                  insight.type === "critical" && "border-red-200 bg-red-50",
                  insight.type === "warning" && "border-amber-200 bg-amber-50",
                  insight.type === "alert" && "border-orange-200 bg-orange-50",
                  insight.type === "info" && "border-sky-200 bg-sky-50",
                  insight.type === "success" && "border-emerald-200 bg-emerald-50"
                )}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {insight.type === "critical" && <XCircle className="h-5 w-5 text-red-600" />}
                  {insight.type === "warning" && <AlertTriangle className="h-5 w-5 text-amber-600" />}
                  {insight.type === "alert" && <AlertCircle className="h-5 w-5 text-orange-600" />}
                  {insight.type === "info" && <Lightbulb className="h-5 w-5 text-sky-600" />}
                  {insight.type === "success" && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-1">{insight.title}</div>
                  <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                  <Badge variant="outline" className="text-xs">
                    Suggested: {insight.action}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// KPI Card Component
interface KpiCardProps {
  title: string;
  value: string;
  target: string;
  status: ReturnType<typeof getComplianceStatus>;
  icon: React.ElementType;
}

const KpiCard = ({ title, value, target, status, icon: Icon }: KpiCardProps) => {
  const StatusIcon = status.icon;
  
  return (
    <Card className={cn("relative overflow-hidden", status.bg)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground mb-1">{title}</p>
            <p className={cn("text-2xl font-bold", status.color)}>{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{target}</p>
          </div>
          <div className={cn("p-2 rounded-full", status.bg)}>
            <StatusIcon className={cn("h-5 w-5", status.color)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareMinutesFacilities;
