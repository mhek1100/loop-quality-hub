import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, FileJson, AlertTriangle, AlertCircle, Check, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ValidationIssue {
  severity: "error" | "warning" | "information";
  message: string;
  location?: string;
}

interface FhirPayloadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  requestPayload?: object;
  responsePayload?: object;
  validationIssues?: ValidationIssue[];
  httpMethod?: "GET" | "POST" | "PATCH";
  endpoint?: string;
  headers?: Record<string, string>;
  onContinue?: () => void;
  continueLabel?: string;
  canContinue?: boolean;
}

export function FhirPayloadModal({
  open,
  onOpenChange,
  title,
  description,
  requestPayload,
  responsePayload,
  validationIssues = [],
  httpMethod,
  endpoint,
  headers,
  onContinue,
  continueLabel = "Continue",
  canContinue = true,
}: FhirPayloadModalProps) {
  const errorCount = validationIssues.filter((v) => v.severity === "error").length;
  const warningCount = validationIssues.filter((v) => v.severity === "warning").length;

  const copyToClipboard = (content: object) => {
    navigator.clipboard.writeText(JSON.stringify(content, null, 2));
    toast({ title: "Copied to clipboard" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {/* HTTP Details */}
        {(httpMethod || endpoint) && (
          <div className="p-3 bg-muted/50 rounded-lg space-y-2">
            {httpMethod && endpoint && (
              <div className="flex items-center gap-2">
                <Badge
                  className={cn(
                    httpMethod === "GET" && "bg-info text-info-foreground",
                    httpMethod === "POST" && "bg-success text-success-foreground",
                    httpMethod === "PATCH" && "bg-warning text-warning-foreground"
                  )}
                >
                  {httpMethod}
                </Badge>
                <code className="text-xs font-mono flex-1 truncate">{endpoint}</code>
              </div>
            )}
            {headers && Object.keys(headers).length > 0 && (
              <div className="text-xs font-mono space-y-1">
                {Object.entries(headers).map(([key, value]) => (
                  <p key={key} className="text-muted-foreground">
                    {key}: <span className="text-foreground">{value}</span>
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        <Tabs defaultValue="request" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="request" disabled={!requestPayload}>
              Request Payload
            </TabsTrigger>
            <TabsTrigger value="response" disabled={!responsePayload}>
              Response Payload
            </TabsTrigger>
            <TabsTrigger value="validation" className="flex items-center gap-1">
              Validation
              {errorCount > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 justify-center">
                  {errorCount}
                </Badge>
              )}
              {warningCount > 0 && errorCount === 0 && (
                <Badge className="ml-1 h-5 w-5 p-0 justify-center bg-warning text-warning-foreground">
                  {warningCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="request" className="flex-1 overflow-hidden mt-4">
            {requestPayload && (
              <div className="h-full flex flex-col">
                <div className="flex justify-end mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(requestPayload)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <ScrollArea className="flex-1 border border-border rounded-lg bg-muted/30">
                  <pre className="p-4 text-xs font-mono">
                    {JSON.stringify(requestPayload, null, 2)}
                  </pre>
                </ScrollArea>
              </div>
            )}
          </TabsContent>

          <TabsContent value="response" className="flex-1 overflow-hidden mt-4">
            {responsePayload && (
              <div className="h-full flex flex-col">
                <div className="flex justify-end mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(responsePayload)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <ScrollArea className="flex-1 border border-border rounded-lg bg-muted/30">
                  <pre className="p-4 text-xs font-mono">
                    {JSON.stringify(responsePayload, null, 2)}
                  </pre>
                </ScrollArea>
              </div>
            )}
          </TabsContent>

          <TabsContent value="validation" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-full">
              {validationIssues.length === 0 ? (
                <Alert className="bg-success/10 border-success/30">
                  <Check className="h-4 w-4 text-success" />
                  <AlertDescription>No validation issues found.</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2">
                  {validationIssues.map((issue, index) => (
                    <Alert
                      key={index}
                      className={cn(
                        issue.severity === "error" && "bg-destructive/10 border-destructive/30",
                        issue.severity === "warning" && "bg-warning/10 border-warning/30",
                        issue.severity === "information" && "bg-info/10 border-info/30"
                      )}
                    >
                      {issue.severity === "error" && <AlertCircle className="h-4 w-4 text-destructive" />}
                      {issue.severity === "warning" && <AlertTriangle className="h-4 w-4 text-warning" />}
                      <AlertDescription>
                        <p className="font-medium">{issue.message}</p>
                        {issue.location && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Location: {issue.location}
                          </p>
                        )}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {onContinue && (
            <Button onClick={onContinue} disabled={!canContinue || errorCount > 0}>
              {continueLabel}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
