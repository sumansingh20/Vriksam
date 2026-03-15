import { type ReactNode } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function TechnicianLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout
      role="technician"
      userName="Raj Patel"
      userEmail="raj@vriksham.com"
      userRole="Technician"
      notificationCount={3}
    >
      {children}
    </DashboardLayout>
  );
}
