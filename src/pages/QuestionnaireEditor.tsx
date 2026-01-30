import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StatusBadge } from "@/components/ui/status-badge";
import { IndicatorChip } from "@/components/ui/indicator-chip";
import { 
  ArrowLeft, 
  Database, 
  AlertTriangle, 
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Save,
  Info
} from "lucide-react";
import { 
  getSubmission, 
  getFacilityById, 
  getReportingPeriodById,
  currentUser,
  roles
} from "@/lib/mock/data";
import { getIndicatorByCode, INDICATOR_QUESTIONS } from "@/lib/mock/indicators";
import { IndicatorCode, QuestionAnswer } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const QuestionnaireEditor = () => {
  const { id, indicatorCode } = useParams<{ id: string; indicatorCode: string }>();
  const submission = getSubmission(id || "");
  const questionnaire = submission?.questionnaires.find(q => q.indicatorCode === indicatorCode);
  
  const [questions, setQuestions] = useState<QuestionAnswer[]>(questionnaire?.questions || []);
  const [comments, setComments] = useState(questionnaire?.comments || "");
  
  if (!submission || !questionnaire) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-xl font-semibold">Questionnaire not found</h2>
        <Button variant="outline" asChild className="mt-4">
          <Link to="/nqip/submissions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Submissions
          </Link>
        </Button>
      </div>
    );
  }

  const facility = getFacilityById(submission.facilityId);
  const period = getReportingPeriodById(submission.reportingPeriodId);
  const indicator = getIndicatorByCode(indicatorCode as IndicatorCode);
  
  // User permissions
  const userRoles = roles.filter(r => currentUser.roleIds.includes(r.id));
  const canEdit = userRoles.some(r => r.permissions.includes("EDIT_QUESTIONNAIRE"));
  const canReview = userRoles.some(r => r.permissions.includes("REVIEW_SUBMISSION"));
  const isEditable = canEdit && (submission.status === "Not Started" || submission.status === "In Progress");

  const handleApplyPrefill = () => {
    setQuestions(questions.map(q => ({
      ...q,
      userValue: null,
      finalValue: q.autoValue,
      isOverridden: false
    })));
    toast({
      title: "Pipeline values applied",
      description: "All questions have been reset to pipeline values."
    });
  };

  const handleSave = () => {
    toast({
      title: "Questionnaire saved",
      description: "Your changes have been saved successfully."
    });
  };

  const handleMarkReviewed = () => {
    toast({
      title: "Marked as Reviewed",
      description: "This questionnaire has been marked as reviewed."
    });
  };

  const updateQuestion = (linkId: string, value: string | number | boolean | null) => {
    setQuestions(questions.map(q => {
      if (q.linkId !== linkId) return q;
      const userValue = value === "" ? null : value;
      return {
        ...q,
        userValue,
        finalValue: userValue ?? q.autoValue,
        isOverridden: userValue !== null && userValue !== q.autoValue
      };
    }));
  };

  const toggleOverride = (linkId: string) => {
    setQuestions(questions.map(q => {
      if (q.linkId !== linkId) return q;
      if (q.isOverridden) {
        // Revert to pipeline value
        return {
          ...q,
          userValue: null,
          finalValue: q.autoValue,
          isOverridden: false
        };
      }
      return q;
    }));
  };

  // Group questions by groupName
  const groupedQuestions = questions.reduce((acc, q) => {
    const group = q.groupName || "General";
    if (!acc[group]) acc[group] = [];
    acc[group].push(q);
    return acc;
  }, {} as Record<string, QuestionAnswer[]>);

  // Check UPWL special logic - suppress comment warnings if comments provided
  const shouldSuppressCommentWarning = (question: QuestionAnswer) => {
    if (indicatorCode === "UPWL") {
      if (question.linkId === "UPWL-04") {
        const commentQuestion = questions.find(q => q.linkId === "UPWL-06");
        return commentQuestion?.finalValue && String(commentQuestion.finalValue).length > 0;
      }
      if (question.linkId === "UPWL-11") {
        const commentQuestion = questions.find(q => q.linkId === "UPWL-13");
        return commentQuestion?.finalValue && String(commentQuestion.finalValue).length > 0;
      }
    }
    return false;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm -mx-6 px-6 py-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/nqip/submissions/${submission.id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">{indicator?.name}</h1>
                <IndicatorChip category={indicator?.category || "Clinical"} />
              </div>
              <p className="text-sm text-muted-foreground">
                {facility?.name} • {period?.quarter}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isEditable && (
              <Button variant="outline" onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Questionnaire
              </Button>
            )}
            {canReview && (
              <Button variant="secondary" onClick={handleMarkReviewed}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Reviewed
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Prefill Banner */}
      {questionnaire.prefillAvailable && (
        <Alert className="bg-info/10 border-info/30">
          <Database className="h-4 w-4 text-info-foreground" />
          <AlertDescription className="flex items-center justify-between">
            <span>CIS data prefill is available for this questionnaire</span>
            <Button variant="outline" size="sm" onClick={handleApplyPrefill}>
              <RefreshCw className="mr-2 h-3 w-3" />
              Reset all to pipeline values
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!questionnaire.prefillAvailable && (
        <Alert className="bg-muted border-border">
          <Info className="h-4 w-4" />
          <AlertDescription>
            No CIS data available for this questionnaire. Please enter values manually.
          </AlertDescription>
        </Alert>
      )}

      {/* Questions */}
      {Object.entries(groupedQuestions).map(([groupName, groupQuestions]) => (
        <Card key={groupName}>
          <CardHeader>
            <CardTitle className="text-lg">{groupName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {groupQuestions.map(question => {
              const suppressWarning = shouldSuppressCommentWarning(question);
              const displayWarnings = suppressWarning 
                ? question.warnings.filter(w => !w.includes("Comment required"))
                : question.warnings;
              
              return (
                <div 
                  key={question.linkId}
                  className={cn(
                    "p-4 rounded-xl border",
                    question.errors.length > 0 ? "border-destructive/30 bg-destructive/5" :
                    displayWarnings.length > 0 ? "border-warning/30 bg-warning/5" :
                    "border-border/50"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <code className="text-xs bg-primary/10 text-primary px-2 py-1 rounded shrink-0">
                      {question.linkId}
                    </code>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">
                          {question.promptText}
                          {question.required && <span className="text-destructive ml-1">*</span>}
                        </p>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Pipeline Value */}
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">
                            Pipeline Value
                          </label>
                          <div className="p-2 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                            {question.autoValue !== null ? String(question.autoValue) : "—"}
                          </div>
                        </div>
                        
                        {/* User Input */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-xs text-muted-foreground">
                              {question.isOverridden ? "Override Value" : "Manual Entry"}
                            </label>
                            {question.isOverridden && (
                              <button 
                                onClick={() => toggleOverride(question.linkId)}
                                className="text-xs text-primary hover:underline"
                              >
                                Revert to pipeline
                              </button>
                            )}
                          </div>
                          {question.responseType === "string" ? (
                            <Textarea
                              value={question.userValue !== null ? String(question.userValue) : ""}
                              onChange={(e) => updateQuestion(question.linkId, e.target.value)}
                              placeholder="Enter value..."
                              disabled={!isEditable}
                              rows={2}
                            />
                          ) : question.responseType === "boolean" ? (
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={Boolean(question.finalValue)}
                                onCheckedChange={(checked) => updateQuestion(question.linkId, checked)}
                                disabled={!isEditable}
                              />
                              <span className="text-sm">{question.finalValue ? "Yes" : "No"}</span>
                            </div>
                          ) : (
                            <Input
                              type={question.responseType === "integer" ? "number" : question.responseType === "date" ? "date" : "text"}
                              value={question.userValue !== null ? String(question.userValue) : ""}
                              onChange={(e) => updateQuestion(
                                question.linkId, 
                                question.responseType === "integer" ? Number(e.target.value) : e.target.value
                              )}
                              placeholder="Enter value..."
                              disabled={!isEditable}
                            />
                          )}
                        </div>
                      </div>
                      
                      {/* Override indicator */}
                      {question.isOverridden && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          Overridden from pipeline
                        </Badge>
                      )}
                      
                      {/* Errors & Warnings */}
                      {question.errors.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {question.errors.map((err, i) => (
                            <p key={i} className="text-sm text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {err}
                            </p>
                          ))}
                        </div>
                      )}
                      {displayWarnings.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {displayWarnings.map((warn, i) => (
                            <p key={i} className="text-sm text-warning flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              {warn}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20 mb-4">
            <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
            <p className="text-sm text-warning-foreground">
              Please do not include names or information that might identify an individual.
            </p>
          </div>
          <Textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add any additional comments about this questionnaire..."
            rows={4}
            disabled={!isEditable}
          />
        </CardContent>
      </Card>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link to={`/nqip/submissions/${submission.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Submission
          </Link>
        </Button>
        
        <div className="flex items-center gap-2">
          {isEditable && (
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Questionnaire
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireEditor;
