"use client";

import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_LABELS, STATUS_ORDER, type TaskStatus } from "@/types/task_types"; 

interface DashboardFiltersProps {
  query: string;
  setQuery: (q: string) => void;
  statusFilter: TaskStatus | "all";
  setStatusFilter: (s: TaskStatus | "all") => void;
  onNewTask: () => void;
}

export function DashboardFilters({
  query,
  setQuery,
  statusFilter,
  setStatusFilter,
  onNewTask,
}: DashboardFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          placeholder="Buscar por título ou descrição..."
          className="pl-9"
        />
      </div>
      <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as TaskStatus | "all")}>
        <SelectTrigger className="w-full sm:w-52">
          <SelectValue placeholder="Todos os status">
            {statusFilter === "all" ? "Todos os status" : STATUS_LABELS[statusFilter as TaskStatus]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          {STATUS_ORDER.map((s: TaskStatus) => (
            <SelectItem key={s} value={s}>
              {STATUS_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button className='cursor-pointer' onClick={onNewTask}>
        <Plus className="h-4 w-4" />
        Nova tarefa
      </Button>
    </div>
  );
}