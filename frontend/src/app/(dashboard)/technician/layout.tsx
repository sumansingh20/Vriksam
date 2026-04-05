import { type ReactNode } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function TechnicianLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout role="technician" notificationCount={3}>
      {children}
    </DashboardLayout>
  );
}
