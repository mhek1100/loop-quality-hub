import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RotateCcw } from "lucide-react";

interface RevertConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  editedCount: number;
}

export function RevertConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  editedCount,
}: RevertConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-warning" />
            Revert All to Pipeline Data
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              This will reset all manually edited values back to the original pipeline data.
            </p>
            {editedCount > 0 && (
              <p className="font-medium text-foreground">
                {editedCount} manually edited {editedCount === 1 ? "value" : "values"} will be reverted.
              </p>
            )}
            <p className="text-sm">
              This action cannot be undone. Make sure you have saved any important changes.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Revert All
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}