import { describe, it, expect } from 'vitest';
import { createBrowserClient } from './browser';
import { createNativeClient } from './native';
import { createServerClient } from './server';
import { createAdminClient } from './admin';

describe('Framework-Agnostic Supabase Factories & Security Boundaries', () => {
  const localUrl = 'http://127.0.0.1:54321';
  const hostedUrl = 'https://xyzcompany.supabase.co';

  const localAnonKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvY2FsIiwicm9sZSI6ImFub24ifQ.placeholder';
  const localServiceKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvY2FsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSJ9.placeholder';

  const hostedPublishableKey = 'sb_publishable_1234567890abcdef';
  const hostedSecretKey = 'sb_secret_1234567890abcdef';

  it('instantiates browser client with valid local or hosted publishable key', () => {
    const clientLocal = createBrowserClient({ url: localUrl, publishableKey: localAnonKey });
    expect(clientLocal).toBeDefined();

    const clientHosted = createBrowserClient({ url: hostedUrl, publishableKey: hostedPublishableKey });
    expect(clientHosted).toBeDefined();
  });

  it('instantiates native client with valid publishable key', () => {
    const client = createNativeClient({ url: localUrl, publishableKey: localAnonKey });
    expect(client).toBeDefined();
  });

  it('instantiates server client with valid publishable key', () => {
    const client = createServerClient({ url: localUrl, publishableKey: localAnonKey });
    expect(client).toBeDefined();
  });

  it('instantiates admin client with valid secret key', () => {
    const clientLocal = createAdminClient({ url: localUrl, adminKey: localServiceKey });
    expect(clientLocal).toBeDefined();

    const clientHosted = createAdminClient({ url: hostedUrl, adminKey: hostedSecretKey });
    expect(clientHosted).toBeDefined();
  });

  it('throws error when URL is missing or empty', () => {
    expect(() => createBrowserClient({ url: '', publishableKey: localAnonKey })).toThrow(
      '[Supabase Validation] URL is missing'
    );
  });

  it('throws error when publishable key is missing or empty', () => {
    expect(() => createBrowserClient({ url: localUrl, publishableKey: '' })).toThrow(
      '[Supabase Validation browser] Publishable API key is missing'
    );
  });

  it('throws error when URL and key are swapped', () => {
    // Passing key as URL
    expect(() => createBrowserClient({ url: hostedPublishableKey, publishableKey: localUrl })).toThrow(
      '[Supabase Validation] Invalid URL: Received an API key'
    );
    // Passing URL as key
    expect(() => createBrowserClient({ url: localUrl, publishableKey: hostedUrl })).toThrow(
      '[Supabase Validation browser] Invalid API Key: Received a URL'
    );
  });

  it('strictly forbids secret/admin keys in browser and native clients', () => {
    expect(() => createBrowserClient({ url: localUrl, publishableKey: hostedSecretKey })).toThrow(
      'Security Violation: Secret/Admin keys are forbidden in browser clients'
    );
    expect(() => createNativeClient({ url: localUrl, publishableKey: localServiceKey })).toThrow(
      'Security Violation: Secret/Admin keys are forbidden in native clients'
    );
  });
});
