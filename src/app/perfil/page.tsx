import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { User, Heart, MessageCircle, Settings, PawPrint, Edit3 } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: favorites } = await supabase
    .from("favorites")
    .select("pets(id, name, species, images, status)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  const { data: interests } = await supabase
    .from("adoption_interests")
    .select("pets(id, name, species, images), status, org_reply, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div className="min-h-screen bg-balulu-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <FadeIn>
          <div className="relative bg-gradient-to-br from-balulu-primary-600 via-balulu-primary-700 to-balulu-secondary-700 rounded-balulu shadow-balulu-lg p-8 mb-6 overflow-hidden">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute right-16 -bottom-12 w-28 h-28 bg-white/10 rounded-full" />
            <div className="relative flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white/15 backdrop-blur-sm rounded-balulu flex items-center justify-center border-2 border-white/20">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                    Mi BALULU
                  </h1>
                  <p className="text-white font-semibold mt-0.5">
                    {user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuario"}
                  </p>
                  <p className="text-white/70 text-sm">{user.email}</p>
                  <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                    <PawPrint className="w-3 h-3" />
                    Adoptante
                  </span>
                </div>
              </div>
              <Link
                href="/perfil/editar"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-balulu-primary-700 bg-white rounded-full hover:scale-105 active:scale-95 transition-transform shadow-balulu"
              >
                <Edit3 className="w-4 h-4" />
                Editar perfil
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            {
              icon: Heart,
              value: favorites?.length || 0,
              label: "Favoritos guardados",
              bg: "bg-gradient-to-br from-rose-500 to-rose-700",
            },
            {
              icon: MessageCircle,
              value: interests?.length || 0,
              label: "Intereses de adopcion",
              bg: "bg-gradient-to-br from-balulu-primary-500 to-balulu-primary-700",
            },
            {
              icon: Settings,
              value: null,
              label: "Configuracion y preferencias",
              bg: "bg-gradient-to-br from-balulu-secondary-500 to-balulu-secondary-700",
              href: "/perfil/editar",
            },
          ].map((stat, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              {stat.href ? (
                <Link
                  href={stat.href}
                  className={`${stat.bg} rounded-balulu p-6 shadow-balulu-lg relative overflow-hidden block hover:scale-[1.03] hover:-translate-y-1 active:scale-[0.98] transition-transform duration-200`}
                >
                  <div className="absolute -right-3 -top-3 w-16 h-16 bg-white/10 rounded-full" />
                  <div className="w-10 h-10 bg-white/20 rounded-balulu-sm flex items-center justify-center mb-3 relative">
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-bold text-white relative">
                    {stat.label}
                  </p>
                </Link>
              ) : (
                <div className={`${stat.bg} rounded-balulu p-6 shadow-balulu-lg relative overflow-hidden hover:scale-[1.03] hover:-translate-y-1 transition-transform duration-200`}>
                  <div className="absolute -right-3 -top-3 w-16 h-16 bg-white/10 rounded-full" />
                  <div className="w-10 h-10 bg-white/20 rounded-balulu-sm flex items-center justify-center mb-3 relative">
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-3xl font-extrabold text-white relative">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-white/80 relative">{stat.label}</p>
                </div>
              )}
            </FadeIn>
          ))}
        </div>

        {/* Recent favorites */}
        {favorites && favorites.length > 0 && (
          <FadeIn>
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
          </FadeIn>
        )}

        {/* Recent interests */}
        {interests && interests.length > 0 && (
          <FadeIn>
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
                      <span
                        className={`inline-block mt-1 px-2.5 py-0.5 text-xs font-bold rounded-full ${
                          interest.status === "adoptado"
                            ? "bg-balulu-secondary-100 text-balulu-secondary-700"
                            : interest.status === "aceptado"
                            ? "bg-balulu-primary-100 text-balulu-primary-700"
                            : interest.status === "rechazado"
                            ? "bg-red-100 text-red-700"
                            : "bg-balulu-accent-100 text-balulu-accent-700"
                        }`}
                      >
                        {interest.status === "adoptado"
                          ? "Adoptada"
                          : interest.status === "aceptado"
                          ? "Aceptado, en proceso"
                          : interest.status === "rechazado"
                          ? "No fue posible"
                          : "Esperando respuesta"}
                      </span>
                      {interest.org_reply && (
                        <p className="text-sm text-balulu-text mt-2 bg-balulu-primary-50 rounded-balulu-sm p-2.5">
                          <span className="font-bold">Respuesta: </span>
                          {interest.org_reply}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
