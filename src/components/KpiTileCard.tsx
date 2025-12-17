import { cn } from "@/lib/utils";
import { KpiData, IndicatorCode, IndicatorDefinition, IndicatorComparison } from "@/lib/types";
import { 
  Heart, 
  Lock, 
  Scale, 
  Activity, 
  Pill, 
  ClipboardList, 
  Droplets,
  Building2,
  Users,
  Smile,
  Star,
  Stethoscope,
  UserCheck,
  PartyPopper,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { QuintileStars } from "@/components/QuintileStars";

interface KpiTileCardProps {
  indicator: IndicatorDefinition;
  kpi?: KpiData;
  isSelected: boolean;
  onSelect: () => void;
  onNavigate: () => void;
  comparison?: IndicatorComparison;
}

// Map indicator codes to icons
const indicatorIcons: Record<IndicatorCode, React.ReactNode> = {
  PI: <Heart className="h-4 w-4 text-rose-400" />,
  RP: <Lock className="h-4 w-4 text-amber-400" />,
  UPWL: <Scale className="h-4 w-4 text-violet-400" />,
  FALL: <Activity className="h-4 w-4 text-slate-600" />,
  MM: <Pill className="h-4 w-4 text-violet-400" />,
  ADL: <ClipboardList className="h-4 w-4 text-emerald-400" />,
  IC: <Droplets className="h-4 w-4 text-sky-400" />,
  HP: <Building2 className="h-4 w-4 text-slate-400" />,
  WF: <Users className="h-4 w-4 text-violet-400" />,
  CE: <Smile className="h-4 w-4 text-emerald-400" />,
  QOL: <Star className="h-4 w-4 text-amber-400" />,
  AH: <Stethoscope className="h-4 w-4 text-violet-400" />,
  EN: <UserCheck className="h-4 w-4 text-blue-400" />,
  LO: <PartyPopper className="h-4 w-4 text-pink-400" />,
};

// Define which indicators are "lower is better" (clinical/negative outcomes)
// For these, a decrease is positive (green) and an increase is negative (red)
const lowerIsBetterIndicators: IndicatorCode[] = [
  "PI",   // Pressure Injuries - fewer is better
  "RP",   // Restrictive Practices - fewer is better
  "UPWL", // Unplanned Weight Loss - fewer is better
  "FALL", // Falls - fewer is better
  "MM",   // Medication Management (polypharmacy) - fewer is better
  "ADL",  // ADL Decline - fewer is better
  "IC",   // Incontinence Care issues - fewer is better
  "HP",   // Hospitalisation - fewer is better
  "WF",   // Workforce turnover - lower is better
];

// These indicators are "higher is better" (positive outcomes)
// For these, an increase is positive (green) and a decrease is negative (red)
// CE, QOL, AH, EN, LO - all experience/quality metrics where higher is better

// Map indicator codes to descriptive text
const indicatorDescriptions: Record<IndicatorCode, string> = {
  PI: "of residents with ≥1 pressure injury",
  RP: "subject to restrictive practices",
  UPWL: "Significant / Consecutive loss",
  FALL: "Falls / Major injury from falls",
  MM: "Polypharmacy / Antipsychotics",
  ADL: "with decline in ADL score",
  IC: "with IAD by severity",
  HP: "ED or hospital admissions",
  WF: "staff turnover rate",
  CE: "reporting Excellent/Good",
  QOL: "reporting Excellent/Good",
  AH: "of recommended services received",
  EN: "enrolled nursing hours met",
  LO: "lifestyle activities delivered",
};

// Chart types for each indicator
type ChartType = "gauge" | "bars" | "gradient-bar" | "donut" | "area" | "multi-bar" | "pills" | "dual-gauge";

const indicatorChartTypes: Record<IndicatorCode, ChartType> = {
  PI: "gauge",
  RP: "gauge",
  UPWL: "bars",
  FALL: "pills",
  MM: "dual-gauge",
  ADL: "area",
  IC: "gauge",
  HP: "multi-bar",
  WF: "donut",
  CE: "gradient-bar",
  QOL: "gradient-bar",
  AH: "gradient-bar",
  EN: "area",
  LO: "gradient-bar",
};

// Mini gauge chart
const GaugeChart = ({ value, color = "hsl(var(--primary))", size = "normal" }: { value: number; color?: string; size?: "small" | "normal" }) => {
  const percentage = Math.min(value, 100);
  const dims = size === "small" ? { width: 40, height: 28, viewBox: "0 0 50 35" } : { width: 70, height: 50, viewBox: "0 0 50 35" };
  
  return (
    <svg width={dims.width} height={dims.height} viewBox={dims.viewBox}>
      <path
        d="M 5 30 A 20 20 0 0 1 45 30"
        fill="none"
        stroke="hsl(var(--muted))"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M 5 30 A 20 20 0 0 1 45 30"
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${(percentage / 100) * 63} 63`}
      />
    </svg>
  );
};

// Dual gauge for Medication Management
const DualGaugeChart = ({ value1, value2, label1, label2 }: { value1: number; value2: number; label1: string; label2: string }) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <div className="flex flex-col items-center">
        <GaugeChart value={value1} color="#a78bfa" size="small" />
        <span className="text-[10px] text-muted-foreground mt-1">{value1}%</span>
        <span className="text-[9px] text-muted-foreground">{label1}</span>
      </div>
      <div className="flex flex-col items-center">
        <GaugeChart value={value2} color="#c4b5fd" size="small" />
        <span className="text-[10px] text-muted-foreground mt-1">{value2}%</span>
        <span className="text-[9px] text-muted-foreground">{label2}</span>
      </div>
    </div>
  );
};

// Mini donut chart
const DonutChart = ({ value, color = "hsl(var(--primary))" }: { value: number; color?: string }) => {
  const data = [
    { value: value },
    { value: 100 - value }
  ];
  
  return (
    <div className="w-[70px] h-[70px] mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={15}
            outerRadius={22}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
          >
            <Cell fill={color} />
            <Cell fill="hsl(var(--muted))" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Mini bar comparison chart
const BarsChart = ({ values, colors, labels }: { values: number[]; colors: string[]; labels?: string[] }) => {
  return (
    <div className="w-full">
      <div className="flex gap-2 items-end justify-center h-[50px]">
        {values.map((v, i) => (
          <div 
            key={i}
            className="flex-1 max-w-[60px] rounded-t-sm" 
            style={{ 
              height: `${Math.max(v * 1.2, 25)}px`,
              backgroundColor: colors[i] || "hsl(var(--primary))"
            }} 
          />
        ))}
      </div>
      {labels && (
        <div className="flex justify-center gap-2 mt-1">
          {labels.map((label, i) => (
            <span key={i} className="text-[10px]" style={{ color: colors[i] }}>{label}</span>
          ))}
        </div>
      )}
    </div>
  );
};

// Pills/badges for split values
const PillsChart = ({ items }: { items: { value: number; label: string; color: string }[] }) => {
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {items.map((item, i) => (
        <span 
          key={i}
          className="text-xs px-3 py-1 rounded-full text-white font-medium"
          style={{ backgroundColor: item.color }}
        >
          {item.value}% {item.label}
        </span>
      ))}
    </div>
  );
};

// Gradient progress bar
const GradientBar = ({ value, variant = "green", showPercentage = false }: { value: number; variant?: "green" | "rainbow"; showPercentage?: boolean }) => {
  const gradients = {
    green: "linear-gradient(to right, hsl(var(--success)), hsl(142, 76%, 36%))",
    rainbow: "linear-gradient(to right, #ef4444, #f97316, #eab308, #22c55e)"
  };
  
  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center gap-2">
        <div className="h-3 bg-muted rounded-full overflow-hidden flex-1">
          <div 
            className="h-full rounded-full transition-all"
            style={{ 
              width: `${value}%`,
              background: gradients[variant]
            }} 
          />
        </div>
        {showPercentage && <span className="text-xs text-muted-foreground">{value}%</span>}
      </div>
      {variant === "rainbow" && (
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Poor</span>
          <span>Excellent</span>
        </div>
      )}
    </div>
  );
};

// Mini area chart
const MiniAreaChart = ({ trend }: { trend: number[] }) => {
  const data = trend.map((v, i) => ({ value: v, index: i }));
  
  return (
    <div className="w-full h-[45px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="hsl(var(--success))"
            fill="hsl(var(--success)/0.2)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Multi bar chart (side by side comparison)
const MultiBarChart = ({ values, colors, labels }: { values: number[]; colors: string[]; labels?: string[] }) => {
  return (
    <div className="w-full">
      <div className="flex gap-2 items-end justify-center h-[50px]">
        {values.map((v, i) => (
          <div 
            key={i}
            className="flex-1 max-w-[55px] rounded-sm" 
            style={{ 
              height: `${Math.max(v * 1.2, 25)}px`,
              backgroundColor: colors[i]
            }} 
          />
        ))}
      </div>
      {labels && (
        <div className="flex justify-center gap-4 mt-1">
          {labels.map((label, i) => (
            <span key={i} className="text-[10px] text-muted-foreground">{label}</span>
          ))}
        </div>
      )}
    </div>
  );
};

const toOrdinal = (value: number): string => {
  const safeValue = Math.max(0, value);
  const mod10 = safeValue % 10;
  const mod100 = safeValue % 100;
  if (mod10 === 1 && mod100 !== 11) return `${safeValue}st`;
  if (mod10 === 2 && mod100 !== 12) return `${safeValue}nd`;
  if (mod10 === 3 && mod100 !== 13) return `${safeValue}rd`;
  return `${safeValue}th`;
};

export const KpiTileCard = ({ indicator, kpi, isSelected, onSelect, onNavigate, comparison }: KpiTileCardProps) => {
  const chartType = indicatorChartTypes[indicator.code];
  const icon = indicatorIcons[indicator.code];
  const description = indicatorDescriptions[indicator.code];
  
  const renderChart = () => {
    if (!kpi) return null;
    
    switch (chartType) {
      case "gauge":
        const gaugeColors: Record<string, string> = {
          PI: "#fdba74",
          RP: "#fcd34d",
          IC: "#93c5fd"
        };
        return (
          <div className="flex justify-center">
            <GaugeChart value={kpi.value} color={gaugeColors[indicator.code] || "hsl(var(--primary))"} />
          </div>
        );
      
      case "dual-gauge":
        // For Medication Management: Polypharmacy and Antipsychotics
        const polyValue = Math.round(kpi.value * 0.95);
        const antiValue = Math.round(kpi.value * 0.42);
        return <DualGaugeChart value1={polyValue} value2={antiValue} label1="Polypharmacy" label2="Antipsychotics" />;
      
      case "donut":
        return <DonutChart value={kpi.value} color="#a78bfa" />;
      
      case "bars":
        return <BarsChart values={[kpi.value, kpi.previousValue]} colors={["#818cf8", "#c4b5fd"]} />;
      
      case "pills":
        return (
          <PillsChart 
            items={[
              { value: Math.round(kpi.value * 0.9), label: "falls", color: "#6b7280" },
              { value: Math.round(kpi.value * 0.15), label: "injury", color: "#1f2937" }
            ]} 
          />
        );
      
      case "gradient-bar":
        const variant = indicator.code === "QOL" ? "rainbow" : "green";
        const showPercentage = indicator.code === "CE" || indicator.code === "AH";
        return <GradientBar value={kpi.value} variant={variant} showPercentage={showPercentage} />;
      
      case "area":
        return <MiniAreaChart trend={kpi.trend || [kpi.previousValue, kpi.value]} />;
      
      case "multi-bar":
        return (
          <div className="flex justify-center">
            <MultiBarChart values={[kpi.value, kpi.previousValue]} colors={["#fda4af", "#f472b6"]} />
          </div>
        );
      
      default:
        return null;
    }
  };
  
  const deltaValue = kpi ? Math.abs(kpi.deltaPercent) : 0;
  const isLowerBetter = lowerIsBetterIndicators.includes(indicator.code);
  
  // Determine if the change is positive (good) for this specific indicator
  // For "lower is better" indicators: negative delta (decrease) is good
  // For "higher is better" indicators: positive delta (increase) is good
  const isPositiveChange = kpi 
    ? (isLowerBetter ? kpi.delta < 0 : kpi.delta > 0)
    : false;
  
  // Determine if the value went up or down for the arrow icon
  const isIncreasing = kpi ? kpi.delta > 0 : false;
  const comparisonIsFavorable = comparison
    ? (isLowerBetter
        ? comparison.rockpoolNumber <= comparison.benchmarkValue
        : comparison.rockpoolNumber >= comparison.benchmarkValue)
    : undefined;
  const proportionPercent = comparison ? Number((comparison.rockpoolProportion * 100).toFixed(1)) : undefined;
  const percentileLabel = proportionPercent !== undefined ? toOrdinal(Math.round(proportionPercent)) : undefined;
  
  return (
    <button
      type="button"
      onClick={onNavigate}
      onMouseEnter={() => onSelect()}
      onFocus={() => onSelect()}
      onTouchStart={() => onSelect()}
      className={cn(
        "bg-card rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md text-left w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
        isSelected && "ring-2 ring-primary border-primary/30"
      )}
    >
      {/* Header with title and icon */}
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-medium text-sm text-foreground leading-tight pr-2">
          {indicator.name}
        </h3>
        {icon}
      </div>
      
      {/* Main value */}
      <p className="text-3xl font-bold text-foreground mb-3">
        {kpi?.value ?? "--"}<span className="text-xl">%</span>
      </p>
      
      {/* Mini chart */}
      <div className="mb-3 min-h-[55px] flex items-center justify-center">
        <div className="w-full">
          {renderChart()}
        </div>
      </div>
      
      {/* Line separator */}
      <div className="border-t border-border my-3" />
      
      {/* Description text */}
      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
        {description}
      </p>
      <div className="text-xs mb-2">
        {kpi ? (
          deltaValue > 0 ? (
            <span className={cn(isPositiveChange ? "text-success" : "text-destructive", "flex items-center gap-1")}>
              {isIncreasing ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {deltaValue.toFixed(1)}% vs previous quarter
            </span>
          ) : (
            <span className="flex items-center gap-1 text-muted-foreground">
              No change vs previous quarter
            </span>
          )
        ) : null}
      </div>
      
      <div className="border-t border-border my-3" />
      
      {comparison && (
        <div className="space-y-1 text-xs mb-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Rockpool</span>
            <span
              className={cn(
                "font-semibold",
                comparisonIsFavorable ? "text-success" : "text-destructive"
              )}
            >
              {comparison.rockpoolNumber}%
            </span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>National avg</span>
            <span>{comparison.benchmarkValue}%</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-dashed border-border">
            <div>
              <span className="text-muted-foreground block">RockpoolProportion</span>
              <span className="text-foreground font-medium">
                {proportionPercent ?? 0}% {percentileLabel ? `(${percentileLabel})` : ""}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Quintile</span>
              <QuintileStars value={comparison.quintile} />
            </div>
          </div>
        </div>
      )}
      
      {/* Delta comparison is moved above */}
    </button>
  );
};
