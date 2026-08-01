import 'server-only';
import { createAdminClient, SupabaseAdminConfig } from '@transport-platform/supabase/admin';

export function createWebAdminClient(config?: Partial<SupabaseAdminConfig>) {
  const url = config?.url || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const adminKey = config?.adminKey || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ADMIN_KEY || '';

  return createAdminClient({ url, adminKey });
}
