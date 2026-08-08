import { createClient } from '@supabase/supabase-js';
import { getSupabaseCredentials, getSupabaseServiceRoleKey } from '@/storage/database/supabase-client';

let adminClient: ReturnType<typeof createClient> | null = null;

export function getAdminClient() {
  if (adminClient) return adminClient;
  const { url } = getSupabaseCredentials();
  const serviceRoleKey = getSupabaseServiceRoleKey();
  adminClient = createClient(url, serviceRoleKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return adminClient;
}

export function getAnonClient() {
  const { url, anonKey } = getSupabaseCredentials();
  return createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}