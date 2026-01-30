import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  Area,
  Line,
  BarChart,
  Bar,
} from "recharts";
import {
  Clock,
  Users,
  Activity,
  Calendar,
  TrendingUp,
  UserCheck,
  ChevronLeft,
} from "lucide-react";

// Import shared data layer
import {
  getPortfolioFacilities,
  getFacilityById,
  COMPLIANCE_TARGET,
  generateDailyData,
  generateFacilityMetrics,
  generateStaffingData,
  generateFacilityInsights,
} from "@/lib/care-minutes";

// Import shared components
import {
  ComplianceKpiCard,
  getKpiStatus,
  InsightItem,
} from "@/components/care-minutes";

// Calendar cell color based on compliance
const getCalendarCellColor = (compliance: number) => {
  if (compliance >= 100) return "bg-emerald-500";
  if (compliance >= 95) return "bg-amber-400";
  if (compliance >= 90) return "bg-orange-500";
  return "bg-red-500";
};

// Staffing signal colors
const getStaffingSignalColor = (status: string) => {
  return status === "ok" 
    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
};

export default function CareMinutesFacilities() {
  const [searchParams] = useSearchParams();
  const urlFacilityId = searchParams.get('id');
  
  // Get portfolio facilities (same as Overview for consistency)
  const facilities = useMemo(() => getPortfolioFacilities(4), []);
  
  // Initialize with URL param or first facility
  const [selectedFacility, setSelectedFacility] = useState(
    urlFacilityId && facilities.some(f => f.id === urlFacilityId)
      ? urlFacilityId 
      : facilities[0].id
  );
  const [dateRange, setDateRange] = useState("30");

  // Update selection if URL param changes
  useEffect(() => {
    if (urlFacilityId && facilities.some(f => f.id === urlFacilityId)) {
      setSelectedFacility(urlFacilityId);
    }
  }, [urlFacilityId, facilities]);

  const facility = getFacilityById(selectedFacility) || facilities[0];
  const dailyData = useMemo(() => generateDailyData(selectedFacility, parseInt(dateRange)), [selectedFacility, dateRange]);
  const metrics = useMemo(() => generateFacilityMetrics(selectedFacility), [selectedFacility]);
  const staffingData = useMemo(() => generateStaffingData(selectedFacility), [selectedFacility]);
  const insights = useMemo(() => generateFacilityInsights(selectedFacility), [selectedFacility]);

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
      rnTarget: facility.targetRn,
      totalTarget: facility.targetTotal,
    }));
  }, [dailyData, facility]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link 
          to="/care-minutes/overview" 
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Portfolio
        </Link>
      </div>

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
        <ComplianceKpiCard
          title="Total Care Compliance"
          value={`${metrics.totalCareCompliance}%`}
          target={`Target: ${COMPLIANCE_TARGET}%`}
          status={getKpiStatus(metrics.totalCareCompliance)}
          icon={Activity}
        />
        <ComplianceKpiCard
          title="RN Minutes Compliance"
          value={`${metrics.rnCompliance}%`}
          target={`Target: ${COMPLIANCE_TARGET}%`}
          status={getKpiStatus(metrics.rnCompliance)}
          icon={UserCheck}
        />
        <ComplianceKpiCard
          title="Avg Daily Minutes"
          value={`${metrics.avgDailyMinutes}`}
          target={`Target: ${facility.targetTotal} min`}
          status={getKpiStatus((metrics.avgDailyMinutes / facility.targetTotal) * 100)}
          icon={Clock}
        />
        <ComplianceKpiCard
          title="Days Below Target"
          value={`${metrics.daysBelowTarget}`}
          target={`Last ${dateRange} days`}
          status={metrics.daysBelowTarget <= 3 ? "good" : metrics.daysBelowTarget <= 7 ? "warning" : "danger"}
          icon={Calendar}
        />
        <ComplianceKpiCard
          title="RN Shortfall Days"
          value={`${metrics.rnShortfallDays}`}
          target={`Last ${dateRange} days`}
          status={metrics.rnShortfallDays <= 3 ? "good" : metrics.rnShortfallDays <= 7 ? "warning" : "danger"}
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
          <div className="grid grid-cols-7 gap-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
                {day}
              </div>
            ))}
            {/* Add empty cells to align with correct day of week */}
            {Array.from({ length: dailyData[0] ? (new Date(dailyData[0].date).getDay() === 0 ? 6 : new Date(dailyData[0].date).getDay() - 1) : 0 }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10" />
            ))}
            {dailyData.map((day) => (
              <div
                key={day.date}
                className={cn(
                  "h-10 rounded-md flex flex-col items-center justify-center text-white text-[10px] font-medium cursor-pointer transition-transform hover:scale-105 relative group",
                  getCalendarCellColor(day.complianceTotal)
                )}
              >
                <span className="font-semibold">{day.complianceTotal}%</span>
                <span className="text-[8px] opacity-80">{day.dayOfMonth}</span>
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
                  content={({ active, payload }) => {
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
                <ReferenceLine y={facility.targetTotal} stroke="hsl(var(--primary))" strokeDasharray="5 5" label={{ value: "Total Target", position: "right", fontSize: 10 }} />
                <ReferenceLine y={facility.targetRn} stroke="hsl(142.1 76.2% 36.3%)" strokeDasharray="5 5" label={{ value: "RN Target", position: "right", fontSize: 10 }} />
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

      {/* Section 4: Weekly Skill Mix */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            Weekly Skill Mix Breakdown
          </CardTitle>
          <CardDescription>
            RN vs Non-RN care minute distribution by week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySkillMixData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 220]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const data = payload[0]?.payload;
                    return (
                      <div className="bg-popover text-popover-foreground text-xs rounded-lg shadow-lg p-3 border">
                        <div className="font-semibold mb-2">{data?.week}</div>
                        <div className="space-y-1">
                          <div>RN: {data?.rn} min (target: {data?.rnTarget})</div>
                          <div>Non-RN: {data?.nonRn} min</div>
                          <div>Total: {data?.rn + data?.nonRn} min (target: {data?.totalTarget})</div>
                        </div>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="rn" stackId="a" fill="hsl(221 83% 53%)" name="RN Minutes" />
                <Bar dataKey="nonRn" stackId="a" fill="hsl(142 76% 36%)" name="Non-RN Minutes" radius={[4, 4, 0, 0]} />
                <ReferenceLine y={facility.targetTotal} stroke="hsl(var(--primary))" strokeDasharray="5 5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(221 83% 53%)" }} />
              <span className="text-muted-foreground">RN Minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(142 76% 36%)" }} />
              <span className="text-muted-foreground">Non-RN Minutes</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Staffing Signals */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Current Staffing Signals</CardTitle>
          <CardDescription>Today's rostered vs required staff by role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {staffingData.map((staff) => (
              <div 
                key={staff.role}
                className={cn(
                  "p-4 rounded-lg border",
                  getStaffingSignalColor(staff.status)
                )}
              >
                <p className="text-sm font-medium">{staff.role}</p>
                <p className="text-2xl font-bold mt-1">
                  {staff.planned} / {staff.required}
                </p>
                <p className="text-xs mt-1">
                  {staff.gap === 0 ? "Fully staffed" : `${Math.abs(staff.gap)} ${staff.gap < 0 ? "under" : "over"}`}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Actionable Insights */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Actionable Insights</CardTitle>
          <CardDescription>System-generated recommendations based on facility data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <InsightItem key={index} insight={insight} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No significant insights to report.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
