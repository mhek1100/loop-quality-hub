import { useState } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { 
  Building2, 
  FileCheck, 
  FileX, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { Link } from "react-router-dom";
import { 
  facilities, 
  submissions, 
  reportingPeriods, 
  getFacilityById, 
  getReportingPeriodById 
} from "@/lib/mock/data";
import { INDICATORS } from "@/lib/mock/indicators";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const Dashboard = () => {
  const [selectedQuarter, setSelectedQuarter] = useState("rp-q2-2025");
  
  const currentPeriod = getReportingPeriodById(selectedQuarter);
  const periodSubmissions = submissions.filter(s => s.reportingPeriodId === selectedQuarter);
  
  // Calculate stats
  const stats = {
    inProgress: periodSubmissions.filter(s => s.status === "In Progress").length,
    submitted: periodSubmissions.filter(s => ["Submitted", "Late Submission", "Submitted - Updated after Due Date"].includes(s.status)).length,
    notStarted: periodSubmissions.filter(s => s.status === "Not Started" || s.status === "Not Submitted").length,
  };

  const chartData = [
    { name: "Submitted", value: stats.submitted, color: "#22c55e" },
    { name: "In Progress", value: stats.inProgress, color: "#8BB9FE" },
    { name: "Not Started", value: stats.notStarted, color: "#94a3b8" },
  ].filter(d => d.value > 0);

  // Find indicators at risk
  const indicatorsAtRisk = periodSubmissions.flatMap(sub => {
    const facility = getFacilityById(sub.facilityId);
    return sub.questionnaires
      .filter(q => q.validationStatus !== "OK")
      .map(q => ({
        facilityName: facility?.name || "Unknown",
        indicatorName: q.indicatorName,
        status: q.validationStatus,
        issueCount: q.questions.reduce((acc, qu) => acc + qu.errors.length + qu.warnings.length, 0)
      }));
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of NQIP submission status
          </p>
        </div>
        
        <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select quarter" />
          </SelectTrigger>
          <SelectContent>
            {reportingPeriods.slice(0, 4).map(period => (
              <SelectItem key={period.id} value={period.id}>
                {period.quarter}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-info/20">
                <Clock className="h-6 w-6 text-info-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-3xl font-bold text-foreground">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/20">
                <FileCheck className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="text-3xl font-bold text-foreground">{stats.submitted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-muted">
                <FileX className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Not Started</p>
                <p className="text-3xl font-bold text-foreground">{stats.notStarted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Submission Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value} facilities`, ""]}
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {chartData.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Facilities Table */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Facilities</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/submissions">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Facility</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Quarter</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">FHIR Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last Updated</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {periodSubmissions.map(sub => {
                    const facility = getFacilityById(sub.facilityId);
                    const period = getReportingPeriodById(sub.reportingPeriodId);
                    return (
                      <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Building2 className="h-4 w-4 text-primary" />
                            </div>
                            <span className="font-medium">{facility?.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{period?.quarter}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={sub.status} />
                        </td>
                        <td className="py-3 px-4">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {sub.fhirStatus}
                          </code>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {new Date(sub.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/submissions/${sub.id}`}>
                              View
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Indicators at Risk */}
      {indicatorsAtRisk.length > 0 && (
        <Card className="border-warning/30 bg-warning/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Indicators at Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {indicatorsAtRisk.slice(0, 5).map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <StatusBadge status={item.status} size="sm" />
                    <div>
                      <p className="font-medium text-sm">{item.indicatorName}</p>
                      <p className="text-xs text-muted-foreground">{item.facilityName}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {item.issueCount} issue{item.issueCount !== 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
