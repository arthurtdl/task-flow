"use client";

import { useState } from "react";
import { TaskCard } from "@/components/task/task-card";
import { STATUS_LABELS, type Task, type TaskStatus } from "@/types/task_types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 4;

const COLUMN_STYLES: Record<TaskStatus, { dot: string; ring: string; bg: string }> = {
  BACKLOG: { dot: "bg-muted-foreground/60", ring: "ring-muted-foreground/30", bg: "from-muted-foreground/5" },
  PENDING: { dot: "bg-chart-3", ring: "ring-chart-3/40", bg: "from-chart-3/5" },
  IN_PROGRESS: { dot: "bg-chart-4", ring: "ring-chart-4/40", bg: "from-chart-4/5" },
  COMPLETED: { dot: "bg-chart-2", ring: "ring-chart-2/40", bg: "from-chart-2/5" },
};

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
  onEdit: (t: Task) => void;
  onOpen: (t: Task) => void;
}

export function KanbanColumn({
  status,
  tasks,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onEdit,
  onOpen,
}: KanbanColumnProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const styles = COLUMN_STYLES[status];
  
  const totalPages = Math.max(1, Math.ceil(tasks.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageItems = tasks.slice(start, start + PAGE_SIZE);

  return (
    <section
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, status)}
      className={cn(
        "rounded-lg bg-linear-to-b to-background border p-3 flex flex-col min-h-75 transition-all",
        styles.bg,
        isDragOver && "ring-2 ring-primary/60 border-primary"
      )}
    >
      <header className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", styles.dot)} />
          <h2 className="text-sm font-semibold">{STATUS_LABELS[status]}</h2>
        </div>
        <Badge variant="secondary" className={cn("font-normal ring-1 bg-transparent", styles.ring)}>
          {tasks.length}
        </Badge>
      </header>

      <div className="flex flex-col gap-2 flex-1">
        {tasks.length === 0 ? (
          <div className="flex-1 grid place-items-center text-xs text-muted-foreground border border-dashed rounded-md py-8">
            {isDragOver ? "Solte aqui" : "Nenhuma tarefa"}
          </div>
        ) : (
          pageItems.map((t: Task) => (
            <TaskCard key={t.id} task={t} showAuthor={false} onEdit={onEdit} onOpen={onOpen} />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-3">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e: React.MouseEvent) => { e.preventDefault(); setCurrentPage((p) => Math.max(1, p - 1)); }}
                className={cn("h-8 px-2 text-xs", safePage === 1 && "pointer-events-none opacity-40")}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={safePage === i + 1}
                  onClick={(e: React.MouseEvent) => { e.preventDefault(); setCurrentPage(i + 1); }}
                  className="h-8 w-8 text-xs"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e: React.MouseEvent) => { e.preventDefault(); setCurrentPage((p) => Math.min(totalPages, p + 1)); }}
                className={cn("h-8 px-2 text-xs", safePage === totalPages && "pointer-events-none opacity-40")}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </section>
  );
}