import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { IndicatorChip } from "@/components/ui/indicator-chip";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  Building2, 
  AlertTriangle, 
  AlertCircle,
  CheckCircle,
  Send,
  Eye,
  FileJson,
  Download,
  Upload,
  Copy,
  Shield,
  Clock,
  Database,
  FileText,
  UserCheck,
  Check,
  Loader2,
  Circle
} from "lucide-react";
import { 
  getSubmission, 
  getFacilityById, 
  getReportingPeriodById, 
  getUserById,
} from "@/lib/mock/data";
import { getIndicatorByCode } from "@/lib/mock/indicators";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { SubmissionAttestationDialog } from "@/components/submission/SubmissionAttestationDialog";
import { AttestationType, ApiWorkflowStep } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface WorkflowStepConfig {
  id: ApiWorkflowStep;
  number: number;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
}

const WORKFLOW_STEPS: WorkflowStepConfig[] = [
  { id: "data-collection", number: 1, label: "Collect Clinical Observations", shortLabel: "Data Collection", icon: Database },
  { id: "questionnaire-retrieved", number: 2, label: "Retrieve QI Questionnaire", shortLabel: "Questionnaire", icon: FileText },
  { id: "data-mapped", number: 3, label: "Map to QuestionnaireResponse", shortLabel: "Data Mapping", icon: FileJson },
  { id: "in-progress-posted", number: 4, label: "POST In-Progress Submission", shortLabel: "POST In-Progress", icon: Upload },
  { id: "awaiting-approval", number: 5, label: "Present to Authorised Submitter", shortLabel: "Awaiting Approval", icon: Clock },
  { id: "data-retrieved", number: 6, label: "GET for Review", shortLabel: "Review Data", icon: Download },
  { id: "review-complete", number: 7, label: "User Review & Approval", shortLabel: "Final Review", icon: UserCheck },
  { id: "submitted", number: 8, label: "PATCH Final Submission", shortLabel: "Submit", icon: Send },
];

const SubmissionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const submission = getSubmission(id || "");
  const { currentUser, canEdit, canReview, canFinalSubmit, canPostInProgress, isAuthorizedSubmitter } = useUser();
  
  const [attestationOpen, setAttestationOpen] = useState(false);
  const [attestationType, setAttestationType] = useState<AttestationType>("submission");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState<ApiWorkflowStep | null>(null);
  
  // Compute the actual current step index
  const currentStepIndex = useMemo(() => {
    if (!submission) return 0;
    return WORKFLOW_STEPS.findIndex((s) => s.id === submission.apiWorkflowStep);
  }, [submission]);

  // Use active step or current step
  const displayStepId = activeStep || submission?.apiWorkflowStep || "data-collection";
  const displayStepIndex = WORKFLOW_STEPS.findIndex((s) => s.id === displayStepId);

  if (!submission) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-xl font-semibold">Submission not found</h2>
        <Button variant="outline" asChild className="mt-4">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Submissions
          </Link>
        </Button>
      </div>
    );
  }

  const facility = getFacilityById(submission.facilityId);
  const period = getReportingPeriodById(submission.reportingPeriodId);
  const submittedBy = submission.submittedByUserId ? getUserById(submission.submittedByUserId) : null;

  // Generate mock FHIR payload
  const fhirPayload = {
    resourceType: "QuestionnaireResponse",
    id: submission.questionnaireResponseId,
    status: submission.fhirStatus,
    questionnaire: submission.questionnaireId,
    subject: {
      reference: submission.healthcareServiceReference
    },
    authored: submission.updatedAt,
    author: {
      reference: `Practitioner/${currentUser.id}`
    },
    item: submission.questionnaires.map(q => ({
      linkId: q.indicatorCode,
      text: q.indicatorName,
      item: q.questions.slice(0, 3).map(qu => ({
        linkId: qu.linkId,
        text: qu.promptText,
        answer: [{ valueInteger: qu.finalValue }]
      }))
    }))
  };

  // Determine attestation type based on submission state
  const determineAttestationType = (): AttestationType => {
    const now = new Date();
    const dueDate = period ? new Date(period.dueDate) : now;
    const hasExistingSubmission = submission.lastSubmittedDate;
    const isAfterDueDate = now > dueDate;
    
    if (!hasExistingSubmission && isAfterDueDate) return "late-submission";
    if (hasExistingSubmission && isAfterDueDate) return "updated-after-due";
    if (hasExistingSubmission) return "resubmission";
    return "submission";
  };

  const handlePostInProgress = () => {
    toast({
      title: "Submitted In-Progress to B2G",
      description: `POST QuestionnaireResponse with status = in-progress. QR ID: ${submission.questionnaireResponseId || "New"}`,
    });
  };

  const handleGetForReview = () => {
    toast({
      title: "Retrieved from B2G Gateway",
      description: `GET QuestionnaireResponse/${submission.questionnaireResponseId}`,
    });
  };

  const handleOpenSubmissionDialog = () => {
    setAttestationType(determineAttestationType());
    setAttestationOpen(true);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setAttestationOpen(false);
    toast({
      title: "Successfully Submitted to Government",
      description: `PATCH QuestionnaireResponse/${submission.questionnaireResponseId} – status changed to completed`,
    });
  };

  const copyQrId = () => {
    if (submission.questionnaireResponseId) {
      navigator.clipboard.writeText(submission.questionnaireResponseId);
      toast({ title: "Copied to clipboard" });
    }
  };

  // Get validation issues
  const validationIssues = submission.questionnaires.flatMap(q => 
    q.questions.filter(qu => qu.errors.length > 0 || qu.warnings.length > 0).map(qu => ({
      ...qu,
      indicatorCode: q.indicatorCode,
      indicatorName: q.indicatorName
    }))
  );

  const renderStepContent = () => {
    const step = WORKFLOW_STEPS[displayStepIndex];
    const isCurrentOrPast = displayStepIndex <= currentStepIndex;
    const isCurrent = displayStepIndex === currentStepIndex;
    const isCompleted = displayStepIndex < currentStepIndex;
    const isFuture = displayStepIndex > currentStepIndex;

    switch (step.id) {
      case "data-collection":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Step 1: Collect Clinical Observations</h3>
                <p className="text-muted-foreground">Data collected in System A from routine care</p>
              </div>
              <StatusBadge status={isCompleted ? "Completed" : isCurrent ? "In Progress" : "Not Started"} />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Indicators Data Entry</CardTitle>
                <CardDescription>Review and enter data for each quality indicator</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Indicator</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submission.questionnaires.map(q => {
                      const indicator = getIndicatorByCode(q.indicatorCode);
                      return (
                        <tr key={q.id} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-3 px-4 font-medium">{q.indicatorName}</td>
                          <td className="py-3 px-4"><IndicatorChip category={indicator?.category || "Clinical"} /></td>
                          <td className="py-3 px-4"><StatusBadge status={q.status} /></td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/submissions/${submission.id}/indicator/${q.indicatorCode}`}>
                                <Eye className="mr-1 h-3 w-3" /> Open
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        );

      case "questionnaire-retrieved":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Step 2: Retrieve QI Questionnaire</h3>
                <p className="text-muted-foreground">GET Questionnaire from B2G Gateway</p>
              </div>
              <StatusBadge status={isCompleted ? "Completed" : isCurrent ? "In Progress" : "Not Started"} />
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Questionnaire ID</p>
                      <code className="text-sm font-mono">{submission.questionnaireId || "—"}</code>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Reporting Period</p>
                      <p className="font-medium">{period?.quarter}</p>
                    </div>
                  </div>
                  {isCompleted && (
                    <Alert className="bg-success/10 border-success/30">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <AlertDescription>Questionnaire structure retrieved successfully</AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "data-mapped":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Step 3: Map to QuestionnaireResponse</h3>
                <p className="text-muted-foreground">Aggregate and map data to FHIR payload</p>
              </div>
              <StatusBadge status={isCompleted ? "Completed" : isCurrent ? "In Progress" : "Not Started"} />
            </div>
            
            {validationIssues.length > 0 && (
              <Alert className="bg-warning/10 border-warning/30">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <AlertDescription>
                  {validationIssues.length} validation issue(s) found. Please review before proceeding.
                </AlertDescription>
              </Alert>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileJson className="h-4 w-4" />
                  Mapped FHIR Payload Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <pre className="p-4 rounded-lg bg-muted/50 text-xs font-mono">
                    {JSON.stringify(fhirPayload, null, 2)}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );

      case "in-progress-posted":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Step 4: POST In-Progress Submission</h3>
                <p className="text-muted-foreground">Initial POST with status = in-progress</p>
              </div>
              <StatusBadge status={isCompleted ? "Completed" : isCurrent ? "In Progress" : "Not Started"} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Submission Action</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      This will send the QuestionnaireResponse to the B2G Gateway with <code className="bg-muted px-1 rounded">status = in-progress</code>.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Server will validate the payload and return any errors or warnings.
                    </p>
                  </div>
                  
                  {isCurrent && canPostInProgress && (
                    <Button onClick={handlePostInProgress} className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      POST In-Progress to B2G Gateway
                    </Button>
                  )}
                  
                  {isCompleted && submission.questionnaireResponseId && (
                    <Alert className="bg-success/10 border-success/30">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <AlertDescription>
                        Successfully posted. QR ID: {submission.questionnaireResponseId}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileJson className="h-4 w-4" />
                    FHIR Payload (POST Body)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[250px]">
                    <pre className="p-4 rounded-lg bg-muted/50 text-xs font-mono">
                      {JSON.stringify(fhirPayload, null, 2)}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "awaiting-approval":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Step 5: Present to Authorised Submitter</h3>
                <p className="text-muted-foreground">Awaiting authorised submitter review</p>
              </div>
              <StatusBadge status={isCompleted ? "Completed" : isCurrent ? "Awaiting" : "Not Started"} />
            </div>
            
            {isCurrent && (
              <Alert className="bg-warning/10 border-warning/30">
                <Clock className="h-4 w-4 text-warning" />
                <AlertDescription>
                  This submission is awaiting review by an authorised submitter. Only users with the QI Submitter role can proceed.
                </AlertDescription>
              </Alert>
            )}
            
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">QuestionnaireResponse ID</p>
                    <code className="text-sm font-mono">{submission.questionnaireResponseId}</code>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">FHIR Status</p>
                    <code className="text-sm font-mono">{submission.fhirStatus}</code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "data-retrieved":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Step 6: GET for Review</h3>
                <p className="text-muted-foreground">Retrieve submitted data for verification</p>
              </div>
              <StatusBadge status={isCompleted ? "Completed" : isCurrent ? "In Progress" : "Not Started"} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Retrieve Action</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Fetch the current QuestionnaireResponse from the B2G Gateway to verify data before final submission.
                  </p>
                  
                  {(isCurrent || isCompleted) && canReview && submission.questionnaireResponseId && (
                    <Button onClick={handleGetForReview} variant={isCompleted ? "outline" : "default"} className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      GET QuestionnaireResponse
                    </Button>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileJson className="h-4 w-4" />
                    Retrieved FHIR Payload
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[250px]">
                    <pre className="p-4 rounded-lg bg-muted/50 text-xs font-mono">
                      {JSON.stringify(fhirPayload, null, 2)}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "review-complete":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Step 7: User Review & Approval</h3>
                <p className="text-muted-foreground">Review, alter if needed, and approve</p>
              </div>
              <StatusBadge status={isCompleted ? "Completed" : isCurrent ? "In Progress" : "Not Started"} />
            </div>
            
            {validationIssues.length > 0 ? (
              <div className="space-y-4">
                <Alert className="bg-warning/10 border-warning/30">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <AlertDescription>
                    {validationIssues.length} validation issue(s) require attention before submission.
                  </AlertDescription>
                </Alert>
                
                {submission.questionnaires.filter(q => q.validationStatus !== "OK").map(q => {
                  const issues = q.questions.filter(qu => qu.errors.length > 0 || qu.warnings.length > 0);
                  if (issues.length === 0) return null;
                  
                  return (
                    <Card key={q.id}>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          {q.indicatorName}
                          <StatusBadge status={q.validationStatus} size="sm" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {issues.map(qu => (
                            <div key={qu.linkId} className="p-3 rounded-lg bg-muted/50 border border-border/50">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <code className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{qu.linkId}</code>
                                  <span className="text-sm">{qu.promptText}</span>
                                </div>
                                <Button variant="ghost" size="sm" asChild>
                                  <Link to={`/submissions/${submission.id}/indicator/${q.indicatorCode}`}>Fix</Link>
                                </Button>
                              </div>
                              <div className="mt-2 space-y-1">
                                {qu.errors.map((err, i) => (
                                  <p key={i} className="text-sm text-destructive flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />{err}
                                  </p>
                                ))}
                                {qu.warnings.map((warn, i) => (
                                  <p key={i} className="text-sm text-warning flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" />{warn}
                                  </p>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                  <p className="text-lg font-medium">All validations passed</p>
                  <p className="text-muted-foreground">Ready to proceed to final submission</p>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "submitted":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Step 8: PATCH Final Submission</h3>
                <p className="text-muted-foreground">Status changed to completed/amended</p>
              </div>
              <StatusBadge status={isCompleted || submission.status === "Submitted" ? "Completed" : isCurrent ? "Ready" : "Not Started"} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Final Submission</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {submission.status === "Submitted" ? (
                    <Alert className="bg-success/10 border-success/30">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <AlertDescription>
                        <div className="space-y-1">
                          <p className="font-medium">Successfully submitted to Government</p>
                          <p className="text-sm">QR ID: {submission.questionnaireResponseId}</p>
                          {submittedBy && (
                            <p className="text-sm">Submitted by: {submittedBy.name} ({submittedBy.email})</p>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">
                        This will send a PATCH request to change the status to <code className="bg-muted px-1 rounded">completed</code> or <code className="bg-muted px-1 rounded">amended</code>.
                      </p>
                      
                      {!isAuthorizedSubmitter && (
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            A valid authorised GPMS user (with X-User-Email or X-Federated-Id) must be selected.
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      {(isCurrent || displayStepIndex >= currentStepIndex) && canFinalSubmit && (
                        <Button 
                          onClick={handleOpenSubmissionDialog} 
                          disabled={!isAuthorizedSubmitter}
                          className="w-full"
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Submit to Government
                        </Button>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileJson className="h-4 w-4" />
                    FHIR Payload (PATCH Body)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[250px]">
                    <pre className="p-4 rounded-lg bg-muted/50 text-xs font-mono">
                      {JSON.stringify({
                        ...fhirPayload,
                        status: "completed"
                      }, null, 2)}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-semibold">{facility?.name}</h1>
            <Badge variant="outline">{period?.quarter}</Badge>
            <StatusBadge status={submission.status} />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">QR ID:</span>
          {submission.questionnaireResponseId ? (
            <div className="flex items-center gap-1">
              <code className="text-sm bg-primary/10 text-primary px-2 py-1 rounded font-mono">
                {submission.questionnaireResponseId}
              </code>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyQrId}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Badge variant="secondary">Not yet created</Badge>
          )}
          <span className="text-sm text-muted-foreground ml-4">FHIR:</span>
          <code className="text-sm bg-muted px-2 py-1 rounded">{submission.fhirStatus}</code>
        </div>
      </div>

      {/* Workflow Step Navigator */}
      <Card className="overflow-hidden">
        <div className="flex overflow-x-auto">
          {WORKFLOW_STEPS.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isActive = step.id === displayStepId;
            const StepIcon = step.icon;
            
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={cn(
                  "flex-1 min-w-[120px] p-4 border-b-2 transition-colors text-center relative",
                  isActive ? "border-primary bg-primary/5" : "border-transparent hover:bg-muted/50",
                  isCompleted && "text-success",
                  !isCompleted && !isCurrent && "text-muted-foreground"
                )}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                    isCompleted && "bg-success text-success-foreground",
                    isCurrent && "bg-primary text-primary-foreground",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                  )}>
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : isCurrent ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className="text-xs font-medium whitespace-nowrap">{step.shortLabel}</span>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {renderStepContent()}
      </div>

      {/* Attestation Dialog */}
      <SubmissionAttestationDialog
        open={attestationOpen}
        onOpenChange={setAttestationOpen}
        attestationType={attestationType}
        onConfirm={handleFinalSubmit}
        isLoading={isSubmitting}
        facilityName={facility?.name || ""}
        quarter={period?.quarter || ""}
        fhirPayload={fhirPayload}
      />
    </div>
  );
};

export default SubmissionDetail;
