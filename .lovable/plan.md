

# Care Minutes Default Section Review

## Executive Summary

After reviewing the three pages under **Products > Care Minutes > Default** (Overview, Facilities, and Performance Statement), I've identified several inconsistencies and improvement opportunities to make them more cohesive, dynamic, and analytically effective.

---

## Current State Analysis

### Page 1: Overview (Portfolio Dashboard)
- **Purpose**: Executive portfolio health summary with trends and facility comparisons
- **Facilities**: 4 facilities (Sunrise Gardens, Harbour View, Mountain Lodge, Coastal Haven)
- **Data**: Static mock data, 12 weeks of trend data
- **KPI Targets**: 100% compliance target
- **Color Scheme**: Emerald (good), Amber (warning), Red (danger)

### Page 2: Facilities (Facility Drill-Down)
- **Purpose**: Individual facility diagnostic view with operational detail
- **Facilities**: 4 facilities (North Ryan, Evansville Manor, West Haven Lodge, Sunrise Gardens)
- **Data**: Dynamically generated based on facility selection (seeded random)
- **KPI Targets**: 100% compliance target, 200 total minutes, 44 RN minutes
- **Features**: Calendar heatmap, daily trends, skill mix, staffing signals, insights

### Page 3: Performance Statement (Governance Report)
- **Purpose**: Formal board/regulatory reporting artefact
- **Facilities**: 8 facilities (Sunrise Aged Care, Harbour View Lodge, Mountain Rest Home, etc.)
- **Data**: Static mock data, 6 months of trend data
- **KPI Targets**: 95% compliance target
- **Features**: Report-style layout, executive commentary

---

## Critical Issues Identified

### 1. Inconsistent Facility Data

| Page | Facility Count | Facility Names |
|------|----------------|----------------|
| Overview | 4 | Sunrise Gardens, Harbour View, Mountain Lodge, Coastal Haven |
| Facilities | 4 | North Ryan, Evansville Manor, West Haven Lodge, Sunrise Gardens |
| Performance Statement | 8 | Sunrise Aged Care, Harbour View Lodge, Mountain Rest Home, etc. |

**Problem**: Each page uses different facility names and counts, making it impossible to trace data across views.

### 2. Inconsistent Compliance Targets

| Page | Target Threshold |
|------|------------------|
| Overview | 100% |
| Facilities | 100% |
| Performance Statement | 95% |

**Problem**: The regulatory standard for Australian care minutes is typically 100%, but the Performance Statement uses 95% for status thresholds.

### 3. Inconsistent KPI Calculations

- **Overview**: Portfolio averages 94.2% total care, 87.5% RN compliance
- **Performance Statement**: Portfolio averages 96.9% total care, 93.8% RN compliance

**Problem**: Different underlying data produces conflicting metrics on pages that should share the same source.

### 4. Static vs Dynamic Data Approach

- **Overview**: Hardcoded static arrays
- **Facilities**: Seeded random generation (dynamic)
- **Performance Statement**: Hardcoded static arrays

**Problem**: Mixed approaches make it difficult to maintain consistency and demonstrate realistic data relationships.

### 5. UI Component Inconsistencies

| Element | Overview | Facilities | Performance Statement |
|---------|----------|------------|----------------------|
| KPI Cards | Custom `KPICard` component | Custom `KpiCard` component | Plain `Card` with inline content |
| Status Badges | `RiskBadge` (Low/Medium/High) | Status icons | `StatusBadge` (Met/Partial/Not Met) |
| Chart Library | Recharts (ComposedChart) | Recharts (ComposedChart) | ChartContainer wrapper + Recharts |
| Section Headers | `<h2>` with semibold | Card headers with icons | `<h2>` with medium weight |

### 6. Missing Cross-Page Navigation

- No clickable links from Overview facility table to Facilities drill-down
- No clickable links from Performance Statement facility table to Facilities drill-down
- No way to return to Overview from Facilities with context

---

## Recommended Improvements

