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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  const t = useTranslations('auth');
  useRedirectIfAuth();
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const schema = z.object({
    name: z.string().min(2, t('nameTooShort')),
    email: z.string().email(t('invalidEmail')),
    password: z.string().min(8, t('passwordTooShort')),
  });
  type FormData = z.infer<typeof schema>;

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: authService.register,
    onSuccess: ({ user, accessToken }) => {
      setAuth(user, accessToken);
      toast.success(t('accountCreated'));
      router.push('/dashboard');
    },
    onError: () => toast.error(t('emailRegistered')),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <Card className="w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-none bg-white dark:bg-slate-900">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">{t('appName')}</CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">{t('createAccountDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">{t('fullName')}</Label>
              <Input id="name" placeholder="Juan Jose" {...register('name')}
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">{t('email')}</Label>
              <Input id="email" type="email" placeholder={t('emailPlaceholder')} {...register('email')}
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">{t('password')}</Label>
              <Input id="password" type="password" placeholder={t('passwordPlaceholder')} {...register('password')}
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
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
