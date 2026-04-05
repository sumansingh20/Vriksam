import { type ReactNode } from 'react';
import { RouteTransition } from '@/components/motion/route-transition';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-shell relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="auth-orb-one absolute -left-20 top-20 h-72 w-72 rounded-full blur-3xl" />
        <div className="auth-orb-two absolute -right-16 bottom-10 h-96 w-96 rounded-full blur-3xl" />
      </div>
      <RouteTransition tone="auth" className="relative z-10 min-h-screen">
        {children}
      </RouteTransition>
    </div>
  );
}
