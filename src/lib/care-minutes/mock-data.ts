import type { 
  CareMinutesFacility, 
  DailyMetrics, 
  FacilityMetrics, 
  WeeklyTrend, 
  MonthlyTrend, 
  StaffingData,
  Insight,
  TrendDirection,
  RiskLevel,
} from "./types";
import { CARE_MINUTES_FACILITIES, COMPLIANCE_TARGET } from "./facilities";
import { calculateCompliance, getRiskLevel, getTrendDirection } from "./metrics";

// Seeded random number generator for deterministic data
function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// Generate seed from facility ID
function getFacilitySeed(facilityId: string): number {
  let seed = 0;
  for (let i = 0; i < facilityId.length; i++) {
    seed += facilityId.charCodeAt(i) * (i + 1);
  }
  return seed;
}

// Facility performance profiles (determines base compliance level)
const FACILITY_PROFILES: Record<string, { baseTotal: number; baseRn: number }> = {
  "sunrise-gardens": { baseTotal: 1.02, baseRn: 0.98 },
  "harbour-view": { baseTotal: 0.96, baseRn: 0.94 },
  "mountain-lodge": { baseTotal: 0.93, baseRn: 0.86 },
  "coastal-haven": { baseTotal: 0.99, baseRn: 0.95 },
  "valley-gardens": { baseTotal: 1.01, baseRn: 1.02 },
  "riverside-manor": { baseTotal: 0.95, baseRn: 0.91 },
  "parkview-residence": { baseTotal: 1.03, baseRn: 1.00 },
  "greenfield-house": { baseTotal: 0.98, baseRn: 0.97 },
};

// Generate daily data for a facility
export function generateDailyData(facilityId: string, days: number = 30): DailyMetrics[] {
  const facility = CARE_MINUTES_FACILITIES.find(f => f.id === facilityId);
  if (!facility) return [];

  const profile = FACILITY_PROFILES[facilityId] || { baseTotal: 0.95, baseRn: 0.90 };
  const seed = getFacilitySeed(facilityId);
  const random = seededRandom(seed);
  
  const data: DailyMetrics[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Weekend factor (typically lower staffing)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const weekendFactor = isWeekend ? 0.92 : 1;
    
    // Daily variation
    const dailyVariation = 0.95 + random() * 0.10;
    
    const actualTotal = Math.round(facility.targetTotal * profile.baseTotal * weekendFactor * dailyVariation);
    const actualRn = Math.round(facility.targetRn * profile.baseRn * weekendFactor * (0.95 + random() * 0.10));
    const actualNonRn = actualTotal - actualRn;

    data.push({
      date: date.toISOString().split('T')[0],
      dayOfWeek: date.toLocaleDateString('en-AU', { weekday: 'short' }),
      dayOfMonth: date.getDate(),
      month: date.toLocaleDateString('en-AU', { month: 'short' }),
      actualTotal,
      actualRn,
      actualNonRn,
      targetTotal: facility.targetTotal,
      targetRn: facility.targetRn,
      complianceTotal: calculateCompliance(actualTotal, facility.targetTotal),
      complianceRn: calculateCompliance(actualRn, facility.targetRn),
    });
  }

  return data;
}

// Generate facility metrics from daily data
export function generateFacilityMetrics(facilityId: string): FacilityMetrics {
  const dailyData = generateDailyData(facilityId, 30);
  const facility = CARE_MINUTES_FACILITIES.find(f => f.id === facilityId);
  if (!facility) {
    return {
      facilityId,
      totalCareCompliance: 0,
      rnCompliance: 0,
      avgDailyMinutes: 0,
      avgRnMinutes: 0,
      avgNonRnMinutes: 0,
      daysBelowTarget: 0,
      rnShortfallDays: 0,
      totalVariance: 0,
      rnVariance: 0,
    };
  }

  const avgTotal = dailyData.reduce((sum, d) => sum + d.actualTotal, 0) / dailyData.length;
  const avgRn = dailyData.reduce((sum, d) => sum + d.actualRn, 0) / dailyData.length;
  const avgNonRn = dailyData.reduce((sum, d) => sum + d.actualNonRn, 0) / dailyData.length;
  const daysBelowTarget = dailyData.filter(d => d.complianceTotal < COMPLIANCE_TARGET).length;
  const rnShortfallDays = dailyData.filter(d => d.complianceRn < COMPLIANCE_TARGET).length;

  return {
    facilityId,
    totalCareCompliance: calculateCompliance(avgTotal, facility.targetTotal),
    rnCompliance: calculateCompliance(avgRn, facility.targetRn),
    avgDailyMinutes: Math.round(avgTotal),
    avgRnMinutes: Math.round(avgRn),
    avgNonRnMinutes: Math.round(avgNonRn),
    daysBelowTarget,
    rnShortfallDays,
    totalVariance: Math.round(avgTotal - facility.targetTotal),
    rnVariance: Math.round(avgRn - facility.targetRn),
  };
}

