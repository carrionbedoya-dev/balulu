import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Heart, MessageCircle, Settings, PawPrint } from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: favorites } = await supabase
    .from("favorites")
    .select("pets(id, name, species, images, status)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  const { data: interests } = await supabase
    .from("adoption_interests")
    .select("pets(id, name, species, images), status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div className="min-h-screen bg-balulu-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-balulu shadow-balulu p-8 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-balulu-primary-100 rounded-balulu flex items-center justify-center">
              <User className="w-10 h-10 text-balulu-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-balulu-text">
                {profile?.full_name || user.email?.split("@")[0] || "Usuario"}
              </h1>
              <p className="text-balulu-muted">{user.email}</p>
              <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-balulu-secondary-50 text-balulu-secondary-700 text-xs font-medium rounded-full">
                <PawPrint className="w-3 h-3" />
                Adoptante
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-balulu p-6 border border-balulu-border">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-5 h-5 text-balulu-accent-500" />
              <span className="text-2xl font-bold text-balulu-text">
                {favorites?.length || 0}
              </span>
            </div>
            <p className="text-sm text-balulu-muted">Favoritos guardados</p>
          </div>
          <div className="bg-white rounded-balulu p-6 border border-balulu-border">
            <div className="flex items-center gap-3 mb-2">
              <MessageCircle className="w-5 h-5 text-balulu-primary-500" />
              <span className="text-2xl font-bold text-balulu-text">
                {interests?.length || 0}
              </span>
            </div>
            <p className="text-sm text-balulu-muted">Intereses de adopcion</p>
          </div>
          <div className="bg-white rounded-balulu p-6 border border-balulu-border">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-5 h-5 text-balulu-muted" />
              <span className="text-sm font-medium text-balulu-text">
                Configuracion
              </span>
            </div>
            <p className="text-sm text-balulu-muted">Gestionar tu cuenta</p>
          </div>
        </div>

        {/* Recent favorites */}
        {favorites && favorites.length > 0 && (
          <div className="bg-white rounded-balulu shadow-balulu p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-balulu-text">
                Favoritos recientes
              </h2>
              <Link
                href="/favoritos"
                className="text-sm text-balulu-primary-600 hover:text-balulu-primary-700 font-medium"
              >
                Ver todos
              </Link>
            </div>
            <div className="space-y-3">
              {favorites.map((fav: any) => (
                <Link
                  key={fav.pets.id}
                  href={`/mascota/${fav.pets.id}`}
                  className="flex items-center gap-4 p-3 rounded-balulu-sm hover:bg-balulu-primary-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-balulu-border rounded-balulu-sm flex items-center justify-center overflow-hidden">
                    {fav.pets.images && fav.pets.images.length > 0 ? (
                      <img
                        src={fav.pets.images[0]}
                        alt={fav.pets.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <PawPrint className="w-6 h-6 text-balulu-muted" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-balulu-text">
                      {fav.pets.name}
                    </p>
                    <p className="text-sm text-balulu-muted">
                      {fav.pets.species
                        ? fav.pets.species.charAt(0).toUpperCase() +
                          fav.pets.species.slice(1)
                        : "Mascota"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent interests */}
        {interests && interests.length > 0 && (
          <div className="bg-white rounded-balulu shadow-balulu p-6">
            <h2 className="text-lg font-semibold text-balulu-text mb-4">
              Intereses de adopcion recientes
            </h2>
            <div className="space-y-3">
              {interests.map((interest: any) => (
                <div
                  key={interest.pets.id}
                  className="flex items-center gap-4 p-3 rounded-balulu-sm border border-balulu-border"
                >
                  <div className="w-12 h-12 bg-balulu-border rounded-balulu-sm flex items-center justify-center overflow-hidden">
                    {interest.pets.images && interest.pets.images.length > 0 ? (
                      <img
                        src={interest.pets.images[0]}
                        alt={interest.pets.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <PawPrint className="w-6 h-6 text-balulu-muted" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-balulu-text">
                      {interest.pets.name}
                    </p>
                    <p className="text-sm text-balulu-muted">
                      Estado:{" "}
                      <span className="text-balulu-secondary-600 font-medium">
                        {interest.status}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
