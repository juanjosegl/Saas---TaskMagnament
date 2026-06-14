'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useRedirectIfAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  useRedirectIfAuth();
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: authService.register,
    onSuccess: ({ user, accessToken }) => {
      setAuth(user, accessToken);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    },
    onError: () => toast.error('Email already registered'),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">ProjectFlow</CardTitle>
          <CardDescription>Create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" placeholder="Juan Jose" {...register('name')} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Min. 8 characters" {...register('password')} />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-slate-900 font-medium hover:underline">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
