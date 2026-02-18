import { Home, ShoppingBag, Compass, Settings, HelpCircle, Clock, BarChart3, Heart, Calendar } from "lucide-react";
import { getFacilityById, getSubmission } from "@/lib/mock/data";
import { getIndicatorByCode } from "@/lib/mock/indicators";

// Primary navigation items — shared between AppSidebar and AppHeader
export const primaryNavItems = [
  { title: "Home", url: "/home", icon: Home },
  { title: "Marketplace", url: "/marketplace", icon: ShoppingBag },
  { title: "Workspace", url: "/workspace", icon: Compass },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Help & Support", url: "/help", icon: HelpCircle },
];

// Settings sub-pages
export const settingsChildren = [
  { title: "Account", url: "/settings/account" },
  { title: "Security", url: "/settings/security" },
  { title: "Notifications", url: "/settings/notification" },
  { title: "API Variables", url: "/settings/api-variables" },
  { title: "CIS Data Pipeline", url: "/settings/pipeline" },
  { title: "Users & Roles", url: "/settings/users" },
  { title: "Conformance", url: "/settings/conformance" },
];

// Product groups — shared between AppSidebar and AppHeader
export const productGroups = [
  {
    title: "Care minutes",
    icon: Clock,
    sections: [
      {
        title: "Default",
        children: [
          { title: "Overview", url: "/care-minutes/overview" },
          { title: "Facilities", url: "/care-minutes/facilities" },
          { title: "Performance Statement", url: "/care-minutes/performance-statement" },
          { title: "Submission", url: "/care-minutes/submission" },
          { title: "Past Reports", url: "/care-minutes/past-reports" },
        ],
      },
      {
        title: "Tableau",
        children: [
          { title: "Overview", url: "/care-minutes/overview-tableau" },
          { title: "Facility View", url: "/care-minutes/facility-view-tableau" },
          { title: "Performance Statement", url: "/care-minutes/performance-statement-tableau" },
        ],
      },
    ],
  },
  {
    title: "NQIP",
    icon: BarChart3,
    children: [
      { title: "KPI Dashboard", url: "/nqip/kpi" },
      { title: "Submissions", url: "/nqip/submissions" },
      { title: "NQIP Settings", url: "/nqip/settings" },
      { title: "NQIP Help", url: "/nqip/help" },
    ],
  },
  {
    title: "RN24/7",
    icon: Heart,
    children: [
      { title: "Overview", url: "/rn247/overview" },
      { title: "Reports", url: "/rn247/reports" },
    ],
  },
  {
    title: "Annual leave",
    icon: Calendar,
    children: [
      { title: "Overview", url: "/annual-leave/overview" },
      { title: "Requests", url: "/annual-leave/requests" },
      { title: "Calendar", url: "/annual-leave/calendar" },
    ],
  },
];

export type BreadcrumbSegment = { label: string };

/**
 * Given the current pathname, returns an ordered array of breadcrumb segments.
 * The last segment is the current page; preceding segments are its ancestors.
 * Pass optional context (submissionId, indicatorCode) for dynamic routes.
 */
export function getBreadcrumbs(
  pathname: string,
  context?: {
    getCreatedById?: (id: string) => { facilityId: string } | undefined;
  }
): BreadcrumbSegment[] {
  // Primary nav exact/prefix matches
  for (const item of primaryNavItems) {
    if (item.url === "/settings") continue; // handled separately below
    if (pathname === item.url || pathname.startsWith(item.url + "/")) {
      return [{ label: item.title }];
    }
  }

  // Settings sub-pages
  if (pathname.startsWith("/settings")) {
    const child = settingsChildren.find((c) => pathname === c.url || pathname.startsWith(c.url + "/"));
    if (child) {
      return [{ label: "Settings" }, { label: child.title }];
    }
    return [{ label: "Settings" }];
  }

  // NQIP dynamic routes — submissions/:id/indicator/:code
  const indicatorMatch = pathname.match(/^\/nqip\/submissions\/([^/]+)\/indicator\/([^/]+)$/);
  if (indicatorMatch) {
    const [, submissionId, indicatorCode] = indicatorMatch;
    const submission =
      (context?.getCreatedById?.(submissionId)) ?? getSubmission(submissionId);
    const facility = submission ? getFacilityById(submission.facilityId) : undefined;
    const indicator = getIndicatorByCode(indicatorCode as any);
    return [
      { label: "Products" },
      { label: "NQIP" },
      ...(facility ? [{ label: facility.name }] : [{ label: "Submission" }]),
      { label: indicator?.name || `Indicator ${indicatorCode}` },
    ];
  }

  // NQIP dynamic routes — submissions/:id
  const submissionMatch = pathname.match(/^\/nqip\/submissions\/([^/]+)$/);
  if (submissionMatch) {
    const [, submissionId] = submissionMatch;
    const submission =
      (context?.getCreatedById?.(submissionId)) ?? getSubmission(submissionId);
    const facility = submission ? getFacilityById(submission.facilityId) : undefined;
    return [
      { label: "Products" },
      { label: "NQIP" },
      { label: facility?.name || "Submission" },
    ];
  }

  // NQIP settings sub-pages
  const nqipSettingsChildren: { title: string; url: string }[] = [
    { title: "API Variables", url: "/nqip/settings/api-variables" },
    { title: "Pipeline", url: "/nqip/settings/pipeline" },
    { title: "Users", url: "/nqip/settings/users" },
    { title: "Conformance", url: "/nqip/settings/conformance" },
  ];
  for (const child of nqipSettingsChildren) {
    if (pathname === child.url || pathname.startsWith(child.url + "/")) {
      return [{ label: "Products" }, { label: "NQIP" }, { label: "NQIP Settings" }, { label: child.title }];
    }
  }

  // Product groups
  for (const group of productGroups) {
    if ("sections" in group && group.sections) {
      for (const section of group.sections) {
        for (const child of section.children) {
          if (pathname === child.url || pathname.startsWith(child.url + "/")) {
            return [
              { label: "Products" },
              { label: group.title },
              { label: section.title },
              { label: child.title },
            ];
          }
        }
      }
    } else if ("children" in group && group.children) {
      for (const child of group.children) {
        if (pathname === child.url || pathname.startsWith(child.url + "/")) {
          return [{ label: "Products" }, { label: group.title }, { label: child.title }];
        }
      }
    }
  }

  // Standalone pages
  const standalone: Record<string, BreadcrumbSegment[]> = {
    "/audit": [{ label: "Audit Log" }],
    "/dev/validation": [{ label: "Questionnaire Validation" }],
    "/": [{ label: "Submissions" }],
  };
  if (standalone[pathname]) return standalone[pathname];

  return [{ label: "Loop Quality Hub" }];
}
