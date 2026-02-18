
# Home Page Implementation Plan

## What the Screenshot Shows

The Home page from the reference screenshot has three main sections:

**Left/Centre Column:**
1. **Welcome header** — "Welcome, [User Name]!"
2. **Notifications/Alerts banner** — A highlighted card showing system maintenance notices
3. **Action Items** — Two rows: "Care Minutes submission for Q1 is due in 5 days" and "Your PRODA device will expire in 12 days", each with a CTA button
4. **Your Products section** — 2x2 grid of product cards (Care Minutes, NQIP, Annual Leave, RN 24/7), each with:
   - A colourful gradient image/illustration area at the top
   - Product name as a large heading
   - Short description text
   - "Go to [Product] Dashboard" button

**Right Column (sidebar panel):**
1. **Complete your setup** — Progress bar + checklist items (PRODA Setup, B2G Credentials)
2. **Invite team members** — Card with an icon and CTA
3. **Quick links** — Submit a support ticket, View documentation, Share feedback

---

## Implementation Approach

### Product Cards with Gradient Illustrations

Since the cards in the screenshot show blank/placeholder image areas, the user wants actual images or illustrations added. Rather than using uploaded images, I'll create visually distinct gradient + icon compositions using Tailwind CSS and Lucide icons — matching the colourful gradient style visible in the screenshot (purple for Care Minutes, blue-purple for NQIP, green for Annual Leave, teal for RN 24/7).

Each card's "image area" will be a rounded gradient panel with a relevant decorative icon/illustration, consistent with the Loop brand palette (lavender, jordy-blue, mauve, thistle from the CSS variables).

### User Name

Pull the user's name from `useUser()` context (already available via `UserContext`).

### Navigation

Product card buttons will use `useNavigate()` from `react-router-dom` to link to each product's primary page:
- Care Minutes → `/care-minutes/overview`
- NQIP → `/nqip/kpi`
- Annual Leave → `/annual-leave/overview`
- RN 24/7 → `/rn247/overview`

---

## Files to Modify

**`src/pages/Home.tsx`** — Full replacement with the complete Home page layout:

```
src/pages/Home.tsx
├── Welcome header (uses useUser for name)
├── Alerts section
│   ├── System maintenance banner (amber/warning tone)
│   └── Action items (submission due, PRODA expiry)
├── Your Products section
│   └── 2x2 grid of ProductCards
│       ├── Gradient illustration area (CSS gradient + icon)
│       ├── Title + description
│       └── CTA button → navigate to product
└── Right sidebar panel
    ├── Complete your setup (progress bar + checklist)
    ├── Invite team members card
    └── Quick links (support, docs, feedback)
```

---

## Technical Details

- **Layout**: Use a 2-column CSS grid (`grid-cols-1 lg:grid-cols-[1fr_320px]`) — main content left, sidebar right — matching the screenshot layout
- **Brand colours**: Use existing CSS variables (`--lavender`, `--mauve`, `--jordy-blue`, `--thistle`) for the card gradient backgrounds
- **Product card images**: Styled `div` elements with `bg-gradient-to-br` using brand palette colours + a large decorative Lucide icon (Clock for Care Minutes, BarChart3 for NQIP, Calendar for Annual Leave, Heart for RN24/7)
- **Progress bar**: Use shadcn/ui `Progress` component already installed
- **Action badges**: Use `Badge` component for "5 days" and "12 days" urgency indicators
- **No new dependencies needed** — everything is already installed
