import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Submission } from "@/lib/types";
import { getFacilityById, getReportingPeriodById } from "@/lib/mock/data";
import { useUser } from "@/contexts/UserContext";
import { CheckCircle2 } from "lucide-react";

interface StepCompletionProps {
  submission: Submission;
}

export function StepCompletion({ submission }: StepCompletionProps) {
  const facility = getFacilityById(submission.facilityId);
  const period = getReportingPeriodById(submission.reportingPeriodId);
  const { getGpmsHeaders } = useUser();
  const headers = getGpmsHeaders();

  return (
    <div className="space-y-6">
      <Alert className="bg-success/10 border-success/30">
        <CheckCircle2 className="h-4 w-4 text-success" />
        <AlertDescription>
          Submission is complete. Keep this confirmation for your records.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Submission Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Facility</p>
            <p className="text-sm font-medium">{facility?.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Reporting Period</p>
            <p className="text-sm font-medium">{period?.quarter}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">QuestionnaireResponse ID</p>
            <code className="text-xs bg-muted px-2 py-1 rounded">
              {submission.questionnaireResponseId}
            </code>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">FHIR Status</p>
            <Badge className="bg-success/10 text-success border-success/30">
              {submission.fhirStatus}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Submission Status</p>
            <Badge variant="outline">{submission.status}</Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Submitted On</p>
            <p className="text-sm">
              {submission.lastSubmittedDate
                ? new Date(submission.lastSubmittedDate).toLocaleString()
                : new Date(submission.updatedAt).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Headers used</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-muted/40 rounded-lg font-mono text-sm space-y-1">
            {headers["X-User-Email"] && <p>X-User-Email: {headers["X-User-Email"]}</p>}
            {headers["X-Federated-Id"] && <p>X-Federated-Id: {headers["X-Federated-Id"]}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Amendments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Amend workflow is not available for this mock environment. Contact support if the
            Department requests changes after completion.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
