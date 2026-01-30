import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Activity, 
  Users, 
  Clock,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  Area,
  Line,
  BarChart,
  Bar,
} from "recharts";

// Import shared data layer
import {
  getPortfolioFacilities,
  getFacilityById,
  COMPLIANCE_TARGET,
  generateAllFacilityMetrics,
  generateWeeklyTrends,
  generatePortfolioInsights,
  getFacilityTrend,
  getFacilityRiskLevel,
  calculatePortfolioSummary,
} from "@/lib/care-minutes";

// Import shared components
import {
  ComplianceKpiCard,
  getKpiStatus,
  getCountStatus,
  RiskBadge,
  FacilityLink,
  ComplianceBar,
  TrendIcon,
  InsightItem,
} from "@/components/care-minutes";

export default function CareMinutesOverview() {
  // Get portfolio facilities (first 4 for Overview)
  const facilities = useMemo(() => getPortfolioFacilities(4), []);
  const facilityIds = useMemo(() => facilities.map(f => f.id), [facilities]);
  
  // Generate metrics for all facilities
  const facilityMetrics = useMemo(() => generateAllFacilityMetrics(facilityIds), [facilityIds]);
  
  // Calculate portfolio summary
  const portfolioKPIs = useMemo(() => 
    calculatePortfolioSummary(facilityMetrics, facilities.length), 
    [facilityMetrics, facilities.length]
  );
  
  // Weekly compliance trend
  const complianceTrendData = useMemo(() => generateWeeklyTrends(12), []);
  
  // Facility comparison data with enriched info
  const facilityData = useMemo(() => {
    return facilityMetrics.map(metrics => {
      const facility = getFacilityById(metrics.facilityId);
      return {
        id: metrics.facilityId,
        name: facility?.name || "Unknown",
        shortName: facility?.shortName || "Unknown",
        totalCareCompliance: metrics.totalCareCompliance,
        rnCompliance: metrics.rnCompliance,
        avgDailyMinutes: metrics.avgDailyMinutes,
        targetMinutes: facility?.targetTotal || 200,
        rnMinutes: metrics.avgRnMinutes,
        nonRnMinutes: metrics.avgNonRnMinutes,
        rnTarget: facility?.targetRn || 44,
        trend: getFacilityTrend(metrics.facilityId),
        riskStatus: getFacilityRiskLevel(metrics.facilityId),
      };
    });
  }, [facilityMetrics]);
  
  // RN breakdown data for stacked chart
  const rnBreakdownData = useMemo(() => 
    facilityData.map(f => ({
      name: f.shortName,
      fullName: f.name,
      rnMinutes: f.rnMinutes,
      nonRnMinutes: f.nonRnMinutes,
      rnTarget: f.rnTarget,
      totalTarget: f.targetMinutes,
    })), 
    [facilityData]
  );
  
  // Auto-generated insights
  const insights = useMemo(() => generatePortfolioInsights(facilityMetrics), [facilityMetrics]);

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
          <ComplianceKpiCard
            title="Total Care Compliance"
            value={`${portfolioKPIs.totalCareCompliance}%`}
            subtitle="Portfolio average"
            status={getKpiStatus(portfolioKPIs.totalCareCompliance)}
            icon={Activity}
          />
          <ComplianceKpiCard
            title="RN Minutes Compliance"
            value={`${portfolioKPIs.rnCompliance}%`}
            subtitle="Portfolio average"
            status={getKpiStatus(portfolioKPIs.rnCompliance)}
            icon={Users}
          />
          <ComplianceKpiCard
            title="Meeting Care Target"
            value={`${portfolioKPIs.facilitiesMeetingCare} / ${portfolioKPIs.totalFacilities}`}
            subtitle="Facilities"
            status={getCountStatus(portfolioKPIs.facilitiesMeetingCare, portfolioKPIs.totalFacilities)}
            icon={ShieldCheck}
          />
          <ComplianceKpiCard
            title="Meeting RN Target"
            value={`${portfolioKPIs.facilitiesMeetingRN} / ${portfolioKPIs.totalFacilities}`}
            subtitle="Facilities"
            status={getCountStatus(portfolioKPIs.facilitiesMeetingRN, portfolioKPIs.totalFacilities)}
            icon={Clock}
          />
          <ComplianceKpiCard
            title="At Compliance Risk"
            value={portfolioKPIs.facilitiesAtRisk}
            subtitle="Facilities requiring attention"
            status={getCountStatus(portfolioKPIs.facilitiesAtRisk, portfolioKPIs.totalFacilities, true)}
            icon={ShieldAlert}
          />
        </div>
      </section>

      {/* Section 2: Compliance Trend Over Time */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Compliance Trend Over Time</CardTitle>
            <CardDescription>Weekly portfolio compliance (last 12 weeks) • Target: {COMPLIANCE_TARGET}%</CardDescription>
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
                    y={COMPLIANCE_TARGET} 
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
            <CardDescription>Side-by-side performance across all facilities • Click a facility name to view details</CardDescription>
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
                    <tr key={facility.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-4">
                        <FacilityLink facilityId={facility.id} facilityName={facility.name} />
                      </td>
                      <td className="py-4 px-4 w-48">
                        <ComplianceBar value={facility.totalCareCompliance} />
                      </td>
                      <td className="py-4 px-4 w-48">
                        <ComplianceBar value={facility.rnCompliance} />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={cn(
                          "font-medium tabular-nums",
                          facility.avgDailyMinutes >= facility.targetMinutes ? "text-emerald-600" : "text-red-600"
                        )}>
                          {facility.avgDailyMinutes}
                        </span>
                        <span className="text-muted-foreground"> / {facility.targetMinutes} min</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center">
                          <TrendIcon direction={facility.trend} />
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center">
                          <RiskBadge level={facility.riskStatus} />
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
                    stroke="hsl(var(--primary))" 
                    strokeDasharray="5 5"
                    label={{ value: "Target", position: "top", fontSize: 10 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 5: Automated Insights */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Operational Insights</CardTitle>
            <CardDescription>
              System-generated analysis based on current performance patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight, index) => (
              <InsightItem key={index} insight={insight} />
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
