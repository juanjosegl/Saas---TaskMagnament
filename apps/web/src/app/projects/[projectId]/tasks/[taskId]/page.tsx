'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ArrowLeft, Calendar, MessageSquare, Send, Trash2, User } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { tasksService } from '@/lib/services/tasks.service';
import { commentsService } from '@/lib/services/comments.service';
import { useAuthStore } from '@/store/auth.store';
import { TaskStatus, TaskPriority } from '@/types';

const STATUSES: TaskStatus[] = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];
const PRIORITIES: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export default function TaskDetailPage() {
  const ts = useTranslations('status');
  const tp = useTranslations('priority');
  const tc = useTranslations('common');
  const { taskId, projectId } = useParams<{ taskId: string; projectId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [comment, setComment] = useState('');

  const { data: task, isLoading } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => tasksService.getOne(taskId),
  });

  const { data: comments, isLoading: loadingComments } = useQuery({
    queryKey: ['comments', taskId],
    queryFn: () => commentsService.getByTask(taskId),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<{ status: TaskStatus; priority: TaskPriority }>) =>
      tasksService.update(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      toast.success('Task updated');
    },
  });

  const commentMutation = useMutation({
    mutationFn: (content: string) => commentsService.create(taskId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      setComment('');
    },
    onError: () => toast.error('Failed to add comment'),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => commentsService.delete(commentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', taskId] }),
  });

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    commentMutation.mutate(comment.trim());
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
          <Skeleton className="h-6 w-32 mb-6" />
          <Skeleton className="h-48 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (!task) return null;

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        <button
          onClick={() => router.push(`/projects/${projectId}`)}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white mb-5 transition-colors"
        >
          <ArrowLeft size={15} /> {tc('back')}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            <Card className="border border-slate-200 dark:border-slate-800 shadow-none">
              <CardContent className="p-6">
                <h1 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {task.title}
                </h1>
                {task.description ? (
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {task.description}
                  </p>
                ) : (
                  <p className="text-sm text-slate-400 italic">No description provided.</p>
                )}
              </CardContent>
            </Card>

            {/* Comments */}
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-3">
                <MessageSquare size={15} />
                Comments ({comments?.length ?? 0})
              </p>

              <Card className="border border-slate-200 dark:border-slate-800 shadow-none">
                <CardContent className="p-4">
                  {/* Comment form */}
                  <form onSubmit={handleComment} className="flex gap-2 mb-4">
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarFallback className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex gap-2">
                      <input
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-slate-400 dark:focus:border-slate-500 transition-colors"
                      />
                      <Button type="submit" size="sm" disabled={!comment.trim() || commentMutation.isPending}>
                        <Send size={14} />
                      </Button>
                    </div>
                  </form>

                  <Separator className="mb-4" />

                  {/* Comments list */}
                  {loadingComments ? (
                    <Skeleton className="h-16 w-full" />
                  ) : !comments?.length ? (
                    <p className="text-sm text-slate-400 text-center py-4">No comments yet. Be the first!</p>
                  ) : (
                    <div className="space-y-4">
                      {comments.map((c) => (
                        <div key={c.id} className="flex gap-2.5">
                          <Avatar className="h-7 w-7 shrink-0">
                            <AvatarFallback className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {c.author.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between gap-2">
                              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                {c.author.name}
                              </span>
                              <span className="text-xs text-slate-400 shrink-0">
                                {new Date(c.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                              {c.content}
                            </p>
                            {c.author.id === user?.id && (
                              <button
                                onClick={() => deleteCommentMutation.mutate(c.id)}
                                className="text-xs text-slate-400 hover:text-red-500 transition-colors mt-1 flex items-center gap-1"
                              >
                                <Trash2 size={11} /> Delete
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="border border-slate-200 dark:border-slate-800 shadow-none">
              <CardContent className="p-4 space-y-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1.5">Status</p>
                  <select
                    value={task.status}
                    onChange={(e) => updateMutation.mutate({ status: e.target.value as TaskStatus })}
                    className="w-full h-8 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 text-sm text-slate-700 dark:text-slate-300"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{ts(s as any)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1.5">Priority</p>
                  <select
                    value={task.priority}
                    onChange={(e) => updateMutation.mutate({ priority: e.target.value as TaskPriority })}
                    className="w-full h-8 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 text-sm text-slate-700 dark:text-slate-300"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>{tp(p as any)}</option>
                    ))}
                  </select>
                </div>

                <Separator />

                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1.5">Assignee</p>
                  {task.assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-slate-100 dark:bg-slate-800">
                          {task.assignee.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-slate-700 dark:text-slate-300">{task.assignee.name}</span>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">Unassigned</p>
                  )}
                </div>

                {task.dueDate && (
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1.5">Due date</p>
                    <span className="flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-300">
                      <Calendar size={13} />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <Separator />

                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1.5">Created by</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-slate-100 dark:bg-slate-800">
                        {task.creator?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{task.creator?.name}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
