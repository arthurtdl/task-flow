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