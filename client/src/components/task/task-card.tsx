"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  CalendarIcon,
  Check,
  Paperclip,
  Pencil,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";
import { cn } from "@/lib/utils";
import type { Task, TaskWithExtras } from "@/types/task_types";
import { useUpdateTask, useDeleteTask } from "@/hooks/use_tasks";

interface Props {
  task: TaskWithExtras;
  showAuthor: boolean;
  onEdit: (task: Task) => void;
  onOpen: (task: Task) => void;
}

export function TaskCard({ task, showAuthor, onEdit, onOpen }: Props) {
  const { mutateAsync: updateTask, isPending: isUpdating } = useUpdateTask();
  const { mutateAsync: deleteTask, isPending: isDeleting } = useDeleteTask();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const safeAttachments = task.attachments || [];
  const isDone = task.status === "COMPLETED";

  const overdue =
    task.deadline &&
    !isDone &&
    new Date(task.deadline).getTime() < Date.now() - 24 * 60 * 60 * 1000;

  const handleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateTask({
        id: task.id,
        data: { status: isDone ? "PENDING" : "COMPLETED" },
      });
      toast.success(isDone ? "Tarefa reaberta" : "Tarefa concluída");
    } catch {
      toast.error("Erro ao atualizar tarefa");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      toast.success("Tarefa removida");
      setShowDeleteDialog(false);
    } catch {
      toast.error("Erro ao remover tarefa");
    }
  };

  return (
    <>
      <Card
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("text/task-id", task.id);
          e.dataTransfer.effectAllowed = "move";
        }}
        onClick={() => onOpen(task as Task)}
        className={cn(
          "group p-3 gap-2 hover:shadow-md hover:border-primary/40 transition-all cursor-pointer active:cursor-grabbing border-l-4 border-l-primary/60",
          (isUpdating || isDeleting) && "opacity-50 pointer-events-none",
        )}
      >
        <div className="flex items-start gap-2">
          <button
            type="button"
            onClick={handleComplete}
            className={cn(
              "mt-0.5 h-5 w-5 shrink-0 rounded-full border grid place-items-center transition-colors",
              isDone
                ? "bg-primary border-primary text-primary-foreground"
                : "border-input hover:border-primary",
            )}
            aria-label="Concluir tarefa"
          >
            {isDone && <Check className="h-3 w-3" />}
          </button>
          <h3
            className={cn(
              "flex-1 text-sm font-medium leading-snug",
              isDone && "line-through text-muted-foreground",
            )}
          >
            {task.title}
          </h3>
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task as Task);
              }}
              aria-label="Editar"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteDialog(true);
              }}
              aria-label="Deletar"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-3">
          {task.deadline && (
            <span
              className={cn(
                "inline-flex items-center gap-1",
                overdue && "text-destructive font-medium",
              )}
            >
              <CalendarIcon className="h-3 w-3" />
              {format(new Date(task.deadline), "dd/MM")}
            </span>
          )}
          {safeAttachments.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <Paperclip className="h-3 w-3" />
              {safeAttachments.length}
            </span>
          )}
          {showAuthor && task.authorName && (
            <Badge variant="secondary" className="ml-auto gap-1 font-normal">
              <UserIcon className="h-3 w-3" />
              {task.authorName}
            </Badge>
          )}
        </div>
      </Card>

      <ConfirmDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        taskTitle={task.title}
      />
    </>
  );
}