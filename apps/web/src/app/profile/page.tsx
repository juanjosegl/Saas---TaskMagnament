'use client';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/auth.store';
import { MapPin, Briefcase, Phone, Calendar, Mail, Shield } from 'lucide-react';
import api from '@/lib/api';
import { ApiResponse, User } from '@/types';

export default function ProfilePage() {
  const t = useTranslations('profile');
  const tc = useTranslations('common');
  const { user: storeUser, setAuth, accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<any>>('/users/me');
      return res.data.data;
    },
  });

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '', phone: '', birthDate: '',
      jobTitle: '', location: '', bio: '', avatar: '',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name ?? '',
        phone: profile.phone ?? '',
        birthDate: profile.birthDate ? new Date(profile.birthDate).toISOString().split('T')[0] : '',
        jobTitle: profile.jobTitle ?? '',
        location: profile.location ?? '',
        bio: profile.bio ?? '',
        avatar: profile.avatar ?? '',
      });
    }
  }, [profile, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.patch<ApiResponse<User>>('/users/me', data);
      return res.data.data;
    },
    onSuccess: (updated) => {
      setAuth({ ...storeUser!, ...updated }, accessToken ?? '');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success(t('saved'));
    },
    onError: () => toast.error('Failed to update profile'),
  });

  const initials = profile?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        <PageHeader title={t('title')} />

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <div className="space-y-5">
            {/* Profile header card */}
            <Card className="border border-slate-200 dark:border-slate-800 shadow-none">
              <CardContent className="p-6">
                <div className="flex items-start gap-5">
                  <Avatar className="h-16 w-16 shrink-0">
                    <AvatarImage src={profile?.avatar} />
                    <AvatarFallback className="text-lg font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-semibold text-slate-900 dark:text-white">{profile?.name}</h2>
                      {profile?.provider === 'GOOGLE' && (
                        <Badge variant="secondary" className="text-xs gap-1">
                          <svg width="10" height="10" viewBox="0 0 24 24" className="shrink-0">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                          Google
                        </Badge>
                      )}
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Mail size={13} /> {profile?.email}
                      </p>
                      {profile?.jobTitle && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Briefcase size={13} /> {profile.jobTitle}
                        </p>
                      )}
                      {profile?.location && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <MapPin size={13} /> {profile.location}
                        </p>
                      )}
                      {profile?.phone && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Phone size={13} /> {profile.phone}
                        </p>
                      )}
                    </div>
                    {profile?.bio && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">{profile.bio}</p>
                    )}
                  </div>
                </div>

                {/* Teams */}
                {profile?.teamMembers?.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-2 flex items-center gap-1.5">
                      <Shield size={12} /> Teams
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {profile.teamMembers.map((tm: any) => (
                        <Badge key={tm.id} variant="secondary" className="text-xs">
                          {tm.team.name} · {tm.role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Edit form */}
            <Card className="border border-slate-200 dark:border-slate-800 shadow-none">
              <CardHeader className="pb-2 px-6 pt-5">
                <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Edit Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm text-slate-700 dark:text-slate-300">{t('fullName')}</Label>
                      <Input {...register('name')}
                        className="dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm text-slate-700 dark:text-slate-300">{t('email')}</Label>
                      <Input value={profile?.email ?? ''} disabled className="opacity-50" />
                    </div>
                  </div>

                  <Separator />

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
                    <Label className="text-sm text-slate-700 dark:text-slate-300">
                      Avatar URL <span className="text-slate-400">({tc('optional')})</span>
                    </Label>
                    <Input placeholder="https://example.com/avatar.jpg" {...register('avatar')}
                      className="dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
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

                  <div className="flex justify-end pt-1">
                    <Button type="submit" size="sm" disabled={isPending}>
                      {isPending ? t('saving') : t('saveChanges')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
