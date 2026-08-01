import { describe, it, expect } from 'vitest';
import { createBrowserClient } from './browser';
import { createServerClient } from './server';

describe('Supabase Package Subpath Export Boundaries', () => {
  it('creates browser client with publishable keys', () => {
    const client = createBrowserClient({
      supabaseUrl: 'http://127.0.0.1:54321',
      publishableKey: 'test_publishable_key',
    });
    expect(client).toBeDefined();
  });

  it('creates server client with publishable keys', () => {
    const client = createServerClient({
      supabaseUrl: 'http://127.0.0.1:54321',
      publishableKey: 'test_publishable_key',
    });
    expect(client).toBeDefined();
  });
});
