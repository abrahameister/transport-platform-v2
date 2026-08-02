import React from 'react';
import { requireOperatorAccess } from '@/lib/auth/guards';
import { PageHeader } from '@transport-platform/ui-web';

export const metadata = {
  title: 'Demanda y Servicios | Consola Operador',
  description: 'Monitoreo corporativo de demanda de transporte y capacidad de flota.',
};

export default async function OperatorDemandPage() {
  const access = await requireOperatorAccess();
  if (!access.authorized || !access.tenant) return null;

  const { tenant } = access;

  return (
    <div>
      <PageHeader
        title="Monitoreo de Demanda y Servicios Operativos"
        subtitle={`Control de requerimientos de traslado, programación de despachos y balance de flota para ${tenant.display_name}`}
      />

      {/* Panel Estado Real del Servicio */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #CBD5E1',
          borderRadius: '8px',
          padding: '28px',
          marginBottom: '28px',
          boxShadow: '0 1px 3px rgba(28, 59, 87, 0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span
            style={{
              backgroundColor: '#475569',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Módulo Deshabilitado en DEV
          </span>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1C3B57' }}>
            Motor de Despachos y Programación de Rutas en Vivo
          </h3>
        </div>

        <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.5', margin: '0 0 16px 0', maxWidth: '820px' }}>
          El motor relacional de despacho en vivo, cálculo algorítmico de demanda operativa y trazados de hoja de ruta
          se encuentra deshabilitado para esta empresa en el entorno actual. Por directivas de honestidad arquitectónica
          de <strong>Duet Solutions</strong>, este sistema no genera simulaciones visuales, mapas decorativos falsos ni
          recorridos sintéticos no respaldados por registros PostGIS reales.
        </p>

        <div
          style={{
            backgroundColor: '#F8F9FA',
            borderLeft: '4px solid #E8832A',
            padding: '16px',
            borderRadius: '4px',
          }}
        >
          <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1C3B57', marginBottom: '4px' }}>
            Requisito de Activación Transaccional
          </div>
          <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.4' }}>
            Para habilitar el despacho de órdenes en vivo hacia la App Conductor, confirme que la configuración de
            módulos operativos (<em>tenant_module_settings</em>) haya sido aprovisionada por el Administrador de
            Plataforma.
          </div>
        </div>
      </div>

      {/* Principios Operativos y Trazabilidad */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #CBD5E1',
          borderRadius: '8px',
          padding: '28px',
          boxShadow: '0 1px 3px rgba(28, 59, 87, 0.02)',
        }}
      >
        <h4 style={{ margin: '0 0 16px 0', fontSize: '17px', fontWeight: 700, color: '#1C3B57' }}>
          Garantías del Sistema de Transporte (Security Spine)
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div
            style={{ padding: '18px', backgroundColor: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0' }}
          >
            <div style={{ fontWeight: 700, color: '#1C3B57', fontSize: '15px', marginBottom: '8px' }}>
              ● Cero Simulación Artificial
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: '1.4' }}>
              Queda estrictamente descartado el uso de mockups inyectados en memoria o generadores aleatorios (
              <code>Math.random()</code>). Cada despacho visualizado corresponde al 100% con filas persistidas en base
              de datos.
            </p>
          </div>

          <div
            style={{ padding: '18px', backgroundColor: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0' }}
          >
            <div style={{ fontWeight: 700, color: '#1C3B57', fontSize: '15px', marginBottom: '8px' }}>
              ● Aislamiento PostGIS & RLS
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: '1.4' }}>
              Las geometrías espaciales y geocercas se procesan dentro de Postgres con políticas Row-Level Security
              (RLS), impidiendo la exfiltración o visualización cruzada entre empresas transportistas compitiendo en el
              ecosistema.
            </p>
          </div>

          <div
            style={{ padding: '18px', backgroundColor: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0' }}
          >
            <div style={{ fontWeight: 700, color: '#1C3B57', fontSize: '15px', marginBottom: '8px' }}>
              ● Conexión Nativas Expo
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: '1.4' }}>
              Las instrucciones y hojas de servicio emergen orgánicamente en el terminal rodante del conductor
              únicamente al existir la confirmación y firma criptográfica de la sesión en el servidor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
