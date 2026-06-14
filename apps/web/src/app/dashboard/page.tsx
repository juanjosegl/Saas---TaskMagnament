'use client';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/lib/services/dashboard.service';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuthStore } from '@/store/auth.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Clock, AlertTriangle, Users } from 'lucide-react';

const statusColors: Record<string, string> = {
  BACKLOG: 'secondary',
  TODO: 'secondary',
  IN_PROGRESS: 'default',
  IN_REVIEW: 'default',
  DONE: 'default',
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard', 'me'],
    queryFn: dashboardService.getMyStats,
  });

  return (
    <AppLayout>
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-slate-500 mt-1">Here&apos;s what&apos;s happening with your projects.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}><CardContent className="p-6"><Skeleton className="h-16 w-full" /></CardContent></Card>
            ))
          ) : (
            <>
              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg"><CheckCircle2 className="text-blue-600" size={24} /></div>
                  <div>
                    <p className="text-sm text-slate-500">Completed this week</p>
                    <p className="text-2xl font-bold text-slate-900">{stats?.completedThisWeek ?? 0}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-amber-100 rounded-lg"><Clock className="text-amber-600" size={24} /></div>
                  <div>
                    <p className="text-sm text-slate-500">In progress</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {stats?.tasksByStatus.find((t) => t.status === 'IN_PROGRESS')?.count ?? 0}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-lg"><AlertTriangle className="text-red-600" size={24} /></div>
                  <div>
                    <p className="text-sm text-slate-500">Overdue</p>
                    <p className="text-2xl font-bold text-slate-900">{stats?.overdueTasksCount ?? 0}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg"><Users className="text-green-600" size={24} /></div>
                  <div>
                    <p className="text-sm text-slate-500">Teams</p>
                    <p className="text-2xl font-bold text-slate-900">{stats?.teamsCount ?? 0}</p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Tasks by Status</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? <Skeleton className="h-32 w-full" /> : stats?.tasksByStatus.map(({ status, count }) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{status.replace('_', ' ')}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-700 rounded-full"
                        style={{ width: `${Math.min((count / Math.max(...(stats?.tasksByStatus.map(t => t.count) ?? [1]))) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Recent Tasks</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? <Skeleton className="h-32 w-full" /> : stats?.recentActivity.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No tasks yet</p>
              ) : stats?.recentActivity.map((task) => (
                <div key={task.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">{task.title}</p>
                    <p className="text-xs text-slate-500">{task.priority}</p>
                  </div>
                  <Badge variant={statusColors[task.status] as 'default' | 'secondary'}>
                    {task.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
