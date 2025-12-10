import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { IndicatorChip } from "@/components/ui/indicator-chip";
import { submissions, getFacilityById, getReportingPeriodById } from "@/lib/mock/data";
import { INDICATORS } from "@/lib/mock/indicators";
import { Eye } from "lucide-react";

const Questionnaires = () => {
  const allQuestionnaires = submissions.flatMap(sub => 
    sub.questionnaires.map(q => ({ ...q, submission: sub }))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-semibold">Questionnaires</h1><p className="text-muted-foreground">View all indicator questionnaires across submissions</p></div>
      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead><tr className="border-b"><th className="text-left py-3 px-4 text-sm text-muted-foreground">Indicator</th><th className="text-left py-3 px-4 text-sm text-muted-foreground">Category</th><th className="text-left py-3 px-4 text-sm text-muted-foreground">Facility</th><th className="text-left py-3 px-4 text-sm text-muted-foreground">Quarter</th><th className="text-left py-3 px-4 text-sm text-muted-foreground">Status</th><th className="text-right py-3 px-4 text-sm text-muted-foreground">Actions</th></tr></thead>
            <tbody>
              {allQuestionnaires.slice(0, 20).map(q => {
                const facility = getFacilityById(q.submission.facilityId);
                const period = getReportingPeriodById(q.submission.reportingPeriodId);
                const indicator = INDICATORS.find(i => i.code === q.indicatorCode);
                return (
                  <tr key={q.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-3 px-4 font-medium">{q.indicatorName}</td>
                    <td className="py-3 px-4"><IndicatorChip category={indicator?.category || "Clinical"} /></td>
                    <td className="py-3 px-4 text-muted-foreground">{facility?.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{period?.quarter}</td>
                    <td className="py-3 px-4"><StatusBadge status={q.status} /></td>
                    <td className="py-3 px-4 text-right"><Button variant="ghost" size="sm" asChild><Link to={`/submissions/${q.submission.id}/indicator/${q.indicatorCode}`}><Eye className="mr-1 h-3 w-3" />Open</Link></Button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Questionnaires;
