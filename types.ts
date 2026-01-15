
export type TaskStatus = 'pending' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface FetchTasksParams {
  q?: string;
  status?: string;
  sort?: string;
}
