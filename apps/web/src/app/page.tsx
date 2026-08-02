import React from 'react';
import Link from 'next/link';

export default function RootPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header Corporativo */}
      <header
        style={{
          backgroundColor: '#1C3B57',
          color: '#FFFFFF',
          padding: '20px 40px',
          boxShadow: '0 2px 4px rgba(28, 59, 87, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: '#E8832A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '20px',
              color: '#FFFFFF',
            }}
          >
            DS
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0, letterSpacing: '-0.3px' }}>
              Transport Platform V2
            </h1>
            <span style={{ fontSize: '13px', color: '#CBD5E1' }}>
              Duet Solutions | Ecosistema Operacional de Transporte
            </span>
          </div>
        </div>
        <div>
          <Link
            href="/sign-in"
            style={{
              backgroundColor: '#E8832A',
              color: '#FFFFFF',
              padding: '10px 20px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '14px',
              boxShadow: '0 2px 4px rgba(232, 131, 42, 0.2)',
            }}
          >
            Iniciar Sesión Operativa ↗
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1080px', margin: '48px auto', padding: '0 24px' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '32px',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(28, 59, 87, 0.04)',
            marginBottom: '32px',
          }}
        >
          <h2 style={{ fontSize: '20px', color: '#1C3B57', fontWeight: 700, margin: '0 0 8px 0' }}>
            Estado del Sistema & Security Spine
          </h2>
          <p style={{ color: '#475569', fontSize: '14px', margin: '0 0 24px 0', lineHeight: '1.5' }}>
            Plataforma B2B para la gestión integral de empresas de transporte de personal y control operacional en
            tiempo real. Todas las interfaces operan bajo aislamiento estrito con PostgreSQL, PostGIS y Row-Level
            Security (RLS).
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div
              style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}
            >
              <div style={{ color: '#88A947', fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>
                ● WEB PORTALS ACTIVES
              </div>
              <div style={{ fontSize: '13px', color: '#475569' }}>
                Next.js 15 App Router con Server Actions & RLS Guards
              </div>
            </div>
            <div
              style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}
            >
              <div style={{ color: '#88A947', fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>
                ● TERMINAL DRIVER ACTIVO
              </div>
              <div style={{ fontSize: '13px', color: '#475569' }}>
                Expo SDK / Native con SecureStore Shims y sesión RLS
              </div>
            </div>
            <div
              style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}
            >
              <div style={{ color: '#88A947', fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>
                ● POSTGRES RLS ENFORCED
              </div>
              <div style={{ fontSize: '13px', color: '#475569' }}>
                Aislamiento por tenant, auditoría inmutable y PostGIS
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '32px',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(28, 59, 87, 0.04)',
          }}
        >
          <h3 style={{ fontSize: '18px', color: '#1C3B57', fontWeight: 700, margin: '0 0 20px 0' }}>
            Accesos Directos a Portales del Ecosistema
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <Link
              href="/operator"
              style={{
                display: 'block',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                textDecoration: 'none',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ color: '#E8832A', fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>
                Centro de Mando Operador ↗
              </div>
              <div style={{ color: '#475569', fontSize: '13.5px', lineHeight: '1.4' }}>
                Consola B2B para Tenant Admins: administración de personal, invitaciones seguras y enlace a terminal
                conductor.
              </div>
            </Link>

            <Link
              href="/platform"
              style={{
                display: 'block',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                textDecoration: 'none',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ color: '#1C3B57', fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>
                Platform SuperAdmin Portal ↗
              </div>
              <div style={{ color: '#475569', fontSize: '13.5px', lineHeight: '1.4' }}>
                Gestión global de empresas transportistas, auditoría corporativa y configuración de branding B2B.
              </div>
            </Link>

            <a
              href="http://localhost:8081"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                textDecoration: 'none',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ color: '#88A947', fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>
                Terminal Móvil Conductor (Expo Web) ↗
              </div>
              <div style={{ color: '#475569', fontSize: '13.5px', lineHeight: '1.4' }}>
                Terminal nativo de abordo para choferes con verificación de identidad y contexto multi-tenant en tiempo
                real.
              </div>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
