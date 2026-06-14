'use client';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { dashboardService } from '@/lib/services/dashboard.service';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuthStore } from '@/store/auth.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Clock, AlertTriangle, Users } from 'lucide-react';

const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  MEDIUM: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  HIGH: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  URGENT: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const ts = useTranslations('status');
  const { user } = useAuthStore();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard', 'me'],
    queryFn: dashboardService.getMyStats,
  });

  const totalTasks = stats?.tasksByStatus.reduce((sum, t) => sum + t.count, 0) ?? 0;

  const kpis = [
    {
      label: t('completed'), sub: t('thisWeek'),
      value: stats?.completedThisWeek ?? 0,
      icon: CheckCircle2, color: 'bg-slate-100 dark:bg-slate-800', iconColor: 'text-slate-600 dark:text-slate-300',
    },
    {
      label: t('inProgress'), sub: t('activeTasks'),
      value: stats?.tasksByStatus.find((t) => t.status === 'IN_PROGRESS')?.count ?? 0,
      icon: Clock, color: 'bg-blue-50 dark:bg-blue-900/20', iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: t('overdue'), sub: t('needAttention'),
      value: stats?.overdueTasksCount ?? 0,
      icon: AlertTriangle, color: 'bg-red-50 dark:bg-red-900/20', iconColor: 'text-red-500 dark:text-red-400',
    },
    {
      label: t('teams'), sub: t('memberships'),
      value: stats?.teamsCount ?? 0,
      icon: Users, color: 'bg-green-50 dark:bg-green-900/20', iconColor: 'text-green-600 dark:text-green-400',
    },
  ];

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">{t('title')}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('greeting')},{' '}
            <span className="font-medium text-slate-700 dark:text-slate-300">{user?.name}</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="border border-slate-200 dark:border-slate-800 shadow-none">
                  <CardContent className="p-5"><Skeleton className="h-14 w-full" /></CardContent>
                </Card>
              ))
            : kpis.map(({ label, sub, value, icon: Icon, color, iconColor }) => (
                <Card key={label} className="border border-slate-200 dark:border-slate-800 shadow-none bg-white dark:bg-slate-950">
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className={`p-2 rounded-md shrink-0 ${color}`}>
                      <Icon className={iconColor} size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">{label}</p>
                      <p className="text-2xl font-semibold text-slate-900 dark:text-white mt-0.5">{value}</p>
                      <p className="text-xs text-slate-400">{sub}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-slate-200 dark:border-slate-800 shadow-none bg-white dark:bg-slate-950">
            <CardHeader className="pb-2 px-5 pt-5">
              <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('taskDistribution')}</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-3">
              {isLoading ? <Skeleton className="h-32 w-full" /> : totalTasks === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">{t('noTasksAssigned')}</p>
              ) : stats?.tasksByStatus.map(({ status, count }) => {
                const pct = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
                return (
                  <div key={status} className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 dark:text-slate-400 w-24 shrink-0">{ts(status as any)}</span>
                    <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-700 dark:bg-slate-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-slate-400 w-6 text-right">{count}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border border-slate-200 dark:border-slate-800 shadow-none bg-white dark:bg-slate-950">
            <CardHeader className="pb-2 px-5 pt-5">
              <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('recentActivity')}</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              {isLoading ? <Skeleton className="h-32 w-full" /> : !stats?.recentActivity.length ? (
                <p className="text-sm text-slate-400 py-4 text-center">{t('noRecentTasks')}</p>
              ) : (
                <div className="space-y-1">
                  {stats.recentActivity.map((task) => (
                    <div key={task.id} className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <div className="min-w-0 mr-3">
                        <p className="text-sm text-slate-800 dark:text-slate-200 font-medium truncate">{task.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{ts(task.status as any)}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded shrink-0 ${PRIORITY_COLORS[task.priority]}`}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
