import { forwardRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { QuestionField } from "./QuestionField";
import { SectionDefinition } from "@/lib/types/questionnaire";
import { QuestionAnswer } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, Check } from "lucide-react";

interface IndicatorAccordionProps {
  section: SectionDefinition;
  questions: QuestionAnswer[];
  onQuestionChange: (linkId: string, value: string | number | null) => void;
  isExpanded: boolean;
  onToggle: () => void;
  id?: string;
}

export const IndicatorAccordion = forwardRef<HTMLDivElement, IndicatorAccordionProps>(
  ({ section, questions, onQuestionChange, isExpanded, onToggle, id }, ref) => {
    const errorCount = questions.filter((q) => q.errors.length > 0).length;
    const warningCount = questions.filter((q) => q.warnings.length > 0).length;
    const completedCount = questions.filter((q) => q.finalValue !== null && q.finalValue !== "").length;
    const totalCount = questions.length;

    const getCategoryClass = (category: string) => {
      switch (category) {
        case "Clinical":
          return "indicator-clinical";
        case "Experience":
          return "indicator-experience";
        case "Workforce":
          return "indicator-workforce";
        default:
          return "";
      }
    };

    return (
      <div ref={ref} id={id} className="scroll-mt-20">
        <Accordion type="single" collapsible value={isExpanded ? section.code : ""}>
          <AccordionItem value={section.code} className="border rounded-lg overflow-hidden">
            <AccordionTrigger
              onClick={onToggle}
              className={cn(
                "px-4 py-3 hover:no-underline hover:bg-muted/50",
                errorCount > 0 && "border-l-4 border-l-destructive"
              )}
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="font-semibold text-primary">{section.code}</span>
                <span className="font-medium">{section.text}</span>
                <Badge variant="secondary" className={getCategoryClass(section.category)}>
                  {section.category}
                </Badge>
                <div className="flex items-center gap-2 ml-auto mr-4">
                  {errorCount > 0 && (
                    <span className="flex items-center gap-1 text-destructive text-sm">
                      <AlertCircle className="h-3 w-3" />
                      {errorCount}
                    </span>
                  )}
                  {warningCount > 0 && (
                    <span className="flex items-center gap-1 text-warning text-sm">
                      <AlertTriangle className="h-3 w-3" />
                      {warningCount}
                    </span>
                  )}
                  {errorCount === 0 && warningCount === 0 && completedCount === totalCount && (
                    <span className="flex items-center gap-1 text-success text-sm">
                      <Check className="h-3 w-3" />
                      Complete
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {completedCount}/{totalCount}
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-6 pt-2">
                {section.subSections.map((subSection) => {
                  const subSectionQuestions = questions.filter((q) =>
                    subSection.questions.some((sq) => sq.linkId === q.linkId)
                  );

                  if (subSectionQuestions.length === 0) return null;

                  return (
                    <div key={subSection.linkId} className="space-y-3">
                      <h4 className="text-sm font-medium text-muted-foreground border-b pb-2">
                        {subSection.text}
                      </h4>
                      <div className="space-y-3">
                        {subSectionQuestions.map((question) => {
                          const def = subSection.questions.find((q) => q.linkId === question.linkId);
                          return (
                            <QuestionField
                              key={question.linkId}
                              linkId={question.linkId}
                              text={def?.text || question.promptText}
                              responseType={def?.responseType || question.responseType}
                              required={def?.required || question.required}
                              value={question.finalValue}
                              autoValue={question.autoValue}
                              isAutoFilled={!question.isOverridden && question.autoValue !== null}
                              errors={question.errors}
                              warnings={question.warnings}
                              onChange={(value) => onQuestionChange(question.linkId, value)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
);

IndicatorAccordion.displayName = "IndicatorAccordion";
