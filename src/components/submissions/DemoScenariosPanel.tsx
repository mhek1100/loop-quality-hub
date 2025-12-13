import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileEdit,
  FlaskConical,
  ChevronDown,
  XCircle,
} from "lucide-react";
import { getDemoScenarios, getFacilityById, getReportingPeriodById, getSubmission } from "@/lib/mock/data";

const scenarioIcons: Record<string, React.ReactNode> = {
  clean: <CheckCircle2 className="h-4 w-4 text-success" />,
  warnings: <AlertTriangle className="h-4 w-4 text-warning" />,
  reject: <XCircle className="h-4 w-4 text-destructive" />,
  empty: <FileEdit className="h-4 w-4 text-muted-foreground" />,
  late: <Clock className="h-4 w-4 text-info-foreground" />,
  default: <FileEdit className="h-4 w-4 text-muted-foreground" />,
};

const scenarioBadgeVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  clean: "default",
  warnings: "secondary",
  reject: "destructive",
  empty: "outline",
  late: "secondary",
  default: "outline",
};

export const DemoScenariosPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedScenarioId, setExpandedScenarioId] = useState<string | null>(null);
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
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
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
              const scenarioType = scenario.type || "default";
              const isExpanded = expandedScenarioId === scenario.id;
              
              return (
                <div
                  key={scenario.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <div className="mt-0.5">{scenarioIcons[scenarioType]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{scenario.name}</span>
                      <Badge variant={scenarioBadgeVariant[scenarioType]} className="text-xs">
                        {scenarioType}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{scenario.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{facility?.name || "Unknown"}</span>
                      <span aria-hidden className="text-muted-foreground/60">|</span>
                      <span>{period?.quarter || "Unknown"}</span>
                    </div>

                    <div className="mt-2 flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-muted-foreground"
                        onClick={() => setExpandedScenarioId(isExpanded ? null : scenario.id)}
                      >
                        {isExpanded ? "Hide steps" : "Show steps"}
                      </Button>
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {scenario.expectedBehavior}
                      </span>
                    </div>

                    {isExpanded && (
                      <div className="mt-2 rounded-md border bg-muted/20 p-2">
                        <p className="text-xs font-medium mb-1">Demo steps</p>
                        <ul className="text-xs text-muted-foreground space-y-1 list-disc ml-4">
                          {scenario.workflowSteps.map((step) => (
                            <li key={step}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm" asChild className="shrink-0">
                    <Link to={`/submissions/${scenario.submissionId}`}>Open</Link>
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
