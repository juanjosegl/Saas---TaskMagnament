'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Bell, CheckCheck } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { ApiResponse, Notification } from '@/types';

export default function NotificationsPage() {
  const t = useTranslations('notifications');
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Notification[]>>('/notifications');
      return res.data.data;
    },
  });

  const markAllMutation = useMutation({
    mutationFn: async () => api.patch('/notifications/read-all'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markOneMutation = useMutation({
    mutationFn: async (id: string) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        <PageHeader
          title={t('title')}
          description={unreadCount > 0 ? `${unreadCount} ${t('unread')}` : undefined}
          action={
            unreadCount > 0 ? (
              <Button variant="outline" size="sm" onClick={() => markAllMutation.mutate()} className="gap-1.5">
                <CheckCheck size={14} /> {t('markAllRead')}
              </Button>
            ) : undefined
          }
        />

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border border-slate-200 dark:border-slate-800 shadow-none">
                <CardContent className="p-4"><Skeleton className="h-12 w-full" /></CardContent>
              </Card>
            ))}
          </div>
        ) : !notifications?.length ? (
          <EmptyState
            title={t('noNotifications')}
            description={t('noNotificationsDesc')}
            icon={<Bell size={40} />}
          />
        ) : (
          <div className="space-y-1.5">
            {notifications.map((n) => (
              <Card
                key={n.id}
                className={cn(
                  'border shadow-none transition-colors cursor-pointer',
                  n.read
                    ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950'
                    : 'border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20'
                )}
                onClick={() => !n.read && markOneMutation.mutate(n.id)}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <div className={cn('mt-0.5 h-2 w-2 rounded-full shrink-0', n.read ? 'bg-transparent' : 'bg-blue-500')} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{n.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                    <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </p>
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
