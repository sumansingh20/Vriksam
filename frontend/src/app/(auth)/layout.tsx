import { type ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-950 via-emerald-950 to-forest-900">
      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(16,185,129,0.15)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(5,150,105,0.1)_0%,_transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(16,185,129,0.08) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
