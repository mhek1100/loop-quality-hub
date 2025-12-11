import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Send, Shield } from "lucide-react";
import { AttestationType } from "@/lib/types";
import { useUser } from "@/contexts/UserContext";

interface SubmissionAttestationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attestationType: AttestationType;
  onConfirm: () => void;
  isLoading?: boolean;
  facilityName: string;
  quarter: string;
}

const ATTESTATION_CONFIG: Record<
  AttestationType,
  { title: string; extraMessage?: string; labelSuffix: string }
> = {
  submission: {
    title: "Submission Confirmation",
    labelSuffix: "",
  },
  resubmission: {
    title: "Re-submit Confirmation",
    extraMessage:
      "This will result in a new version of the QI data submission, with an updated date.",
    labelSuffix: "",
  },
  "updated-after-due": {
    title: "Submitted - Updated after Due Date",
    extraMessage:
      "This will result in a new version of the QI data submission, with the label 'Submitted - Updated after Due Date'.",
    labelSuffix: " - Updated after Due Date",
  },
  "late-submission": {
    title: "Late Submission",
    extraMessage:
      "This will result in QI data submission, with the label, 'Late Submission'.",
    labelSuffix: " - Late",
  },
};

const ATTESTATION_BULLETS = [
  "Confirm that you have collected, and are reporting, the quality indicator data in accordance with National Aged Care Mandatory Quality Indicator Program Manual 3.0 and all applicable laws, in accordance with the Aged Care Act 1997, Records Principles 2014 and Accountability Principles 2014.",
  "Confirm that any information you have provided does not contain any personal information as defined under Privacy Act 1988.",
];

export function SubmissionAttestationDialog({
  open,
  onOpenChange,
  attestationType,
  onConfirm,
  isLoading,
  facilityName,
  quarter,
}: SubmissionAttestationDialogProps) {
  const [confirmed, setConfirmed] = useState(false);
  const { currentUser, getGpmsHeaders, isAuthorizedSubmitter } = useUser();
  
  const config = ATTESTATION_CONFIG[attestationType];
  const headers = getGpmsHeaders();

  const handleConfirm = () => {
    if (confirmed) {
      onConfirm();
      setConfirmed(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setConfirmed(false);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {config.title}
          </DialogTitle>
          <DialogDescription>
            {facilityName} • {quarter}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!isAuthorizedSubmitter && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                A valid authorised GPMS user (with X-User-Email or X-Federated-Id) must
                be selected to perform a formal submission.
              </AlertDescription>
            </Alert>
          )}

          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <p className="text-sm font-medium">By submitting Quality Indicators data you:</p>
            <ul className="space-y-3">
              {ATTESTATION_BULLETS.map((bullet, index) => (
                <li key={index} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            {config.extraMessage && (
              <p className="text-sm text-muted-foreground italic pt-2 border-t border-border">
                {config.extraMessage}
              </p>
            )}
          </div>

          <div className="p-3 bg-muted/30 rounded-lg space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Submitted by (GPMS Headers):
            </p>
            <div className="font-mono text-xs space-y-1">
              {headers["X-User-Email"] && (
                <p>
                  X-User-Email: <Badge variant="secondary">{headers["X-User-Email"]}</Badge>
                </p>
              )}
              {headers["X-Federated-Id"] && (
                <p>
                  X-Federated-Id: <Badge variant="secondary">{headers["X-Federated-Id"]}</Badge>
                </p>
              )}
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
            <Checkbox
              checked={confirmed}
              onCheckedChange={(checked) => setConfirmed(checked === true)}
              disabled={!isAuthorizedSubmitter}
            />
            <span className="text-sm font-medium">I confirm the above statements.</span>
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!confirmed || !isAuthorizedSubmitter || isLoading}
          >
            {isLoading ? (
              "Submitting..."
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit to Government
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
