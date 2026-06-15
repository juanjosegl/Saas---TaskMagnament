'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FolderKanban, CheckSquare, Bell, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import { ApiResponse } from '@/types';

interface Props { open: boolean; onClose: () => void; }

export function MobileSidebar({ open, onClose }: Props) {
  const t = useTranslations('nav');
  const pathname = usePathname();
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
  });

  const unreadCount = (countData?.count ?? 0) + (invitations?.filter((i: any) => i.status === 'PENDING').length ?? 0);

  const nav = [
    { href: '/dashboard',     label: t('dashboard'),     icon: LayoutDashboard, badge: 0 },
    { href: '/teams',         label: t('teams'),         icon: Users, badge: 0 },
    { href: '/projects',      label: t('projects'),      icon: FolderKanban, badge: 0 },
    { href: '/tasks',         label: t('tasks'),         icon: CheckSquare, badge: 0 },
    { href: '/notifications', label: t('notifications'), icon: Bell, badge: unreadCount },
  ];

  if (!open) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-64 bg-white dark:bg-slate-950 h-full shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <span className="text-sm font-semibold text-slate-900 dark:text-white">ProjectFlow</span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {nav.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  active
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                )}
              >
                <span className="relative shrink-0">
                  <Icon size={16} strokeWidth={active ? 2.5 : 2} />
                  {badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 h-4 min-w-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </span>
                <span className="flex-1">{label}</span>
                {badge > 0 && (
                  <span className="h-5 min-w-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
