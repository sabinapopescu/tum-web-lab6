export type TaskType = 'Bug' | 'Feature' | 'DevOps' | 'Research' | 'Design';
export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Todo' | 'In Progress' | 'Done';

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  priority: Priority;
  status: TaskStatus;
  isWatched: boolean;
  createdAt: number; // ms timestamp
  completedAt: number | null; // ms timestamp, set when status → Done
}

export interface FilterState {
  type: TaskType | 'all';
  priority: Priority | 'all';
  status: TaskStatus | 'all' | 'watched';
  search: string;
}

export type Page = 'dashboard' | 'tasks' | 'stats';
