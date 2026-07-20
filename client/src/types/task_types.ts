export type TaskStatus = 'BACKLOG' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline?: string; 
  status: TaskStatus;
  isPriority: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTask {
  title: string;
  description?: string;
  deadline?: string;
  status?: TaskStatus;
  isPriority?: boolean;
  userId: string;
}

export type UpdateTask = Partial<CreateTask>;

export const STATUS_ORDER: TaskStatus[] = [
  'BACKLOG',
  'PENDING',
  'IN_PROGRESS',
  'COMPLETED'
];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  BACKLOG: 'Backlog',
  PENDING: 'Pendente',
  IN_PROGRESS: 'Em Andamento',
  COMPLETED: 'Concluído',
};

export interface TaskAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  createdAt?: string;
  taskId?: string;
}

export interface TaskWithExtras extends Task {
  attachments?: TaskAttachment[];
  user?: {
    name: string;
  }; 
}