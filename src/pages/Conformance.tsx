import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Shield, AlertTriangle, FileText, Lock } from "lucide-react";

const Conformance = () => {
  const checks = [
    {
      title: "Error/Warning Presentation",
      description: "Errors and warnings from business and data validations are properly presented to users",
      implemented: true,
    },
    {
      title: "Comment Privacy Warning",
      description: 'Free-text fields display: "Please do not include names or information that might identify an individual."',
      implemented: true,
    },
    {
      title: "Submission Attestations",
      description: "Four attestation scenarios implemented: Submission, Re-submit, Updated after Due Date, Late Submission",
      implemented: true,
    },
    {
      title: "GPMS Header Usage",
      description: "X-User-Email and X-Federated-Id headers are captured and sent with final submissions",
      implemented: true,
    },
    {
      title: "QuestionnaireResponse ID Visibility",
      description: "QuestionnaireResponse ID is displayed prominently in all submission views",
      implemented: true,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">API Conformance</h1>
        <p className="text-muted-foreground">
          Conformance status for the B2G Quality Indicators API
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Foundational Tier Conformance
          </CardTitle>
          <CardDescription>
            Quality Indicators API is classified as aggregated (de-identified) Administrative and Clinical Data.
            Software must meet all mandatory requirements and complete conformance testing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {checks.map((check, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
              <CheckCircle className="h-5 w-5 text-success mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{check.title}</p>
                  <Badge variant="default" className="text-xs">Implemented</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{check.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Attestation Messages
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm font-medium mb-2">Standard Attestation (all submission types):</p>
            <p className="text-sm text-muted-foreground">By submitting Quality Indicators data you:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
              <li>Confirm compliance with QI Program Manual 3.0, Aged Care Act 1997, Records Principles 2014, Accountability Principles 2014</li>
              <li>Confirm no personal information under Privacy Act 1988</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            API Endpoints (Simulated)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 font-mono text-xs">
            <p className="text-muted-foreground">POST https://api.health.gov.au/authentication/v2/oauth2/AccessToken</p>
            <p className="text-muted-foreground">GET https://api.health.gov.au/Providers/v2/Organization</p>
            <p className="text-muted-foreground">GET https://api.health.gov.au/Providers/v2/HealthcareServices</p>
            <p className="text-muted-foreground">GET https://api.health.gov.au/quality-indicators/v2/Questionnaire</p>
            <p className="text-muted-foreground">POST/GET/PATCH https://api.health.gov.au/quality-indicators/v2/QuestionnaireResponse</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Conformance;
