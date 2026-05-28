export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  subject: string;
  deadline: string;          // ISO date string yyyy-MM-dd
  status: TaskStatus;
  priority: TaskPriority;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  dueToday: number;
}
