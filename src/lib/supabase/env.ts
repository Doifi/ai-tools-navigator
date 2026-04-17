/**
 * Public Supabase environment variables required by read APIs.
 */
export function hasPublicSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Admin Supabase environment variables required by privileged admin actions.
 */
export function hasAdminSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export default hasPublicSupabaseEnv;
