import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

let clientInstance: ReturnType<typeof createSupabaseClient<Database>> | null = null;
let publicClientInstance: ReturnType<typeof createSupabaseClient<Database>> | null = null;

// Cliente con autenticación (para favoritos, login, perfil)
export function createClient() {
  if (clientInstance) return clientInstance;

  clientInstance = createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "balulu-auth",
        flowType: "pkce",
      },
    }
  );

  return clientInstance;
}

// Cliente público SIN autenticación (para leer mascotas, organizaciones)
export function createPublicClient() {
  if (publicClientInstance) return publicClientInstance;

  publicClientInstance = createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return publicClientInstance;
}
