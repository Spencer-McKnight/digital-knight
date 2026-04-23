import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { requireEnv } from '@/lib/env';

/**
 * Supabase — service-role client (server only).
 *
 *   Bypasses Row-Level Security by design. Never import this file from any
 *   module that compiles to the client bundle; the `server-only` guard makes
 *   that a build-time error.
 *
 *   One lazily-created singleton per runtime. The underlying client caches
 *   connections, so reaching for the same instance per request is correct
 *   (and cheaper than booting a new client for every Server Action call).
 */

let client: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (client) return client;

  client = createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: { schema: 'public' },
  });
  return client;
}
