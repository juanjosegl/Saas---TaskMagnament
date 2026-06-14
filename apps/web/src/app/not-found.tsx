import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center">
        <p className="text-6xl font-bold text-slate-200 dark:text-slate-800">404</p>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white mt-4">Page not found</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:bg-slate-700 dark:hover:bg-slate-100 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
