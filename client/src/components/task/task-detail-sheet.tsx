"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  CalendarIcon,
  Download,
  Paperclip,
  Pencil,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  STATUS_LABELS,
  STATUS_ORDER,
  type Task,
  type TaskStatus,
} from "@/types/task_types";
import type { TaskAttachment, TaskWithExtras } from "@/types/task_types";
import { useTask, useUpdateTask, useDeleteTask } from "@/hooks/use_tasks";
import { useDeleteAttachment } from "@/hooks/use_attachment";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";
import { fixDateOffset } from "@/lib/fixDataOffset";

interface Props {
  taskId: string | null;
  onOpenChange: (open: boolean) => void;
  onEdit: (task: Task) => void;
  showAuthor: boolean;
}

export function TaskDetailSheet({
  taskId,
  onOpenChange,
  onEdit,
  showAuthor,
}: Props) {
  const open = !!taskId;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data, isLoading } = useTask(taskId || undefined);
  const task = data as TaskWithExtras | undefined;

  const { mutateAsync: updateTask } = useUpdateTask();
  const { mutateAsync: deleteTask, isPending: isDeleting } = useDeleteTask();
  const { mutateAsync: deleteAttachment } = useDeleteAttachment();

  const safeAttachments = task?.attachments || [];

  const handleDeleteTask = async () => {
    if (!task) return;
    try {
      await deleteTask(task.id);
      toast.success("Tarefa removida");
      setShowDeleteDialog(false);
      onOpenChange(false);
    } catch {
      toast.error("Erro ao remover tarefa");
    }
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (!task) return;
    try {
      await updateTask({ id: task.id, data: { status: newStatus } });
      toast.success("Status atualizado");
    } catch {
      toast.error("Erro ao atualizar status");
    }
  };

  const handleRemoveAttachment = async (attachmentId: string) => {
    try {
      await deleteAttachment(attachmentId);
      toast.success("Anexo removido");
    } catch {
      toast.error("Erro ao remover anexo");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto p-6">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Carregando detalhes...
          </div>
        ) : !task ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Tarefa não encontrada.
          </div>
        ) : (
          <>
            <SheetHeader className="p-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="font-mono text-[10px]">
                  {task.id.split("-")[0]}
                </Badge>
                {showAuthor && task.user?.name && (
                  <Badge variant="secondary" className="gap-1 font-normal">
                    <UserIcon className="h-3 w-3" />
                    {task.user?.name}
                  </Badge>
                )}
              </div>
              <SheetTitle className="text-xl leading-tight">
                {task.title}
              </SheetTitle>
              {task.description && (
                <SheetDescription className="whitespace-pre-wrap mt-2">
                  {task.description}
                </SheetDescription>
              )}
            </SheetHeader>

            <div className="mt-6 space-y-5">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <Select
                    value={task.status}
                    onValueChange={(v) => handleStatusChange(v as TaskStatus)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Status">
                        {STATUS_LABELS[task.status as TaskStatus]}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_ORDER.map((s) => (
                        <SelectItem key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Prazo</p>
                  <div className="h-8 flex items-center gap-1 text-sm">
                    <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    {task.deadline
                      ? format(fixDateOffset(task.deadline), "dd/MM/yyyy")
                      : "—"}
                  </div>
                </div>
              </div>

              {safeAttachments.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Paperclip className="h-3 w-3" />
                    Anexos ({safeAttachments.length})
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {safeAttachments.map((att: TaskAttachment) => (
                      <div
                        key={att.id}
                        className="group relative rounded-md overflow-hidden border aspect-video bg-muted/30"
                      >
                        {att.fileType?.startsWith("image/") ? (
                          <img
                            src={att.fileUrl}
                            alt={att.fileName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex flex-col items-center justify-center gap-1 p-2">
                            <Paperclip className="h-5 w-5 text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                              {att.fileName}
                            </span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-7 w-7"
                            onClick={() => window.open(att.fileUrl, "_blank")}
                          >
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-7 w-7"
                            onClick={() => handleRemoveAttachment(att.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                Criada em{" "}
                {format(new Date(task.createdAt), "dd/MM/yyyy 'às' HH:mm")}
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button className="flex-1" onClick={() => onEdit(task as Task)}>
                  <Pencil className="h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Remover
                </Button>
              </div>
            </div>

            <ConfirmDeleteDialog
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
              onConfirm={handleDeleteTask}
              isDeleting={isDeleting}
              taskTitle={task.title}
            />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}