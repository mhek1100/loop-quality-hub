import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Play, 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle2, 
  FileEdit,
  Clock,
  XCircle,
  ChevronDown,
  FlaskConical
} from "lucide-react";
import { getDemoScenarios, getFacilityById, getReportingPeriodById, getSubmission } from "@/lib/mock/data";

const getScenarioType = (id: string): string => {
  if (id.includes("happy-path")) return "clean";
  if (id.includes("govt-validation") || id.includes("rejected")) return "govt-errors";
  if (id.includes("warnings")) return "warnings";
  if (id.includes("empty")) return "empty";
  if (id.includes("late-amendment")) return "late-amendment";
  return "default";
};

const scenarioIcons: Record<string, React.ReactNode> = {
  "clean": <CheckCircle2 className="h-4 w-4 text-success" />,
  "warnings": <AlertTriangle className="h-4 w-4 text-warning" />,
  "errors": <AlertCircle className="h-4 w-4 text-destructive" />,
  "govt-errors": <XCircle className="h-4 w-4 text-destructive" />,
  "empty": <FileEdit className="h-4 w-4 text-muted-foreground" />,
  "late-amendment": <Clock className="h-4 w-4 text-info-foreground" />,
  "default": <FileEdit className="h-4 w-4 text-muted-foreground" />,
};

const scenarioBadgeVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  "clean": "default",
  "warnings": "secondary",
  "errors": "destructive",
  "govt-errors": "destructive",
  "empty": "outline",
  "late-amendment": "secondary",
  "default": "outline",
};

export const DemoScenariosPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const scenarios = getDemoScenarios();

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-dashed border-muted-foreground/30 bg-muted/30">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
                <FlaskConical className="h-4 w-4" />
                Demo Scenarios
                <Badge variant="outline" className="text-xs font-normal">
                  {scenarios.length} scenarios
                </Badge>
              </CardTitle>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>
            <p className="text-xs text-muted-foreground/70 text-left">
              Test different submission workflows with pre-configured scenarios
            </p>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-3">
            {scenarios.map((scenario) => {
              const submission = getSubmission(scenario.submissionId);
              const facility = submission ? getFacilityById(submission.facilityId) : null;
              const period = submission ? getReportingPeriodById(submission.reportingPeriodId) : null;
              const scenarioType = getScenarioType(scenario.id);
              
              return (
                <div 
                  key={scenario.id} 
                  className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <div className="mt-0.5">
                    {scenarioIcons[scenarioType]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{scenario.name}</span>
                      <Badge variant={scenarioBadgeVariant[scenarioType]} className="text-xs">
                        {scenarioType}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {scenario.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{facility?.name || "Unknown"}</span>
                      <span>•</span>
                      <span>{period?.quarter || "Unknown"}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild className="shrink-0">
                    <Link to={`/submissions/${scenario.submissionId}`}>
                      Open
                    </Link>
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
