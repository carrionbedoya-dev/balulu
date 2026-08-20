"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { createClient, createPublicClient } from "@/lib/supabase/client";
import {
  Search,
  Filter,
  Heart,
  MapPin,
  Dog,
  Cat,
  Rabbit,
  Bird,
  X,
  BadgeCheck,
  PlusCircle,
} from "lucide-react";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  age_months: number | null;
  size: string | null;
  sex: string | null;
  location: string | null;
  description: string | null;
  status: string | null;
  images: string[] | null;
  organization_id: string | null;
  organizations: { name: string; verified: boolean | null } | null;
}

const speciesIcons: Record<string, React.ReactNode> = {
  perro: <Dog className="w-4 h-4" />,
  gato: <Cat className="w-4 h-4" />,
  conejo: <Rabbit className="w-4 h-4" />,
  ave: <Bird className="w-4 h-4" />,
};

const speciesOptions = [
  { value: "", label: "Todas las especies" },
  { value: "perro", label: "Perros" },
  { value: "gato", label: "Gatos" },
  { value: "conejo", label: "Conejos" },
  { value: "ave", label: "Aves" },
  { value: "otro", label: "Otros" },
];

const sizeOptions = [
  { value: "", label: "Todos los tamaños" },
  { value: "pequeno", label: "Pequeño" },
  { value: "mediano", label: "Mediano" },
  { value: "grande", label: "Grande" },
];

const ageOptions = [
  { value: "", label: "Todas las edades" },
  { value: "cachorro", label: "Cachorro (0-1 año)" },
  { value: "joven", label: "Joven (1-3 años)" },
  { value: "adulto", label: "Adulto (3-8 años)" },
  { value: "senior", label: "Senior (+8 años)" },
];

