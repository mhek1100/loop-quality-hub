import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  facilities, 
  reportingPeriods, 
  getAllKpiData,
  DEFAULT_COMPARISON_FACILITY_ID,
  getIndicatorComparison
} from "@/lib/mock/data";
import { INDICATORS, getIndicatorByCode } from "@/lib/mock/indicators";
import { IndicatorCode, KpiData } from "@/lib/types";
import { KpiTileCard } from "@/components/KpiTileCard";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";

const KpiDashboard = () => {
  const [selectedFacility, setSelectedFacility] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("rp-q4-2025");
  const [selectedIndicator, setSelectedIndicator] = useState<IndicatorCode>("PI");
  const navigate = useNavigate();
  
  const allKpiData = getAllKpiData();
  const comparisonFacilityId = selectedFacility === "all" ? DEFAULT_COMPARISON_FACILITY_ID : selectedFacility;
  
  // Filter KPI data based on selections
  const filteredKpiData = allKpiData.filter(kpi => 
    (selectedFacility === "all" || kpi.facilityId === selectedFacility) &&
    kpi.periodId === selectedPeriod
  );

  // Get aggregated KPI data per indicator
  const getIndicatorKpi = (code: IndicatorCode): KpiData | undefined => {
    const indicatorData = filteredKpiData.filter(k => k.indicatorCode === code);
    if (indicatorData.length === 0) return undefined;
    
    // Aggregate if multiple facilities
    if (indicatorData.length === 1) return indicatorData[0];
    
    const avgValue = indicatorData.reduce((acc, d) => acc + d.value, 0) / indicatorData.length;
    const avgPrevValue = indicatorData.reduce((acc, d) => acc + d.previousValue, 0) / indicatorData.length;
    
    return {
      ...indicatorData[0],
      value: Number(avgValue.toFixed(1)),
      previousValue: Number(avgPrevValue.toFixed(1)),
      delta: Number((avgValue - avgPrevValue).toFixed(1)),
      deltaPercent: Number(((avgValue - avgPrevValue) / avgPrevValue * 100).toFixed(1))
    };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <Select value={selectedFacility} onValueChange={setSelectedFacility}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select facility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Facilities</SelectItem>
                {facilities.map(f => (
                  <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rp-q4-2025">Q4 2025</SelectItem>
                <SelectItem value="rp-q3-2025">Q3 2025</SelectItem>
                <SelectItem value="rp-q2-2025">Q2 2025</SelectItem>
                <SelectItem value="rp-q1-2025">Q1 2025</SelectItem>
                <SelectItem value="rp-q4-2024">Q4 2024</SelectItem>
                <SelectItem value="rp-q3-2024">Q3 2024</SelectItem>
                <SelectItem value="rp-q2-2024">Q2 2024</SelectItem>
                <SelectItem value="rp-q1-2024">Q1 2024</SelectItem>
              </SelectContent>
            </Select>

          </div>
        </CardContent>
      </Card>

      {/* Indicator Tiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {INDICATORS.map(indicator => {
          const kpi = getIndicatorKpi(indicator.code);
          const isSelected = selectedIndicator === indicator.code;
          const comparison = getIndicatorComparison(indicator.code, comparisonFacilityId, selectedPeriod);
          const facilityName = selectedFacility === "all" 
            ? "All Facilities" 
            : facilities.find(f => f.id === selectedFacility)?.name;
          
          return (
            <KpiTileCard
              key={indicator.code}
              indicator={indicator}
              kpi={kpi}
              isSelected={isSelected}
              onSelect={() => setSelectedIndicator(indicator.code)}
              onNavigate={() => navigate(`/kpi/indicator/${indicator.code.toLowerCase()}`)}
              comparison={comparison}
              facilityName={facilityName}
            />
          );
        })}
      </div>

      {/* KPI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Highlights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-success/10 border border-success/20">
              <p className="font-medium text-success">Largest Improvement</p>
              <p className="text-sm text-muted-foreground mt-1">
                Harbour Heights showed 12% improvement in Falls prevention
              </p>
            </div>
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="font-medium text-destructive">Needs Attention</p>
              <p className="text-sm text-muted-foreground mt-1">
                Riverbend ADL scores declined 8% compared to previous quarter
              </p>
            </div>
            <div className="p-3 rounded-lg bg-info/10 border border-info/20">
              <p className="font-medium text-info-foreground">Trending Stable</p>
              <p className="text-sm text-muted-foreground mt-1">
                Medication Management metrics consistent across all facilities
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Data Quality Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
              <p className="text-sm">
                <span className="font-medium">Q2 2025 — Riverbend Aged Care:</span>{" "}
                Pressure Injuries data has 2 validation warnings. Please review before final submission.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted border border-border/50">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Q2 2025 — Coastal View Lodge:</span>{" "}
                Submission not yet started. Data may be incomplete for this period.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KpiDashboard;
