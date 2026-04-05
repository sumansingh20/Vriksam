import { type ReactNode } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout role="client" notificationCount={2}>
      {children}
    </DashboardLayout>
  );
}
