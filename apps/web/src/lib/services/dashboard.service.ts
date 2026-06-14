import api from '../api';
import { DashboardStats, ApiResponse } from '@/types';

export const dashboardService = {
  async getMyStats() {
    const res = await api.get<ApiResponse<DashboardStats>>('/dashboard/me');
    return res.data.data;
  },
  async getTeamStats(teamId: string) {
    const res = await api.get(`/dashboard/teams/${teamId}`);
    return res.data.data;
  },
};
