import { Check, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApiWorkflowStep } from "@/lib/types";

interface Step {
  id: ApiWorkflowStep;
  number: number;
  label: string;
  description: string;
}

const WORKFLOW_STEPS: Step[] = [
  {
    id: "data-collection",
    number: 1,
    label: "Collect Clinical Observations",
    description: "Data collected in System A from routine care",
  },
  {
    id: "questionnaire-retrieved",
    number: 2,
    label: "Retrieve QI Questionnaire",
    description: "GET Questionnaire from B2G Gateway",
  },
  {
    id: "data-mapped",
    number: 3,
    label: "Map to QuestionnaireResponse",
    description: "Aggregate and map data to FHIR payload",
  },
  {
    id: "in-progress-posted",
    number: 4,
    label: "POST In-Progress Submission",
    description: "Initial POST with status = in-progress",
  },
  {
    id: "awaiting-approval",
    number: 5,
    label: "Present to Authorised Submitter",
    description: "Awaiting authorised submitter review",
  },
  {
    id: "data-retrieved",
    number: 6,
    label: "GET for Review",
    description: "Retrieve submitted data for verification",
  },
  {
    id: "review-complete",
    number: 7,
    label: "User Review & Approval",
    description: "Review, alter if needed, and approve",
  },
  {
    id: "submitted",
    number: 8,
    label: "PATCH Final Submission",
    description: "Status changed to completed/amended",
  },
];

interface ApiWorkflowStepperProps {
  currentStep: ApiWorkflowStep;
  className?: string;
}

export function ApiWorkflowStepper({ currentStep, className }: ApiWorkflowStepperProps) {
  const currentStepIndex = WORKFLOW_STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className={cn("space-y-1", className)}>
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        API Workflow Progress
      </h3>
      <div className="space-y-0">
        {WORKFLOW_STEPS.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <div key={step.id} className="flex gap-3">
              {/* Connector line and icon */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                    isCompleted && "bg-primary text-primary-foreground",
                    isCurrent && "bg-primary/20 text-primary border-2 border-primary",
                    isPending && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-3 w-3" />
                  ) : isCurrent ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    step.number
                  )}
                </div>
                {index < WORKFLOW_STEPS.length - 1 && (
                  <div
                    className={cn(
                      "w-0.5 h-8",
                      isCompleted ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>

              {/* Step content */}
              <div className="pb-6 pt-0.5">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isCurrent && "text-primary",
                    isPending && "text-muted-foreground"
                  )}
                >
                  Step {step.number}: {step.label}
                </p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { WORKFLOW_STEPS };
