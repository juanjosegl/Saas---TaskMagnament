import api from '../api';
import { Team, ApiResponse } from '@/types';

export const teamsService = {
  async create(data: { name: string; description?: string }) {
    const res = await api.post<ApiResponse<Team>>('/teams', data);
    return res.data.data;
  },
  async getAll() {
    const res = await api.get<ApiResponse<Team[]>>('/teams');
    return res.data.data;
  },
  async getOne(teamId: string) {
    const res = await api.get<ApiResponse<Team>>(`/teams/${teamId}`);
    return res.data.data;
  },
  async invite(teamId: string, data: { email: string; role: string }) {
    const res = await api.post(`/teams/${teamId}/invite`, data);
    return res.data.data;
  },
};
