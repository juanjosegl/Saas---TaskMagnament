'use client';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import { ApiResponse, User } from '@/types';

export default function ProfilePage() {
  const t = useTranslations('profile');
  const tc = useTranslations('common');
  const { user, setAuth } = useAuthStore();

  const { register, handleSubmit, reset } = useForm<{ name: string; avatar?: string }>({
    defaultValues: { name: user?.name ?? '', avatar: user?.avatar ?? '' },
  });

  useEffect(() => {
    reset({ name: user?.name ?? '', avatar: user?.avatar ?? '' });
  }, [user, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: { name: string; avatar?: string }) => {
      const res = await api.patch<ApiResponse<User>>('/users/me', data);
      return res.data.data;
    },
    onSuccess: (updated) => {
      const token = localStorage.getItem('access_token') ?? '';
      setAuth({ ...user!, ...updated }, token);
      toast.success(t('saved'));
    },
    onError: () => toast.error('Failed to update profile'),
  });

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-2xl mx-auto">
        <PageHeader title={t('title')} />

        <Card className="border border-slate-200 dark:border-slate-800 shadow-none">
          <CardContent className="p-6">
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
              <Avatar className="h-14 w-14">
                <AvatarFallback className="text-base font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm">{t('fullName')}</Label>
                <Input {...register('name', { required: true })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">{t('email')}</Label>
                <Input value={user?.email ?? ''} disabled className="opacity-60" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Avatar URL <span className="text-slate-400">({tc('optional')})</span></Label>
                <Input placeholder="https://example.com/avatar.jpg" {...register('avatar')} />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" size="sm" disabled={isPending}>
                  {isPending ? t('saving') : t('saveChanges')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
