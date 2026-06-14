'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { CheckSquare, Calendar, MessageSquare } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { tasksService } from '@/lib/services/tasks.service';
import { TaskStatus } from '@/types';
import { toast } from 'sonner';

export default function TasksPage() {
  const t = useTranslations('tasks');
  const ts = useTranslations('status');
  const tp = useTranslations('priority');
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', 'mine'],
    queryFn: tasksService.getMine,
  });

  const updateMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      tasksService.update(taskId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', 'mine'] });
      toast.success('Task updated');
    },
  });

  const STATUSES: TaskStatus[] = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        <PageHeader title={t('title')} />

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border border-slate-200 dark:border-slate-800 shadow-none">
                <CardContent className="p-4"><Skeleton className="h-14 w-full" /></CardContent>
              </Card>
            ))}
          </div>
        ) : !tasks?.length ? (
          <EmptyState
            title={t('noTasks')}
            description={t('noTasksDesc')}
            icon={<CheckSquare size={40} />}
          />
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <Card key={task.id} className="border border-slate-200 dark:border-slate-800 shadow-none hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{task.title}</p>
                      {task.description && (
                        <p className="text-xs text-slate-400 mt-0.5 truncate">{task.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        {task.dueDate && (
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Calendar size={11} />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        {(task._count?.comments ?? 0) > 0 && (
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <MessageSquare size={11} />
                            {task._count?.comments} {t('comments')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge value={task.priority} type="priority" label={tp(task.priority as any)} />
                      <select
                        value={task.status}
                        onChange={(e) => updateMutation.mutate({ taskId: task.id, status: e.target.value as TaskStatus })}
                        className="h-7 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 text-xs text-slate-700 dark:text-slate-300"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{ts(s as any)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
