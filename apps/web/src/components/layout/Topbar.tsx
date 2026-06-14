'use client';
import { useTheme } from 'next-themes';
import { useUIStore } from '@/store/ui.store';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/lib/services/auth.service';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Menu, Sun, Moon, Monitor, ChevronDown, User, LogOut, Languages, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { clearQueryCache } from '@/lib/providers';

interface TopbarProps {
  onMobileMenuOpen: () => void;
}

export function Topbar({ onMobileMenuOpen }: TopbarProps) {
  const t = useTranslations('nav');
  const { theme, setTheme } = useTheme();
  const { locale, setLocale } = useUIStore();
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLogout = async () => {
    try { await authService.logout(); } catch {}
    clearQueryCache();
    clearAuth();
    router.push('/login');
  };

  const initials = user?.name
    ?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const ThemeIcon = !mounted ? Monitor
    : theme === 'dark' ? Moon
    : theme === 'light' ? Sun
    : Monitor;

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ] as const;

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
  ] as const;

  return (
    <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center px-4 gap-2 shrink-0">
      <button
        className="lg:hidden p-2 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        onClick={onMobileMenuOpen}
      >
        <Menu size={18} />
      </button>
      <span className="lg:hidden text-sm font-semibold text-slate-900 dark:text-white">ProjectFlow</span>
      <div className="flex-1" />

      <DropdownMenu>
        <DropdownMenuTrigger className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors outline-none">
          <ThemeIcon size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <p className="px-2 py-1.5 text-xs text-slate-400">Appearance</p>
          <DropdownMenuSeparator />
          {themes.map(({ value, label, icon: Icon }) => (
            <DropdownMenuItem key={value} className="gap-2 text-sm cursor-pointer" onClick={() => setTheme(value)}>
              <Icon size={14} />{label}
              {mounted && theme === value && <Check size={13} className="ml-auto text-slate-500" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors outline-none">
          <Languages size={15} />
          <span className="text-xs font-medium uppercase">{locale}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <p className="px-2 py-1.5 text-xs text-slate-400">Language</p>
          <DropdownMenuSeparator />
          {languages.map(({ value, label }) => (
            <DropdownMenuItem key={value} className="gap-2 text-sm cursor-pointer" onClick={() => setLocale(value as 'en' | 'es')}>
              {label}
              {locale === value && <Check size={13} className="ml-auto text-slate-500" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors outline-none ml-1">
          <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{initials}</span>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-tight">{user?.name}</p>
            <p className="text-xs text-slate-400 leading-tight truncate max-w-[120px]">{user?.email}</p>
          </div>
          <ChevronDown size={13} className="text-slate-400 hidden sm:block" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <div className="px-2 py-2">
            <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate mt-0.5">{user?.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 cursor-pointer text-sm" onClick={() => router.push('/profile')}>
            <User size={14} /> Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2 cursor-pointer text-sm text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
            onClick={handleLogout}
          >
            <LogOut size={14} /> {t('signOut')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
