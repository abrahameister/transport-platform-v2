/**
 * Expo Driver App — Security & Authentication Tests
 *
 * Validates:
 * - No service role key in any driver source file
 * - Session management logic
 * - Guard behavior for unauthorized states
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const DRIVER_ROOT = path.resolve(__dirname, '../');

// Recursively scan files in a directory
function scanFiles(dir: string, extensions: string[]): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory() && !['node_modules', '.expo', '.turbo', 'dist'].includes(entry.name)) {
      results.push(...scanFiles(fullPath, extensions));
    } else if (entry.isFile() && extensions.some((ext) => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }

  return results;
}

describe('Expo Driver Security Boundaries', () => {
  const allFiles = scanFiles(DRIVER_ROOT, ['.ts', '.tsx', '.js']);
  const sourceFiles = allFiles.filter((p) => !p.includes('node_modules') && !p.includes('.test.'));

  it('never imports SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ADMIN_KEY in driver source', () => {
    const violations: string[] = [];

    for (const filePath of sourceFiles) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (
        content.includes('SUPABASE_SERVICE_ROLE_KEY') ||
        content.includes('SUPABASE_ADMIN_KEY') ||
        content.includes('supabase/admin')
      ) {
        violations.push(path.relative(DRIVER_ROOT, filePath));
      }
    }

    expect(violations).toEqual([]);
  });

  it('never imports @transport-platform/supabase/admin in driver source', () => {
    const violations: string[] = [];

    for (const filePath of sourceFiles) {
      if (filePath.includes('node_modules')) continue;
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('@transport-platform/supabase/admin')) {
        violations.push(path.relative(DRIVER_ROOT, filePath));
      }
    }

    expect(violations).toEqual([]);
  });

  it('never logs access_token or refresh_token in driver source', () => {
    const violations: string[] = [];

    for (const filePath of sourceFiles) {
      if (filePath.includes('node_modules')) continue;
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('access_token') || content.includes('refresh_token')) {
        violations.push(path.relative(DRIVER_ROOT, filePath));
      }
    }

    expect(violations).toEqual([]);
  });

  it('only uses EXPO_PUBLIC_ prefixed env vars in driver source', () => {
    // Verify no non-public env vars are used
    const violations: string[] = [];
    const allowedPatterns = ['EXPO_PUBLIC_SUPABASE_URL', 'EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'NODE_ENV'];

    for (const filePath of sourceFiles) {
      if (filePath.includes('node_modules') || filePath.includes('.test.')) continue;
      const content = fs.readFileSync(filePath, 'utf8');
      const envMatches = content.match(/process\.env\.([A-Z_]+)/g) || [];
      for (const match of envMatches) {
        const varName = match.replace('process.env.', '');
        if (!allowedPatterns.includes(varName) && !varName.startsWith('EXPO_PUBLIC_')) {
          violations.push(`${path.relative(DRIVER_ROOT, filePath)}: ${varName}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});

describe('Expo Driver Session Management', () => {
  it('SessionContext provides expected exports and reactive auth structure', () => {
    const contextPath = path.join(DRIVER_ROOT, 'lib', 'SessionContext.tsx');
    expect(fs.existsSync(contextPath)).toBe(true);
    const content = fs.readFileSync(contextPath, 'utf8');
    expect(content).toContain('export function SessionProvider');
    expect(content).toContain('export function useSession');
    expect(content).toContain('onAuthStateChange');
  });

  it('supabase client factory uses native client and implements singleton pattern', () => {
    const supabasePath = path.join(DRIVER_ROOT, 'lib', 'supabase.ts');
    expect(fs.existsSync(supabasePath)).toBe(true);
    const content = fs.readFileSync(supabasePath, 'utf8');
    expect(content).toContain("import { createNativeClient } from '@transport-platform/supabase/native'");
    expect(content).toContain('export function getDriverSupabaseClient()');
    expect(content).toContain('if (_client) return _client;');
  });
});

describe('Expo Driver Navigation Guards', () => {
  it('(operator) layout file exists and contains session guard logic', () => {
    const layoutPath = path.join(DRIVER_ROOT, 'app', '(operator)', '_layout.tsx');
    expect(fs.existsSync(layoutPath)).toBe(true);
    const content = fs.readFileSync(layoutPath, 'utf8');
    // Must check for suspended tenant rejection
    expect(content).toContain('suspended');
    // Must check for inactive membership rejection
    expect(content).toContain('membership.status');
    // Must redirect unauthenticated users
    expect(content).toContain('sign-in');
  });

  it('sign-in screen exists and uses public auth only', () => {
    const signInPath = path.join(DRIVER_ROOT, 'app', '(auth)', 'sign-in.tsx');
    expect(fs.existsSync(signInPath)).toBe(true);
    const content = fs.readFileSync(signInPath, 'utf8');
    // Must use the session context signIn (which uses public auth)
    expect(content).toContain('useSession');
    expect(content).toContain('signIn');
    // Must NOT contain any service role reference
    expect(content).not.toContain('service_role');
    expect(content).not.toContain('SUPABASE_ADMIN_KEY');
  });

  it('operator home screen shows user, tenant, role and logout', () => {
    const homePath = path.join(DRIVER_ROOT, 'app', '(operator)', 'index.tsx');
    expect(fs.existsSync(homePath)).toBe(true);
    const content = fs.readFileSync(homePath, 'utf8');
    expect(content).toContain('tenant');
    expect(content).toContain('user');
    expect(content).toContain('membership.role');
    expect(content).toContain('signOut');
    expect(content).toContain('branding');
  });
});
