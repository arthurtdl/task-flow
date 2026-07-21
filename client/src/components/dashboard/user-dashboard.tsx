"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import type { Task, TaskStatus } from "@/types/task_types";
import { STATUS_ORDER, STATUS_LABELS } from "@/types/task_types";
import { Topbar } from "@/components/layout/topbar";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { KanbanColumn } from "@/components/dashboard/kanban-column";
import { TaskFormDialog } from "@/components/task/task-form-dialog"; 
import { TaskDetailSheet } from "@/components/task/task-detail-sheet";
import { useAuth } from "@/hooks/auth-context";
import { useTasksByUser, useAllTasks, useUpdateTask } from "@/hooks/use_tasks";

interface DashboardProps {
  adminMode?: boolean;
}

export function UserDashboard({ adminMode = false }: DashboardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { currentUser: user, logout, isLoading: isAuthLoading } = useAuth();

  const { data: userTasks = [], isLoading: loadUser } = useTasksByUser(adminMode ? undefined : user?.id);
  const { data: allTasks = [], isLoading: loadAll } = useAllTasks(adminMode);
  
  const tasks = adminMode ? allTasks : userTasks;
  const isLoading = adminMode ? loadAll : loadUser;

  const { mutateAsync: updateTask } = useUpdateTask();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<TaskStatus | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login");
    }
  }, [isAuthLoading, user, router]);

  const visibleTasks = useMemo(() => {
    let list = tasks;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (t: Task) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      list = list.filter((t: Task) => t.status === statusFilter);
    }
    return list;
  }, [tasks, query, statusFilter]);

  const columns = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = { 
      BACKLOG: [], 
      PENDING: [], 
      IN_PROGRESS: [], 
      COMPLETED: [] 
    };
    for (const t of visibleTasks) {
      if (map[t.status]) map[t.status].push(t);
    }
    return map;
  }, [visibleTasks]);

  const handleDrop = async (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDragOver(null);
    const id = e.dataTransfer.getData("text/task-id");
    if (!id || !user?.id) return;
    
    const task = tasks.find((t: Task) => t.id === id);
    if (!task || task.status === status) return;

    const queryKey = adminMode ? ["tasks", "all"] : ["tasks", "user", user.id];
    
    await queryClient.cancelQueries({ queryKey });
    const previousTasks = queryClient.getQueryData(queryKey);
    queryClient.setQueryData(queryKey, (old: Task[] | undefined) => 
      old?.map((t) => (t.id === id ? { ...t, status } : t))
    );

    try {
      await updateTask({ id, data: { status } });
      toast.success(`Movida para ${STATUS_LABELS[status]}`);
    } catch (error) {
      console.error(error);
      queryClient.setQueryData(queryKey, previousTasks);
      toast.error("Erro ao mover a tarefa");
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <p className="text-muted-foreground animate-pulse">Carregando sessão...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Topbar user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <DashboardFilters 
          query={query} 
          setQuery={setQuery} 
          statusFilter={statusFilter} 
          setStatusFilter={setStatusFilter} 
          onNewTask={() => { setEditing(null); setDialogOpen(true); }}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            Carregando o Kanban...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {STATUS_ORDER.map((status: TaskStatus) => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={columns[status]}
                isDragOver={dragOver === status}
                onDragOver={(e: React.DragEvent) => { e.preventDefault(); setDragOver(status); }}
                onDragLeave={() => setDragOver((c: TaskStatus | null) => (c === status ? null : c))}
                onDrop={handleDrop}
                onEdit={(t: Task) => { setEditing(t); setDialogOpen(true); }}
                onOpen={(t: Task) => setOpenTaskId(t.id)}
                showAuthor={adminMode}
              />
            ))}
          </div>
        )}
      </main>

      <TaskFormDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        task={editing} 
      />
      
      <TaskDetailSheet
        taskId={openTaskId}
        onOpenChange={(o: boolean) => !o && setOpenTaskId(null)}
        onEdit={(t: Task) => { setOpenTaskId(null); setEditing(t); setDialogOpen(true); }}
        showAuthor={adminMode}
      />
    </div>
  );
}