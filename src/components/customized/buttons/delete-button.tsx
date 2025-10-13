import * as React from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

import { useQueryClient } from "@tanstack/react-query";

type DeleteButtonProps = {
  title: string;
  description: React.ReactNode;
  onConfirm: () => Promise<void> | void;
  children?: React.ReactNode;
  disabled?: boolean;
  /**
   * Optional array of react-query keys to invalidate/refetch after delete.
   * Each key can be a string, number, or an array (as accepted by react-query).
   */
  refetchQueryKeys?: Array<string | number>;
};

export default function DeleteButton({
  title,
  description,
  onConfirm,
  children,
  disabled,
  refetchQueryKeys,
}: DeleteButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleConfirm = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await onConfirm();
  
      // Invalidate and refetch queries if refetchQueryKeys is provided
      if (Array.isArray(refetchQueryKeys)) {
        await queryClient.invalidateQueries({
          queryKey: refetchQueryKeys
        });
      }

      setOpen(false);
    } catch (err: any) {
      setError(
        err?.message
          ? err.message
          : "An error occurred while deleting. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="text-destructive"
        size={'sm'}
        onClick={() => setOpen(true)}
        disabled={disabled || isDeleting}
        aria-label="Delete"
      >
        {children ? children : <Trash2 className="size-4" />}
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>
              {description}
              {error && (
                <div className="mt-2 text-sm text-destructive font-medium">
                  {error}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} onClick={() => setOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <Button
              variant={'destructive'}
              onClick={handleConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}