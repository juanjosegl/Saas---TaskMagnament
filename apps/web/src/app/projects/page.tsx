'use client';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { FolderKanban, ChevronRight } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { teamsService } from '@/lib/services/teams.service';
import { projectsService } from '@/lib/services/projects.service';
import { useQuery as useQ } from '@tanstack/react-query';

export default function ProjectsPage() {
  const t = useTranslations('projects');
  const ts = useTranslations('status');
  const router = useRouter();

  const { data: teams, isLoading: loadingTeams } = useQ({
    queryKey: ['teams'],
    queryFn: teamsService.getAll,
  });

  const firstTeamId = teams?.[0]?.id;

  const { data: projects, isLoading: loadingProjects } = useQ({
    queryKey: ['projects', firstTeamId],
    queryFn: () => projectsService.getByTeam(firstTeamId!),
    enabled: !!firstTeamId,
  });

  const isLoading = loadingTeams || loadingProjects;

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <PageHeader title={t('title')} />

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border border-slate-200 dark:border-slate-800 shadow-none">
                <CardContent className="p-4"><Skeleton className="h-10 w-full" /></CardContent>
              </Card>
            ))}
          </div>
        ) : !projects?.length ? (
          <EmptyState
            title={t('noProjects')}
            description={t('noProjectsDesc')}
            icon={<FolderKanban size={40} />}
          />
        ) : (
          <div className="space-y-2">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="border border-slate-200 dark:border-slate-800 shadow-none hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer group"
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      <FolderKanban size={15} className="text-slate-500 dark:text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{project.name}</p>
                      {project.description && (
                        <p className="text-xs text-slate-400 truncate">{project.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    <span className="text-xs text-slate-400 hidden sm:block">{project._count?.tasks ?? 0} {t('tasks')}</span>
                    <StatusBadge value={project.status} label={ts(project.status as any)} />
                    <ChevronRight size={15} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
