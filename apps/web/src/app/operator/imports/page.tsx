import React from 'react';
import { requireOperatorAccess } from '@/lib/auth/guards';
import { PageHeader } from '@transport-platform/ui-web';

export const metadata = {
  title: 'Carga por Lote e Importaciones | Consola Operador',
  description: 'Módulo corporativo de ingesta masiva de datos operativos por lotes.',
};

export default async function OperatorImportsPage() {
  const access = await requireOperatorAccess();
  if (!access.authorized || !access.tenant) return null;

  const { tenant } = access;

  return (
    <div>
      <PageHeader
        title="Carga por Lote e Importaciones Operativas"
        subtitle={`Procesamiento masivo de nómina de personal y registros operativos por fichero para ${tenant.display_name}`}
      />

      {/* Panel Explicativo Honesto y Corporativo */}
      <div
        style={{
          backgroundColor: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: '8px',
          padding: '24px',
          marginBottom: '32px',
          color: '#92400E',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span
            style={{
              backgroundColor: '#854D0E',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Módulo Deshabilitado en DEV
          </span>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#78350F' }}>
            Procesador Asíncrono de Archivos y Plantillas Masivas
          </h3>
        </div>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px', lineHeight: '1.5', color: '#92400E' }}>
          El motor de procesamiento masivo por lotes (Batch Import) para la ingesta automática de listas de personal y
          asignaciones masivas se encuentra deshabilitado en el entorno local actual. La ejecución de transacciones
          masivas requiere validación de esquemas de seguridad y asignación de workers asíncronos autorizados por el
          Administrador de la Plataforma.
        </p>
      </div>

      {/* Referencia de Esquema Técnico de Importación */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #CBD5E1',
          borderRadius: '8px',
          padding: '28px',
          boxShadow: '0 1px 3px rgba(28, 59, 87, 0.02)',
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '17px', fontWeight: 700, color: '#1C3B57' }}>
            Estructura Técnica de Plantillas (.CSV / .XLSX)
          </h4>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#64748B' }}>
            Especificación de formato exigida para la validación relacional de datos antes de su inserción bajo RLS.
          </p>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
          <thead>
            <tr
              style={{
                backgroundColor: '#F8F9FA',
                borderBottom: '2px solid #E2E8F0',
                color: '#4A5568',
                fontWeight: 700,
              }}
            >
              <th style={{ padding: '12px 16px' }}>Columna en Cabecera</th>
              <th style={{ padding: '12px 16px' }}>Tipo de Dato</th>
              <th style={{ padding: '12px 16px' }}>Requerido</th>
              <th style={{ padding: '12px 16px' }}>Regla de Negocio & Validación RLS</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '14px 16px', fontWeight: 700, fontFamily: 'monospace', color: '#1C3B57' }}>
                rut_id
              </td>
              <td style={{ padding: '14px 16px', color: '#475569' }}>Texto (Alfanumérico)</td>
              <td style={{ padding: '14px 16px' }}>
                <span style={{ color: '#166534', fontWeight: 700 }}>Sí (Obligatorio)</span>
              </td>
              <td style={{ padding: '14px 16px', color: '#475569' }}>
                Identificador fiscal único. Se valida que no exista un registro duplicado en la misma empresa
                transportista.
              </td>
            </tr>

            <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '14px 16px', fontWeight: 700, fontFamily: 'monospace', color: '#1C3B57' }}>
                nombre_completo
              </td>
              <td style={{ padding: '14px 16px', color: '#475569' }}>Texto (UTF-8)</td>
              <td style={{ padding: '14px 16px' }}>
                <span style={{ color: '#166534', fontWeight: 700 }}>Sí (Obligatorio)</span>
              </td>
              <td style={{ padding: '14px 16px', color: '#475569' }}>
                Nombre y apellidos del conductor u operador. Longitud mínima de 3 caracteres.
              </td>
            </tr>

            <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '14px 16px', fontWeight: 700, fontFamily: 'monospace', color: '#1C3B57' }}>
                correo_operativo
              </td>
              <td style={{ padding: '14px 16px', color: '#475569' }}>Email Normalizado</td>
              <td style={{ padding: '14px 16px' }}>
                <span style={{ color: '#166534', fontWeight: 700 }}>Sí (Obligatorio)</span>
              </td>
              <td style={{ padding: '14px 16px', color: '#475569' }}>
                Dirección de correo que se utilizará para enlazar con la tabla de identidades y enviar invitaciones.
              </td>
            </tr>

            <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '14px 16px', fontWeight: 700, fontFamily: 'monospace', color: '#1C3B57' }}>
                rol_asignado
              </td>
              <td style={{ padding: '14px 16px', color: '#475569' }}>Enum Estricto</td>
              <td style={{ padding: '14px 16px' }}>
                <span style={{ color: '#166534', fontWeight: 700 }}>Sí (Obligatorio)</span>
              </td>
              <td style={{ padding: '14px 16px', color: '#475569' }}>
                Valores permitidos: <code>driver</code> (Conductor Rodante) u <code>operator</code> (Asistente de
                Despacho).
              </td>
            </tr>

            <tr>
              <td style={{ padding: '14px 16px', fontWeight: 700, fontFamily: 'monospace', color: '#1C3B57' }}>
                centro_costo
              </td>
              <td style={{ padding: '14px 16px', color: '#475569' }}>Texto (Opcional)</td>
              <td style={{ padding: '14px 16px' }}>
                <span style={{ color: '#64748B', fontWeight: 600 }}>Opcional</span>
              </td>
              <td style={{ padding: '14px 16px', color: '#475569' }}>
                Código interno para facturación o clasificación en centros de operación B2B.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
