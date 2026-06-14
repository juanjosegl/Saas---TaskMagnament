'use client';
import { useRequireAuth } from '@/hooks/useAuth';
import { Sidebar } from './Sidebar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useRequireAuth();
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
