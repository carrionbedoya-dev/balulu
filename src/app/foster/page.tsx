"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { createPublicClient } from "@/lib/supabase/client";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Dog,
  Cat,
  Rabbit,
  Bird,
  X,
  PlusCircle,
  Wallet,
  HeartHandshake,
} from "lucide-react";

interface FosterListing {
  id: string;
  pet_name: string;
  species: string;
  breed: string | null;
  size: string | null;
  images: string[] | null;
  start_date: string;
  end_date: string;
  location: string;
  compensation_type: string;
  compensation_details: string | null;
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

const compensationOptions = [
  { value: "", label: "Pagado o voluntario" },
  { value: "pagado", label: "Pagado" },
  { value: "voluntario", label: "Voluntario" },
];

function formatDateRange(start: string, end: string) {
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  const s = new Date(start + "T00:00:00").toLocaleDateString("es-MX", opts);
  const e = new Date(end + "T00:00:00").toLocaleDateString("es-MX", opts);
  return `${s} - ${e}`;
}

export default function FosterPage() {
  const [listings, setListings] = useState<FosterListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [selectedCompensation, setSelectedCompensation] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const publicSupabase = createPublicClient();

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    setLoading(true);
    try {
      let query = publicSupabase
        .from("foster_listings")
        .select(
          "id, pet_name, species, breed, size, images, start_date, end_date, location, compensation_type, compensation_details"
        )
        .eq("status", "disponible")
        .order("created_at", { ascending: false });

      if (selectedSpecies) query = query.eq("species", selectedSpecies);
      if (selectedCompensation)
        query = query.eq("compensation_type", selectedCompensation);

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching foster listings:", error);
        setListings([]);
      } else {
        let filtered = data || [];
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (l) =>
              l.pet_name.toLowerCase().includes(q) ||
              (l.breed && l.breed.toLowerCase().includes(q)) ||
              l.location.toLowerCase().includes(q)
          );
        }
        setListings(filtered);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setListings([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-balulu-background">
      <div className="relative bg-gradient-to-br from-balulu-secondary-700 via-balulu-secondary-800 to-balulu-primary-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1920&q=80')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl text-white mb-2 !font-extrabold">
              Foster temporal
            </h1>
            <p className="text-balulu-secondary-100 text-lg">
              Cuida una mascota por unos dias o semanas mientras su dueño lo
              resuelve
            </p>
          </div>
          <Link href="/foster/publicar" className="btn-accent whitespace-nowrap">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Publicar mi mascota
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-white rounded-balulu shadow-balulu p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-balulu-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchListings()}
                placeholder="Buscar por nombre, raza o zona..."
                className="input pl-10"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-balulu-sm border-2 font-semibold text-sm transition-colors ${
                showFilters
                  ? "border-balulu-secondary-500 bg-balulu-secondary-50 text-balulu-secondary-700"
                  : "border-balulu-border text-balulu-muted"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filtros
              {(selectedSpecies || selectedCompensation) && (
                <span className="w-5 h-5 bg-balulu-accent-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {[selectedSpecies, selectedCompensation].filter(Boolean).length}
                </span>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={fetchListings}
              className="btn-primary text-sm"
            >
              Buscar
            </motion.button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-balulu-border grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <label className="label text-xs">Compensacion</label>
                <select
                  value={selectedCompensation}
                  onChange={(e) => setSelectedCompensation(e.target.value)}
                  className="input"
                >
                  {compensationOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedSpecies("");
                    setSelectedCompensation("");
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
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-balulu-secondary-100 rounded-balulu mx-auto mb-6 flex items-center justify-center">
              <HeartHandshake className="w-10 h-10 text-balulu-secondary-400" />
            </div>
            <h3 className="text-xl font-semibold text-balulu-text mb-2">
              No hay solicitudes de foster ahorita
            </h3>
            <p className="text-balulu-muted max-w-md mx-auto">
              Intenta con otros filtros, o si tienes una mascota que necesita
              foster temporal, publicala tu mismo.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-balulu-muted mb-6">
              {listings.length} solicitud{listings.length !== 1 ? "es" : ""} de
              foster
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/foster/${listing.id}`}
                  className="card group block"
                >
                  <div className="relative aspect-square bg-balulu-border overflow-hidden">
                    {listing.images && listing.images.length > 0 ? (
                      <Image
                        src={listing.images[0]}
                        alt={listing.pet_name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-balulu-secondary-50">
                        <Dog className="w-16 h-16 text-balulu-secondary-300" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full ${
                          listing.compensation_type === "pagado"
                            ? "bg-balulu-accent-500 text-white"
                            : "bg-white/90 text-balulu-text"
                        }`}
                      >
                        <Wallet className="w-3 h-3" />
                        {listing.compensation_type === "pagado"
                          ? "Pagado"
                          : "Voluntario"}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-balulu-secondary-50 text-balulu-secondary-700 text-xs font-bold rounded-full">
                        {speciesIcons[listing.species?.toLowerCase()] || (
                          <Dog className="w-3 h-3" />
                        )}
                        {listing.species
                          ? listing.species.charAt(0).toUpperCase() +
                            listing.species.slice(1)
                          : "Mascota"}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-balulu-text text-xl group-hover:text-balulu-secondary-700 transition-colors">
                      {listing.pet_name}
                    </h3>
                    <p className="text-[15px] font-medium text-balulu-muted mt-1">
                      {listing.breed || "Raza desconocida"}
                    </p>
                    <div className="flex items-center gap-1 mt-2.5 text-sm text-balulu-muted">
                      <Calendar className="w-4 h-4" />
                      {formatDateRange(listing.start_date, listing.end_date)}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-sm text-balulu-muted">
                      <MapPin className="w-4 h-4" />
                      {listing.location}
                    </div>
                    {listing.compensation_details && (
                      <p className="text-sm text-balulu-secondary-700 font-semibold mt-2 line-clamp-1">
                        {listing.compensation_details}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
