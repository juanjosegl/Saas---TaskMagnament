'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, FolderKanban,
  CheckSquare, Bell, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/ui.store';
import { useTranslations } from 'next-intl';

export function Sidebar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  const nav = [
    { href: '/dashboard',     label: t('dashboard'),     icon: LayoutDashboard },
    { href: '/teams',         label: t('teams'),         icon: Users },
    { href: '/projects',      label: t('projects'),      icon: FolderKanban },
    { href: '/tasks',         label: t('tasks'),         icon: CheckSquare },
    { href: '/notifications', label: t('notifications'), icon: Bell },
  ];

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col min-h-screen bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-all duration-200 shrink-0',
        sidebarCollapsed ? 'w-16' : 'w-60'
      )}
    >
      <div className="flex items-center h-14 px-3 border-b border-slate-100 dark:border-slate-800">
        {!sidebarCollapsed && (
          <span className="flex-1 text-sm font-semibold text-slate-900 dark:text-white tracking-tight pl-1">
            ProjectFlow
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-auto"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              title={sidebarCollapsed ? label : undefined}
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium transition-colors',
                sidebarCollapsed ? 'justify-center' : '',
                active
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              )}
            >
              <Icon size={17} strokeWidth={active ? 2.5 : 2} className="shrink-0" />
              {!sidebarCollapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
