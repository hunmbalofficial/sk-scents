'use client';

import { useEffect } from 'react';
import { ToastProvider } from '@/components/ui/Toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}
