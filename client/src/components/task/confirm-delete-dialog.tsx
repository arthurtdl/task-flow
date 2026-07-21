"use client";

import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
  taskTitle?: string;
}

export function ConfirmDeleteDialog({ open, onOpenChange, onConfirm, isDeleting, taskTitle }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Remover Tarefa
          </DialogTitle>
          <DialogDescription className="pt-3 text-base">
            Tem certeza que deseja deletar a tarefa <strong>{`"${taskTitle}"`}</strong>?
            <br /><br />
            Esta ação não pode ser desfeita e a tarefa será removida permanentemente.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Removendo..." : "Sim, deletar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}