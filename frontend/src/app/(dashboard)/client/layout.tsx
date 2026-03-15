import { type ReactNode } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout
      role="client"
      userName="Rahul Mehta"
      userEmail="rahul@techcorp.in"
      userRole="Client"
      notificationCount={2}
    >
      {children}
    </DashboardLayout>
  );
}
