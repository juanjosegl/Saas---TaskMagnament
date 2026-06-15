import api from '../api';
import { Team, ApiResponse } from '@/types';

export interface Invitation {
  id: string;
  token: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
  team: { id: string; name: string; description?: string };
  sender: { id: string; name: string; avatar?: string };
}

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
  async getMyInvitations() {
    const res = await api.get<ApiResponse<Invitation[]>>('/teams/my-invitations');
    return res.data.data;
  },
  async acceptInvitation(token: string) {
    const res = await api.post(`/teams/invitations/${token}/accept`);
    return res.data.data;
  },
};
