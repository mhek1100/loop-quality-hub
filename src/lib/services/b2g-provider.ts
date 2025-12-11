// B2G Provider Management Service - Simulates Provider API endpoints
import { B2GOrganization, B2GHealthcareService } from "../types";

const ORGANIZATION_ENDPOINT = "https://api.health.gov.au/Providers/v2/Organization";
const HEALTHCARE_SERVICES_ENDPOINT = "https://api.health.gov.au/Providers/v2/HealthcareServices";

// Mock data for providers/organizations
const mockOrganizations: B2GOrganization[] = [
  {
    id: "ORG-001",
    name: "Riverbend Healthcare Group",
    identifier: "ARCH-RB-001",
    active: true,
  },
  {
    id: "ORG-002",
    name: "Coastal Care Pty Ltd",
    identifier: "ARCH-CC-002",
    active: true,
  },
  {
    id: "ORG-003",
    name: "Harbour Healthcare Services",
    identifier: "ARCH-HH-003",
    active: true,
  },
];

// Mock data for healthcare services (Program Payment Entities)
const mockHealthcareServices: B2GHealthcareService[] = [
  {
    id: "HS-001",
    organizationId: "ORG-001",
    name: "Riverbend Aged Care",
    identifier: "HS-RIVERBEND-001",
    programPaymentEntityId: "PPE-RB-001",
  },
  {
    id: "HS-002",
    organizationId: "ORG-002",
    name: "Coastal View Lodge",
    identifier: "HS-COASTAL-002",
    programPaymentEntityId: "PPE-CV-002",
  },
  {
    id: "HS-003",
    organizationId: "ORG-003",
    name: "Harbour Heights Home",
    identifier: "HS-HARBOUR-003",
    programPaymentEntityId: "PPE-HH-003",
  },
];

export const providerManagementService = {
  /**
   * Simulates GET https://api.health.gov.au/Providers/v2/Organization
   * Returns list of registered providers
   */
  async getOrganizations(): Promise<{
    success: boolean;
    data?: B2GOrganization[];
    error?: string;
    endpoint: string;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    console.log(`[B2G Provider] GET ${ORGANIZATION_ENDPOINT}`);

    return {
      success: true,
      data: mockOrganizations,
      endpoint: ORGANIZATION_ENDPOINT,
    };
  },

  /**
   * Simulates GET https://api.health.gov.au/Providers/v2/HealthcareServices?organization={providerId}
   * Returns Program Payment Entities for a given provider
   */
  async getHealthcareServices(organizationId: string): Promise<{
    success: boolean;
    data?: B2GHealthcareService[];
    error?: string;
    endpoint: string;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const endpoint = `${HEALTHCARE_SERVICES_ENDPOINT}?organization=${organizationId}`;
    console.log(`[B2G Provider] GET ${endpoint}`);

    const services = mockHealthcareServices.filter(
      (s) => s.organizationId === organizationId
    );

    return {
      success: true,
      data: services,
      endpoint,
    };
  },

  /**
   * Get organization by facility mapping
   */
  getOrganizationForFacility(facilityId: string): B2GOrganization | undefined {
    // Simple mapping based on facility ID
    const orgMap: Record<string, string> = {
      "fac-001": "ORG-001",
      "fac-002": "ORG-002",
      "fac-003": "ORG-003",
    };
    return mockOrganizations.find((o) => o.id === orgMap[facilityId]);
  },

  /**
   * Get healthcare service for a facility
   */
  getHealthcareServiceForFacility(facilityId: string): B2GHealthcareService | undefined {
    const serviceMap: Record<string, string> = {
      "fac-001": "HS-001",
      "fac-002": "HS-002",
      "fac-003": "HS-003",
    };
    return mockHealthcareServices.find((s) => s.id === serviceMap[facilityId]);
  },

  /**
   * Get endpoints for display
   */
  getEndpoints() {
    return {
      organization: ORGANIZATION_ENDPOINT,
      healthcareServices: HEALTHCARE_SERVICES_ENDPOINT,
    };
  },
};
