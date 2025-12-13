import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, AlertCircle, Zap, Pencil, RotateCcw } from "lucide-react";
import { PrivacyWarning } from "@/components/submission/PrivacyWarning";
import { isCommentField } from "@/lib/submission-utils";

interface QuestionFieldProps {
  linkId: string;
  text: string;
  responseType: "integer" | "string" | "date" | "boolean" | "choice";
  required: boolean;
  value: string | number | boolean | null;
  autoValue: string | number | boolean | null;
  isAutoFilled: boolean;
  errors: string[];
  warnings: string[];
  onChange: (value: string | number | null) => void;
  onRevert?: () => void;
  disabled?: boolean;
}

export function QuestionField({
  linkId,
  text,
  responseType,
  required,
  value,
  autoValue,
  isAutoFilled,
  errors,
  warnings,
  onChange,
  onRevert,
  disabled = false,
}: QuestionFieldProps) {
  const hasErrors = errors.length > 0;
  const hasWarnings = warnings.length > 0;
  const canRevert = !disabled && !isAutoFilled && autoValue !== null && autoValue !== undefined;
  const showPrivacyWarning = isCommentField(linkId, text) && responseType === "string";

  const handleChange = (newValue: string) => {
    if (disabled) return;
    if (responseType === "integer") {
      const parsed = parseInt(newValue, 10);
      onChange(isNaN(parsed) ? null : parsed);
    } else {
      onChange(newValue || null);
    }
  };

  const displayValue = value !== null && value !== undefined ? String(value) : "";

  return (
    <div
      id={`question-${linkId}`}
      className={cn(
        "p-4 rounded-lg border transition-all scroll-mt-24",
        hasErrors
          ? "border-destructive bg-destructive/5"
          : hasWarnings
          ? "border-warning bg-warning/5"
          : "border-border bg-card"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          {/* Header row with linkId and source chip */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-medium text-primary">{linkId}</span>
            <Badge
              variant="secondary"
              className={cn(
                "text-xs gap-1",
                isAutoFilled
                  ? "bg-success/10 text-success border-success/30"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {isAutoFilled ? (
                <>
                  <Zap className="h-3 w-3" />
                  Auto-filled
                </>
              ) : (
                <>
                  <Pencil className="h-3 w-3" />
                  Edited manually
                </>
              )}
            </Badge>
            {canRevert && onRevert && (
              <button
                type="button"
                onClick={onRevert}
                className="text-xs text-primary hover:text-primary/80 hover:underline flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Revert to pipeline ({String(autoValue)})
              </button>
            )}
            {required && (
              <span className="text-xs text-destructive">*</span>
            )}
          </div>

          {/* Question text */}
          <p className="text-sm text-muted-foreground">{text}</p>

          {/* Input field */}
          {responseType === "string" && text.toLowerCase().includes("comment") ? (
            <div className="space-y-2">
              <Textarea
                value={displayValue}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Enter comments..."
                disabled={disabled}
                className={cn(
                  "mt-2",
                  hasErrors && "border-destructive focus-visible:ring-destructive"
                )}
              />
              {showPrivacyWarning && <PrivacyWarning compact />}
            </div>
          ) : (
            <Input
              type={responseType === "integer" ? "number" : responseType === "date" ? "date" : "text"}
              value={displayValue}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Enter value..."
              disabled={disabled}
              className={cn(
                "mt-2 max-w-xs",
                hasErrors && "border-destructive focus-visible:ring-destructive"
              )}
            />
          )}

          {/* Validation messages */}
          {hasErrors && (
            <div className="mt-2 space-y-1">
              {errors.map((error, i) => (
                <p key={i} className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {error}
                </p>
              ))}
            </div>
          )}
          {hasWarnings && !hasErrors && (
            <div className="mt-2 space-y-1">
              {warnings.map((warning, i) => (
                <p key={i} className="text-xs text-warning flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {warning}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Status icon on the right */}
        <div className="flex-shrink-0">
          {hasErrors ? (
            <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
          ) : displayValue ? (
            <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
              <Check className="h-4 w-4 text-success" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
