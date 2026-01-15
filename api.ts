
import { Task, ApiResponse, FetchTasksParams } from './types';

// In a real local dev environment, this would likely be http://localhost:5000
const BASE_URL = '/api/tasks';

export const api = {
  async getTasks(params: FetchTasksParams): Promise<ApiResponse<Task[]>> {
    const query = new URLSearchParams(params as any).toString();
    const response = await fetch(`${BASE_URL}${query ? `?${query}` : ''}`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },

  async createTask(task: Partial<Task>): Promise<ApiResponse<Task>> {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create task');
    }
    return response.json();
  },

  async updateTask(id: string, task: Partial<Task>): Promise<ApiResponse<Task>> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update task');
    }
    return response.json();
  },

  async deleteTask(id: string): Promise<ApiResponse<null>> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete task');
    return response.json();
  },
};
