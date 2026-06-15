'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FolderKanban, CheckSquare, Bell, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/ui.store';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import { ApiResponse } from '@/types';

export function Sidebar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { user } = useAuthStore();

  const { data: countData } = useQuery({
    queryKey: ['notifications-count'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{ count: number }>>('/notifications/unread-count');
      return res.data.data;
    },
    enabled: !!user,
    refetchInterval: 30000,
  });

  const { data: invitations } = useQuery({
    queryKey: ['my-invitations'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<any[]>>('/teams/my-invitations');
      return res.data.data;
    },
    enabled: !!user,
    refetchInterval: 60000,
  });

  const unreadCount = (countData?.count ?? 0) + (invitations?.filter((i: any) => i.status === 'PENDING').length ?? 0);

  const nav = [
    { href: '/dashboard',     label: t('dashboard'),     icon: LayoutDashboard, badge: 0 },
    { href: '/teams',         label: t('teams'),         icon: Users, badge: 0 },
    { href: '/projects',      label: t('projects'),      icon: FolderKanban, badge: 0 },
    { href: '/tasks',         label: t('tasks'),         icon: CheckSquare, badge: 0 },
    { href: '/notifications', label: t('notifications'), icon: Bell, badge: unreadCount },
  ];

  return (
    <aside className={cn(
      'hidden lg:flex flex-col min-h-screen bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-all duration-200 shrink-0',
      sidebarCollapsed ? 'w-16' : 'w-60'
    )}>
      <div className="flex items-center h-14 px-3 border-b border-slate-100 dark:border-slate-800">
        {!sidebarCollapsed && (
          <span className="flex-1 text-sm font-semibold text-slate-900 dark:text-white tracking-tight pl-1">
            ProjectFlow
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-auto"
        >
          {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {nav.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              title={sidebarCollapsed ? label : undefined}
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium transition-colors relative',
                sidebarCollapsed ? 'justify-center' : '',
                active
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              )}
            >
              <span className="relative shrink-0">
                <Icon size={17} strokeWidth={active ? 2.5 : 2} />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </span>
              {!sidebarCollapsed && (
                <span className="flex-1">{label}</span>
              )}
              {!sidebarCollapsed && badge > 0 && (
                <span className="ml-auto h-5 min-w-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
