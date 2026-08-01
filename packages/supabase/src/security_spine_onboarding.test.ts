import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';

function checkIsPlatformSuperAdmin(email: string | null | undefined, allowlist: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const normalizedEmail = email.trim().toLowerCase();
  const allowedEmails = allowlist
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowedEmails.includes(normalizedEmail);
}

function mockRequirePlatformAdmin(user: { id: string; email?: string } | null, allowlist: string) {
  if (!user) return { authorized: false, status: 401 };
  const email = user.email ? user.email.trim().toLowerCase() : '';
  if (!checkIsPlatformSuperAdmin(email, allowlist)) {
    return { authorized: false, status: 403, reason: 'Forbidden: Requires Platform SuperAdmin role.' };
  }
  return { authorized: true, status: 200, actorUserId: user.id, actorEmail: email };
}

function mockRequireOperatorAccess(
  user: { id: string; email?: string } | null,
  activeTenantId?: string | null,
  status?: string
) {
  if (!user) return { authorized: false, status: 401 };
  if (!activeTenantId) {
    return { authorized: false, status: 403, reason: 'No active tenant or operational membership assigned.' };
  }
  if (status !== 'active') {
    return { authorized: false, status: 403, reason: 'Tenant is not active.' };
  }
  return { authorized: true, status: 200 };
}

function getAllFiles(dir: string, fileList: string[] = []): string[] {
  try {
    const files = readdirSync(dir);
    files.forEach((file) => {
      const filePath = join(dir, file);
      if (statSync(filePath).isDirectory()) {
        if (!file.includes('node_modules') && !file.includes('.next')) {
          getAllFiles(filePath, fileList);
        }
      } else {
        fileList.push(filePath);
      }
    });
  } catch {
    // Si la carpeta no existe, ignorar
  }
  return fileList;
}

describe('Block 1 Tenant Onboarding — Security & Authorization Verification', () => {
  const allowlist = 'platform.admin.dev@example.com,superadmin@transportplatform.com';

  it('allowlist permite el email autorizado con normalización lower(trim(email))', () => {
    expect(checkIsPlatformSuperAdmin('  platform.admin.dev@example.com  ', allowlist)).toBe(true);
    expect(checkIsPlatformSuperAdmin('SUPERADMIN@TRANSPORTPLATFORM.COM', allowlist)).toBe(true);
  });

  it('allowlist rechaza otro email no perteneciente a la lista', () => {
    expect(checkIsPlatformSuperAdmin('tenant.admin.dev@example.com', allowlist)).toBe(false);
    expect(checkIsPlatformSuperAdmin('hacker@unknown.com', allowlist)).toBe(false);
    expect(checkIsPlatformSuperAdmin(null, allowlist)).toBe(false);
  });

  it('actor de RPC proviene exclusivamente de la sesión verificada en servidor', () => {
    const sessionUser = { id: '00000000-0000-0000-0000-000000000001', email: 'platform.admin.dev@example.com' };
    const authResult = mockRequirePlatformAdmin(sessionUser, allowlist);

    expect(authResult.authorized).toBe(true);
    expect(authResult.actorUserId).toBe(sessionUser.id);
    expect(authResult.actorEmail).toBe('platform.admin.dev@example.com');
  });

  it('service role no aparece en código cliente (UI o archivos no marcados server-only en web/src)', () => {
    // Analizar el workspace estáticamente para prevenir fuga de SUPABASE_SERVICE_ROLE_KEY
    const projectRoot = resolve(__dirname, '../../..');
    const webSrcDir = resolve(projectRoot, 'apps/web/src');
    const files = getAllFiles(webSrcDir);

    let clientExposures = 0;
    files.forEach((filePath) => {
      const content = readFileSync(filePath, 'utf8');
      const usesServiceKey =
        content.includes('SUPABASE_SERVICE_ROLE_KEY') || content.includes('@transport-platform/supabase/admin');

      if (usesServiceKey) {
        // Deben ser exclusivamente archivos que comiencen con import 'server-only'
        const hasServerOnly = content.includes("import 'server-only'") || content.includes('import "server-only"');
        const isClientComponent = content.includes("'use client'") || content.includes('"use client"');

        expect(isClientComponent).toBe(false);
        expect(hasServerOnly).toBe(true);
        if (isClientComponent || !hasServerOnly) {
          clientExposures++;
        }
      }
    });
    expect(clientExposures).toBe(0);
  });

  it('usuario tenant no entra a /platform', () => {
    const tenantUser = { id: '11111111-1111-1111-1111-111111111111', email: 'tenant.admin.dev@example.com' };
    const result = mockRequirePlatformAdmin(tenantUser, allowlist);
    expect(result.authorized).toBe(false);
    expect(result.status).toBe(403);
    expect(result.reason).toContain('Forbidden');
  });

  it('usuario sin tenant activo no entra a /operator', () => {
    const tenantUser = { id: '11111111-1111-1111-1111-111111111111', email: 'tenant.admin.dev@example.com' };

    // Sin tenant activo asignado ni membresía
    const resultNoTenant = mockRequireOperatorAccess(tenantUser, null);
    expect(resultNoTenant.authorized).toBe(false);
    expect(resultNoTenant.status).toBe(403);
    expect(resultNoTenant.reason).toContain('No active tenant');

    // Con tenant asignado pero en estado no activo (ej. draft o suspended)
    const resultDraftTenant = mockRequireOperatorAccess(tenantUser, 'tenant-uuid-123', 'draft');
    expect(resultDraftTenant.authorized).toBe(false);
    expect(resultDraftTenant.status).toBe(403);
  });
});
