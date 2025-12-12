import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, AlertCircle, Zap, Pencil } from "lucide-react";

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
}: QuestionFieldProps) {
  const hasErrors = errors.length > 0;
  const hasWarnings = warnings.length > 0;
  const isEdited = !isAutoFilled && value !== autoValue;

  const handleChange = (newValue: string) => {
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
      className={cn(
        "p-4 rounded-lg border transition-all",
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
            {required && (
              <span className="text-xs text-destructive">*</span>
            )}
          </div>

          {/* Question text */}
          <p className="text-sm text-muted-foreground">{text}</p>

          {/* Input field */}
          {responseType === "string" && text.toLowerCase().includes("comment") ? (
            <Textarea
              value={displayValue}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Enter comments..."
              className={cn(
                "mt-2",
                hasErrors && "border-destructive focus-visible:ring-destructive"
              )}
            />
          ) : (
            <Input
              type={responseType === "integer" ? "number" : responseType === "date" ? "date" : "text"}
              value={displayValue}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Enter value..."
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
