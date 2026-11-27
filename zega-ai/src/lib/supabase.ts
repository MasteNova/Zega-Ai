import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isConfigured = Boolean(url && anon);
export const supabase: SupabaseClient | null = isConfigured ? createClient(url!, anon!) : null;

export function requireClient(): SupabaseClient {
  if (!supabase) throw new Error('SUPABASE_NOT_CONFIGURED');
  return supabase;
}

export function friendlyError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  if (msg.includes('SUPABASE_NOT_CONFIGURED'))
    return 'Backend not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env — see README.';
  if (msg.includes('rate_limited')) return 'Too many requests. Please wait a few minutes and try again.';
  if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) return 'Network problem. Check your connection and retry.';
  return msg;
}
