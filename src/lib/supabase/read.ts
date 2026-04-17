import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { hasAdminSupabaseEnv, hasPublicSupabaseEnv } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export function hasReadableSupabaseEnv() {
  return hasAdminSupabaseEnv() || hasPublicSupabaseEnv();
}

export function createReadableSupabaseClient() {
  if (hasAdminSupabaseEnv()) {
    return createAdminSupabaseClient();
  }

  if (hasPublicSupabaseEnv()) {
    return createServerSupabaseClient();
  }

  throw new Error("Missing readable Supabase environment variables.");
}

export default createReadableSupabaseClient;
