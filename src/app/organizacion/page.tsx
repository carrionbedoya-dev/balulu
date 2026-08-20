"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  Plus,
  PawPrint,
  Eye,
  Heart,
  TrendingUp,
  Trash2,
  Edit3,
  Loader2,
  Sparkles,
} from "lucide-react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import FadeIn from "@/components/animations/FadeIn";
import { useToast } from "@/components/Toast";

interface Pet {
  id: string;
  name: string;
  species: string;
  status: string | null;
  images: string[] | null;
  created_at: string | null;
}

interface Interest {
  id: string;
  pet_id: string;
  status: string | null;
  created_at: string | null;
  pets: { name: string } | null;
  org_reply?: string | null;
}

export default function OrganizationDashboardPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const orgQuickReplies = [
    "Claro, cuentanos un poco mas sobre ti y tu hogar",
    "Podemos agendar una visita esta semana",
    "Necesitamos que completes una breve entrevista antes de continuar",
    "Perfecto, contactanos por WhatsApp para coordinar los detalles",
  ];
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const sendOrgReply = async (interestId: string, reply: string) => {
    const { error } = await supabase
      .from("adoption_interests")
      .update({ status: "aceptado", org_reply: reply })
      .eq("id", interestId);

    if (error) {
      showToast("No se pudo enviar la respuesta", "error");
      return;
    }

    setInterests((prev) =>
      prev.map((i) =>
        i.id === interestId ? { ...i, status: "aceptado", org_reply: reply } : i
      )
    );
    setReplyingTo(null);
    showToast("Respuesta enviada", "success");

    fetch("/api/notify-status-change", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interestId }),
    }).catch(() => {});
  };

  const updateInterestStatus = async (interestId: string, newStatus: string) => {
    const { error } = await supabase
      .from("adoption_interests")
      .update({ status: newStatus })
      .eq("id", interestId);

    if (error) {
      showToast("No se pudo actualizar el estado", "error");
      return;
    }

    setInterests((prev) =>
      prev.map((i) => (i.id === interestId ? { ...i, status: newStatus } : i))
    );
    showToast("Estado actualizado", "success");

    fetch("/api/notify-status-change", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interestId }),
    }).catch(() => {
      // Falla silenciosa: el estado ya se actualizo, el correo es un extra.
    });
  };

  async function fetchData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data: myPets } = await supabase
      .from("pets")
      .select("id, name, species, status, images, created_at")
      .eq("created_by", user.id)
      .order("created_at", { ascending: false });

    const { data: myInterests } = await supabase
      .from("adoption_interests")
      .select("id, pet_id, status, created_at, org_reply, pets(name)")
      .in(
        "pet_id",
        myPets?.map((p) => p.id) || []
      )
      .order("created_at", { ascending: false });

    setPets(myPets || []);
    setInterests(myInterests || []);
    setLoading(false);
  }

  async function deletePet(petId: string, petName: string) {
    if (!confirm(`¿Estas seguro de eliminar a ${petName}?`)) return;

    const { error } = await supabase.from("pets").delete().eq("id", petId);

    if (error) {
      showToast("Error al eliminar la mascota", "error");
      return;
    }

    setPets((prev) => prev.filter((p) => p.id !== petId));
    showToast(`${petName} eliminada exitosamente`, "success");
  }

  const stats = {
    totalPets: pets.length,
    availablePets: pets.filter((p) => p.status === "disponible").length,
    inProcessPets: pets.filter((p) => p.status === "en_proceso").length,
    adoptedPets: pets.filter((p) => p.status === "adoptado").length,
    totalInterests: interests.length,
    pendingInterests: interests.filter((i) => i.status === "pendiente").length,
  };

  return (
    <div className="min-h-screen bg-balulu-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <FadeIn className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-balulu-text">
              Panel de organizacion
            </h1>
            <p className="text-balulu-muted mt-1">
              Gestiona tus mascotas y solicitudes de adopcion
            </p>
          </div>
          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/organizacion/compartir-historia" className="btn-secondary">
                <Sparkles className="w-5 h-5 mr-2" />
                Compartir historia
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/organizacion/publicar" className="btn-primary">
                <Plus className="w-5 h-5 mr-2" />
                Dar en adopcion
              </Link>
            </motion.div>
          </div>
        </FadeIn>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total mascotas",
              value: stats.totalPets,
              icon: PawPrint,
              iconColor: "text-white bg-white/25",
              bg: "bg-gradient-to-br from-balulu-primary-500 to-balulu-primary-700",
              textColor: "text-white",
              labelColor: "text-balulu-primary-100",
            },
            {
              label: "Disponibles",
              value: stats.availablePets,
              icon: Eye,
              iconColor: "text-white bg-white/25",
              bg: "bg-gradient-to-br from-balulu-secondary-500 to-balulu-secondary-700",
              textColor: "text-white",
              labelColor: "text-balulu-secondary-100",
            },
            {
              label: "En proceso",
              value: stats.inProcessPets,
              icon: TrendingUp,
              iconColor: "text-white bg-white/25",
              bg: "bg-gradient-to-br from-balulu-accent-500 to-balulu-accent-700",
              textColor: "text-white",
              labelColor: "text-balulu-accent-100",
            },
            {
              label: "Intereses",
              value: stats.totalInterests,
              icon: Heart,
              iconColor: "text-white bg-white/25",
              bg: "bg-gradient-to-br from-rose-500 to-rose-700",
              textColor: "text-white",
              labelColor: "text-rose-100",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className={`${stat.bg} rounded-balulu p-6 shadow-balulu-lg relative overflow-hidden`}
            >
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full" />
              <div className="absolute -right-2 -bottom-6 w-16 h-16 bg-white/10 rounded-full" />
              <div className={`w-10 h-10 ${stat.iconColor} rounded-balulu-sm flex items-center justify-center mb-3 relative`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className={`text-3xl font-extrabold ${stat.textColor} relative`}>
                {stat.value}
              </p>
              <p className={`text-sm font-medium ${stat.labelColor} relative`}>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* My pets */}
        <div className="bg-white rounded-balulu shadow-balulu p-6 mb-8">
          <h2 className="text-xl font-semibold text-balulu-text mb-6">
            Mis mascotas publicadas
          </h2>
          {loading ? (
            <LoadingSkeleton count={3} type="list" />
          ) : pets.length === 0 ? (
            <EmptyState type="pets" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-balulu-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-balulu-muted">
                      Mascota
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-balulu-muted">
                      Especie
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-balulu-muted">
                      Estado
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-balulu-muted">
                      Intereses
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-balulu-muted">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pets.map((pet, index) => {
                    const petInterests =
                      interests.filter((i) => i.pet_id === pet.id) || [];
                    return (
                      <motion.tr
                        key={pet.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-balulu-border/50 hover:bg-balulu-primary-50/50"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-balulu-border rounded-balulu-sm flex items-center justify-center overflow-hidden">
                              {pet.images && pet.images.length > 0 ? (
                                <img
                                  src={pet.images[0]}
                                  alt={pet.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <PawPrint className="w-5 h-5 text-balulu-muted" />
                              )}
                            </div>
                            <span className="font-medium text-balulu-text">
                              {pet.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-balulu-muted capitalize">
                          {pet.species}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                              pet.status === "disponible"
                                ? "bg-balulu-secondary-50 text-balulu-secondary-700"
                                : pet.status === "en_proceso"
                                ? "bg-balulu-accent-50 text-balulu-accent-700"
                                : "bg-balulu-primary-50 text-balulu-primary-700"
                            }`}
                          >
                            {pet.status === "disponible"
                              ? "Disponible"
                              : pet.status === "en_proceso"
                              ? "En proceso"
                              : pet.status === "adoptado"
                              ? "Adoptado"
                              : pet.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-balulu-muted">
                          {petInterests.length} interes
                          {petInterests.length !== 1 ? "es" : ""}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/mascota/${pet.id}`}
                              className="text-sm text-balulu-primary-600 hover:text-balulu-primary-700 font-medium"
                            >
                              Ver
                            </Link>
                            <Link
                              href={`/organizacion/editar/${pet.id}`}
                              className="p-1.5 text-balulu-primary-600 hover:bg-balulu-primary-50 rounded-balulu-sm transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Link>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => deletePet(pet.id, pet.name)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-balulu-sm transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent interests */}
        {interests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-balulu shadow-balulu p-6"
          >
            <h2 className="text-xl font-semibold text-balulu-text mb-6">
              Solicitudes de adopcion recientes
            </h2>
            <div className="space-y-4">
              {interests.slice(0, 5).map((interest, index) => (
                <motion.div
                  key={interest.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col gap-3 p-4 border border-balulu-border rounded-balulu-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-balulu-text">
                        Interes en {interest.pets?.name || "mascota"}
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
                        {interest.status || "pendiente"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {interest.status === "pendiente" && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              setReplyingTo(replyingTo === interest.id ? null : interest.id)
                            }
                            className="text-xs font-bold px-3 py-1.5 rounded-full bg-balulu-primary-600 text-white hover:bg-balulu-primary-700 transition-colors"
                          >
                            Responder
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateInterestStatus(interest.id, "rechazado")}
                            className="text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-balulu-border text-balulu-muted hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                          >
                            Rechazar
                          </motion.button>
                        </>
                      )}
                      {interest.status === "aceptado" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateInterestStatus(interest.id, "adoptado")}
                          className="text-xs font-bold px-3 py-1.5 rounded-full bg-balulu-secondary-600 text-white hover:bg-balulu-secondary-700 transition-colors"
                        >
                          Marcar adoptado
                        </motion.button>
                      )}
                      <span className="text-xs text-balulu-muted whitespace-nowrap">
                        {interest.created_at ? new Date(interest.created_at).toLocaleDateString("es-MX") : "Fecha desconocida"}
                      </span>
                    </div>
                  </div>

                  {interest.org_reply && (
                    <div className="bg-balulu-primary-50 rounded-balulu-sm p-3 text-sm text-balulu-primary-800">
                      <span className="font-bold">Tu respuesta: </span>
                      {interest.org_reply}
                    </div>
                  )}

                  {replyingTo === interest.id && (
                    <div className="bg-balulu-background rounded-balulu-sm p-3 space-y-2">
                      <p className="text-xs font-semibold text-balulu-muted uppercase tracking-wide">
                        Elige una respuesta rapida
                      </p>
                      {orgQuickReplies.map((reply) => (
                        <button
                          key={reply}
                          onClick={() => sendOrgReply(interest.id, reply)}
                          className="block w-full text-left text-sm p-2.5 rounded-balulu-sm bg-white border border-balulu-border hover:border-balulu-primary-400 hover:bg-balulu-primary-50 transition-colors"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
