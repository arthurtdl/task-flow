"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import type { Task } from "@/types/task_types";
import { useAuth } from "@/hooks/auth-context";
import { useCreateTask, useUpdateTask } from "@/hooks/use_tasks";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
}

export function TaskFormDialog({ open, onOpenChange, task }: Props) {
  const { currentUser } = useAuth();
  const { mutateAsync: createTask, isPending: isCreating } = useCreateTask();
  const { mutateAsync: updateTask, isPending: isUpdating } = useUpdateTask();
  
  const isLoading = isCreating || isUpdating;
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    if (task && open) {
      setTitle(task.title);
      setDescription(task.description || "");
      setDeadline(task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : "");
    } else if (open) {
      setTitle("");
      setDescription("");
      setDeadline("");
    }
  }, [task, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    try {
      if (task) {
        await updateTask({
          id: task.id,
          data: {
            title,
            description,
            deadline: deadline ? new Date(deadline).toISOString() : undefined,
          }
        });
        toast.success("Tarefa atualizada com sucesso!");
      } else {
        await createTask({
          title,
          description,
          deadline: deadline ? new Date(deadline).toISOString() : undefined,
          userId: currentUser.id,
          status: "PENDING",
        });
        toast.success("Tarefa criada com sucesso!");
      }
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar a tarefa.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
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

          <div className="space-y-2">
            <Label htmlFor="deadline">Prazo (Opcional)</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !title.trim()}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}