'use client';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/lib/services/auth.service';
import { clearQueryCache } from '@/lib/providers';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const token = searchParams.get('token');
    const isNew = searchParams.get('new') === 'true';

    if (!token) { router.replace('/login'); return; }

    localStorage.setItem('access_token', token);
    clearQueryCache();

    authService.me()
      .then((user) => {
        setAuth(user, token);
        if (isNew) {
          router.replace('/complete-profile');
        } else {
          router.replace('/dashboard');
        }
      })
      .catch(() => router.replace('/login'));
  }, [searchParams, router, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center">
        <Loader2 className="animate-spin text-slate-400 mx-auto mb-3" size={32} />
        <p className="text-sm text-slate-500 dark:text-slate-400">Signing you in...</p>
      </div>
    </div>
  );
}
