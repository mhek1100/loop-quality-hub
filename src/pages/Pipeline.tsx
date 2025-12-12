import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Database, RefreshCw, Settings, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { facilities, pipelineConfigs, syncJobs, getFacilityById } from "@/lib/mock/data";
import { toast } from "@/hooks/use-toast";

interface PipelineProps {
  showHeader?: boolean;
}

const Pipeline = ({ showHeader = true }: PipelineProps) => {
  const handleSync = () => {
    toast({ title: "Sync started", description: "CIS pipeline sync has been initiated." });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {showHeader && (
        <div>
          <h1 className="text-2xl font-semibold">CIS Data Pipeline</h1>
          <p className="text-muted-foreground">Configure and monitor Telstra Health CIS integration</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {pipelineConfigs.map(config => {
          const facility = getFacilityById(config.facilityId);
          return (
            <Card key={config.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{facility?.name}</CardTitle>
                  <Badge variant={config.status === "Connected" ? "default" : config.status === "Error" ? "destructive" : "secondary"}>
                    {config.status === "Connected" && <CheckCircle className="mr-1 h-3 w-3" />}
                    {config.status === "Error" && <XCircle className="mr-1 h-3 w-3" />}
                    {config.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between"><span className="text-muted-foreground">CIS System:</span><span>{facility?.cisSystemName}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">API Key:</span><code className="text-xs">{config.apiKeyMasked}</code></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Last Sync:</span><span>{config.lastSyncDate ? new Date(config.lastSyncDate).toLocaleString() : "Never"}</span></div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleSync}><RefreshCw className="mr-1 h-3 w-3" />Sync Now</Button>
                  <Button size="sm" variant="ghost"><Settings className="mr-1 h-3 w-3" />Configure</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Recent Sync Jobs</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full">
            <thead><tr className="border-b"><th className="text-left py-2 text-sm text-muted-foreground">Facility</th><th className="text-left py-2 text-sm text-muted-foreground">Date/Time</th><th className="text-left py-2 text-sm text-muted-foreground">Status</th><th className="text-left py-2 text-sm text-muted-foreground">Records</th></tr></thead>
            <tbody>
              {syncJobs.map(job => {
                const facility = getFacilityById(job.facilityId);
                return (
                  <tr key={job.id} className="border-b border-border/50">
                    <td className="py-3">{facility?.name}</td>
                    <td className="py-3 text-muted-foreground">{new Date(job.timestamp).toLocaleString()}</td>
                    <td className="py-3"><StatusBadge status={job.status === "Success" ? "Submitted" : job.status === "Failed" ? "Errors" : "Warnings"} /></td>
                    <td className="py-3">{job.recordsImported}</td>
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

export default Pipeline;
