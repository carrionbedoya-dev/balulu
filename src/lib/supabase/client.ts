import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

let clientInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;

// Cliente unico para el navegador. Usa cookies (no localStorage), igual que
// el middleware y el cliente de servidor -- asi la sesion es consistente en
// TODA la app, sin importar si el login fue por correo o por Google OAuth.
export function createClient() {
  if (clientInstance) return clientInstance;

  clientInstance = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return clientInstance;
}

// Alias para lecturas publicas (mascotas, organizaciones). Usa el mismo
// cliente: no hace falta uno separado, y evita el bug de sesiones divergentes.
export function createPublicClient() {
  return createClient();
}
