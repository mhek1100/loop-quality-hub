import { Check, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WorkflowStep {
  id: number;
  label: string;
  description: string;
  status: "completed" | "current" | "pending" | "disabled";
}

interface WorkflowStepperProps {
  steps: WorkflowStep[];
  orientation?: "horizontal" | "vertical";
}

export function WorkflowStepper({ steps, orientation = "vertical" }: WorkflowStepperProps) {
  return (
    <div className={cn(
      "flex",
      orientation === "vertical" ? "flex-col space-y-0" : "flex-row space-x-0"
    )}>
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={cn(
            "flex",
            orientation === "vertical" ? "flex-row" : "flex-col items-center"
          )}
        >
          <div className={cn(
            "flex",
            orientation === "vertical" ? "flex-col items-center" : "flex-row items-center"
          )}>
            {/* Step indicator */}
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                step.status === "completed" && "border-primary bg-primary text-primary-foreground",
                step.status === "current" && "border-primary bg-primary/10 text-primary",
                step.status === "pending" && "border-muted-foreground/30 bg-muted text-muted-foreground",
                step.status === "disabled" && "border-muted bg-muted text-muted-foreground/50"
              )}
            >
              {step.status === "completed" ? (
                <Check className="h-4 w-4" />
              ) : step.status === "current" ? (
                <Circle className="h-3 w-3 fill-current" />
              ) : (
                step.id
              )}
            </div>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  orientation === "vertical" ? "w-0.5 h-12" : "h-0.5 w-12",
                  step.status === "completed" ? "bg-primary" : "bg-muted-foreground/20"
                )}
              />
            )}
          </div>
          
          {/* Step content */}
          <div className={cn(
            orientation === "vertical" ? "ml-4 pb-12" : "mt-2 text-center",
            index === steps.length - 1 && "pb-0"
          )}>
            <p className={cn(
              "text-sm font-medium",
              step.status === "completed" && "text-primary",
              step.status === "current" && "text-foreground",
              step.status === "pending" && "text-muted-foreground",
              step.status === "disabled" && "text-muted-foreground/50"
            )}>
              {step.label}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-[200px]">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
