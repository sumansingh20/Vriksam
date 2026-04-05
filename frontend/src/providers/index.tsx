'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useEffect, useState } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !window.performance) {
      return;
    }

    const perf = window.performance as Performance & {
      mark?: (...args: unknown[]) => void;
      measure?: (...args: unknown[]) => void;
      clearMarks?: (...args: unknown[]) => void;
      clearMeasures?: (...args: unknown[]) => void;
    };

    const ensureMethod = (
      method: 'mark' | 'measure' | 'clearMarks' | 'clearMeasures',
    ) => {
      if (typeof perf[method] === 'function') {
        return;
      }

      try {
        Object.defineProperty(perf, method, {
          configurable: true,
          writable: true,
          value: () => undefined,
        });
      } catch {
        // Ignore failures for non-configurable performance objects.
      }
    };

    ensureMethod('mark');
    ensureMethod('measure');
    ensureMethod('clearMarks');
    ensureMethod('clearMeasures');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
