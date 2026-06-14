'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Users, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import { ApiResponse } from '@/types';

interface InvitationInfo {
  id: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
  team: { name: string };
  sender: { name: string };
}

export default function AcceptInvitationPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const [invitation, setInvitation] = useState<InvitationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<ApiResponse<InvitationInfo>>(`/teams/invitations/${token}`)
      .then((res) => setInvitation(res.data.data))
      .catch(() => setError('Invitation not found or already used.'))
      .finally(() => setLoading(false));
  }, [token]);

  const acceptMutation = useMutation({
    mutationFn: () => api.post(`/teams/invitations/${token}/accept`),
    onSuccess: (res: any) => {
      toast.success('You joined the team successfully!');
      router.push(`/teams/${res.data.data.teamId}`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to accept invitation');
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <Card className="w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-none">
          <CardContent className="p-8 text-center">
            <XCircle className="mx-auto text-red-400 mb-4" size={40} />
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Invalid Invitation</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{error}</p>
            <Button className="mt-6" onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (invitation.status !== 'PENDING') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <Card className="w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-none">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="mx-auto text-green-400 mb-4" size={40} />
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Already Accepted</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">This invitation has already been used.</p>
            <Button className="mt-6" onClick={() => router.push('/teams')}>Go to Teams</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <Card className="w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-none bg-white dark:bg-slate-900">
        <CardContent className="p-8">
          <div className="flex justify-center mb-6">
            <div className="h-14 w-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Users size={28} className="text-slate-600 dark:text-slate-300" />
            </div>
          </div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white text-center mb-2">
            Team Invitation
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
            <strong className="text-slate-700 dark:text-slate-300">{invitation.sender.name}</strong> invited you to join
          </p>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-6 text-center">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">{invitation.team.name}</p>
            <p className="text-sm text-slate-500 mt-1">Role: <span className="font-medium">{invitation.role}</span></p>
          </div>

          {!user ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 text-center mb-4">
                Sign in or create an account to accept this invitation.
              </p>
              <Button className="w-full" onClick={() => router.push(`/login?redirect=/invitations/${token}`)}>
                Sign in to accept
              </Button>
              <Button variant="outline" className="w-full" onClick={() => router.push(`/register?redirect=/invitations/${token}`)}>
                Create account
              </Button>
            </div>
          ) : user.email !== invitation.email ? (
            <div className="text-center">
              <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 mb-4">
                This invitation was sent to <strong>{invitation.email}</strong>.<br />
                You are logged in as <strong>{user.email}</strong>.
              </p>
              <Button variant="outline" onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Button
                className="w-full"
                onClick={() => acceptMutation.mutate()}
                disabled={acceptMutation.isPending}
              >
                {acceptMutation.isPending ? (
                  <><Loader2 size={15} className="animate-spin mr-2" /> Accepting...</>
                ) : 'Accept Invitation'}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => router.push('/dashboard')}>
                Decline
              </Button>
            </div>
          )}
          <p className="text-xs text-slate-400 text-center mt-6">
            Expires {new Date(invitation.expiresAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
