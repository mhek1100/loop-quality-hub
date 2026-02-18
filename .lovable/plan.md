
# Dynamic Header Breadcrumb Implementation

## Your Suggestion vs. My Recommendation

Your instinct is exactly right. Instead of a plain title like "Loop Quality Hub", the header should reflect the user's current location in the nav hierarchy.

**My recommendation**: replace the title/subtitle pattern in the header with a **breadcrumb trail** — for example:

```
Products  ›  Care Minutes  ›  Default  ›  Overview
```

or for primary nav:

```
Home
Marketplace
Settings  ›  Account
```

This is cleaner than a long concatenated string like "Products > Care Minutes > Overview" in a single heading, and is the standard pattern used in dashboards like Notion, Linear, and Vercel. The last crumb is the page name, rendered in bold/foreground; parent crumbs are muted and separated by chevron separators.

---

## How It Works

The sidebar already has the full nav structure defined in two arrays:
- `primaryNavItems` — Home, Marketplace, Workspace, Settings, Help & Support
- `productGroups` — Care Minutes (with Default/Tableau sub-sections), NQIP, RN24/7, Annual Leave

Rather than duplicating this data, I'll extract the route map into a **shared constant** (`src/lib/nav-config.ts`) that both `AppSidebar` and `AppHeader` import from. This means a single source of truth — if a nav label changes, the header updates automatically.

The `AppHeader` will then use `useLocation()` to match the current path against the nav config and derive an array of breadcrumb segments like:

```ts
[{ label: "Products" }, { label: "Care Minutes" }, { label: "Default" }, { label: "Overview" }]
```

For dynamic routes (like `/nqip/submissions/:id`), a fallback title is shown.

---

## Breadcrumb Rules Per Route Type

| Route | Breadcrumb Output |
|-------|-------------------|
| `/home` | Home |
| `/marketplace` | Marketplace |
| `/workspace` | Workspace |
| `/help` | Help & Support |
| `/settings/account` | Settings › Account |
| `/settings/security` | Settings › Security |
| `/settings/notification` | Settings › Notifications |
| `/care-minutes/overview` | Products › Care Minutes › Default › Overview |
| `/care-minutes/facilities` | Products › Care Minutes › Default › Facilities |
| `/care-minutes/performance-statement` | Products › Care Minutes › Default › Performance Statement |
| `/care-minutes/overview-tableau` | Products › Care Minutes › Tableau › Overview |
| `/care-minutes/facility-view-tableau` | Products › Care Minutes › Tableau › Facility View |
| `/care-minutes/performance-statement-tableau` | Products › Care Minutes › Tableau › Performance Statement |
| `/nqip/kpi` | Products › NQIP › KPI Dashboard |
| `/nqip/submissions` | Products › NQIP › Submissions |
| `/nqip/submissions/:id` | Products › NQIP › [Facility Name] |
| `/nqip/submissions/:id/indicator/:code` | Products › NQIP › [Indicator Name] |
| `/nqip/settings/api-variables` | Products › NQIP › NQIP Settings › API Variables |
| `/nqip/help` | Products › NQIP › NQIP Help |
| `/rn247/overview` | Products › RN24/7 › Overview |
| `/rn247/reports` | Products › RN24/7 › Reports |
| `/annual-leave/overview` | Products › Annual Leave › Overview |
| `/annual-leave/requests` | Products › Annual Leave › Requests |
| `/annual-leave/calendar` | Products › Annual Leave › Calendar |
| `/audit` | Audit Log |

---

## Visual Design

The breadcrumb replaces the current `<h1>` + `<p>` subtitle layout in the header. It will use:

- A `ChevronRight` separator icon between segments (from `lucide-react`, already installed)
- Parent segments: `text-muted-foreground text-sm` — smaller, greyed out, not clickable (purely informational — no need to be links since you already have the sidebar)
- Final segment (current page): `text-foreground font-semibold text-base` — slightly larger and bold

The header height stays the same (`h-16`), fitting comfortably in one line even for 4-level deep breadcrumbs.

---

## Files to Change

### 1. `src/lib/nav-config.ts` — NEW FILE
Single source of truth for the full route-to-breadcrumb map. Extracts the existing `primaryNavItems` and `productGroups` from `AppSidebar` into a shared module. Also exports a `getBreadcrumbs(pathname)` function that returns the breadcrumb array for any given path, with special handling for dynamic segments like submission IDs.

### 2. `src/components/layout/AppHeader.tsx` — MODIFY
- Import `getBreadcrumbs` from `nav-config.ts`
- Replace the `useMemo` title/subtitle logic with a breadcrumb array computation
- Replace the `<h1>` + `<p>` JSX with a breadcrumb row using `ChevronRight` separators
- Keep the `UserSwitcher` on the right as-is

### 3. `src/components/layout/AppSidebar.tsx` — MODIFY
- Import `primaryNavItems` and `productGroups` from `nav-config.ts` instead of defining them locally
- No visual or behavioural changes to the sidebar itself

---

## What Stays Unchanged
- Sidebar structure and behaviour (collapse, expand, active states)
- Header height and `UserSwitcher`
- All routing in `App.tsx`
- Dynamic submission/indicator title resolution (still works via the existing mock data helpers)
