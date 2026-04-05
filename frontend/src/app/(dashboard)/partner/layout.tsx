import { type ReactNode } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function PartnerLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout role="partner" notificationCount={3}>
      {children}
    </DashboardLayout>
  );
}
