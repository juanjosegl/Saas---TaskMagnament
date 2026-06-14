'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FolderKanban, CheckSquare, Bell, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/lib/services/auth.service';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/teams', label: 'Teams', icon: Users },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/tasks', label: 'My Tasks', icon: CheckSquare },
  { href: '/notifications', label: 'Notifications', icon: Bell },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await authService.logout();
    clearAuth();
    router.push('/login');
  };

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-white">ProjectFlow</h1>
        <p className="text-slate-400 text-xs mt-1">Project Management</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              pathname === href || pathname.startsWith(href + '/')
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-slate-600 text-white text-xs">
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm w-full px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
