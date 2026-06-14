import { TaskStatus, TaskPriority, ProjectStatus } from '@/types';

const STATUS_STYLES: Record<string, string> = {
  BACKLOG:     'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  TODO:        'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  IN_PROGRESS: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  IN_REVIEW:   'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  DONE:        'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  ACTIVE:      'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  ARCHIVED:    'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500',
  COMPLETED:   'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
};

const PRIORITY_STYLES: Record<string, string> = {
  LOW:    'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  MEDIUM: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  HIGH:   'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
  URGENT: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
};

interface Props {
  value: string;
  type?: 'status' | 'priority';
  label: string;
}

export function StatusBadge({ value, type = 'status', label }: Props) {
  const styles = type === 'priority' ? PRIORITY_STYLES : STATUS_STYLES;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[value] ?? 'bg-slate-100 text-slate-600'}`}>
      {label}
    </span>
  );
}
