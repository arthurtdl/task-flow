"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Paperclip, X, File as FileIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { TaskStatus, TaskWithExtras } from "@/types/task_types";
import { STATUS_LABELS, STATUS_ORDER } from "@/types/task_types";
import { useAuth } from "@/hooks/auth-context";
import { useCreateTask, useUpdateTask } from "@/hooks/use_tasks";
import {
  useCreateAttachment,
  useDeleteAttachment,
} from "@/hooks/use_attachment";
import { attachmentService } from "@/services/attachment_service";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: TaskWithExtras | null;
}

export function TaskFormDialog({ open, onOpenChange, task }: Props) {
  const { currentUser } = useAuth();

  const { mutateAsync: createTask, isPending: isCreating } = useCreateTask();
  const { mutateAsync: updateTask, isPending: isUpdating } = useUpdateTask();
  const { mutateAsync: createAttachment, isPending: isAttaching } =
    useCreateAttachment();
  const { mutateAsync: deleteAttachment } = useDeleteAttachment();

  const isLoading = isCreating || isUpdating || isAttaching;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState<TaskStatus>("BACKLOG");

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState(
    task?.attachments || [],
  );

  useEffect(() => {
    if (task && open) {
      setTitle(task.title);
      setDescription(task.description || "");
      setDeadline(
        task.deadline
          ? new Date(task.deadline).toISOString().split("T")[0]
          : "",
      );
      setStatus(task.status);
      setExistingAttachments(task.attachments || []);
    } else if (open) {
      setTitle("");
      setDescription("");
      setDeadline("");
      setStatus("BACKLOG");
      setExistingAttachments([]);
    }
    setNewFiles([]);
  }, [task, open]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleRemoveNewFile = (indexToRemove: number) => {
    setNewFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleRemoveExistingAttachment = async (attachmentId: string) => {
    try {
      const attachmentToRemove = existingAttachments.find((a) => a.id === attachmentId);
      if (attachmentToRemove?.fileUrl) {
        await attachmentService.deleteFromSupabase(attachmentToRemove.fileUrl);
      }
      await deleteAttachment(attachmentId);
      
      setExistingAttachments((prev) =>
        prev.filter((a) => a.id !== attachmentId),
      );
      toast.success("Anexo removido");
    } catch {
      toast.error("Erro ao remover anexo");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      let currentTaskId = task?.id;

      if (task) {
        await updateTask({
          id: task.id,
          data: {
            title,
            description,
            status,
            deadline: deadline ? new Date(deadline).toISOString() : undefined,
          },
        });
        toast.success("Tarefa atualizada com sucesso!");
      } else {
        const newTask = await createTask({
          title,
          description,
          status,
          deadline: deadline ? new Date(deadline).toISOString() : undefined,
          userId: currentUser.id,
        });
        currentTaskId = newTask.id;
        toast.success("Tarefa criada com sucesso!");
      }

      if (newFiles.length > 0 && currentTaskId) {
        toast.info("Enviando anexos...");
        for (const file of newFiles) {
          try {
            const uploadedData = await attachmentService.uploadToSupabase(file);

            await createAttachment({
              taskId: currentTaskId,
              fileUrl: uploadedData.fileUrl,
              fileName: uploadedData.fileName,
              fileType: uploadedData.fileType,
            });
          } catch (uploadError) {
            console.error(`Erro ao subir o arquivo ${file.name}:`, uploadError);
            toast.error(`Falha ao salvar o anexo: ${file.name}`);
          }
        }
        toast.success("Anexos salvos com sucesso!");
      }

      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar a tarefa ou anexos.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{task ? "Editar Tarefa" : "Nova Tarefa"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Finalizar relatório mensal"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes da tarefa..."
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={STATUS_LABELS[status]}
                onValueChange={(v) => setStatus(v as TaskStatus)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione..." />
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

            <div className="space-y-2">
              <Label htmlFor="deadline">Prazo (Opcional)</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t">
            <Label>Anexos</Label>

            {existingAttachments.length > 0 && (
              <div className="flex flex-col gap-2">
                {existingAttachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-2 border rounded-md bg-muted/30 text-sm"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Paperclip className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate max-w-50">{att.fileName}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive"
                      onClick={() => handleRemoveExistingAttachment(att.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {newFiles.length > 0 && (
              <div className="flex flex-col gap-2">
                {newFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 border border-primary/20 rounded-md bg-primary/5 text-sm"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileIcon className="h-4 w-4 shrink-0 text-primary" />
                      <span className="truncate max-w-50 font-medium">
                        {file.name}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleRemoveNewFile(idx)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="relative">
              <Input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2 pointer-events-none"
              >
                <Paperclip className="h-4 w-4" />
                Adicionar Arquivos
              </Button>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !title.trim()}>
              {isLoading ? "Salvando..." : "Salvar Tarefa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}