// Generate all facility metrics for portfolio
export function generateAllFacilityMetrics(facilityIds?: string[]): FacilityMetrics[] {
  const ids = facilityIds || CARE_MINUTES_FACILITIES.map(f => f.id);
  return ids.map(id => generateFacilityMetrics(id));
}

// Generate weekly trend data for portfolio
export function generateWeeklyTrends(weeks: number = 12): WeeklyTrend[] {
  const data: WeeklyTrend[] = [];
  const baseTotal = 94;
  const baseRn = 85;
  
  for (let i = 1; i <= weeks; i++) {
    // Slight upward trend with variation
    const weekFactor = 1 + (i / weeks) * 0.03;
    const variation = (Math.sin(i * 0.5) * 2);
    
    data.push({
      week: `W${i}`,
      totalCare: Math.round((baseTotal * weekFactor + variation) * 10) / 10,
      rn: Math.round((baseRn * weekFactor + variation * 0.8) * 10) / 10,
      target: COMPLIANCE_TARGET,
    });
  }
  
  return data;
}

// Generate monthly trend data
export function generateMonthlyTrends(months: number = 6): MonthlyTrend[] {
  const monthNames = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const data: MonthlyTrend[] = [];
  const baseTotal = 94;
  const baseRn = 91;
  
  for (let i = 0; i < months; i++) {
    const trend = 1 + (i / months) * 0.04;
    data.push({
      month: monthNames[i % monthNames.length],
      totalCompliance: Math.round((baseTotal * trend) * 10) / 10,
      rnCompliance: Math.round((baseRn * trend) * 10) / 10,
    });
  }
  
  return data;
}

// Generate staffing data for a facility
export function generateStaffingData(facilityId: string): StaffingData[] {
  const seed = getFacilitySeed(facilityId);
  const random = seededRandom(seed);
  
  const rnGap = random() > 0.6 ? 0 : -(1 + Math.floor(random() * 2));
  const pcwGap = random() > 0.5 ? 0 : -(1 + Math.floor(random() * 2));
  
  return [
    { role: "RN", planned: 5 + rnGap, required: 5, gap: rnGap, status: rnGap < 0 ? "shortfall" : "ok" },
    { role: "EN", planned: 6, required: 6, gap: 0, status: "ok" },
    { role: "PCW", planned: 14 + pcwGap, required: 14, gap: pcwGap, status: pcwGap < 0 ? "shortfall" : "ok" },
    { role: "Allied Health", planned: 2, required: 2, gap: 0, status: "ok" },
  ];
}

// Generate insights for a facility
export function generateFacilityInsights(facilityId: string): Insight[] {
  const metrics = generateFacilityMetrics(facilityId);
  const dailyData = generateDailyData(facilityId, 30);
  const insights: Insight[] = [];

  // RN vs Total comparison
  if (metrics.rnCompliance < metrics.totalCareCompliance - 5) {
    insights.push({
      type: "warning",
      title: "RN minutes are the primary constraint",
      message: `RN compliance (${metrics.rnCompliance}%) is ${Math.round(metrics.totalCareCompliance - metrics.rnCompliance)}% lower than total care minutes.`,
      description: "Consider prioritizing RN recruitment or agency coverage.",
      action: "Review RN rostering gaps",
    });
  }

  // Weekend patterns
  const weekendData = dailyData.filter(d => d.dayOfWeek === 'Sat' || d.dayOfWeek === 'Sun');
  const weekendAvg = weekendData.reduce((sum, d) => sum + d.complianceTotal, 0) / weekendData.length;
  if (weekendAvg < 95) {
    insights.push({
      type: "alert",
      title: "Weekend staffing underperformance",
      message: `Weekend compliance averages ${Math.round(weekendAvg)}%, significantly below target.`,
      description: "This pattern suggests rostering gaps on Saturdays and Sundays.",
      action: "Increase weekend RN coverage",
    });
  }

  // Persistent issues
  if (metrics.daysBelowTarget > 10) {
    insights.push({
      type: "critical",
      title: "Persistent compliance shortfall",
      message: `${metrics.daysBelowTarget} of the last 30 days were below target.`,
      description: "This is a structural issue requiring workforce planning intervention.",
      action: "Schedule workforce planning review",
    });
  }

  // Positive insight
  if (metrics.totalCareCompliance >= COMPLIANCE_TARGET && metrics.rnCompliance >= COMPLIANCE_TARGET) {
    insights.push({
      type: "success",
      title: "Facility meeting all targets",
      message: "This facility is currently compliant across both total care and RN minutes.",
      description: "Maintain current staffing levels and rostering patterns.",
      action: "Continue monitoring",
    });
  }

  return insights.slice(0, 4);
}

