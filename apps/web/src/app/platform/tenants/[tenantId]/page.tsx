import React from 'react';
import { notFound } from 'next/navigation';
import { requirePlatformAdmin } from '@/lib/auth/guards';
import { platformAdminService } from '@/lib/services/platformAdminService';
import { ForbiddenView } from '@/components/ForbiddenView';
import { TenantDetailManager } from './TenantDetailManager';
import { LogoutButton } from '@/components/LogoutButton';

export const metadata = {
  title: 'Gestión de Empresa | Platform SuperAdmin Portal',
  description: 'Consola de gestión de empresa, configuración de branding e invitaciones operativas.',
};

interface PageProps {
  params: Promise<{ tenantId: string }>;
}

export default async function TenantDetailPage({ params }: PageProps) {
  const auth = await requirePlatformAdmin();
  if (!auth.authorized) {
    return <ForbiddenView reason={auth.message} userEmail={auth.email || undefined} />;
  }

  const { tenantId } = await params;
  const tenant = await platformAdminService.getTenantById(tenantId);

  if (!tenant) {
    notFound();
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header
        style={{
          backgroundColor: '#1C3B57',
          color: '#FFFFFF',
          padding: '16px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontWeight: 800, fontSize: '18px', color: '#E8832A' }}>TP</span>
          <span style={{ fontSize: '16px', fontWeight: 700 }}>Transport Platform V2</span>
          <span style={{ fontSize: '14px', color: '#CBD5E1' }}>/ Empresa: {tenant.slug}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '13px' }}>
          <span>
            Conectado como: <strong>{auth.email}</strong>
          </span>
          <LogoutButton variant="outline" />
        </div>
      </header>

      <main style={{ padding: '40px 20px' }}>
        <TenantDetailManager tenant={tenant} />
      </main>
    </div>
  );
}
