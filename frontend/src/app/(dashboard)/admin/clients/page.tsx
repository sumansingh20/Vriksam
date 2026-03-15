'use client';

import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { ClientTable } from '@/components/dashboard/client-table';

export default function AdminClientsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        description="Manage your client accounts, subscriptions, and locations."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Clients' },
        ]}
        actions={
          <button className="btn-emerald flex items-center gap-2 rounded-xl">
            <Plus className="h-4 w-4" />
            Add Client
          </button>
        }
      />

      <ClientTable />
    </div>
  );
}
