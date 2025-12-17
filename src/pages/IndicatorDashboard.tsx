import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { facilities, getAllKpiData, reportingPeriods } from "@/lib/mock/data";
import { getIndicatorByCode, isHigherBetter } from "@/lib/mock/indicators";
import { IndicatorCode, KpiData } from "@/lib/types";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowLeft, AlertCircle, TrendingDown, TrendingUp } from "lucide-react";

type MixSegment = { label: string; value: number; color: string };

interface MixConfig {
  title: string;
  subtitle: string;
  segments: MixSegment[];
}

const mixConfigs: Record<IndicatorCode, MixConfig> = {
  PI: {
    title: "Pressure injury profile",
    subtitle: "Share of reported stages this quarter",
    segments: [
      { label: "Stage 1-2", value: 58, color: "#fb923c" },
      { label: "Stage 3-4", value: 24, color: "#f97316" },
      { label: "Unstageable", value: 18, color: "#ea580c" },
    ],
  },
  RP: {
    title: "Type of intervention",
    subtitle: "Residents experiencing restrictive practices",
    segments: [
      { label: "Physical", value: 52, color: "#facc15" },
      { label: "Chemical", value: 37, color: "#f59e0b" },
      { label: "Seclusion", value: 11, color: "#d97706" },
    ],
  },
  UPWL: {
    title: "Weight loss cohorts",
    subtitle: "Relative contribution to total weight loss cases",
    segments: [
      { label: "Significant (>=5%)", value: 62, color: "#c084fc" },
      { label: "Consecutive (<5%)", value: 38, color: "#a855f7" },
    ],
  },
  FALL: {
    title: "Fall severity mix",
    subtitle: "Outcomes recorded for the quarter",
    segments: [
      { label: "No injury", value: 71, color: "#4f46e5" },
      { label: "Minor injury", value: 21, color: "#6366f1" },
      { label: "Major injury", value: 8, color: "#a5b4fc" },
    ],
  },
  MM: {
    title: "Medication focus areas",
    subtitle: "Residents captured in safety reviews",
    segments: [
      { label: "Polypharmacy (9+ meds)", value: 42, color: "#8b5cf6" },
      { label: "Antipsychotics", value: 18, color: "#a855f7" },
      { label: "High-risk combos", value: 40, color: "#c4b5fd" },
    ],
  },
  ADL: {
    title: "Domain of decline",
    subtitle: "Where Barthel Index movements occurred",
    segments: [
      { label: "Mobility", value: 45, color: "#059669" },
      { label: "Self-care", value: 28, color: "#10b981" },
      { label: "Cognition", value: 27, color: "#34d399" },
    ],
  },
  IC: {
    title: "IAD severity",
    subtitle: "Residents requiring continence support",
    segments: [
      { label: "Mild", value: 54, color: "#38bdf8" },
      { label: "Moderate", value: 30, color: "#0ea5e9" },
      { label: "Severe", value: 16, color: "#0369a1" },
    ],
  },
  HP: {
    title: "Hospitalisation triggers",
    subtitle: "Drivers of acute transfers",
    segments: [
      { label: "ED presentations", value: 52, color: "#fb7185" },
      { label: "Acute admissions", value: 31, color: "#f43f5e" },
      { label: "Palliative needs", value: 17, color: "#be123c" },
    ],
  },
  WF: {
    title: "Turnover profile",
    subtitle: "Share of total leavers",
    segments: [
      { label: "Registered Nurses", value: 28, color: "#a855f7" },
      { label: "Enrolled Nurses", value: 22, color: "#c084fc" },
      { label: "Personal care", value: 50, color: "#d8b4fe" },
    ],
  },
  CE: {
    title: "Resident sentiment",
    subtitle: "Latest experience survey responses",
    segments: [
      { label: "Excellent", value: 42, color: "#22c55e" },
      { label: "Good", value: 37, color: "#4ade80" },
      { label: "Neutral", value: 21, color: "#86efac" },
    ],
  },
  QOL: {
    title: "Life quality anchors",
    subtitle: "Top themes cited by residents",
    segments: [
      { label: "Connected", value: 33, color: "#f9a8d4" },
      { label: "Engaged", value: 41, color: "#f472b6" },
      { label: "Supported", value: 26, color: "#ec4899" },
    ],
  },
  AH: {
    title: "Allied health coverage",
    subtitle: "Mix of services delivered",
    segments: [
      { label: "Physiotherapy", value: 38, color: "#3b82f6" },
      { label: "Occupational therapy", value: 34, color: "#60a5fa" },
      { label: "Speech & other", value: 28, color: "#93c5fd" },
    ],
  },
  EN: {
    title: "Roster coverage",
    subtitle: "Enrolled nursing hours filled",
    segments: [
      { label: "Day shifts", value: 44, color: "#06b6d4" },
      { label: "Evenings", value: 33, color: "#0ea5e9" },
      { label: "Nights", value: 23, color: "#0891b2" },
    ],
  },
  LO: {
    title: "Lifestyle sessions",
    subtitle: "Time allocated by activity stream",
    segments: [
      { label: "Social & community", value: 35, color: "#f472b6" },
      { label: "Creative & sensory", value: 27, color: "#fb7185" },
      { label: "Wellness", value: 22, color: "#f87171" },
      { label: "One-on-one", value: 16, color: "#fbbf24" },
    ],
  },
};