export default function ExplorePage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const supabase = createClient();
  const publicSupabase = createPublicClient();

  useEffect(() => {
    fetchPets();
    fetchFavorites();
  }, []);

  async function fetchPets() {
    setLoading(true);
    try {
      let query = publicSupabase
        .from("pets")
        .select(
          "id, name, species, breed, age_months, size, sex, location, description, status, images, organization_id, organizations(name, verified)"
        )
        .eq("status", "disponible")
        .order("created_at", { ascending: false });

      if (selectedSpecies) query = query.eq("species", selectedSpecies);
      if (selectedSize) query = query.eq("size", selectedSize);

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching pets:", error);
        setPets([]);
      } else {
        let filtered = data || [];
        if (selectedAge) {
          filtered = filtered.filter((pet) => {
            const months = pet.age_months || 0;
            if (selectedAge === "cachorro") return months <= 12;
            if (selectedAge === "joven") return months > 12 && months <= 36;
            if (selectedAge === "adulto") return months > 36 && months <= 96;
            if (selectedAge === "senior") return months > 96;
            return true;
          });
        }
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (pet) =>
              pet.name.toLowerCase().includes(q) ||
              (pet.breed && pet.breed.toLowerCase().includes(q)) ||
              (pet.location && pet.location.toLowerCase().includes(q))
          );
        }
        setPets(filtered);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setPets([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchFavorites() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("favorites")
        .select("pet_id")
        .eq("user_id", user.id);

      if (data) {
        setFavorites(new Set(data.map((f) => f.pet_id)));
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  }

  async function toggleFavorite(petId: string) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }

      if (favorites.has(petId)) {
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("pet_id", petId);
        setFavorites((prev) => {
          const next = new Set(prev);
          next.delete(petId);
          return next;
        });
      } else {
        await supabase.from("favorites").insert({
          user_id: user.id,
          pet_id: petId,
        });
        setFavorites((prev) => new Set(prev).add(petId));
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
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
      <div className="relative bg-gradient-to-br from-balulu-primary-700 via-balulu-primary-800 to-balulu-secondary-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1920&q=80')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl text-white mb-2 !font-extrabold">
              Conocer mascotas
            </h1>
            <p className="text-balulu-primary-100 text-lg">
              Descubre a tu próximo compañero en Cancún y alrededores
            </p>
          </div>
          <Link
            href="/organizacion/publicar"
            className="inline-flex items-center gap-2 px-5 py-3 bg-white text-balulu-primary-700 font-bold rounded-full hover:scale-105 active:scale-95 transition-transform shadow-balulu flex-shrink-0 w-fit"
          >
            <PlusCircle className="w-5 h-5" />
            Dar en adopcion
          </Link>
        </div>
      </div>

      <div className="bg-gradient-to-r from-balulu-primary-50 via-white to-balulu-secondary-50 backdrop-blur-md border-b border-balulu-border sticky top-20 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-balulu-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchPets()}
                placeholder="Buscar por nombre, raza o ubicación..."
                className="input pl-11 py-3.5 text-[15px] font-medium"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary text-sm flex items-center gap-2 ${
                showFilters ? "border-balulu-primary-400 bg-balulu-primary-50" : ""
              }`}
            >
              <Filter className="w-4 h-4" />
              Filtros
              {(selectedSpecies || selectedSize || selectedAge) && (
                <span className="w-5 h-5 bg-balulu-accent-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {[selectedSpecies, selectedSize, selectedAge].filter(Boolean)
                    .length}
                </span>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={fetchPets}
              className="btn-primary text-sm"
            >
              Buscar
            </motion.button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-balulu-border grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label text-xs">Especie</label>
                <select
                  value={selectedSpecies}
                  onChange={(e) => setSelectedSpecies(e.target.value)}
                  className="input"
                >
                  {speciesOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label text-xs">Tamaño</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="input"
                >
                  {sizeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label text-xs">Edad</label>
                <select
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(e.target.value)}
                  className="input"
                >
                  {ageOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-3 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedSpecies("");
                    setSelectedSize("");
                    setSelectedAge("");
                    setSearchQuery("");
                  }}
                  className="text-sm text-balulu-muted hover:text-balulu-text flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Limpiar filtros
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-square bg-balulu-border" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-balulu-border rounded w-2/3" />
                  <div className="h-4 bg-balulu-border rounded w-1/2" />
                  <div className="h-4 bg-balulu-border rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-balulu-primary-100 rounded-balulu mx-auto mb-6 flex items-center justify-center">
              <Search className="w-10 h-10 text-balulu-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-balulu-text mb-2">
              No encontramos mascotas
            </h3>
            <p className="text-balulu-muted max-w-md mx-auto">
              Intenta con otros filtros o terminos de busqueda. Hay muchas
              mascotas esperando ser descubiertas.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-balulu-muted mb-6">
              {pets.length} mascota{pets.length !== 1 ? "s" : ""} encontrada
              {pets.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pets.map((pet) => (
                <div key={pet.id} className="card group">
                  <Link href={`/mascota/${pet.id}`} className="block">
                    <div className="relative aspect-square bg-balulu-border overflow-hidden">
                      {pet.images && pet.images.length > 0 ? (
                        <Image
                          src={pet.images[0]}
                          alt={pet.name}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-balulu-primary-50">
                          <Dog className="w-16 h-16 text-balulu-primary-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 pointer-events-none">
                        <span className="text-white text-sm font-semibold px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          Ver perfil completo
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(pet.id);
                          }}
                          className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-balulu hover:scale-110 transition-transform"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              favorites.has(pet.id)
                                ? "fill-red-500 text-red-500"
                                : "text-balulu-muted"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </Link>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-balulu-primary-50 text-balulu-primary-700 text-xs font-bold rounded-full">
                        {speciesIcons[pet.species?.toLowerCase()] || (
                          <Dog className="w-3 h-3" />
                        )}
                        {pet.species
                          ? pet.species.charAt(0).toUpperCase() +
                            pet.species.slice(1)
                          : "Mascota"}
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-balulu-secondary-50 text-balulu-secondary-700 text-xs font-bold rounded-full">
                        {pet.sex === "macho"
                          ? "Macho"
                          : pet.sex === "hembra"
                          ? "Hembra"
                          : "Sexo desconocido"}
                      </span>
                    </div>
                    <Link href={`/mascota/${pet.id}`}>
                      <h3 className="font-extrabold text-balulu-text text-xl group-hover:text-balulu-primary-700 transition-colors flex items-center gap-1.5">
                        {pet.name}
                        {pet.organizations?.verified && (
                          <BadgeCheck
                            className="w-5 h-5 text-balulu-secondary-500 flex-shrink-0"
                            aria-label="Organizacion verificada"
                          />
                        )}
                      </h3>
                    </Link>
                    <p className="text-[15px] font-medium text-balulu-muted mt-1">
                      {pet.breed || "Raza desconocida"} · {formatAge(pet.age_months)}
                    </p>
                    {pet.location && (
                      <div className="flex items-center gap-1 mt-2.5 text-sm text-balulu-muted">
                        <MapPin className="w-4 h-4" />
                        {pet.location}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}