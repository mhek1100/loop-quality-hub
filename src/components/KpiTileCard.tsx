import { cn } from "@/lib/utils";
import { KpiData, IndicatorCode, IndicatorDefinition } from "@/lib/types";
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

interface KpiTileCardProps {
  indicator: IndicatorDefinition;
  kpi?: KpiData;
  isSelected: boolean;
  onClick: () => void;
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
type ChartType = "gauge" | "bars" | "gradient-bar" | "donut" | "area" | "multi-bar" | "pills";

const indicatorChartTypes: Record<IndicatorCode, ChartType> = {
  PI: "gauge",
  RP: "gauge",
  UPWL: "bars",
  FALL: "pills",
  MM: "gauge",
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
const GaugeChart = ({ value, color = "hsl(var(--primary))" }: { value: number; color?: string }) => {
  const percentage = Math.min(value, 100);
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference * 0.75;
  
  return (
    <svg width="50" height="35" viewBox="0 0 50 35">
      <path
        d="M 5 30 A 20 20 0 0 1 45 30"
        fill="none"
        stroke="hsl(var(--muted))"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M 5 30 A 20 20 0 0 1 45 30"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={`${(percentage / 100) * 63} 63`}
      />
    </svg>
  );
};

// Mini donut chart
const DonutChart = ({ value, color = "hsl(var(--primary))" }: { value: number; color?: string }) => {
  const data = [
    { value: value },
    { value: 100 - value }
  ];
  
  return (
    <div className="w-[50px] h-[50px]">
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
const BarsChart = ({ values, colors }: { values: number[]; colors: string[] }) => {
  return (
    <div className="flex gap-2 items-end h-[40px]">
      {values.map((v, i) => (
        <div 
          key={i}
          className="w-[28px] rounded-t-sm" 
          style={{ 
            height: `${Math.max(v * 0.8, 15)}px`,
            backgroundColor: colors[i] || "hsl(var(--primary))"
          }} 
        />
      ))}
    </div>
  );
};

// Pills/badges for split values
const PillsChart = ({ items }: { items: { value: number; label: string; color: string }[] }) => {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {items.map((item, i) => (
        <span 
          key={i}
          className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
          style={{ backgroundColor: item.color }}
        >
          {item.value}% {item.label}
        </span>
      ))}
    </div>
  );
};

// Gradient progress bar
const GradientBar = ({ value, variant = "green" }: { value: number; variant?: "green" | "rainbow" }) => {
  const gradients = {
    green: "linear-gradient(to right, hsl(var(--success)), hsl(142, 76%, 36%))",
    rainbow: "linear-gradient(to right, #ef4444, #f97316, #eab308, #22c55e)"
  };
  
  return (
    <div className="space-y-1">
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all"
          style={{ 
            width: `${value}%`,
            background: gradients[variant]
          }} 
        />
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
    <div className="w-full h-[30px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="hsl(var(--success))"
            fill="hsl(var(--success)/0.2)"
            strokeWidth={1.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Multi bar chart (side by side comparison)
const MultiBarChart = ({ values, colors }: { values: number[]; colors: string[] }) => {
  return (
    <div className="flex gap-3 items-end h-[40px]">
      {values.map((v, i) => (
        <div 
          key={i}
          className="w-[24px] rounded-sm" 
          style={{ 
            height: `${Math.max(v * 0.8, 15)}px`,
            backgroundColor: colors[i]
          }} 
        />
      ))}
    </div>
  );
};

export const KpiTileCard = ({ indicator, kpi, isSelected, onClick }: KpiTileCardProps) => {
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
          MM: "#c4b5fd",
          IC: "#93c5fd"
        };
        return <GaugeChart value={kpi.value} color={gaugeColors[indicator.code] || "hsl(var(--primary))"} />;
      
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
        return <GradientBar value={kpi.value} variant={variant} />;
      
      case "area":
        return <MiniAreaChart trend={kpi.trend || [kpi.previousValue, kpi.value]} />;
      
      case "multi-bar":
        return <MultiBarChart values={[kpi.value, kpi.previousValue]} colors={["#fda4af", "#f472b6"]} />;
      
      default:
        return null;
    }
  };
  
  const deltaValue = kpi ? Math.abs(kpi.deltaPercent) : 0;
  const isPositive = kpi ? kpi.delta < 0 : false; // Lower is often better for clinical indicators
  
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md",
        isSelected && "ring-2 ring-primary border-primary/30"
      )}
    >
      {/* Header with title and icon */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-sm text-foreground leading-tight">
          {indicator.name}
        </h3>
        {icon}
      </div>
      
      {/* Main value */}
      <p className="text-3xl font-bold text-foreground mb-3">
        {kpi?.value || "—"}<span className="text-xl">%</span>
      </p>
      
      {/* Mini chart */}
      <div className="mb-3 min-h-[40px]">
        {renderChart()}
      </div>
      
      {/* Description text */}
      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
        {description}
      </p>
      
      {/* Delta comparison */}
      {kpi && (
        <div className={cn(
          "flex items-center gap-1 text-xs",
          isPositive ? "text-success" : "text-destructive"
        )}>
          {isPositive ? (
            <TrendingDown className="h-3 w-3" />
          ) : (
            <TrendingUp className="h-3 w-3" />
          )}
          <span>{deltaValue}% vs previous quarter</span>
        </div>
      )}
      
      {/* Status badge */}
      <div className="mt-2">
        <span className={cn(
          "text-[10px] px-1.5 py-0.5 rounded",
          kpi?.isComplete ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
        )}>
          {kpi?.isComplete ? "Complete" : "Incomplete"}
        </span>
      </div>
    </div>
  );
};