### Phase 1: Shared Data Layer (Foundation)

Create a centralized data module to ensure consistency:

```text
src/lib/care-minutes/
  - facilities.ts      (shared facility definitions)
  - metrics.ts         (compliance calculation functions)
  - mock-data.ts       (seeded data generation)
  - types.ts           (TypeScript interfaces)
```

**Key Benefits**:
- Single source of truth for facility names and IDs
- Consistent compliance thresholds (100% target)
- Derived metrics that stay in sync

### Phase 2: Unified Component Library

Standardize reusable components:

| Component | Purpose |
|-----------|---------|
| `ComplianceKpiCard` | Consistent KPI tile with status styling |
| `ComplianceStatusBadge` | Unified status labeling (Compliant/At Risk/Non-Compliant) |
| `FacilityLink` | Clickable facility name that navigates to drill-down |
| `ComplianceTrendChart` | Reusable line chart with target reference line |
| `ComplianceBar` | Horizontal progress bar (already exists in Overview) |

### Phase 3: Page-Specific Enhancements

#### Overview Improvements
1. Add date range selector (Current Month / Current Quarter / Custom)
2. Make facility names clickable to navigate to Facilities page
3. Use shared data module instead of static arrays
4. Add period comparison (vs previous period)

#### Facilities Improvements
1. Pre-select facility based on URL parameter (e.g., `/care-minutes/facilities?id=sunrise-gardens`)
2. Add "Back to Portfolio" breadcrumb
3. Ensure generated data aligns with Overview metrics
4. Add export capability for diagnostic data

#### Performance Statement Improvements
1. Align facility list with Overview (use shared data)
2. Change target threshold to 100% (or make configurable)
3. Add print/export button for PDF generation
4. Make facility names clickable to Facilities page
5. Add reporting period selector (Q1, Q2, Q3, Q4, Full Year)

### Phase 4: Analytics Goal Alignment

Ensure each page serves its distinct analytical purpose:

| Page | Primary Audience | Key Question Answered |
|------|------------------|----------------------|
| Overview | Operations Manager | "How is my portfolio performing right now?" |
| Facilities | Facility Manager | "Why is this facility underperforming?" |
| Performance Statement | Board/Regulator | "Are we compliant for the reporting period?" |

**Specific Enhancements**:

1. **Overview**: Add a "Facilities Requiring Attention" quick-action section at the top
2. **Facilities**: Surface the top 3 actionable insights more prominently
3. **Performance Statement**: Auto-calculate executive commentary based on data rather than hardcoding

---

## Technical Implementation Summary

### Files to Create
- `src/lib/care-minutes/facilities.ts` - Shared facility definitions
- `src/lib/care-minutes/types.ts` - TypeScript interfaces
- `src/lib/care-minutes/metrics.ts` - Compliance calculations
- `src/lib/care-minutes/mock-data.ts` - Seeded data generation
- `src/components/care-minutes/ComplianceKpiCard.tsx` - Unified KPI card
- `src/components/care-minutes/ComplianceStatusBadge.tsx` - Status badge
- `src/components/care-minutes/FacilityLink.tsx` - Clickable facility

### Files to Modify
- `src/pages/care-minutes/Overview.tsx` - Use shared data, add navigation
- `src/pages/care-minutes/Facilities.tsx` - Use shared data, handle URL params
- `src/pages/care-minutes/PerformanceStatement.tsx` - Use shared data, align targets

### Estimated Changes
- ~8 new files
- ~3 major file updates
- Shared data layer: ~200 lines
- Component updates: ~150 lines per page

---

## Priority Order

1. **High Priority**: Create shared facility data to fix naming inconsistencies
2. **High Priority**: Align compliance targets to 100% across all pages
3. **Medium Priority**: Unify KPI card and status badge components
4. **Medium Priority**: Add cross-page navigation (facility links)
5. **Lower Priority**: Add date/period selectors
6. **Lower Priority**: Generate executive commentary dynamically

