'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { authService } from '@/lib/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useRedirectIfAuth } from '@/hooks/useAuth';
import { clearQueryCache } from '@/lib/providers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  jobTitle: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(500).optional(),
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const t = useTranslations('auth');
  useRedirectIfAuth();
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: authService.register,
    onSuccess: ({ user, accessToken }) => {
      clearQueryCache();
      setAuth(user, accessToken);
      toast.success(t('accountCreated'));
      router.push('/dashboard');
    },
    onError: () => toast.error(t('emailRegistered')),
  });

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}/api/v1/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-8">
      <Card className="w-full max-w-lg border border-slate-200 dark:border-slate-800 shadow-none bg-white dark:bg-slate-900">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">{t('appName')}</CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">{t('createAccountDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button type="button" variant="outline" className="w-full gap-2 mb-4" onClick={handleGoogleLogin}>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>

          <div className="relative my-4">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 px-2 text-xs text-slate-400">
              or register with email
            </span>
          </div>

          <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm text-slate-700 dark:text-slate-300">{t('fullName')} *</Label>
                <Input placeholder="Juan Jose" {...register('name')}
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-slate-700 dark:text-slate-300">{t('email')} *</Label>
                <Input type="email" placeholder={t('emailPlaceholder')} {...register('email')}
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-slate-700 dark:text-slate-300">{t('password')} *</Label>
              <Input type="password" placeholder={t('passwordPlaceholder')} {...register('password')}
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <Separator />
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
              Additional Info <span className="normal-case font-normal">(optional)</span>
            </p>

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

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? t('creatingAccount') : t('createAccount')}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-5">
            {t('hasAccount')}{' '}
            <Link href="/login" className="text-slate-900 dark:text-white font-medium hover:underline">{t('signIn')}</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
