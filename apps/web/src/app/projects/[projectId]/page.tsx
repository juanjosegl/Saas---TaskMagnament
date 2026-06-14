'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus, ArrowLeft, CheckSquare } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { projectsService } from '@/lib/services/projects.service';
import { tasksService } from '@/lib/services/tasks.service';
import { TaskStatus, TaskPriority } from '@/types';

const STATUSES: TaskStatus[] = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

export default function ProjectBoardPage() {
  const t = useTranslations('tasks');
  const ts = useTranslations('status');
  const tp = useTranslations('priority');
  const tc = useTranslations('common');
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: project, isLoading: loadingProject } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsService.getOne(projectId),
  });

  const { data: tasks, isLoading: loadingTasks } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => tasksService.getByProject(projectId),
  });

  const form = useForm<{ title: string; description?: string; priority: TaskPriority }>();

  const createMutation = useMutation({
    mutationFn: (data: any) => tasksService.create(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      toast.success('Task created');
      form.reset();
      setOpen(false);
    },
    onError: () => toast.error('Failed to create task'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      tasksService.update(taskId, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', projectId] }),
  });

  const tasksByStatus = (status: TaskStatus) => tasks?.filter((t) => t.status === status) ?? [];

  const STATUS_COLORS: Record<TaskStatus, string> = {
    BACKLOG:     'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800',
    TODO:        'bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/50',
    IN_PROGRESS: 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/50',
    IN_REVIEW:   'bg-purple-50/50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/50',
    DONE:        'bg-green-50/50 dark:bg-green-950/20 border-green-100 dark:border-green-900/50',
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-full">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white mb-5 transition-colors"
        >
          <ArrowLeft size={15} /> {tc('back')}
        </button>

        <PageHeader
          title={loadingProject ? '...' : project?.name ?? ''}
          description={project?.description}
          action={
            <Button size="sm" onClick={() => setOpen(true)} className="gap-1.5">
              <Plus size={14} /> {t('newTask')}
            </Button>
          }
        />

        {/* Kanban board */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUSES.map((status) => (
            <div key={status} className="shrink-0 w-72">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <StatusBadge value={status} label={ts(status as any)} />
                  <span className="text-xs text-slate-400">{tasksByStatus(status).length}</span>
                </div>
              </div>

              <div className={`rounded-lg border p-2 space-y-2 min-h-[200px] ${STATUS_COLORS[status]}`}>
                {loadingTasks ? (
                  <Skeleton className="h-20 w-full" />
                ) : tasksByStatus(status).length === 0 ? (
                  <div className="flex items-center justify-center h-20">
                    <p className="text-xs text-slate-300 dark:text-slate-600">No tasks</p>
                  </div>
                ) : (
                  tasksByStatus(status).map((task) => (
                    <Card key={task.id} className="border border-slate-200 dark:border-slate-700 shadow-none bg-white dark:bg-slate-900">
                      <CardContent className="p-3">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2 leading-snug">{task.title}</p>
                        <div className="flex items-center justify-between">
                          <StatusBadge value={task.priority} type="priority" label={tp(task.priority as any)} />
                          {task.assignee && (
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-[10px] bg-slate-200 dark:bg-slate-700">
                                {task.assignee.name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                        {/* Move to next status */}
                        {status !== 'DONE' && (
                          <button
                            onClick={() => {
                              const next = STATUSES[STATUSES.indexOf(status) + 1];
                              updateMutation.mutate({ taskId: task.id, status: next });
                            }}
                            className="mt-2 w-full text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-left transition-colors"
                          >
                            Move to {ts(STATUSES[STATUSES.indexOf(status) + 1] as any)} →
                          </button>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">{t('createTask')}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label className="text-sm">{t('taskTitle')}</Label>
                <Input placeholder={t('taskTitlePlaceholder')} {...form.register('title', { required: true })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">{t('description')} <span className="text-slate-400">({tc('optional')})</span></Label>
                <Input placeholder={t('descriptionPlaceholder')} {...form.register('description')} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">{t('priority')}</Label>
                <select
                  {...form.register('priority')}
                  defaultValue="MEDIUM"
                  className="w-full h-9 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>{tc('cancel')}</Button>
                <Button type="submit" size="sm" disabled={createMutation.isPending}>{t('createTask')}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
