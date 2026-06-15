'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Bell, CheckCheck, Users, CheckCircle2, XCircle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import api from '@/lib/api';
import { teamsService } from '@/lib/services/teams.service';
import { ApiResponse, Notification } from '@/types';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
  const t = useTranslations('notifications');
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: notifications, isLoading: loadingNotifs } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Notification[]>>('/notifications');
      return res.data.data;
    },
  });

  const { data: invitations, isLoading: loadingInvites } = useQuery({
    queryKey: ['my-invitations'],
    queryFn: teamsService.getMyInvitations,
  });

  const markAllMutation = useMutation({
    mutationFn: async () => api.patch('/notifications/read-all'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-count'] });
    },
  });

  const markOneMutation = useMutation({
    mutationFn: async (id: string) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-count'] });
    },
  });

  const acceptMutation = useMutation({
    mutationFn: (token: string) => teamsService.acceptInvitation(token),
    onSuccess: (data: any) => {
      toast.success('You joined the team!');
      queryClient.invalidateQueries({ queryKey: ['my-invitations'] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      router.push(`/teams/${data.teamId}`);
    },
    onError: (err: any) => toast.error(err.response?.data?.message ?? 'Failed to accept'),
  });

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;
  const pendingInvitations = invitations?.filter((i) => i.status === 'PENDING') ?? [];

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

        {/* Pending Invitations */}
        {pendingInvitations.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Users size={13} /> Pending Invitations ({pendingInvitations.length})
            </p>
            <div className="space-y-2">
              {pendingInvitations.map((inv) => (
                <Card key={inv.id} className="border border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 shadow-none">
                  <CardContent className="p-4 flex items-center gap-4">
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarImage src={inv.sender.avatar} />
                      <AvatarFallback className="text-xs bg-slate-200 dark:bg-slate-700">
                        {inv.sender.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        <span className="text-slate-600 dark:text-slate-300">{inv.sender.name}</span> invited you to join
                        <span className="font-semibold"> {inv.team.name}</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Role: <span className="font-medium">{inv.role}</span> · Expires {new Date(inv.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        className="gap-1.5 h-8"
                        onClick={() => acceptMutation.mutate(inv.token)}
                        disabled={acceptMutation.isPending}
                      >
                        <CheckCircle2 size={13} /> Accept
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 gap-1.5 text-slate-500">
                        <XCircle size={13} /> Decline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Notifications */}
        <div>
          {pendingInvitations.length > 0 && (
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
              Activity
            </p>
          )}

          {loadingNotifs ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
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
                    'border shadow-none transition-colors',
                    n.read
                      ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 cursor-pointer hover:border-slate-300'
                  )}
                  onClick={() => !n.read && markOneMutation.mutate(n.id)}
                >
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className={cn(
                      'mt-1.5 h-2 w-2 rounded-full shrink-0',
                      n.read ? 'bg-slate-200 dark:bg-slate-700' : 'bg-blue-500'
                    )} />
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
      </div>
    </AppLayout>
  );
}
