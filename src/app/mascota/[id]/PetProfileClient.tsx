"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { createClient, createPublicClient } from "@/lib/supabase/client";
import {
  Heart,
  MapPin,
  Calendar,
  Ruler,
  PawPrint,
  MessageCircle,
  ArrowLeft,
  Share2,
  Shield,
  CheckCircle,
  X,
} from "lucide-react";
import { useToast } from "@/components/Toast";

interface PetProfileClientProps {
  pet: any;
  initialFavorite: boolean;
  userId?: string;
}

const personalityTraits = [
  "Jugueton",
  "Tranquilo",
  "Cariñoso",
  "Protector",
  "Sociable",
  "Independiente",
  "Energetico",
  "Tierno",
];

const quickChatMessages = [
  "Hola, estoy interesado en conocer mas sobre esta mascota",
  "Me gustaria saber mas sobre su personalidad",
  "¿Cuando podria conocerla en persona?",
  "¿Que informacion necesitan de mi para la adopcion?",
];

export default function PetProfileClient({
  pet,
  initialFavorite,
  userId,
}: PetProfileClientProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [showQuickChat, setShowQuickChat] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");
  const [chatSent, setChatSent] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const { showToast } = useToast();
  const supabase = createClient();

  const toggleFavorite = async () => {
    if (!userId) {
      window.location.href = "/login";
      return;
    }

    if (isFavorite) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("pet_id", pet.id);
      setIsFavorite(false);
      showToast(`${pet.name} eliminada de favoritos`, "info");
    } else {
      await supabase.from("favorites").insert({
        user_id: userId,
        pet_id: pet.id,
      });
      setIsFavorite(true);
      showToast(`${pet.name} guardada en favoritos`, "success");
    }
  };

  const [similarPets, setSimilarPets] = useState<any[]>([]);

  useEffect(() => {
    const fetchSimilar = async () => {
      const publicClient = createPublicClient();
      const { data } = await publicClient
        .from("pets")
        .select("id, name, species, breed, images, age_months")
        .eq("species", pet.species)
        .eq("status", "disponible")
        .neq("id", pet.id)
        .limit(4);
      setSimilarPets(data || []);
    };
    fetchSimilar();
  }, [pet.id, pet.species]);

  const shareOnWhatsApp = () => {
    const url = window.location.href;
    const text = `¡Mira a ${pet.name}! Esta buscando un hogar en BALULU 🐾 ${url}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const sendQuickChat = async () => {
    if (!selectedMessage || !userId) return;

    const { data: newInterest } = await supabase
      .from("adoption_interests")
      .insert({
        user_id: userId,
        pet_id: pet.id,
        message: selectedMessage,
        status: "pendiente",
      })
      .select("id")
      .single();

    if (newInterest) {
      fetch("/api/notify-new-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interestId: newInterest.id }),
      }).catch(() => {
        // Falla silenciosa: el interes ya se guardo, el correo es un extra.
      });
    }

    setChatSent(true);
    showToast("Mensaje enviado exitosamente", "success");
    setTimeout(() => {
      setShowQuickChat(false);
      setChatSent(false);
      setSelectedMessage("");
    }, 2000);
  };

  const formatAge = (months: number | null) => {
    if (!months) return "Edad desconocida";
    if (months < 12) return `${months} meses`;
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    if (remMonths === 0) return `${years} año${years > 1 ? "s" : ""}`;
    return `${years} año${years > 1 ? "s" : ""} ${remMonths} meses`;
  };

  const images = pet.images?.length > 0 ? pet.images : [null];

  return (
    <div className="min-h-screen bg-balulu-background">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/explorar"
            className="inline-flex items-center gap-2 text-sm text-balulu-muted hover:text-balulu-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a explorar
          </Link>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="relative aspect-square bg-balulu-border rounded-balulu overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  {images[currentImage] ? (
                    <Image
                      src={images[currentImage]}
                      alt={pet.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-balulu-primary-50">
                      <PawPrint className="w-24 h-24 text-balulu-primary-200" />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              <div className="absolute top-4 right-4 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={shareOnWhatsApp}
                  className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-balulu"
                  aria-label="Compartir por WhatsApp"
                >
                  <Share2 className="w-5 h-5 text-balulu-secondary-600" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleFavorite}
                  className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-balulu"
                  aria-label="Agregar a favoritos"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isFavorite
                        ? "fill-red-500 text-red-500"
                        : "text-balulu-muted"
                    }`}
                  />
                </motion.button>
              </div>
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img: string | null, i: number) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentImage(i)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-balulu-sm overflow-hidden border-2 transition-colors ${
                      i === currentImage
                        ? "border-balulu-primary-500"
                        : "border-transparent"
                    }`}
                  >
                    {img ? (
                      <Image
                        src={img}
                        alt={`${pet.name} ${i + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-balulu-primary-50 flex items-center justify-center">
                        <PawPrint className="w-6 h-6 text-balulu-primary-300" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-3"
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-balulu-primary-50 text-balulu-primary-700 text-sm font-medium rounded-full">
                  <PawPrint className="w-4 h-4" />
                  {pet.species
                    ? pet.species.charAt(0).toUpperCase() + pet.species.slice(1)
                    : "Mascota"}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full ${
                    pet.status === "disponible"
                      ? "bg-balulu-secondary-50 text-balulu-secondary-700"
                      : "bg-balulu-accent-50 text-balulu-accent-700"
                  }`}
                >
                  {pet.status === "disponible" && (
                    <span className="relative flex w-2 h-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-balulu-secondary-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full w-2 h-2 bg-balulu-secondary-500"></span>
                    </span>
                  )}
                  {pet.status === "disponible"
                    ? "Disponible para adopcion"
                    : "En proceso de adopcion"}
                </span>
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold text-balulu-text mb-2">
                {pet.name}
              </h1>
              {pet.breed && (
                <p className="text-lg text-balulu-muted">{pet.breed}</p>
              )}
            </div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {[
                {
                  icon: Calendar,
                  label: "Edad",
                  value: formatAge(pet.age_months),
                },
                {
                  icon: pet.sex === "macho" ? PawPrint : Heart,
                  label: "Sexo",
                  value:
                    pet.sex === "macho"
                      ? "Macho"
                      : pet.sex === "hembra"
                      ? "Hembra"
                      : "Desconocido",
                },
                {
                  icon: Ruler,
                  label: "Tamaño",
                  value: pet.size
                    ? pet.size.charAt(0).toUpperCase() + pet.size.slice(1)
                    : "Desconocido",
                },
                {
                  icon: MapPin,
                  label: "Ubicacion",
                  value: pet.location || "Cancun",
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-white rounded-balulu-sm p-4 border border-balulu-border"
                >
                  <stat.icon className="w-5 h-5 text-balulu-primary-500 mb-2" />
                  <p className="text-xs text-balulu-muted uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className="font-semibold text-balulu-text text-sm mt-0.5">
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Description */}
            {pet.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-balulu p-6 border border-balulu-border"
              >
                <h3 className="font-semibold text-balulu-text mb-3">
                  Sobre {pet.name}
                </h3>
                <p className="text-balulu-muted leading-relaxed">
                  {pet.description}
                </p>
              </motion.div>
            )}

            {/* Personality */}
            {pet.personality_traits && pet.personality_traits.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-balulu p-6 border border-balulu-border"
              >
                <h3 className="font-semibold text-balulu-text mb-3">
                  Personalidad
                </h3>
                <div className="flex flex-wrap gap-2">
                  {pet.personality_traits.map((trait: string) => (
                    <motion.span
                      key={trait}
                      whileHover={{ scale: 1.05 }}
                      className="px-3 py-1.5 bg-balulu-primary-50 text-balulu-primary-700 text-sm rounded-full"
                    >
                      {trait}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Compatibilidad familiar */}
            {(pet.good_with_children !== null ||
              pet.good_with_dogs !== null ||
              pet.good_with_cats !== null ||
              pet.special_needs) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="bg-white rounded-balulu p-6 border border-balulu-border"
              >
                <h3 className="font-semibold text-balulu-text mb-3">
                  Compatibilidad
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Niños", value: pet.good_with_children },
                    { label: "Perros", value: pet.good_with_dogs },
                    { label: "Gatos", value: pet.good_with_cats },
                  ].map(
                    (item) =>
                      item.value !== null && (
                        <div
                          key={item.label}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-balulu-sm border-2 ${
                            item.value
                              ? "border-balulu-secondary-200 bg-balulu-secondary-50"
                              : "border-balulu-border bg-balulu-background"
                          }`}
                        >
                          {item.value ? (
                            <CheckCircle className="w-5 h-5 text-balulu-secondary-600" />
                          ) : (
                            <X className="w-5 h-5 text-balulu-muted" />
                          )}
                          <span className="text-xs font-semibold text-balulu-text">
                            {item.label}
                          </span>
                        </div>
                      )
                  )}
                </div>
                {pet.special_needs && (
                  <div className="mt-4 p-3 bg-balulu-accent-50 border border-balulu-accent-200 rounded-balulu-sm flex items-start gap-2">
                    <Shield className="w-4 h-4 text-balulu-accent-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-balulu-accent-800">
                      Tiene necesidades especiales de cuidado. Pregunta a la
                      organizacion para mas detalles.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Organization */}
            {pet.organizations && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-balulu p-6 border border-balulu-border"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-balulu-text">
                    Publicado por
                  </h3>
                  {pet.organizations.verified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-balulu-secondary-50 text-balulu-secondary-700 text-xs font-medium rounded-full">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Verificado
                    </span>
                  )}
                </div>
                <p className="font-medium text-balulu-text">
                  {pet.organizations.name}
                </p>
                {pet.organizations.location && (
                  <p className="text-sm text-balulu-muted mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {pet.organizations.location}
                  </p>
                )}
              </motion.div>
            )}

            {/* Contacto directo */}
            {(pet.contact_phone || pet.contact_whatsapp || pet.contact_instagram) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                className="bg-white rounded-balulu p-6 border border-balulu-border"
              >
                <h3 className="font-semibold text-balulu-text mb-3">
                  Contacto directo
                </h3>
                <div className="flex flex-wrap gap-2">
                  {pet.contact_whatsapp && (
                    
                      href={`https://wa.me/${pet.contact_whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-balulu-secondary-50 text-balulu-secondary-700 text-sm font-semibold rounded-full hover:bg-balulu-secondary-100 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </a>
                  )}
                  {pet.contact_phone && (
                    
                      href={`tel:${pet.contact_phone}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-balulu-primary-50 text-balulu-primary-700 text-sm font-semibold rounded-full hover:bg-balulu-primary-100 transition-colors"
                    >
                      {pet.contact_phone}
                    </a>
                  )}
                  {pet.contact_instagram && (
                    
                      href={`https://instagram.com/${pet.contact_instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-balulu-accent-50 text-balulu-accent-700 text-sm font-semibold rounded-full hover:bg-balulu-accent-100 transition-colors"
                    >
                      {pet.contact_instagram}
                    </a>
                  )}
                </div>
              </motion.div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-3"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (!userId) {
                    window.location.href = "/login";
                    return;
                  }
                  setShowQuickChat(true);
                }}
                className="btn-primary w-full text-base py-4 pulse-glow"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Estoy interesado en adoptar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={toggleFavorite}
                className="btn-secondary w-full text-base py-4"
              >
                <Heart
                  className={`w-5 h-5 mr-2 ${
                    isFavorite ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                {isFavorite
                  ? "Quitar de favoritos"
                  : "Guardar en favoritos"}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {similarPets.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-2xl font-bold text-balulu-text mb-6">
            Otras mascotas que te podrian interesar
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {similarPets.map((sp, i) => (
              <motion.div
                key={sp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <Link href={`/mascota/${sp.id}`} className="card group block">
                  <div className="relative aspect-square bg-balulu-border overflow-hidden">
                    {sp.images && sp.images.length > 0 ? (
                      <Image
                        src={sp.images[0]}
                        alt={sp.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-balulu-primary-50">
                        <PawPrint className="w-10 h-10 text-balulu-primary-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-balulu-text group-hover:text-balulu-primary-700 transition-colors">
                      {sp.name}
                    </h3>
                    <p className="text-sm text-balulu-muted">
                      {sp.breed || "Raza desconocida"}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Chat Modal */}
      <AnimatePresence>
        {showQuickChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-balulu-lg shadow-balulu-lg max-w-md w-full p-6"
            >
              {chatSent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="w-16 h-16 bg-balulu-secondary-100 rounded-balulu mx-auto mb-4 flex items-center justify-center"
                  >
                    <CheckCircle className="w-8 h-8 text-balulu-secondary-600" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-balulu-text mb-2">
                    ¡Mensaje enviado!
                  </h3>
                  <p className="text-balulu-muted">
                    El rescatista recibira tu interes y se pondra en contacto
                    contigo.
                  </p>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-balulu-text mb-2">
                    Expresa tu interes
                  </h3>
                  <p className="text-balulu-muted text-sm mb-6">
                    Selecciona un mensaje para iniciar el proceso de adopcion de{" "}
                    {pet.name}.
                  </p>
                  <div className="space-y-2 mb-6">
                    {quickChatMessages.map((msg) => (
                      <motion.button
                        key={msg}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelectedMessage(msg)}
                        className={`w-full text-left p-4 rounded-balulu-sm border-2 transition-all ${
                          selectedMessage === msg
                            ? "border-balulu-primary-500 bg-balulu-primary-50"
                            : "border-balulu-border hover:border-balulu-primary-300"
                        }`}
                      >
                        <p className="text-sm text-balulu-text">{msg}</p>
                      </motion.button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowQuickChat(false)}
                      className="flex-1 btn-secondary py-3"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={sendQuickChat}
                      disabled={!selectedMessage}
                      className="flex-1 btn-primary py-3 disabled:opacity-50"
                    >
                      Enviar mensaje
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
