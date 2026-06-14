import api from '../api';
import { Task, ApiResponse } from '@/types';

export const tasksService = {
  async create(projectId: string, data: Partial<Task>) {
    const res = await api.post<ApiResponse<Task>>(`/projects/${projectId}/tasks`, data);
    return res.data.data;
  },
  async getByProject(projectId: string) {
    const res = await api.get<ApiResponse<Task[]>>(`/projects/${projectId}/tasks`);
    return res.data.data;
  },
  async getOne(taskId: string) {
    const res = await api.get<ApiResponse<Task & { comments: any[] }>>(`/tasks/${taskId}`);
    return res.data.data;
  },
  async update(taskId: string, data: Partial<Task>) {
    const res = await api.patch<ApiResponse<Task>>(`/tasks/${taskId}`, data);
    return res.data.data;
  },
  async delete(taskId: string) {
    await api.delete(`/tasks/${taskId}`);
  },
  async getMine() {
    const res = await api.get<ApiResponse<Task[]>>('/tasks/mine');
    return res.data.data;
  },
};
