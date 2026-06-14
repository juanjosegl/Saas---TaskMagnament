import api from '../api';
import { Comment, ApiResponse } from '@/types';

export const commentsService = {
  async getByTask(taskId: string) {
    const res = await api.get<ApiResponse<Comment[]>>(`/tasks/${taskId}/comments`);
    return res.data.data;
  },
  async create(taskId: string, content: string) {
    const res = await api.post<ApiResponse<Comment>>(`/tasks/${taskId}/comments`, { content });
    return res.data.data;
  },
  async delete(commentId: string) {
    await api.delete(`/comments/${commentId}`);
  },
};
