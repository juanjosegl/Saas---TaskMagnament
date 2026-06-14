'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Users, Plus, ChevronRight, FolderKanban } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { teamsService } from '@/lib/services/teams.service';

const createSchema = (t: (k: string) => string) => z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

export default function TeamsPage() {
  const t = useTranslations('teams');
  const tc = useTranslations('common');
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: teams, isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: teamsService.getAll,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(createSchema(t)),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: teamsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Team created successfully');
      reset();
      setOpen(false);
    },
    onError: () => toast.error('Failed to create team'),
  });

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <PageHeader
          title={t('title')}
          action={
            <Button size="sm" onClick={() => setOpen(true)} className="gap-1.5">
              <Plus size={15} /> {t('newTeam')}
            </Button>
          }
        />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border border-slate-200 dark:border-slate-800 shadow-none">
                <CardContent className="p-5"><Skeleton className="h-20 w-full" /></CardContent>
              </Card>
            ))}
          </div>
        ) : !teams?.length ? (
          <EmptyState
            title={t('noTeams')}
            description={t('noTeamsDesc')}
            icon={<Users size={40} />}
            action={
              <Button size="sm" onClick={() => setOpen(true)} className="gap-1.5">
                <Plus size={15} /> {t('newTeam')}
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team) => (
              <Card
                key={team.id}
                className="border border-slate-200 dark:border-slate-800 shadow-none hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer group"
                onClick={() => router.push(`/teams/${team.id}`)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Users size={18} className="text-slate-500 dark:text-slate-400" />
                    </div>
                    <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors mt-0.5" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1 truncate">{team.name}</h3>
                  {team.description && (
                    <p className="text-xs text-slate-400 mb-3 line-clamp-2">{team.description}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Users size={12} /> {team._count?.members ?? 0} {t('members')}
                    </span>
                    <span className="flex items-center gap-1">
                      <FolderKanban size={12} /> {team._count?.projects ?? 0} {t('projects')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">{t('createTeam')}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label className="text-sm">{t('teamName')}</Label>
                <Input placeholder={t('teamNamePlaceholder')} {...register('name')} />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">{t('description')} <span className="text-slate-400">({tc('optional')})</span></Label>
                <Input placeholder={t('descriptionPlaceholder')} {...register('description')} />
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>{tc('cancel')}</Button>
                <Button type="submit" size="sm" disabled={isPending}>
                  {isPending ? tc('loading') : t('createTeam')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