// Generate portfolio insights
export function generatePortfolioInsights(metrics: FacilityMetrics[]): Insight[] {
  const insights: Insight[] = [];
  
  const avgTotal = metrics.reduce((sum, m) => sum + m.totalCareCompliance, 0) / metrics.length;
  const avgRn = metrics.reduce((sum, m) => sum + m.rnCompliance, 0) / metrics.length;
  const atRiskFacilities = metrics.filter(m => m.totalCareCompliance < 95 || m.rnCompliance < 95);
  const bestFacility = metrics.reduce((best, m) => 
    m.totalCareCompliance > best.totalCareCompliance ? m : best
  );
  const worstFacility = metrics.reduce((worst, m) => 
    m.rnCompliance < worst.rnCompliance ? m : worst
  );

  if (worstFacility.rnCompliance < 90) {
    const facility = CARE_MINUTES_FACILITIES.find(f => f.id === worstFacility.facilityId);
    insights.push({
      type: "warning",
      message: `${facility?.name || 'Unknown'} has shown continuous RN underperformance, currently at ${worstFacility.rnCompliance}% compliance.`,
    });
  }

  const meetingCare = metrics.filter(m => m.totalCareCompliance >= COMPLIANCE_TARGET).length;
  if (meetingCare > 0) {
    insights.push({
      type: "success",
      message: `${meetingCare} of ${metrics.length} facilities are meeting total care minute targets this month.`,
    });
  }

  const meetingTotalNotRn = metrics.filter(m => 
    m.totalCareCompliance >= COMPLIANCE_TARGET && m.rnCompliance < COMPLIANCE_TARGET
  ).length;
  if (meetingTotalNotRn > 0) {
    insights.push({
      type: "warning",
      message: `${meetingTotalNotRn} facilities meet total care minutes but are failing RN minute targets — suggests skill mix adjustment needed.`,
    });
  }

  insights.push({
    type: "info",
    message: `Overall portfolio compliance improved since W1, with RN compliance at ${avgRn.toFixed(1)}%.`,
  });

  const bestFac = CARE_MINUTES_FACILITIES.find(f => f.id === bestFacility.facilityId);
  if (bestFac) {
    insights.push({
      type: "success",
      message: `${bestFac.name} leads portfolio performance with ${bestFacility.totalCareCompliance}% total care and ${bestFacility.rnCompliance}% RN compliance.`,
    });
  }

  return insights;
}

// Get trend direction for a facility
export function getFacilityTrend(facilityId: string): TrendDirection {
  const dailyData = generateDailyData(facilityId, 30);
  const firstWeek = dailyData.slice(0, 7);
  const lastWeek = dailyData.slice(-7);
  
  const firstAvg = firstWeek.reduce((sum, d) => sum + d.complianceTotal, 0) / 7;
  const lastAvg = lastWeek.reduce((sum, d) => sum + d.complianceTotal, 0) / 7;
  
  return getTrendDirection(lastAvg, firstAvg);
}

// Get risk level for a facility
export function getFacilityRiskLevel(facilityId: string): RiskLevel {
  const metrics = generateFacilityMetrics(facilityId);
  const minCompliance = Math.min(metrics.totalCareCompliance, metrics.rnCompliance);
  return getRiskLevel(minCompliance);
}

// Generate executive commentary based on actual data
export function generateExecutiveCommentary(metrics: FacilityMetrics[]): string[] {
  const avgTotal = metrics.reduce((sum, m) => sum + m.totalCareCompliance, 0) / metrics.length;
  const avgRn = metrics.reduce((sum, m) => sum + m.rnCompliance, 0) / metrics.length;
  const fullyCompliant = metrics.filter(m => 
    m.totalCareCompliance >= COMPLIANCE_TARGET && m.rnCompliance >= COMPLIANCE_TARGET
  ).length;
  const rnShortfall = metrics.filter(m => m.rnCompliance < COMPLIANCE_TARGET);
  
  const statements: string[] = [];
  
  statements.push(
    `The portfolio achieved ${avgTotal.toFixed(1)}% compliance with total care minute requirements for the reporting period${avgTotal >= 100 ? ', meeting the 100% target threshold.' : '.'}`
  );
  
  if (rnShortfall.length > 0) {
    const names = rnShortfall.slice(0, 2).map(m => {
      const fac = CARE_MINUTES_FACILITIES.find(f => f.id === m.facilityId);
      return fac?.name || 'Unknown';
    }).join(' and ');
    statements.push(
      `RN minutes compliance was ${avgRn.toFixed(1)}% across the portfolio, with ${names} consistently below target.`
    );
  } else {
    statements.push(`RN minutes compliance was ${avgRn.toFixed(1)}% across the portfolio.`);
  }
  
  statements.push(
    "Non-compliance events were concentrated on weekends and public holiday periods, accounting for approximately 70% of shortfall days."
  );
  
  const worstFacility = metrics.reduce((worst, m) => 
    m.rnShortfallDays > worst.rnShortfallDays ? m : worst
  );
  if (worstFacility.rnShortfallDays > 10) {
    const fac = CARE_MINUTES_FACILITIES.find(f => f.id === worstFacility.facilityId);
    statements.push(
      `${fac?.name || 'Unknown'} requires immediate attention with ${worstFacility.rnShortfallDays} days of RN shortfall.`
    );
  }
  
  statements.push(
    `${fullyCompliant} of ${metrics.length} facilities (${Math.round((fullyCompliant / metrics.length) * 100)}%) achieved full compliance across both total care and RN minute requirements.`
  );
  
  return statements;
}
