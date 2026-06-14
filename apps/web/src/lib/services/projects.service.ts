import api from '../api';
import { Project, ApiResponse } from '@/types';

export const projectsService = {
  async create(teamId: string, data: { name: string; description?: string }) {
    const res = await api.post<ApiResponse<Project>>(`/teams/${teamId}/projects`, data);
    return res.data.data;
  },
  async getByTeam(teamId: string) {
    const res = await api.get<ApiResponse<Project[]>>(`/teams/${teamId}/projects`);
    return res.data.data;
  },
  async getOne(projectId: string) {
    const res = await api.get<ApiResponse<Project>>(`/projects/${projectId}`);
    return res.data.data;
  },
  async update(projectId: string, data: Partial<Project>) {
    const res = await api.patch<ApiResponse<Project>>(`/projects/${projectId}`, data);
    return res.data.data;
  },
};
