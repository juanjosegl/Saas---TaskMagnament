'use client';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import api from '@/lib/api';
import { ApiResponse, User } from '@/types';

export default function CompleteProfilePage() {
  const { user, setAuth, accessToken } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) { router.replace('/login'); return; }
  }, [user, router]);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      phone: '',
      birthDate: '',
      jobTitle: '',
      location: '',
      bio: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.patch<ApiResponse<User>>('/users/me', data);
      return res.data.data;
    },
    onSuccess: (updated) => {
      setAuth({ ...user!, ...updated }, accessToken ?? '');
      toast.success('Profile completed!');
      router.push('/dashboard');
    },
    onError: () => toast.error('Failed to save profile'),
  });

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-8">
      <Card className="w-full max-w-lg border border-slate-200 dark:border-slate-800 shadow-none bg-white dark:bg-slate-900">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="text-lg font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
            Complete your profile
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">
            Welcome, <strong>{user?.name}</strong>! Add a few more details to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm text-slate-700 dark:text-slate-300">Phone</Label>
                <Input placeholder="+57 300 123 4567" {...register('phone')}
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-slate-700 dark:text-slate-300">Date of Birth</Label>
                <Input type="date" {...register('birthDate')}
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm text-slate-700 dark:text-slate-300">Job Title</Label>
                <Input placeholder="Full Stack Developer" {...register('jobTitle')}
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-slate-700 dark:text-slate-300">Location</Label>
                <Input placeholder="Bogotá, Colombia" {...register('location')}
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-slate-700 dark:text-slate-300">Bio</Label>
              <textarea
                {...register('bio')}
                placeholder="Tell us a bit about yourself..."
                rows={3}
                className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-slate-400 dark:focus:border-slate-500 resize-none"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.push('/dashboard')}
              >
                Skip for now
              </Button>
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending ? 'Saving...' : 'Complete Profile'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
