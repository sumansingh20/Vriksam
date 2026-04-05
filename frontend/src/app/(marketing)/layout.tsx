import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { RouteTransition } from '@/components/motion/route-transition';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="marketing-shell relative flex min-h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="marketing-orb-one absolute -left-24 top-32 h-[28rem] w-[28rem] rounded-full blur-3xl" />
        <div className="marketing-orb-two absolute -right-28 top-[28rem] h-[32rem] w-[32rem] rounded-full blur-3xl" />
        <div className="marketing-grid-overlay absolute inset-0" />
      </div>

      <Navbar />
      <main className="relative z-10 flex-1">
        <RouteTransition tone="marketing" className="h-full">
          {children}
        </RouteTransition>
      </main>
      <Footer />
    </div>
  );
}
