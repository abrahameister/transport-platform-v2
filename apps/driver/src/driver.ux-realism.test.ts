/**
 * Expo Driver App — UX Realism & Zero-Mock Verification Tests
 *
 * Validates:
 * - Absence of marketing promotional copy ("Next Release", "Bloque 2/3", "Sprint", "QR", "UPCOMING_MODULES")
 * - Presence of honest operational capabilities and connectivity testing
 * - Compliance with Duet Solutions B2B design guidelines
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const DRIVER_ROOT = path.resolve(__dirname, '../');

function getAppFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAppFiles(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
      results.push(fullPath);
    }
  }
  return results;
}

describe('Driver App Zero-Mock & Honest UX Compliance', () => {
  const appDir = path.join(DRIVER_ROOT, 'app');
  const allAppFiles = getAppFiles(appDir);

  it('contains zero references to QR code reading or mock promotional modules in any screen', () => {
    const prohibitedWords = [
      'Lectura QR',
      'QR',
      'UPCOMING_MODULES',
      'Bloque 2',
      'Bloque 3',
      'Next Release',
      'Sprint 2+',
    ];
    const violations: { file: string; word: string }[] = [];

    for (const filePath of allAppFiles) {
      const content = fs.readFileSync(filePath, 'utf8');
      for (const word of prohibitedWords) {
        // use word boundaries for short words like QR
        const regex = new RegExp(word === 'QR' ? '\\bQR\\b' : word, 'i');
        if (regex.test(content)) {
          violations.push({ file: path.relative(DRIVER_ROOT, filePath), word });
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it('operator home terminal displays honest connectivity matrix and interactive session check', () => {
    const homePath = path.join(appDir, '(operator)', 'index.tsx');
    expect(fs.existsSync(homePath)).toBe(true);
    const content = fs.readFileSync(homePath, 'utf8');

    // Verify honest connectivity section
    expect(content).toContain('Conectividad del Terminal');
    expect(content).toContain('Supabase Local DEV');

    // Verify honest capability listing
    expect(content).toContain('Capacidades y Módulos');
    expect(content).toContain('Autenticación & Aislamiento RLS');
    expect(content).toContain('Hoja de Ruta y Despachos');

    // Verify interactive test button and alert
    expect(content).toContain('Verificar Conectividad de Sesión');
    expect(content).toContain('Alert.alert');
  });

  it('all tab screens implement corporate B2B notice and discard marketing fluff', () => {
    const tabsDir = path.join(appDir, '(tabs)');
    const indexContent = fs.readFileSync(path.join(tabsDir, 'index.tsx'), 'utf8');
    const activityContent = fs.readFileSync(path.join(tabsDir, 'activity.tsx'), 'utf8');
    const profileContent = fs.readFileSync(path.join(tabsDir, 'profile.tsx'), 'utf8');

    expect(indexContent).toContain('Estado del Terminal');
    expect(activityContent).toContain(
      'El registro de services previos no se encuentra disponible actualmente para su empresa'.replace(
        'services',
        'servicios'
      )
    );
    expect(profileContent).toContain('Administrador de Operaciones');
  });
});
