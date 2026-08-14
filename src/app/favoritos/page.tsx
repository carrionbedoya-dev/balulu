"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Heart, Dog, ArrowLeft, MapPin, Trash2 } from "lucide-react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import FadeIn from "@/components/animations/FadeIn";
import { useToast } from "@/components/Toast";

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
  const { showToast } = useToast();
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

  async function removeFavorite(petId: string, petName: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("pet_id", petId);

    setFavorites((prev) => prev.filter((f) => f.pets.id !== petId));
    showToast(`${petName} eliminada de favoritos`, "info");
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
        <FadeIn>
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
        </FadeIn>

        {loading ? (
          <LoadingSkeleton count={4} />
        ) : favorites.length === 0 ? (
          <EmptyState type="favorites" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((fav, index) => (
              <motion.div
                key={fav.pets.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{ y: -4 }}
                className="card group"
              >
                <Link href={`/mascota/${fav.pets.id}`} className="block">
                  <div className="relative aspect-square bg-balulu-border overflow-hidden">
                    {fav.pets.images && fav.pets.images.length > 0 ? (
                      <Image
                        src={fav.pets.images[0]}
                        alt={fav.pets.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-balulu-primary-50">
                        <Dog className="w-16 h-16 text-balulu-primary-300" />
                      </div>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFavorite(fav.pets.id, fav.pets.name);
                      }}
                      className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-balulu opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </motion.button>
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/mascota/${fav.pets.id}`}>
                    <h3 className="font-bold text-balulu-text text-lg group-hover:text-balulu-primary-700 transition-colors">
                      {fav.pets.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-balulu-muted mt-1">
                    {fav.pets.breed || "Raza desconocida"} · {formatAge(fav.pets.age_months)}
                  </p>
                  {fav.pets.location && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-balulu-muted">
                      <MapPin className="w-3.5 h-3.5" />
                      {fav.pets.location}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
