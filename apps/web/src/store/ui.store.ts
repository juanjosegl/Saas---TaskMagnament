import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Locale = 'en' | 'es';
type Theme = 'light' | 'dark' | 'system';

interface UIState {
  locale: Locale;
  theme: Theme;
  sidebarCollapsed: boolean;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      locale: 'en',
      theme: 'system',
      sidebarCollapsed: false,
      setLocale: (locale) => {
        document.cookie = `locale=${locale};path=/;max-age=31536000`;
        set({ locale });
        window.location.reload();
      },
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    }),
    { name: 'ui-storage' }
  )
);
