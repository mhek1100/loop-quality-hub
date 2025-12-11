import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/status-badge";
import { IndicatorChip } from "@/components/ui/indicator-chip";
import { Badge } from "@/components/ui/badge";
import { WorkflowStepper, WorkflowStep } from "@/components/ui/workflow-stepper";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  RefreshCw,
  Copy,
  ExternalLink,
  Shield
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
import { SubmissionApiCall } from "@/lib/types/api";
import {
  simulateGetQuestionnaires,
  simulateGetQuestionnaire,
  simulatePostQuestionnaireResponse,
  simulateGetQuestionnaireResponse,
  simulatePatchQuestionnaireResponse,
} from "@/lib/api/mockB2G";

const SubmissionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const submission = getSubmission(id || "");
  const { currentUser, canEdit, canReview, canSubmit } = useUser();
  
  const [apiCalls, setApiCalls] = useState<SubmissionApiCall[]>([]);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showApiPreview, setShowApiPreview] = useState(false);
  const [governmentCopy, setGovernmentCopy] = useState<any>(null);
  
  // Local state for simulating workflow changes
  const [localQuestionnaireId, setLocalQuestionnaireId] = useState(submission?.questionnaireId || null);
  const [localQrId, setLocalQrId] = useState(submission?.questionnaireResponseId || null);
  const [localFhirStatus, setLocalFhirStatus] = useState(submission?.fhirStatus || "in-progress");
  const [localTransportStatus, setLocalTransportStatus] = useState(submission?.transportStatus || "Not Sent");
  
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

  // Calculate workflow steps
  const getWorkflowSteps = (): WorkflowStep[] => {
    const hasData = submission.questionnaires.some(q => q.questions.some(qu => qu.finalValue !== null));
    const hasQuestionnaire = !!localQuestionnaireId;
    const hasDraftQr = !!localQrId && localFhirStatus === "in-progress";
    const hasCompletedQr = localFhirStatus === "completed" || localFhirStatus === "amended";
    const hasErrors = submission.hasErrors;

    return [
      {
        id: 1,
        label: "Collect & Validate Data",
        description: "Enter questionnaire data via CIS pipeline or manual entry",
        status: hasData ? "completed" : "current"
      },
      {
        id: 2,
        label: "Retrieve Questionnaire",
        description: "Get QI Questionnaire structure from B2G API",
        status: hasQuestionnaire ? "completed" : hasData ? "current" : "pending"
      },
      {
        id: 3,
        label: "Build Draft Response",
        description: "Generate QuestionnaireResponse payload",
        status: hasQuestionnaire && !hasDraftQr && !hasCompletedQr ? "current" : hasDraftQr || hasCompletedQr ? "completed" : "pending"
      },
      {
        id: 4,
        label: "POST Draft (in-progress)",
        description: "Send draft QuestionnaireResponse to Government",
        status: hasDraftQr ? "completed" : hasQuestionnaire && !hasCompletedQr ? "current" : hasCompletedQr ? "completed" : "pending"
      },
      {
        id: 5,
        label: "Review & Approve",
        description: "Internal review before formal submission",
        status: hasDraftQr && !hasCompletedQr ? "current" : hasCompletedQr ? "completed" : "pending"
      },
      {
        id: 6,
        label: "GET Government Copy",
        description: "Retrieve and verify Government-stored data",
        status: hasDraftQr ? "current" : hasCompletedQr ? "completed" : "pending"
      },
      {
        id: 7,
        label: "PATCH Formal Submission",
        description: "Submit final data (status: completed/amended)",
        status: hasCompletedQr ? "completed" : hasDraftQr && !hasErrors ? "current" : "disabled"
      }
    ];
  };

  const handleRetrieveQuestionnaire = () => {
    const { questionnaireIds, apiCall: listCall } = simulateGetQuestionnaires();
    setApiCalls(prev => [...prev, { ...listCall, submissionId: submission.id }]);
    
    const { questionnaire, apiCall: getCall } = simulateGetQuestionnaire(questionnaireIds[0]);
    setApiCalls(prev => [...prev, { ...getCall, submissionId: submission.id }]);
    setLocalQuestionnaireId(questionnaireIds[0]);
    
    toast({
      title: "Questionnaire Retrieved",
      description: `Questionnaire ID: ${questionnaireIds[0]}`
    });
  };

  const handleGenerateDraft = () => {
    toast({
      title: "Draft Generated",
      description: "QuestionnaireResponse payload ready for transmission"
    });
  };

  const handlePostDraft = () => {
    const payload = {
      resourceType: "QuestionnaireResponse",
      questionnaire: localQuestionnaireId,
      status: "in-progress",
      subject: { reference: submission.programPaymentEntityRef || `HealthcareService/${facility?.serviceId}` }
    };
    
    const { questionnaireResponseId, apiCall } = simulatePostQuestionnaireResponse(submission.id, payload);
    setApiCalls(prev => [...prev, apiCall]);
    setLocalQrId(questionnaireResponseId);
    setLocalFhirStatus("in-progress");
    setLocalTransportStatus("Draft Sent (in-progress)");
    
    toast({
      title: "Draft Sent to Government",
      description: `QuestionnaireResponse ID: ${questionnaireResponseId}`
    });
  };

  const handleGetGovernmentCopy = () => {
    if (!localQrId) return;
    
    const { response, apiCall } = simulateGetQuestionnaireResponse(localQrId);
    setApiCalls(prev => [...prev, { ...apiCall, submissionId: submission.id }]);
    setGovernmentCopy(response);
    
    toast({
      title: "Government Copy Retrieved",
      description: "Review the data stored in the Government system"
    });
  };

  const handleFormalSubmission = () => {
    if (!localQrId || !canSubmit) return;
    
    const newStatus = localFhirStatus === "completed" ? "amended" : "completed";
    const { apiCall } = simulatePatchQuestionnaireResponse(submission.id, localQrId, newStatus);
    setApiCalls(prev => [...prev, apiCall]);
    setLocalFhirStatus(newStatus);
    setLocalTransportStatus(newStatus === "completed" ? "Submitted (completed)" : "Amended");
    setShowSubmitDialog(false);
    
    toast({
      title: "Formal Submission Complete",
      description: `QuestionnaireResponse ${localQrId} status: ${newStatus}`
    });
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft saved",
      description: "Your changes have been saved successfully."
    });
  };

  const handleMarkReady = () => {
    toast({
      title: "Marked as Ready for Review",
      description: "This submission is now ready for review."
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
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
            {canReview && submission.status === "In Progress" && (
              <Button variant="secondary" onClick={handleMarkReady}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark Ready for Review
              </Button>
            )}
            {canSubmit && localQrId && localFhirStatus === "in-progress" && (
              <Button onClick={() => setShowSubmitDialog(true)}>
                <Send className="mr-2 h-4 w-4" />
                Submit to Government
              </Button>
            )}
          </div>
        </div>
        
        {/* QuestionnaireResponse ID and Transport Status */}
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">QR ID:</span>
            {localQrId ? (
              <div className="flex items-center gap-1">
                <code className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-mono">
                  {localQrId}
                </code>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(localQrId)}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground italic">Not yet created</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">FHIR Status:</span>
            <code className="text-xs bg-muted px-2 py-1 rounded">{localFhirStatus}</code>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Transport:</span>
            <Badge variant={localTransportStatus === "Submitted (completed)" ? "default" : "secondary"}>
              {localTransportStatus}
            </Badge>
          </div>
          
          {submission.programPaymentEntityName && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">PPE:</span>
              <span className="text-sm">{submission.programPaymentEntityName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="workflow" className="space-y-6">
        <TabsList>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="indicators-overview">Indicators</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="api-calls">API Calls</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="fhir">Raw FHIR</TabsTrigger>
        </TabsList>

        <TabsContent value="workflow" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Workflow Stepper */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">B2G Submission Workflow</CardTitle>
                <CardDescription>
                  Follow these steps to submit QI data to the Government
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WorkflowStepper steps={getWorkflowSteps()} />
              </CardContent>
            </Card>

            {/* Actions Panel */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Workflow Actions</CardTitle>
                <CardDescription>
                  Execute each step of the B2G API workflow
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Step 2: Retrieve Questionnaire */}
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Step 2: Retrieve QI Questionnaire</p>
                      <p className="text-sm text-muted-foreground">
                        GET /Questionnaire - Fetch current questionnaire structure
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleRetrieveQuestionnaire}
                      disabled={!!localQuestionnaireId}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {localQuestionnaireId ? "Retrieved" : "Retrieve"}
                    </Button>
                  </div>
                  {localQuestionnaireId && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Questionnaire ID: <code className="bg-muted px-1 rounded">{localQuestionnaireId}</code>
                    </p>
                  )}
                </div>

                {/* Step 3: Generate Draft */}
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Step 3: Generate Draft QuestionnaireResponse</p>
                      <p className="text-sm text-muted-foreground">
                        Build FHIR payload from current answers
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleGenerateDraft}
                      disabled={!localQuestionnaireId}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Generate
                    </Button>
                  </div>
                </div>

                {/* Step 4: POST Draft */}
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Step 4: Send Draft to Government</p>
                      <p className="text-sm text-muted-foreground">
                        POST /QuestionnaireResponse (status: in-progress)
                      </p>
                    </div>
                    <Button 
                      onClick={handlePostDraft}
                      disabled={!localQuestionnaireId || !!localQrId}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {localQrId ? "Sent" : "Send Draft"}
                    </Button>
                  </div>
                  {localQrId && localFhirStatus === "in-progress" && (
                    <p className="text-xs text-muted-foreground mt-2">
                      QuestionnaireResponse ID: <code className="bg-muted px-1 rounded">{localQrId}</code>
                    </p>
                  )}
                </div>

                {/* Step 6: GET Government Copy */}
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Step 6: View Government Copy</p>
                      <p className="text-sm text-muted-foreground">
                        GET /QuestionnaireResponse/{"{id}"} - Verify stored data
                      </p>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Button 
                            variant="outline"
                            onClick={handleGetGovernmentCopy}
                            disabled={!localQrId}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Copy
                          </Button>
                        </span>
                      </TooltipTrigger>
                      {!localQrId && (
                        <TooltipContent>
                          <p>QuestionnaireResponse must be created first</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </div>
                  {governmentCopy && (
                    <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
                      {JSON.stringify(governmentCopy, null, 2)}
                    </pre>
                  )}
                </div>

                {/* Step 7: PATCH Formal Submission */}
                <div className="p-4 rounded-lg border border-primary/30 bg-primary/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        Step 7: Formal Submission
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PATCH /QuestionnaireResponse/{"{id}"} (status: completed/amended)
                      </p>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Button 
                            onClick={() => setShowSubmitDialog(true)}
                            disabled={!localQrId || localFhirStatus === "completed" || !canSubmit}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            {localFhirStatus === "completed" ? "Submitted" : "Submit"}
                          </Button>
                        </span>
                      </TooltipTrigger>
                      {!canSubmit && (
                        <TooltipContent>
                          <p>Only QI Submitter role can perform formal submission</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </div>
                  {!canSubmit && (
                    <p className="text-xs text-warning mt-2 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Requires QI Submitter role
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

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
                <code className="text-lg font-medium">{localFhirStatus}</code>
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

        <TabsContent value="api-calls">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">API Call History</CardTitle>
              <CardDescription>
                Record of B2G API interactions for this submission
              </CardDescription>
            </CardHeader>
            <CardContent>
              {apiCalls.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No API calls recorded yet. Use the Workflow tab to interact with the B2G API.
                </p>
              ) : (
                <div className="space-y-3">
                  {apiCalls.map(call => (
                    <div key={call.id} className="p-3 rounded-lg border border-border bg-muted/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={call.success ? "default" : "destructive"}>
                            {call.method}
                          </Badge>
                          <code className="text-xs">{call.statusCode}</code>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(call.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm font-mono mt-2 text-muted-foreground break-all">
                        {call.endpoint}
                      </p>
                      <p className="text-sm mt-1">{call.responseSummary}</p>
                      {call.questionnaireResponseId && (
                        <p className="text-xs text-muted-foreground mt-1">
                          QR ID: <code className="bg-muted px-1 rounded">{call.questionnaireResponseId}</code>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50">
                  <div>
                    <p className="font-medium">Version {submission.submissionVersionNumber}</p>
                    <p className="text-sm text-muted-foreground">Current version</p>
                    {localQrId && (
                      <p className="text-xs text-muted-foreground mt-1">
                        QR ID: {localQrId}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <StatusBadge status={submission.status} />
                    <p className="text-xs text-muted-foreground mt-1">
                      FHIR: {localFhirStatus}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(submission.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
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
              <CardDescription>
                {localQrId ? (
                  <span className="flex items-center gap-2">
                    Current QuestionnaireResponse ID: 
                    <code className="bg-muted px-2 py-0.5 rounded">{localQrId}</code>
                    <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => copyToClipboard(localQrId)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </span>
                ) : (
                  "QuestionnaireResponse not yet created"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="p-4 rounded-lg bg-muted/50 overflow-auto text-xs font-mono max-h-[500px]">
                {JSON.stringify({
                  resourceType: "QuestionnaireResponse",
                  id: localQrId || "[will be assigned on POST]",
                  questionnaire: localQuestionnaireId || "[retrieve questionnaire first]",
                  status: localFhirStatus,
                  subject: {
                    reference: submission.programPaymentEntityRef || `HealthcareService/${facility?.serviceId}`
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

      {/* Submit to Government Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Confirm Formal Submission
            </DialogTitle>
            <DialogDescription>
              You are about to submit this QuestionnaireResponse to the Government B2G API.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Facility:</span>
                <span className="font-medium">{facility?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Period:</span>
                <span className="font-medium">{period?.quarter}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">QR ID:</span>
                <code className="text-xs bg-muted px-2 py-0.5 rounded">{localQrId}</code>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status Change:</span>
                <span>{localFhirStatus} → <strong>{localFhirStatus === "completed" ? "amended" : "completed"}</strong></span>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border">
              <p className="text-sm font-medium mb-2">API Request Headers Preview:</p>
              <div className="space-y-1 text-xs font-mono">
                <p>Authorization: Bearer mock-bearer-token-***</p>
                <p className="text-primary">X-User-Email: {currentUser.email}</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-warning/10 border border-warning/30">
              <p className="text-sm text-warning flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                This action will formally submit data to the Government system.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleFormalSubmission}>
              <Send className="mr-2 h-4 w-4" />
              Confirm Submission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubmissionDetail;