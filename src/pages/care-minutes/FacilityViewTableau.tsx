import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { TrendingUp, Calendar } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  LabelList,
} from "recharts";

// Facilities consistent with OverviewTableau
const facilities = [
  { name: "Johnsonchester", id: 1 },
  { name: "New Ashleychester", id: 2 },
  { name: "North Ryan", id: 3 },
  { name: "Rileyville", id: 4 },
];

// Facility-specific data
const facilityData: Record<string, {
  compliance: number;
  targetMet: boolean;
  targetDate: string;
  targetMinutes: number;
  qtdActualMinutes: number;
  difference: number;
  actualDailyAvg: number;
  dailyTarget: number;
  daysRemaining: number;
  adjustedPerformance: number;
}> = {
  Johnsonchester: {
    compliance: 102.96,
    targetMet: true,
    targetDate: "22 September, 2025",
    targetMinutes: 215.00,
    qtdActualMinutes: 161.57,
    difference: -53.43,
    actualDailyAvg: 120.5,
    dailyTarget: -6653.44,
    daysRemaining: 9,
    adjustedPerformance: 92.93,
  },
  "New Ashleychester": {
    compliance: 89.42,
    targetMet: false,
    targetDate: "22 September, 2025",
    targetMinutes: 215.00,
    qtdActualMinutes: 137.73,
    difference: -77.27,
    actualDailyAvg: 98.2,
    dailyTarget: -8234.12,
    daysRemaining: 9,
    adjustedPerformance: 78.56,
  },
  "North Ryan": {
    compliance: 86.18,
    targetMet: false,
    targetDate: "22 September, 2025",
    targetMinutes: 215.00,
    qtdActualMinutes: 138.05,
    difference: -76.95,
    actualDailyAvg: 95.8,
    dailyTarget: -9102.33,
    daysRemaining: 9,
    adjustedPerformance: 74.21,
  },
  Rileyville: {
    compliance: 98.12,
    targetMet: false,
    targetDate: "22 September, 2025",
    targetMinutes: 215.00,
    qtdActualMinutes: 153.39,
    difference: -61.61,
    actualDailyAvg: 112.4,
    dailyTarget: -5421.87,
    daysRemaining: 9,
    adjustedPerformance: 88.34,
  },
};

// Generate calendar data for July, August, September
const generateCalendarData = (facilityName: string) => {
  const months = [
    { name: "July", days: 31, startDay: 0 }, // Sunday
    { name: "August", days: 31, startDay: 4 }, // Thursday
    { name: "September", days: 30, startDay: 0 }, // Sunday
  ];

  // Seed based on facility name for consistent random data
  const seed = facilityName.length;
  const seededRandom = (i: number) => {
    const x = Math.sin(seed * i) * 10000;
    return x - Math.floor(x);
  };

  return months.map((month, monthIndex) => {
    const days: { day: number; status: "planning" | "under" | "met" | "over3" | "over6" | "over10" }[] = [];
    
    for (let day = 1; day <= month.days; day++) {
      const rand = seededRandom(day + monthIndex * 100);
      let status: "planning" | "under" | "met" | "over3" | "over6" | "over10";
      
      // Future days (September 23+) are planning
      if (monthIndex === 2 && day >= 23) {
        status = "planning";
      } else if (rand < 0.15) {
        status = "under";
      } else if (rand < 0.45) {
        status = "met";
      } else if (rand < 0.65) {
        status = "over3";
      } else if (rand < 0.85) {
        status = "over6";
      } else {
        status = "over10";
      }
      
      days.push({ day, status });
    }
    
    return { ...month, days };
  });
};

// Generate hourly performance data (5 weeks)
const generateHourlyPerformance = (facilityName: string) => {
  const seed = facilityName.length;
  const seededRandom = (i: number) => {
    const x = Math.sin(seed * i + 42) * 10000;
    return x - Math.floor(x);
  };

  const weeks: { values: { value: number; status: string }[] }[] = [];
  
  for (let week = 0; week < 5; week++) {
    const weekData: { value: number; status: string }[] = [];
    for (let day = 0; day < 7; day++) {
      const rand = seededRandom(week * 7 + day);
      let value: number;
      let status: string;
      
      if (rand < 0.1) {
        value = Math.floor(rand * -5);
        status = "under";
      } else if (rand < 0.3) {
        value = Math.floor(rand * 5);
        status = "met";
      } else if (rand < 0.5) {
        value = Math.floor(3 + rand * 3);
        status = "over3";
      } else if (rand < 0.7) {
        value = Math.floor(6 + rand * 5);
        status = "over6";
      } else {
        value = Math.floor(10 + rand * 15);
        status = "over10";
      }
      
      // Some cells show negative values
      if (rand < 0.25) {
        value = -Math.floor(rand * 100);
        status = "under";
      }
      
      weekData.push({ value, status });
    }
    weeks.push({ values: weekData });
  }
  
  return weeks;
};

