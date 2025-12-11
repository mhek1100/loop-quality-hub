import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/status-badge";
import { IndicatorChip } from "@/components/ui/indicator-chip";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  Building2, 
  AlertTriangle, 
  AlertCircle,
  CheckCircle,
  Send,
  Save,
  Eye,
  FileJson,
  Download,
  Upload,
  Copy,
  Shield,
  Clock
} from "lucide-react";
import { 
  getSubmission, 
  getFacilityById, 
  getReportingPeriodById, 
  getUserById,
  auditLogs,
} from "@/lib/mock/data";
import { getIndicatorByCode } from "@/lib/mock/indicators";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { ApiWorkflowStepper } from "@/components/submission/ApiWorkflowStepper";
import { SubmissionAttestationDialog } from "@/components/submission/SubmissionAttestationDialog";
import { AttestationType } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SubmissionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const submission = getSubmission(id || "");
  const { currentUser, userRoles, canEdit, canReview, canFinalSubmit, canPostInProgress, isAuthorizedSubmitter } = useUser();
  
  const [attestationOpen, setAttestationOpen] = useState(false);
  const [attestationType, setAttestationType] = useState<AttestationType>("submission");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!submission) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-xl font-semibold">Submission not found</h2>
        <Button variant="outline" asChild className="mt-4">
          <Link to="/submissions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Submissions
          </Link>
        </Button>
      </div>
    );
  }

  const facility = getFacilityById(submission.facilityId);
  const period = getReportingPeriodById(submission.reportingPeriodId);
  const createdBy = getUserById(submission.createdByUserId);
  const submittedBy = submission.submittedByUserId ? getUserById(submission.submittedByUserId) : null;

  // Get related audit logs
  const relatedLogs = auditLogs.filter(log => 
    log.entityId === submission.id || 
    submission.questionnaires.some(q => log.entityId === q.id)
  );

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

  const handleSaveDraft = () => {
    toast({
      title: "Draft saved",
      description: "Your changes have been saved successfully."
    });
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
    // Simulate API call
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb & Actions Header (Sticky) */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm -mx-6 px-6 py-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/submissions">
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
            {canEdit && (submission.status === "Not Started" || submission.status === "In Progress") && (
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
            )}
            {canPostInProgress && submission.apiWorkflowStep === "data-collection" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary" onClick={handlePostInProgress}>
                    <Upload className="mr-2 h-4 w-4" />
                    POST In-Progress
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Step 4: Initial POST with status = in-progress</TooltipContent>
              </Tooltip>
            )}
            {canReview && submission.questionnaireResponseId && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" onClick={handleGetForReview}>
                    <Download className="mr-2 h-4 w-4" />
                    GET for Review
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Step 6: Retrieve submitted data for verification</TooltipContent>
              </Tooltip>
            )}
            {canFinalSubmit && submission.status !== "Submitted" && submission.questionnaireResponseId && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button 
                      onClick={handleOpenSubmissionDialog}
                      disabled={!isAuthorizedSubmitter}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Submit to Government
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {isAuthorizedSubmitter 
                    ? "Step 8: PATCH to set final status" 
                    : "Requires authorized GPMS user with X-User-Email or X-Federated-Id"}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
        
        {/* QuestionnaireResponse ID Banner */}
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">QuestionnaireResponse ID:</span>
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
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">FHIR Status:</span>
            <code className="text-sm bg-muted px-2 py-1 rounded">{submission.fhirStatus}</code>
          </div>
          <Badge variant={submission.questionnaires.some(q => q.prefillAvailable) ? "default" : "secondary"}>
            CIS pipeline {submission.questionnaires.some(q => q.prefillAvailable) ? "enabled" : "disabled"}
          </Badge>
        </div>
      </div>

      {/* Awaiting Approval Banner */}
      {submission.apiWorkflowStep === "in-progress-posted" && submission.fhirStatus === "in-progress" && (
        <Alert className="bg-warning/10 border-warning/30">
          <Clock className="h-4 w-4 text-warning" />
          <AlertDescription className="flex items-center justify-between">
            <span>Awaiting authorised submitter review. Only users with QI Submitter role can proceed to final submission.</span>
            {!canFinalSubmit && (
              <Badge variant="outline" className="text-warning border-warning">
                Current user cannot submit
              </Badge>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs defaultValue="indicators-overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="indicators-overview">Indicators Overview</TabsTrigger>
          <TabsTrigger value="api-workflow">API Workflow</TabsTrigger>
          <TabsTrigger value="validation">Validation & Warnings</TabsTrigger>
          <TabsTrigger value="history">Submission History</TabsTrigger>
          <TabsTrigger value="fhir">Raw FHIR Payload</TabsTrigger>
        </TabsList>

        <TabsContent value="indicators-overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Version</p>
                <p className="text-2xl font-bold">{submission.submissionVersionNumber}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">FHIR Status</p>
                <code className="text-lg font-medium">{submission.fhirStatus}</code>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Created By</p>
                <p className="text-lg font-medium">{createdBy?.name || "Unknown"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-lg font-medium">{new Date(submission.updatedAt).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          </div>

          {/* Indicators Table */}
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Indicator</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Validation</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last Reviewed</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submission.questionnaires.map(q => {
                    const indicator = getIndicatorByCode(q.indicatorCode);
                    const reviewedBy = q.lastReviewedByUserId ? getUserById(q.lastReviewedByUserId) : null;
                    
                    return (
                      <tr key={q.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 font-medium">{q.indicatorName}</td>
                        <td className="py-3 px-4">
                          <IndicatorChip category={indicator?.category || "Clinical"} />
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={q.status} />
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={q.validationStatus} />
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {reviewedBy ? `${reviewedBy.name}` : "—"}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/submissions/${submission.id}/indicator/${q.indicatorCode}`}>
                              <Eye className="mr-1 h-3 w-3" />
                              Open
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

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {relatedLogs.slice(0, 5).map(log => {
                  const user = getUserById(log.userId);
                  return (
                    <div key={log.id} className="flex gap-4">
                      <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                      <div className="flex-1">
                        <p className="text-sm">{log.details}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {user?.name} • {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-workflow" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  API Workflow Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ApiWorkflowStepper currentStep={submission.apiWorkflowStep} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Submission Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Questionnaire ID</p>
                    <code className="text-sm font-mono">{submission.questionnaireId || "—"}</code>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">QuestionnaireResponse ID</p>
                    <code className="text-sm font-mono">{submission.questionnaireResponseId || "Not created"}</code>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">HealthcareService Reference</p>
                    <code className="text-sm font-mono">{submission.healthcareServiceReference || "—"}</code>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">FHIR Status</p>
                    <code className="text-sm font-mono">{submission.fhirStatus}</code>
                  </div>
                </div>

                {submittedBy && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">Last Submitted By</p>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{submittedBy.name}</span>
                      <Badge variant="secondary">{submittedBy.email}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {submission.lastSubmittedDate && new Date(submission.lastSubmittedDate).toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="validation">
          <div className="space-y-4">
            {submission.questionnaires.filter(q => q.validationStatus !== "OK").map(q => {
              const issues = q.questions.filter(qu => qu.errors.length > 0 || qu.warnings.length > 0);
              if (issues.length === 0) return null;
              
              return (
                <Card key={q.id}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {q.indicatorName}
                      <StatusBadge status={q.validationStatus} size="sm" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {issues.map(qu => (
                        <div key={qu.linkId} className="p-3 rounded-lg bg-muted/50 border border-border/50">
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                              {qu.linkId}
                            </code>
                            <span className="text-sm font-medium">{qu.promptText}</span>
                          </div>
                          <div className="mt-2 space-y-1">
                            {qu.errors.map((err, i) => (
                              <p key={i} className="text-sm text-destructive flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {err}
                              </p>
                            ))}
                            {qu.warnings.map((warn, i) => (
                              <p key={i} className="text-sm text-warning flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                {warn}
                              </p>
                            ))}
                          </div>
                          <div className="mt-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/submissions/${submission.id}/indicator/${q.indicatorCode}`}>
                                View & Fix
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {submission.questionnaires.every(q => q.validationStatus === "OK") && (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                  <p className="text-lg font-medium">All validations passed</p>
                  <p className="text-muted-foreground">No warnings or errors found in this submission</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50">
                  <div>
                    <p className="font-medium">Version {submission.submissionVersionNumber}</p>
                    <p className="text-sm text-muted-foreground">Current version</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={submission.status} />
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(submission.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {/* Mock previous versions */}
                {submission.submissionVersionNumber > 1 && (
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                    <div>
                      <p className="font-medium text-muted-foreground">Version {submission.submissionVersionNumber - 1}</p>
                      <p className="text-sm text-muted-foreground">Previous version</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">in-progress</Badge>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fhir">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileJson className="h-5 w-5" />
                FHIR QuestionnaireResponse Payload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="p-4 rounded-lg bg-muted/50 overflow-auto text-xs font-mono max-h-[500px]">
                {JSON.stringify({
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
                }, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Attestation Dialog */}
      <SubmissionAttestationDialog
        open={attestationOpen}
        onOpenChange={setAttestationOpen}
        attestationType={attestationType}
        onConfirm={handleFinalSubmit}
        isLoading={isSubmitting}
        facilityName={facility?.name || ""}
        quarter={period?.quarter || ""}
      />
    </div>
  );
};

export default SubmissionDetail;
