import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { auditLogs, getUserById, facilities } from "@/lib/mock/data";

const AuditLog = () => {
  const [userFilter, setUserFilter] = useState("all");
  const filteredLogs = auditLogs.filter(log => userFilter === "all" || log.userId === userFilter);

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Activity Log</CardTitle>
          <Select value={userFilter} onValueChange={setUserFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by user" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Users</SelectItem></SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map(log => {
              const user = getUserById(log.userId);
              return (
                <div key={log.id} className="flex gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm">{log.details}</p>
                    <p className="text-xs text-muted-foreground mt-1">{user?.name} • {new Date(log.timestamp).toLocaleString()} • {log.actionType}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLog;
