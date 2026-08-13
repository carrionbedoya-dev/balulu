"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Heart, Dog, ArrowLeft, MapPin } from "lucide-react";

interface FavoritePet {
  pets: {
    id: string;
    name: string;
    species: string;
    breed: string | null;
    age_months: number | null;
    size: string | null;
    sex: string | null;
    location: string | null;
    images: string[] | null;
    status: string;
  };
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoritePet[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchFavorites();
  }, []);

  async function fetchFavorites() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("favorites")
      .select("pets(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching favorites:", error);
    } else {
      setFavorites(data || []);
    }
    setLoading(false);
  }

  const formatAge = (months: number | null) => {
    if (!months) return "Edad desconocida";
    if (months < 12) return `${months} meses`;
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    if (remMonths === 0) return `${years} año${years > 1 ? "s" : ""}`;
    return `${years} año${years > 1 ? "s" : ""} ${remMonths} meses`;
  };

  return (
    <div className="min-h-screen bg-balulu-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/explorar"
          className="inline-flex items-center gap-2 text-sm text-balulu-muted hover:text-balulu-text mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a explorar
        </Link>

        <h1 className="text-3xl font-bold text-balulu-text mb-2">
          Mis favoritos
        </h1>
        <p className="text-balulu-muted mb-8">
          Las mascotas que has guardado para ver despues
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-square bg-balulu-border" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-balulu-border rounded w-2/3" />
                  <div className="h-4 bg-balulu-border rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-balulu-primary-100 rounded-balulu mx-auto mb-6 flex items-center justify-center">
              <Heart className="w-10 h-10 text-balulu-primary-300" />
            </div>
            <h3 className="text-xl font-semibold text-balulu-text mb-2">
              No tienes favoritos aun
            </h3>
            <p className="text-balulu-muted max-w-md mx-auto mb-6">
              Explora las mascotas disponibles y guarda las que te interesen
              para verlas despues.
            </p>
            <Link href="/explorar" className="btn-primary">
              Explorar mascotas
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map(({ pets: pet }) => (
              <div key={pet.id} className="card group">
                <Link href={`/mascota/${pet.id}`} className="block">
                  <div className="relative aspect-square bg-balulu-border overflow-hidden">
                    {pet.images && pet.images.length > 0 ? (
                      <Image
                        src={pet.images[0]}
                        alt={pet.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-balulu-primary-50">
                        <Dog className="w-16 h-16 text-balulu-primary-300" />
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/mascota/${pet.id}`}>
                    <h3 className="font-bold text-balulu-text text-lg group-hover:text-balulu-primary-700 transition-colors">
                      {pet.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-balulu-muted mt-1">
                    {pet.breed || "Raza desconocida"} · {formatAge(pet.age_months)}
                  </p>
                  {pet.location && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-balulu-muted">
                      <MapPin className="w-3.5 h-3.5" />
                      {pet.location}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
