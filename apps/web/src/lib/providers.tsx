'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { useRef } from 'react';

let globalQueryClient: QueryClient | null = null;

export function getQueryClient() {
  if (!globalQueryClient) {
    globalQueryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: 1, staleTime: 1000 * 30 },
      },
    });
  }
  return globalQueryClient;
}

export function clearQueryCache() {
  if (globalQueryClient) {
    globalQueryClient.clear();
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const clientRef = useRef<QueryClient>(null);
  if (!clientRef.current) {
    clientRef.current = getQueryClient();
  }

  return (
    <QueryClientProvider client={clientRef.current}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
        <Toaster richColors position="top-right" />
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
