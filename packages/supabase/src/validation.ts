import { z } from 'zod';

export function isLocalHost(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    return parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1' || parsed.hostname === '::1';
  } catch {
    return false;
  }
}

export function isServiceRoleJwt(key: string): boolean {
  if (key.startsWith('sb_secret_') || key.includes('service_role')) {
    return true;
  }
  if (key.startsWith('eyJ')) {
    try {
      const parts = key.split('.');
      if (parts.length >= 2 && parts[1]) {
        const payload = Buffer.from(parts[1], 'base64').toString('utf-8');
        if (payload.includes('"role":"service_role"') || payload.includes('service_role')) {
          return true;
        }
      }
    } catch {
      // Ignore parse errors
    }
  }
  return false;
}

export function validateSupabaseUrl(urlStr: unknown): string {
  if (typeof urlStr !== 'string' || !urlStr.trim()) {
    throw new Error('[Supabase Validation] URL is missing or empty.');
  }

  const trimmed = urlStr.trim();

  // Detect swapped arguments
  if (trimmed.startsWith('sb_') || trimmed.startsWith('eyJ')) {
    throw new Error('[Supabase Validation] Invalid URL: Received an API key instead of a valid URL.');
  }

  const urlResult = z.string().url().safeParse(trimmed);
  if (!urlResult.success) {
    throw new Error(`[Supabase Validation] Invalid URL format: "${trimmed}".`);
  }

  return trimmed;
}

export function validatePublishableKey(
  key: unknown,
  urlStr: string,
  clientType: 'browser' | 'native' | 'server'
): string {
  if (typeof key !== 'string' || !key.trim()) {
    throw new Error(`[Supabase Validation ${clientType}] Publishable API key is missing or empty.`);
  }

  const trimmed = key.trim();

  // Detect swapped arguments
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    throw new Error(`[Supabase Validation ${clientType}] Invalid API Key: Received a URL instead of an API key.`);
  }

  // Strict check: secret / admin / service_role keys are strictly forbidden in client factories
  if (isServiceRoleJwt(trimmed)) {
    throw new Error(
      `[Supabase Validation ${clientType}] Security Violation: Secret/Admin keys are forbidden in ${clientType} clients.`
    );
  }

  if (isLocalHost(urlStr)) {
    return trimmed;
  }

  // Hosted key validation
  if (trimmed.startsWith('sb_publishable_') || trimmed.startsWith('eyJ')) {
    return trimmed;
  }

  return trimmed;
}

export function validateAdminKey(key: unknown, urlStr: string): string {
  if (typeof key !== 'string' || !key.trim()) {
    throw new Error('[Supabase Validation Admin] Secret/Admin API key is missing or empty.');
  }

  const trimmed = key.trim();

  // Detect swapped arguments
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    throw new Error('[Supabase Validation Admin] Invalid Admin Key: Received a URL instead of an Admin key.');
  }

  if (isLocalHost(urlStr)) {
    return trimmed;
  }

  // Hosted admin key validation
  if (trimmed.startsWith('sb_secret_') || isServiceRoleJwt(trimmed)) {
    return trimmed;
  }

  return trimmed;
}
