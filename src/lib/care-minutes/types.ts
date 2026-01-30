// Care Minutes shared types

export interface CareMinutesFacility {
  id: string;
  name: string;
  shortName: string;
  targetTotal: number; // AN-ACC total care minutes target
  targetRn: number;    // AN-ACC RN minutes target
}

export interface FacilityMetrics {
  facilityId: string;
  totalCareCompliance: number;
  rnCompliance: number;
  avgDailyMinutes: number;
  avgRnMinutes: number;
  avgNonRnMinutes: number;
  daysBelowTarget: number;
  rnShortfallDays: number;
  totalVariance: number;
  rnVariance: number;
}

export interface DailyMetrics {
  date: string;
  dayOfWeek: string;
  dayOfMonth: number;
  month: string;
  actualTotal: number;
  actualRn: number;
  actualNonRn: number;
  targetTotal: number;
  targetRn: number;
  complianceTotal: number;
  complianceRn: number;
}

export interface WeeklyTrend {
  week: string;
  totalCare: number;
  rn: number;
  target: number;
}

export interface MonthlyTrend {
  month: string;
  totalCompliance: number;
  rnCompliance: number;
}

export type ComplianceStatus = "compliant" | "at-risk" | "non-compliant";

export type RiskLevel = "low" | "medium" | "high";

export type TrendDirection = "up" | "down" | "flat";

export interface StaffingData {
  role: string;
  planned: number;
  required: number;
  gap: number;
  status: "ok" | "shortfall";
}

export interface Insight {
  type: "success" | "warning" | "info" | "critical" | "alert";
  title?: string;
  message: string;
  description?: string;
  action?: string;
}

export interface PortfolioSummary {
  totalCareCompliance: number;
  rnCompliance: number;
  facilitiesMeetingCare: number;
  facilitiesMeetingRN: number;
  facilitiesAtRisk: number;
  totalFacilities: number;
  daysNonCompliance: number;
}
