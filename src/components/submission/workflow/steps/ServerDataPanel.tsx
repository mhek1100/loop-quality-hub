import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Submission } from "@/lib/types";
import { useUser } from "@/contexts/UserContext";
import { qiQuestionnaireResponseService } from "@/lib/services/b2g-questionnaire-response";
import { RefreshCw, CheckCircle, AlertTriangle, Server } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ServerDataPanelProps {
  submission: Submission;
  onDataRetrieved?: (data: any) => void;
}

export function ServerDataPanel({ submission, onDataRetrieved }: ServerDataPanelProps) {
  const { currentUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [serverData, setServerData] = useState<any>(null);
  const [lastRetrieved, setLastRetrieved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRetrieve = async () => {
    if (!submission.questionnaireResponseId) {
      setError("No QuestionnaireResponse ID available");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await qiQuestionnaireResponseService.getQuestionnaireResponse(
        submission.questionnaireResponseId,
        currentUser
      );

      if (result.success && result.data) {
        setServerData(result.data);
        setLastRetrieved(new Date());
        onDataRetrieved?.(result.data);
        toast({
          title: "Server data retrieved",
          description: `FHIR status: ${result.fhirStatus}`,
        });
      } else {
        setError(result.error || "Failed to retrieve data");
        toast({
          title: "Failed to retrieve data",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (err) {
      setError("An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to retrieve server data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Server className="h-4 w-4" />
          Server Data Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-muted/50 border-muted">
          <AlertDescription className="text-sm">
            Before final submission, retrieve the latest data from the government server to verify 
            your QuestionnaireResponse is in sync. This step is recommended per the API workflow.
          </AlertDescription>
        </Alert>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleRetrieve}
            disabled={isLoading || !submission.questionnaireResponseId}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Retrieving..." : "Retrieve from Server (GET)"}
          </Button>
          
          {lastRetrieved && (
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-success" />
              Last retrieved: {lastRetrieved.toLocaleTimeString()}
            </span>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {serverData && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">Server data verified</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Server FHIR Status</p>
                <Badge variant="secondary" className="mt-1">{serverData.status}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Updated (Server)</p>
                <p className="text-sm font-mono">
                  {new Date(serverData.authored).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}