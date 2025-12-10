import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/status-badge";
import { IndicatorChip } from "@/components/ui/indicator-chip";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  AlertCircle,
  CheckCircle,
  Send,
  Save,
  Eye,
  FileJson
} from "lucide-react";
import { 
  getSubmission, 
  getFacilityById, 
  getReportingPeriodById, 
  getUserById,
  auditLogs,
  currentUser,
  roles
} from "@/lib/mock/data";
import { getIndicatorByCode } from "@/lib/mock/indicators";
import { toast } from "@/hooks/use-toast";

const SubmissionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const submission = getSubmission(id || "");
  
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
  
  // User permissions
  const userRoles = roles.filter(r => currentUser.roleIds.includes(r.id));
  const canEdit = userRoles.some(r => r.permissions.includes("EDIT_QUESTIONNAIRE"));
  const canReview = userRoles.some(r => r.permissions.includes("REVIEW_SUBMISSION"));
  const canSubmit = userRoles.some(r => r.permissions.includes("FINAL_SUBMIT_GOVERNMENT"));

  // Get related audit logs
  const relatedLogs = auditLogs.filter(log => 
    log.entityId === submission.id || 
    submission.questionnaires.some(q => log.entityId === q.id)
  );

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

  const handleSubmitToGov = () => {
    toast({
      title: "Submitted to Government",
      description: "Your NQIP data has been submitted successfully.",
    });
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
            {canSubmit && submission.status !== "Submitted" && (
              <Button onClick={handleSubmitToGov}>
                <Send className="mr-2 h-4 w-4" />
                Submit to Government
              </Button>
            )}
          </div>
        </div>
        
        {/* Prefill indicator */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Prefill source: 
          </span>
          <Badge variant={submission.questionnaires.some(q => q.prefillAvailable) ? "default" : "secondary"}>
            CIS pipeline {submission.questionnaires.some(q => q.prefillAvailable) ? "enabled" : "disabled"}
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="indicators">Indicators</TabsTrigger>
          <TabsTrigger value="validation">Validation & Warnings</TabsTrigger>
          <TabsTrigger value="history">Submission History</TabsTrigger>
          <TabsTrigger value="fhir">Raw FHIR Payload</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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

          {/* Indicators Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Indicator Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {submission.questionnaires.map(q => {
                  const indicator = getIndicatorByCode(q.indicatorCode);
                  const warningsCount = q.questions.reduce((a, qu) => a + qu.warnings.length, 0);
                  const errorsCount = q.questions.reduce((a, qu) => a + qu.errors.length, 0);
                  
                  return (
                    <div 
                      key={q.id}
                      className="p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <IndicatorChip category={indicator?.category || "Clinical"} />
                        <StatusBadge status={q.status} size="sm" />
                      </div>
                      <h3 className="font-medium text-sm">{q.indicatorName}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        {errorsCount > 0 && (
                          <span className="flex items-center gap-1 text-destructive text-xs">
                            <AlertCircle className="h-3 w-3" />
                            {errorsCount}
                          </span>
                        )}
                        {warningsCount > 0 && (
                          <span className="flex items-center gap-1 text-warning text-xs">
                            <AlertTriangle className="h-3 w-3" />
                            {warningsCount}
                          </span>
                        )}
                        {errorsCount === 0 && warningsCount === 0 && (
                          <span className="flex items-center gap-1 text-success text-xs">
                            <CheckCircle className="h-3 w-3" />
                            Valid
                          </span>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" className="mt-3 w-full" asChild>
                        <Link to={`/submissions/${submission.id}/indicator/${q.indicatorCode}`}>
                          Open Questionnaire
                        </Link>
                      </Button>
                    </div>
                  );
                })}
              </div>
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

        <TabsContent value="indicators">
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
                  id: submission.id,
                  status: submission.fhirStatus,
                  subject: {
                    reference: `HealthcareService/${facility?.serviceId}`
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
    </div>
  );
};

export default SubmissionDetail;