const rangeOptions = [
  { value: "4", label: "Last 4 quarters" },
  { value: "8", label: "Last 8 quarters" },
];

interface AggregatedMetrics {
  value: number;
  previous: number;
  delta: number;
  deltaPercent: number;
  completionRate: number;
  count: number;
}

const aggregateRecords = (records: KpiData[]): AggregatedMetrics | null => {
  if (!records.length) return null;
  const count = records.length;
  const sum = records.reduce((acc, record) => acc + record.value, 0);
  const sumPrev = records.reduce((acc, record) => acc + record.previousValue, 0);
  const completionRate = records.filter(record => record.isComplete).length / count * 100;
  const value = sum / count;
  const previous = sumPrev / count;
  const delta = value - previous;
  const deltaPercent = previous !== 0 ? (delta / previous) * 100 : 0;
  return {
    value: Number(value.toFixed(1)),
    previous: Number(previous.toFixed(1)),
    delta: Number(delta.toFixed(1)),
    deltaPercent: Number(deltaPercent.toFixed(1)),
    completionRate: Number(completionRate.toFixed(1)),
    count,
  };
};

const getPeriodLabel = (periodId: string) => {
  return reportingPeriods.find(period => period.id === periodId)?.quarter ?? "Latest quarter";
};

const getPreviousPeriodLabel = (periodId: string) => {
  const idx = reportingPeriods.findIndex(period => period.id === periodId);
  return reportingPeriods[idx + 1]?.quarter;
};

