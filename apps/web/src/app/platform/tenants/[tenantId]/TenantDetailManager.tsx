'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { ContentContainer, Alert, Button } from '@transport-platform/ui-web';
import { activateTenantAction, updateBrandingAction, createInvitationAction } from '@/lib/actions/adminActions';

interface TenantDetailManagerProps {
  tenant: any;
}

export function TenantDetailManager({ tenant }: TenantDetailManagerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'branding' | 'invitations'>('overview');

  // Estado de activación
  const [activationError, setActivationError] = useState<string | null>(null);
  const [isActivating, startActivating] = useTransition();

  // Estado de branding
  const [brandingSuccess, setBrandingSuccess] = useState<string | null>(null);
  const [brandingError, setBrandingError] = useState<string | null>(null);
  const [isUpdatingBranding, startUpdatingBranding] = useTransition();

  // Estado de invitaciones
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [generatedInviteUrl, setGeneratedInviteUrl] = useState<string | null>(null);
  const [invitedEmail, setInvitedEmail] = useState<string | null>(null);
  const [isInviting, startInviting] = useTransition();
  const [copied, setCopied] = useState(false);

  // Valores HSL locales para preview en tiempo real
  const branding = tenant.branding || {};
  const [primaryH, setPrimaryH] = useState(branding.primary_color_h ?? 210);
  const [primaryS, setPrimaryS] = useState(branding.primary_color_s ?? 80);
  const [primaryL, setPrimaryL] = useState(branding.primary_color_l ?? 50);
  const [logoPath, setLogoPath] = useState(branding.logo_asset_path || '/assets/logo-placeholder.svg');

  const handleActivate = () => {
    setActivationError(null);
    startActivating(async () => {
      const res = await activateTenantAction(tenant.id);
      if (res?.error) {
        setActivationError(res.error);
      }
    });
  };

  const handleBrandingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBrandingSuccess(null);
    setBrandingError(null);
    const formData = new FormData(e.currentTarget);
    formData.append('tenant_id', tenant.id);

    startUpdatingBranding(async () => {
      const res = await updateBrandingAction(null, formData);
      if (res?.error) {
        setBrandingError(res.error);
      } else if (res?.success) {
        setBrandingSuccess(res.message || 'Branding actualizado.');
      }
    });
  };

  const handleInviteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInviteError(null);
    setGeneratedInviteUrl(null);
    setCopied(false);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append('tenant_id', tenant.id);

    startInviting(async () => {
      const res = await createInvitationAction(null, formData);
      if (res?.error) {
        setInviteError(res.error);
      } else if (res?.success && res.token) {
        const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
        setGeneratedInviteUrl(`${origin}/invite/${res.token}`);
        setInvitedEmail(res.invitedEmail || null);
        form.reset();
      }
    });
  };

  const handleCopyLink = () => {
    if (generatedInviteUrl && typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(generatedInviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    }
  };

  const statusColors: Record<string, { bg: string; border: string; text: string }> = {
    active: { bg: '#DCFCE7', border: '#BBF7D0', text: '#166534' },
    draft: { bg: '#FEF9C3', border: '#FEF08A', text: '#854D0E' },
    suspended: { bg: '#FFEDD5', border: '#FED7AA', text: '#9A3412' },
    archived: { bg: '#F1F5F9', border: '#CBD5E1', text: '#475569' },
  };
  const currentStyle = statusColors[tenant.status] || { bg: '#F1F5F9', border: '#CBD5E1', text: '#475569' };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/platform" style={{ color: '#1C3B57', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
          ← Volver al listado de empresas
        </Link>
      </div>

      <ContentContainer>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '1px solid #E2E8F0',
            paddingBottom: '20px',
            marginBottom: '24px',
          }}
        >
          <div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
              SLUG: {tenant.slug}
            </span>
            <h1 style={{ margin: '6px 0', fontSize: '28px', fontWeight: 800, color: '#1C3B57' }}>
              {tenant.display_name}
            </h1>
            <span style={{ fontSize: '15px', color: '#475569', fontWeight: 500 }}>
              Razón Social: {tenant.legal_name}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
            <div
              style={{
                padding: '6px 14px',
                backgroundColor: currentStyle.bg,
                border: `1px solid ${currentStyle.border}`,
                color: currentStyle.text,
                borderRadius: '20px',
                fontWeight: 700,
                fontSize: '14px',
              }}
            >
              Estado: {tenant.status.toUpperCase()}
            </div>

            {tenant.status !== 'active' && (
              <Button
                variant="primary"
                disabled={isActivating}
                onClick={handleActivate}
                style={{
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  padding: '10px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)',
                }}
              >
                {isActivating ? 'Activando...' : '✓ Activar Empresa Oficialmente'}
              </Button>
            )}
          </div>
        </div>

        {activationError && (
          <Alert variant="danger" title="Error en la activación" style={{ marginBottom: '20px' }}>
            {activationError}
          </Alert>
        )}

        {/* Pestañas de Navegación del Tenant */}
        <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid #F1F5F9', marginBottom: '28px' }}>
          {[
            { id: 'overview', label: '📊 Datos Generales & Estado' },
            { id: 'branding', label: '🎨 Configuración de Branding' },
            { id: 'invitations', label: '✉️ Invitaciones Operativas (Tenant Admin)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '12px 18px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? '#F0F4F8' : 'transparent',
                color: activeTab === tab.id ? '#1C3B57' : '#64748B',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: '15px',
                borderBottom: activeTab === tab.id ? '3px solid #E8832A' : '3px solid transparent',
                cursor: 'pointer',
                borderRadius: '8px 8px 0 0',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENIDO VISTA GENERAl */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div
              style={{ backgroundColor: '#F8FAFC', padding: '20px', borderRadius: '10px', border: '1px solid #E2E8F0' }}
            >
              <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#1E293B', fontWeight: 700 }}>
                Parámetros Regionales
              </h3>
              <p style={{ margin: '8px 0', fontSize: '14px' }}>
                Zona Horaria: <strong style={{ color: '#1C3B57' }}>{tenant.timezone}</strong>
              </p>
              <p style={{ margin: '8px 0', fontSize: '14px' }}>
                Locale Principal: <strong style={{ color: '#1C3B57' }}>{tenant.locale}</strong>
              </p>
              <p style={{ margin: '8px 0', fontSize: '14px' }}>
                ID Interno UUID:{' '}
                <code style={{ fontSize: '12px', background: '#E2E8F0', padding: '2px 6px', borderRadius: '4px' }}>
                  {tenant.id}
                </code>
              </p>
            </div>

            <div
              style={{ backgroundColor: '#F8FAFC', padding: '20px', borderRadius: '10px', border: '1px solid #E2E8F0' }}
            >
              <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#1E293B', fontWeight: 700 }}>
                Resumen de Membresías & Accesos
              </h3>
              <p style={{ margin: '8px 0', fontSize: '14px' }}>
                Total Operadores (Memberships):{' '}
                <strong style={{ color: '#1C3B57' }}>{tenant.memberships.length}</strong>
              </p>
              <p style={{ margin: '8px 0', fontSize: '14px' }}>
                Invitations Emitidas: <strong style={{ color: '#1C3B57' }}>{tenant.invitations.length}</strong>
              </p>
              <p style={{ margin: '8px 0', fontSize: '14px' }}>
                Creada el: <strong>{new Date(tenant.created_at).toLocaleString('es-CL')}</strong>
              </p>
            </div>
          </div>
        )}

        {/* CONTENIDO BRANDING */}
        {activeTab === 'branding' && (
          <div>
            <div
              style={{
                marginBottom: '24px',
                padding: '20px',
                borderRadius: '12px',
                background: `hsl(${primaryH}, ${primaryS}%, ${primaryL}%)`,
                color: '#FFF',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              }}
            >
              <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.85 }}>
                Live Preview del Branding Tenant
              </span>
              <h2 style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: 800 }}>
                {tenant.display_name} — Portal Operativo
              </h2>
              <p style={{ margin: '6px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
                Este banner refleja en tiempo real el color primario HSL que verá el Tenant Admin en el Shell de
                Operador.
              </p>
            </div>

            {brandingSuccess && (
              <Alert
                variant="success"
                title="Branding Guardado"
                style={{ marginBottom: '16px', backgroundColor: '#ECFDF5', color: '#065F46', borderColor: '#A7F3D0' }}
              >
                {brandingSuccess}
              </Alert>
            )}
            {brandingError && (
              <Alert variant="danger" title="Error de actualización" style={{ marginBottom: '16px' }}>
                {brandingError}
              </Alert>
            )}

            <form onSubmit={handleBrandingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label
                  style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}
                >
                  Ruta o URL del Logo Asset
                </label>
                <input
                  name="logo_asset_path"
                  type="text"
                  value={logoPath}
                  onChange={(e) => setLogoPath(e.target.value)}
                  disabled={isUpdatingBranding}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '15px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '16px',
                  backgroundColor: '#F8FAFC',
                  padding: '20px',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div style={{ gridColumn: 'span 3' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#1C3B57' }}>Color Primario (HSL)</span>
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: '4px',
                    }}
                  >
                    Hue (H: 0-360): {primaryH}
                  </label>
                  <input
                    type="range"
                    name="primary_color_h"
                    min={0}
                    max={360}
                    value={primaryH}
                    onChange={(e) => setPrimaryH(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: '4px',
                    }}
                  >
                    Saturation (S: 0-100%): {primaryS}%
                  </label>
                  <input
                    type="range"
                    name="primary_color_s"
                    min={0}
                    max={100}
                    value={primaryS}
                    onChange={(e) => setPrimaryS(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: '4px',
                    }}
                  >
                    Lightness (L: 0-100%): {primaryL}%
                  </label>
                  <input
                    type="range"
                    name="primary_color_l"
                    min={0}
                    max={100}
                    value={primaryL}
                    onChange={(e) => setPrimaryL(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <Button
                  type="submit"
                  disabled={isUpdatingBranding}
                  variant="primary"
                  style={{
                    padding: '12px 28px',
                    fontWeight: 600,
                  }}
                >
                  {isUpdatingBranding ? 'Guardando...' : 'Guardar Configuración de Branding'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* CONTENIDO INVITACIONES */}
        {activeTab === 'invitations' && (
          <div>
            <div
              style={{
                backgroundColor: '#F8F9FA',
                padding: '20px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                marginBottom: '28px',
              }}
            >
              <h3 style={{ margin: '0 0 8px 0', fontSize: '17px', fontWeight: 700, color: '#1C3B57' }}>
                Generación de Invitaciones de Administrador Operativo
              </h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
                El token plano encriptado del enlace de invitación solo existe temporalmente durante esta respuesta del
                servidor; <strong>jamás se almacena ni se registra en observabilidad</strong>. Genere la invitación para
                su prueba y cópielo antes de salir.
              </p>

              {inviteError && (
                <Alert variant="danger" title="Error al generar invitación" style={{ marginBottom: '16px' }}>
                  {inviteError}
                </Alert>
              )}

              {generatedInviteUrl ? (
                <div
                  style={{
                    backgroundColor: '#ECFDF5',
                    border: '2px solid #059669',
                    borderRadius: '10px',
                    padding: '20px',
                    marginTop: '16px',
                    color: '#065F46',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: '16px',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>✨ ¡Invitación Generada y Lista para su Uso!</span>
                  </div>
                  <p style={{ fontSize: '14px', margin: '4px 0 12px 0' }}>
                    Envíe este enlace o ábralo desde el navegador tras iniciar sesión con{' '}
                    <strong>{invitedEmail}</strong>:
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                      backgroundColor: '#FFFFFF',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      border: '1px solid #A7F3D0',
                    }}
                  >
                    <input
                      type="text"
                      readOnly
                      value={generatedInviteUrl}
                      style={{
                        flex: 1,
                        border: 'none',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#1C3B57',
                        outline: 'none',
                        background: 'transparent',
                        fontFamily: 'monospace',
                      }}
                    />
                    <Button
                      type="button"
                      onClick={handleCopyLink}
                      style={{
                        backgroundColor: copied ? '#059669' : '#047857',
                        color: '#FFF',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '13px',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {copied ? '✓ ¡Enlace Copiado!' : '📋 Copiar Enlace'}
                    </Button>
                  </div>

                  <div style={{ marginTop: '14px', fontSize: '12px', color: '#047857', fontWeight: 600 }}>
                    ⚠️ Recuerde: Si recarga esta página, el token de alta seguridad ya no se podrá visualizar por
                    directivas de privacidad.
                  </div>

                  <div
                    style={{
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: '1px solid #A7F3D0',
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Button
                      type="button"
                      onClick={() => setGeneratedInviteUrl(null)}
                      style={{
                        background: 'transparent',
                        color: '#047857',
                        border: '1px underline',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 600,
                      }}
                    >
                      Generar otra invitación distinta
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleInviteSubmit} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#1E293B',
                        marginBottom: '6px',
                      }}
                    >
                      Correo electrónico del Operador Invitado (Tenant Admin)
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="ej: tenant.admin.dev@example.com"
                      defaultValue="tenant.admin.dev@example.com"
                      disabled={isInviting}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '15px',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#FFFFFF',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isInviting}
                    variant="primary"
                    style={{
                      padding: '10px 24px',
                      fontWeight: 600,
                      height: '42px',
                    }}
                  >
                    {isInviting ? 'Generando token...' : 'Invitar como Tenant Admin'}
                  </Button>
                </form>
              )}
            </div>

            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1C3B57', marginBottom: '12px' }}>
              Historial de Invitations Registradas en BD
            </h4>
            {tenant.invitations && tenant.invitations.length > 0 ? (
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '14px',
                  backgroundColor: '#FFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <thead style={{ backgroundColor: '#F8FAFC', color: '#475569', textAlign: 'left' }}>
                  <tr>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>Destinatario</th>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>Rol Asignado</th>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>Estado</th>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>Fecha Emisión</th>
                  </tr>
                </thead>
                <tbody>
                  {tenant.invitations.map((inv: any) => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1C3B57' }}>
                        {inv.normalized_email}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#475569' }}>{inv.role}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 700 }}>
                        <span
                          style={{
                            color:
                              inv.status === 'accepted' ? '#10B981' : inv.status === 'revoked' ? '#EF4444' : '#F59E0B',
                          }}
                        >
                          ● {inv.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#64748B', fontSize: '13px' }}>
                        {new Date(inv.created_at).toLocaleString('es-CL')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: '#64748B', fontStyle: 'italic', fontSize: '14px' }}>
                No hay invitaciones registradas con anterioridad.
              </p>
            )}
          </div>
        )}
      </ContentContainer>
    </div>
  );
}
