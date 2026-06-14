import api from '../api';
import { User, ApiResponse } from '@/types';

export const authService = {
  async register(data: { name: string; email: string; password: string }) {
    const res = await api.post<ApiResponse<{ user: User; accessToken: string }>>('/auth/register', data);
    return res.data.data;
  },
  async login(data: { email: string; password: string }) {
    const res = await api.post<ApiResponse<{ user: User; accessToken: string }>>('/auth/login', data);
    return res.data.data;
  },
  async logout() {
    await api.post('/auth/logout');
  },
  async me() {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data.data;
  },
};
