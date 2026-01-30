import type { ComplianceStatus, RiskLevel, TrendDirection, PortfolioSummary, FacilityMetrics } from "./types";
import { STATUS_THRESHOLDS, RISK_THRESHOLDS, COMPLIANCE_TARGET } from "./facilities";

// Determine compliance status based on percentage
export function getComplianceStatus(value: number): ComplianceStatus {
  if (value >= STATUS_THRESHOLDS.compliant) return "compliant";
  if (value >= STATUS_THRESHOLDS.atRisk) return "at-risk";
  return "non-compliant";
}

// Determine risk level based on compliance percentage
export function getRiskLevel(value: number): RiskLevel {
  if (value >= RISK_THRESHOLDS.low) return "low";
  if (value >= RISK_THRESHOLDS.medium) return "medium";
  return "high";
}

// Determine trend direction based on current vs previous
export function getTrendDirection(current: number, previous: number): TrendDirection {
  const diff = current - previous;
  if (diff > 1) return "up";
  if (diff < -1) return "down";
  return "flat";
}

// Calculate compliance percentage
export function calculateCompliance(actual: number, target: number): number {
  return Math.round((actual / target) * 100 * 10) / 10;
}

// Calculate variance in minutes
export function calculateVariance(actual: number, target: number): number {
  return Math.round(actual - target);
}

// Calculate portfolio summary from facility metrics
export function calculatePortfolioSummary(
  facilityMetrics: FacilityMetrics[],
  facilityCount: number
): PortfolioSummary {
  const totalCareSum = facilityMetrics.reduce((sum, f) => sum + f.totalCareCompliance, 0);
  const rnSum = facilityMetrics.reduce((sum, f) => sum + f.rnCompliance, 0);
  const meetingCare = facilityMetrics.filter(f => f.totalCareCompliance >= COMPLIANCE_TARGET).length;
  const meetingRN = facilityMetrics.filter(f => f.rnCompliance >= COMPLIANCE_TARGET).length;
  const atRisk = facilityMetrics.filter(f => 
    f.totalCareCompliance < STATUS_THRESHOLDS.atRisk || 
    f.rnCompliance < STATUS_THRESHOLDS.atRisk
  ).length;
  const daysNonCompliance = facilityMetrics.reduce((sum, f) => sum + f.daysBelowTarget, 0);

  return {
    totalCareCompliance: Math.round((totalCareSum / facilityCount) * 10) / 10,
    rnCompliance: Math.round((rnSum / facilityCount) * 10) / 10,
    facilitiesMeetingCare: meetingCare,
    facilitiesMeetingRN: meetingRN,
    facilitiesAtRisk: atRisk,
    totalFacilities: facilityCount,
    daysNonCompliance,
  };
}

// Status display helpers
export const statusLabels: Record<ComplianceStatus, string> = {
  "compliant": "Compliant",
  "at-risk": "At Risk",
  "non-compliant": "Non-Compliant",
};

export const riskLabels: Record<RiskLevel, string> = {
  "low": "Low Risk",
  "medium": "At Risk",
  "high": "High Risk",
};

// Get color class for compliance value (for use with CSS variables)
export function getComplianceColorClass(value: number): string {
  if (value >= RISK_THRESHOLDS.low) return "text-emerald-600";
  if (value >= RISK_THRESHOLDS.medium) return "text-amber-600";
  return "text-red-600";
}

export function getComplianceBgClass(value: number): string {
  if (value >= RISK_THRESHOLDS.low) return "bg-emerald-500";
  if (value >= RISK_THRESHOLDS.medium) return "bg-amber-500";
  return "bg-red-500";
}
