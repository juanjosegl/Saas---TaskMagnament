'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

export function useRequireAuth() {
  const { user } = useAuthStore();
  const router = useRouter();
  useEffect(() => {
    if (!user) router.replace('/login');
  }, [user, router]);
  return { user };
}

export function useRedirectIfAuth() {
  const { user } = useAuthStore();
  const router = useRouter();
  useEffect(() => {
    if (user) router.replace('/dashboard');
  }, [user, router]);
}
