import { Check, Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export type WorkflowStepId = "data-entry" | "preview" | "post-in-progress" | "final-submission";

export interface WorkflowStep {
  id: WorkflowStepId;
  number: number;
  label: string;
  description: string;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: "data-entry",
    number: 1,
    label: "Data Entry",
    description: "Enter all required indicator values",
  },
  {
    id: "preview",
    number: 2,
    label: "Build & Preview",
    description: "Review the QuestionnaireResponse",
  },
  {
    id: "post-in-progress",
    number: 3,
    label: "Submit In-Progress",
    description: "POST to Government API",
  },
  {
    id: "final-submission",
    number: 4,
    label: "Final Submission",
    description: "PATCH to complete submission",
  },
];

interface WorkflowStepperProps {
  currentStep: WorkflowStepId;
  completedSteps: WorkflowStepId[];
  lockedSteps: WorkflowStepId[];
  onStepClick: (stepId: WorkflowStepId) => void;
  className?: string;
}

export function WorkflowStepper({
  currentStep,
  completedSteps,
  lockedSteps,
  onStepClick,
  className,
}: WorkflowStepperProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {WORKFLOW_STEPS.map((step, index) => {
        const isCompleted = completedSteps.includes(step.id);
        const isCurrent = currentStep === step.id;
        const isLocked = lockedSteps.includes(step.id);
        const isClickable = !isLocked;

        return (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step indicator */}
            <button
              onClick={() => isClickable && onStepClick(step.id)}
              disabled={isLocked}
              className={cn(
                "flex flex-col items-center gap-2 group transition-all",
                isClickable && "cursor-pointer",
                isLocked && "cursor-not-allowed opacity-50"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                  isCompleted && "bg-success text-success-foreground",
                  isCurrent && !isCompleted && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  !isCurrent && !isCompleted && !isLocked && "bg-muted text-muted-foreground group-hover:bg-muted/80",
                  isLocked && "bg-muted/50 text-muted-foreground/50"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : isLocked ? (
                  <Lock className="h-4 w-4" />
                ) : isCurrent ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  step.number
                )}
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isCurrent && "text-primary",
                    isLocked && "text-muted-foreground/50"
                  )}
                >
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {step.description}
                </p>
              </div>
            </button>

            {/* Connector line */}
            {index < WORKFLOW_STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-4",
                  isCompleted ? "bg-success" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
