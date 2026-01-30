import type { CareMinutesFacility } from "./types";

// Single source of truth for all Care Minutes facilities
// AN-ACC targets: 200 total minutes, 44 RN minutes (40+10% buffer typically)
export const CARE_MINUTES_FACILITIES: CareMinutesFacility[] = [
  { id: "sunrise-gardens", name: "Sunrise Gardens", shortName: "Sunrise", targetTotal: 200, targetRn: 44 },
  { id: "harbour-view", name: "Harbour View Lodge", shortName: "Harbour", targetTotal: 200, targetRn: 44 },
  { id: "mountain-lodge", name: "Mountain Lodge", shortName: "Mountain", targetTotal: 200, targetRn: 44 },
  { id: "coastal-haven", name: "Coastal Haven", shortName: "Coastal", targetTotal: 200, targetRn: 44 },
  { id: "valley-gardens", name: "Valley Gardens", shortName: "Valley", targetTotal: 200, targetRn: 44 },
  { id: "riverside-manor", name: "Riverside Manor", shortName: "Riverside", targetTotal: 200, targetRn: 44 },
  { id: "parkview-residence", name: "Parkview Residence", shortName: "Parkview", targetTotal: 200, targetRn: 44 },
  { id: "greenfield-house", name: "Greenfield House", shortName: "Greenfield", targetTotal: 200, targetRn: 44 },
];

// Compliance target threshold (100% is the regulatory standard)
export const COMPLIANCE_TARGET = 100;

// Thresholds for status determination
export const STATUS_THRESHOLDS = {
  compliant: 100,      // >= 100% = Compliant
  atRisk: 95,          // >= 95% = At Risk
  // < 95% = Non-Compliant
};

// Risk level thresholds
export const RISK_THRESHOLDS = {
  low: 98,             // >= 98% = Low Risk
  medium: 95,          // >= 95% = Medium Risk
  // < 95% = High Risk
};

export function getFacilityById(id: string): CareMinutesFacility | undefined {
  return CARE_MINUTES_FACILITIES.find(f => f.id === id);
}

export function getFacilityByName(name: string): CareMinutesFacility | undefined {
  return CARE_MINUTES_FACILITIES.find(f => 
    f.name.toLowerCase() === name.toLowerCase() || 
    f.shortName.toLowerCase() === name.toLowerCase()
  );
}

// Get a subset of facilities (first N)
export function getPortfolioFacilities(count: number = 4): CareMinutesFacility[] {
  return CARE_MINUTES_FACILITIES.slice(0, count);
}

// Get all facilities
export function getAllFacilities(): CareMinutesFacility[] {
  return CARE_MINUTES_FACILITIES;
}