const IndicatorDashboard = () => {
  const { indicatorCode = "" } = useParams<{ indicatorCode: string }>();
  const navigate = useNavigate();
  const normalizedCode = indicatorCode.toUpperCase() as IndicatorCode;
  const indicator = getIndicatorByCode(normalizedCode);
  const [selectedFacility, setSelectedFacility] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>(reportingPeriods[0]?.id ?? "");
  const [trendWindow, setTrendWindow] = useState<string>("8");

  const allKpiData = useMemo(() => getAllKpiData(), []);
  const indicatorRecords = useMemo(
    () => allKpiData.filter(record => record.indicatorCode === normalizedCode),
    [allKpiData, normalizedCode]
  );

  const facilityFilteredRecords = useMemo(
    () => indicatorRecords.filter(record => selectedFacility === "all" || record.facilityId === selectedFacility),
    [indicatorRecords, selectedFacility]
  );

  const periodRecords = useMemo(
    () => facilityFilteredRecords.filter(record => record.periodId === selectedPeriod),
    [facilityFilteredRecords, selectedPeriod]
  );

  const summary = aggregateRecords(periodRecords);
  const sortedPeriodsAsc = useMemo(
    () =>
      [...reportingPeriods].sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      ),
    []
  );

  const windowSize = Number(trendWindow);
  const trendPeriods = sortedPeriodsAsc.slice(-windowSize);

  const trendData = trendPeriods.map(period => {
    const records = facilityFilteredRecords.filter(record => record.periodId === period.id);
    const aggregate = aggregateRecords(records);
    return {
      period: period.quarter,
      value: aggregate?.value ?? 0,
    };
  }).map((point, index, arr) => {
    const slice = arr.slice(Math.max(0, index - 2), index + 1);
    const rolling = slice.reduce((acc, curr) => acc + curr.value, 0) / slice.length;
    return {
      ...point,
      rolling: Number(rolling.toFixed(1)),
    };
  });

  const facilityBarData = facilities
    .map(facility => {
      const match = indicatorRecords.find(
        record => record.facilityId === facility.id && record.periodId === selectedPeriod
      );
      if (!match) return null;
      return {
        facility: facility.name.split(" ")[0],
        fullName: facility.name,
        current: Number(match.value.toFixed(1)),
        previous: Number(match.previousValue.toFixed(1)),
        facilityId: facility.id,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  const higherIsBetter = indicator ? isHigherBetter(indicator.code) : true;
  const ranking = [...facilityBarData].sort((a, b) =>
    higherIsBetter ? b.current - a.current : a.current - b.current
  );
  const bestFacility = ranking[0];
  const worstFacility = ranking[ranking.length - 1];

  const insights: string[] = [];
  if (summary) {
    const direction = summary.delta >= 0 ? "increased" : "decreased";
    insights.push(
      `${getPeriodLabel(selectedPeriod)} average ${direction} to ${summary.value}% (${Math.abs(summary.delta).toFixed(1)} pts vs prior).`
    );
    insights.push(
      `${summary.completionRate}% of submissions were complete (${summary.count} facility records).`
    );
  }
  if (bestFacility && worstFacility && bestFacility !== worstFacility) {
    insights.push(
      `${bestFacility.fullName} ${higherIsBetter ? "leads" : "shows the lowest rate"} at ${bestFacility.current}% while ${worstFacility.fullName} is at ${worstFacility.current}%.`
    );
  }

  const mixConfig: MixConfig | undefined = indicator ? mixConfigs[indicator.code] : undefined;
  const mixSegments = useMemo(() => {
    if (!mixConfig) return [];
    const total = mixConfig.segments.reduce((acc, seg) => acc + seg.value, 0) || 1;
    return mixConfig.segments.map(segment => ({
      ...segment,
      percent: Number(((segment.value / total) * 100).toFixed(1)),
    }));
  }, [mixConfig]);

  if (!indicator) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Indicator not found</CardTitle>
            <CardDescription>
              The selected KPI does not match a known indicator. Return to the KPI Dashboard to pick another indicator.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/kpi")} variant="outline">
              Back to KPI Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const summaryCards = [
    {
      id: "current",
      label: "Current value",
      value: summary ? `${summary.value}%` : "-",
      helper: getPeriodLabel(selectedPeriod),
    },
    {
      id: "delta",
      label: summary && summary.delta >= 0 ? "Quarterly lift" : "Quarterly reduction",
      value: summary ? `${summary.delta >= 0 ? "+" : ""}${summary.delta.toFixed(1)} pts` : "-",
      helper: `vs ${getPreviousPeriodLabel(selectedPeriod) ?? "prior quarter"}`,
      isPositive: summary ? (higherIsBetter ? summary.delta >= 0 : summary.delta < 0) : undefined,
    },
    {
      id: "completion",
      label: "Completion rate",
      value: summary ? `${summary.completionRate}%` : "-",
      helper: `${summary?.count ?? 0} contributing facilities`,
    },
    {
      id: "leader",
      label: higherIsBetter ? "Leading facility" : "Lowest rate facility",
      value: bestFacility ? bestFacility.current.toFixed(1) + "%" : "-",
      helper: bestFacility?.fullName ?? "Not enough data",
    },
  ];

  const mixTitle = mixConfig?.title ?? "Breakdown";
  const mixSubtitle = mixConfig?.subtitle ?? "Distribution of related activity";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/kpi">KPI Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{indicator.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button variant="ghost" className="gap-2" onClick={() => navigate("/kpi")}>
            <ArrowLeft className="h-4 w-4" />
            Back to KPI Dashboard
          </Button>
        </div>
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">{indicator.name}</h1>
              <p className="text-muted-foreground text-sm max-w-3xl">{indicator.description}</p>
            </div>
            <Badge variant="outline" className="text-sm">
              {indicator.category}
            </Badge>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <Select value={selectedFacility} onValueChange={setSelectedFacility}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Facility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All facilities</SelectItem>
                {facilities.map(facility => (
                  <SelectItem key={facility.id} value={facility.id}>
                    {facility.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Quarter" />
              </SelectTrigger>
              <SelectContent>
                {reportingPeriods.map(period => (
                  <SelectItem key={period.id} value={period.id}>
                    {period.quarter}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={trendWindow} onValueChange={setTrendWindow}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trend range" />
              </SelectTrigger>
              <SelectContent>
                {rangeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map(card => (
          <Card key={card.id}>
            <CardHeader className="pb-2">
              <CardDescription>{card.label}</CardDescription>
              <CardTitle className="text-3xl font-semibold">
                {card.value}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground flex items-center gap-2">
              {card.id === "delta" && summary && (
                card.isPositive ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )
              )}
              <span>{card.helper}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Trend over time</CardTitle>
            <CardDescription>
              Performance across the selected timeframe with a 3-period moving average.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="period" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{ borderRadius: 12 }}
                  formatter={(value: number) => [`${value}%`, "Value"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#trendFill)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="rolling"
                  stroke="hsl(var(--success))"
                  fill="transparent"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Facility comparison</CardTitle>
            <CardDescription>Quarterly snapshot for each location.</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={facilityBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="facility" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip formatter={(value: number) => [`${value}%`, "Value"]} />
                <Legend />
                <Bar dataKey="current" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="previous" fill="#c4b5fd" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{mixTitle}</CardTitle>
            <CardDescription>{mixSubtitle}</CardDescription>
          </CardHeader>
          {mixSegments.length > 0 ? (
            <CardContent>
              <div className="flex flex-col xl:flex-row gap-6">
                <div className="h-[220px] xl:w-1/2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={mixSegments} dataKey="percent" nameKey="label" innerRadius={60} outerRadius={90}>
                        {mixSegments.map(segment => (
                          <Cell key={segment.label} fill={segment.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${value}%`, "Share"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-3">
                  {mixSegments.map(segment => (
                    <div
                      key={segment.label}
                      className="flex items-center justify-between rounded-md border px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium">{segment.label}</p>
                        <p className="text-xs text-muted-foreground">Synthetic distribution</p>
                      </div>
                      <span className="text-lg font-semibold">{segment.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          ) : (
            <CardContent className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>No mix data defined for this indicator.</span>
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Insights</CardTitle>
            <CardDescription>Key takeaways generated from the mock data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="flex gap-3">
                <div className="mt-1">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <p className="text-sm text-foreground">{insight}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IndicatorDashboard;