// Capacity planning data
const capacityPlanningData = [
  { date: "22-9", staffNeeded: 52, rostered: 38, gap: -14 },
  { date: "23-9", staffNeeded: 48, rostered: 40, gap: -8 },
  { date: "24-9", staffNeeded: 45, rostered: 41, gap: -4 },
  { date: "25-9", staffNeeded: 44, rostered: 41, gap: -3 },
  { date: "26-9", staffNeeded: 42, rostered: 41, gap: -1 },
  { date: "27-9", staffNeeded: 50, rostered: 42, gap: -8 },
  { date: "28-9", staffNeeded: 46, rostered: 42, gap: -4 },
  { date: "29-9", staffNeeded: 45, rostered: 42, gap: -3 },
  { date: "30-9", staffNeeded: 47, rostered: 42, gap: -5 },
];

// Status color helper
const getStatusColor = (status: string) => {
  switch (status) {
    case "planning": return "bg-gray-200 dark:bg-gray-700";
    case "under": return "bg-red-500";
    case "met": return "bg-gray-300 dark:bg-gray-500";
    case "over3": return "bg-emerald-300";
    case "over6": return "bg-emerald-500";
    case "over10": return "bg-emerald-700";
    default: return "bg-gray-200";
  }
};

const getStatusTextColor = (status: string) => {
  switch (status) {
    case "under": return "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300";
    case "met": return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    case "over3": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300";
    case "over6": return "bg-emerald-200 text-emerald-800 dark:bg-emerald-800/50 dark:text-emerald-200";
    case "over10": return "bg-emerald-300 text-emerald-900 dark:bg-emerald-700/50 dark:text-emerald-100";
    default: return "bg-gray-50 text-gray-500";
  }
};

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function FacilityViewTableau() {
  const [selectedFacility, setSelectedFacility] = useState("Johnsonchester");
  const data = facilityData[selectedFacility];
  const calendarData = generateCalendarData(selectedFacility);
  const hourlyData = generateHourlyPerformance(selectedFacility);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Care Minutes Dashboard (Facility View)</h1>
          <p className="text-muted-foreground mt-1">
            Detailed facility-level compliance and capacity planning
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-right">
            <span className="text-muted-foreground">Care Minutes View</span>
            <p className="font-medium">Total Care Minutes</p>
          </div>
          <div className="text-right">
            <span className="text-muted-foreground">Location</span>
            <Select value={selectedFacility} onValueChange={setSelectedFacility}>
              <SelectTrigger className="w-[180px] mt-0.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {facilities.map((f) => (
                  <SelectItem key={f.id} value={f.name}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          {/* Main Compliance Card */}
          <Card className="bg-zinc-800 text-white overflow-hidden">
            <CardContent className="p-5">
              <div className="text-sm font-medium text-zinc-300 mb-1">{selectedFacility}</div>
              <div className="text-5xl font-bold tracking-tight">{data.compliance.toFixed(2)}%</div>
              <div className={cn(
                "inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-sm font-medium",
                data.targetMet 
                  ? "bg-emerald-500 text-white" 
                  : "bg-red-500 text-white"
              )}>
                <TrendingUp className="h-4 w-4" />
                {data.targetMet ? "Target Met" : "Below Target"}
              </div>
              <p className="text-xs text-zinc-400 mt-2">as of {data.targetDate}</p>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Target Minutes</span>
                <span className="font-medium">{data.targetMinutes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">QTD Actual Minutes</span>
                <span className="font-medium">{data.qtdActualMinutes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Difference</span>
                <span className={cn("font-medium", data.difference < 0 ? "text-red-600" : "text-emerald-600")}>
                  {data.difference.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Actual Daily Avg.</span>
                <span className="font-medium">{data.actualDailyAvg.toFixed(1)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Daily Target Card */}
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Daily Target ({data.daysRemaining} days remaining)
              </div>
              <div className="text-3xl font-bold text-amber-600 mt-1">
                {data.dailyTarget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">care minutes per day to reach 100%</p>
            </CardContent>
          </Card>

          {/* Shift Date */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Shift Date</span>
              </div>
              <p className="font-medium mt-1">21/09/2025</p>
              <p className="text-xs text-muted-foreground mt-2">Add Resource (Numbers only)</p>
            </CardContent>
          </Card>

          {/* Adjusted Performance Card */}
          <Card className="bg-red-600 text-white overflow-hidden">
            <CardContent className="p-4">
              <div className="text-4xl font-bold">{data.adjustedPerformance.toFixed(2)}%</div>
              <p className="text-sm text-red-100 mt-1">Adjusted Care Minutes</p>
              <p className="text-sm text-red-100">Performance by End of Quarter</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {/* Calendar Compliance */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Care Minutes Daily Target Compliance{" "}
                <span className="text-muted-foreground font-normal">(Target vs. Worked)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                {calendarData.map((month) => (
                  <div key={month.name}>
                    <div className="text-center font-medium text-sm mb-2">{month.name}</div>
                    <div className="grid grid-cols-7 gap-0.5 text-[10px]">
                      {dayLabels.map((day) => (
                        <div key={day} className="text-center text-muted-foreground py-1">
                          {day}
                        </div>
                      ))}
                      {/* Empty cells for start offset */}
                      {Array.from({ length: month.startDay }).map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}
                      {/* Calendar days */}
                      {month.days.map(({ day, status }) => (
                        <div
                          key={day}
                          className={cn(
                            "aspect-square flex items-center justify-center text-[10px] font-medium rounded-sm",
                            getStatusColor(status),
                            status === "under" || status === "over6" || status === "over10" 
                              ? "text-white" 
                              : "text-gray-700 dark:text-gray-200"
                          )}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Hourly Performance Grid */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  Care Minutes Daily Hour Performance{" "}
                  <span className="text-muted-foreground font-normal">(Target vs. Worked)</span>
                </CardTitle>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Display</span>
                  <span className="px-3 py-1 bg-muted rounded text-sm font-medium">Percentage</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {/* Header row */}
                <div className="grid grid-cols-7 gap-1 text-[10px] text-center mb-2">
                  {dayLabels.map((day) => (
                    <div key={day} className="text-muted-foreground font-medium py-1">
                      {day}
                    </div>
                  ))}
                </div>
                {/* Data rows */}
                {hourlyData.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7 gap-1">
                    {week.values.map((cell, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={cn(
                          "py-2 text-center text-xs font-medium rounded",
                          getStatusTextColor(cell.status)
                        )}
                      >
                        {cell.value > 0 ? `${cell.value}%` : `${cell.value}%`}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 mt-4 text-xs flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-gray-200 dark:bg-gray-700" />
                  <span className="text-muted-foreground">Planning</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-red-500" />
                  <span className="text-muted-foreground">Under Target</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-gray-300 dark:bg-gray-500" />
                  <span className="text-muted-foreground">Target Met</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-emerald-300" />
                  <span className="text-muted-foreground">3-5% Over Target</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-emerald-500" />
                  <span className="text-muted-foreground">6-10% Over Target</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-emerald-700" />
                  <span className="text-muted-foreground">Above 10% Over Target</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Capacity Planning Chart */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Capacity Planning on Remaining Days{" "}
                <span className="text-muted-foreground font-normal">(Staff Needs vs Rostered)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={capacityPlanningData} margin={{ top: 30, right: 20, left: 0, bottom: 5 }}>
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                      label={{ value: "Nb of Staff", angle: -90, position: "insideLeft", style: { fontSize: 11 } }}
                    />
                    <ReferenceLine y={42} stroke="hsl(var(--destructive))" strokeWidth={2} strokeDasharray="0" />
                    <Bar dataKey="staffNeeded" radius={[4, 4, 0, 0]} fill="hsl(var(--muted))">
                      {capacityPlanningData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="hsl(var(--muted))" />
                      ))}
                      <LabelList
                        dataKey="gap"
                        position="top"
                        formatter={(value: number) => value}
                        style={{ fontSize: 11, fontWeight: 600, fill: "hsl(var(--foreground))" }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Rostering View Placeholder */}
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground">Rostering View (In Progress)</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Detailed rostering integration coming soon.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
