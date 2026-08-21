"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  MapPin,
  Calendar,
  Wallet,
  PawPrint,
  MessageCircle,
  ArrowLeft,
  Share2,
  Phone,
  AtSign,
  CheckCircle,
  X,
  Info,
} from "lucide-react";
import { useToast } from "@/components/Toast";

interface FosterListingClientProps {
  listing: any;
  userId?: string;
  alreadyInterested: boolean;
}

const quickMessages = [
  "Hola, me interesa hacer foster de tu mascota. ¿Seguimos platicando?",
  "Tengo experiencia cuidando mascotas y me encantaria ayudar en esas fechas",
  "¿Podrias contarme mas sobre su rutina y necesidades?",
  "Estoy disponible en esas fechas, ¿como le hacemos?",
];

export default function FosterListingClient({
  listing,
  userId,
  alreadyInterested,
}: FosterListingClientProps) {
  const [interested, setInterested] = useState(alreadyInterested);
  const [showQuickChat, setShowQuickChat] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const { showToast } = useToast();
  const supabase = createClient();

  const images = listing.images?.length > 0 ? listing.images : [null];

  const formatDate = (d: string) =>
    new Date(d + "T00:00:00").toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const shareOnWhatsApp = () => {
    const url = window.location.href;
    const text = `${listing.pet_name} busca foster temporal en BALULU 🐾 ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const sendInterest = async () => {
    if (!selectedMessage || !userId) return;
    setSending(true);

    const { data: newInterest, error } = await supabase
      .from("foster_interests")
      .insert({
        user_id: userId,
        listing_id: listing.id,
        message: selectedMessage,
        status: "pendiente",
      })
      .select("id")
      .single();

    if (error) {
      showToast("Error al enviar tu interes", "error");
      setSending(false);
      return;
    }

    if (newInterest) {
      fetch("/api/notify-foster-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interestId: newInterest.id }),
      }).catch(() => {
        // Falla silenciosa: el interes ya se guardo, el correo es un extra.
      });
    }

    setSent(true);
    setInterested(true);
    setSending(false);
    showToast("Mensaje enviado exitosamente", "success");
    setTimeout(() => {
      setShowQuickChat(false);
      setSent(false);
      setSelectedMessage("");
    }, 2000);
  };

  const handleInterestClick = () => {
    if (!userId) {
      window.location.href = "/login";
      return;
    }
    setShowQuickChat(true);
  };

  return (
    <div className="min-h-screen bg-balulu-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href="/foster"
          className="inline-flex items-center gap-2 text-sm text-balulu-muted hover:text-balulu-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a foster
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Images */}
        <div className="lg:col-span-3">
          <div className="relative aspect-square sm:aspect-[4/3] rounded-balulu overflow-hidden bg-balulu-border">
            {images[currentImage] ? (
              <Image
                src={images[currentImage]}
                alt={listing.pet_name}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-balulu-secondary-50">
                <PawPrint className="w-24 h-24 text-balulu-secondary-300" />
              </div>
            )}
            <div className="absolute top-4 left-4">
              <span
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-full ${
                  listing.compensation_type === "pagado"
                    ? "bg-balulu-accent-500 text-white"
                    : "bg-white/95 text-balulu-text"
                }`}
              >
                <Wallet className="w-4 h-4" />
                {listing.compensation_type === "pagado" ? "Pagado" : "Voluntario"}
              </span>
            </div>
            <button
              onClick={shareOnWhatsApp}
              className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-balulu hover:scale-110 transition-transform"
            >
              <Share2 className="w-5 h-5 text-balulu-text" />
            </button>
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-balulu-sm overflow-hidden border-2 ${
                    currentImage === i
                      ? "border-balulu-secondary-500"
                      : "border-transparent"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-balulu-text">
              {listing.pet_name}
            </h1>
            <p className="text-balulu-muted mt-1">
              {listing.species?.charAt(0).toUpperCase() +
                listing.species?.slice(1)}
              {listing.breed ? ` · ${listing.breed}` : ""}
            </p>
          </div>

          <div className="bg-white rounded-balulu shadow-balulu p-5 space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-balulu-secondary-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-balulu-text">
                  {formatDate(listing.start_date)} — {formatDate(listing.end_date)}
                </p>
                <p className="text-xs text-balulu-muted">Periodo de foster</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-balulu-secondary-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-balulu-text">
                  {listing.location}
                </p>
                <p className="text-xs text-balulu-muted">Ubicacion</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Wallet className="w-5 h-5 text-balulu-secondary-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-balulu-text">
                  {listing.compensation_details ||
                    (listing.compensation_type === "pagado"
                      ? "Pagado (monto a acordar)"
                      : "Voluntario")}
                </p>
                {listing.covers_expenses && (
                  <p className="text-xs text-balulu-muted">
                    El dueño cubre gastos y alimentacion
                  </p>
                )}
              </div>
            </div>
          </div>

          {(listing.good_with_children ||
            listing.good_with_dogs ||
            listing.good_with_cats) && (
            <div className="flex flex-wrap gap-2">
              {listing.good_with_children && (
                <span className="px-3 py-1.5 bg-balulu-primary-50 text-balulu-primary-700 text-xs font-bold rounded-full">
                  Buena con niños
                </span>
              )}
              {listing.good_with_dogs && (
                <span className="px-3 py-1.5 bg-balulu-primary-50 text-balulu-primary-700 text-xs font-bold rounded-full">
                  Buena con perros
                </span>
              )}
              {listing.good_with_cats && (
                <span className="px-3 py-1.5 bg-balulu-primary-50 text-balulu-primary-700 text-xs font-bold rounded-full">
                  Buena con gatos
                </span>
              )}
            </div>
          )}

          {listing.description && (
            <div>
              <h3 className="font-bold text-balulu-text mb-2">Sobre {listing.pet_name}</h3>
              <p className="text-balulu-muted text-[15px] leading-relaxed">
                {listing.description}
              </p>
            </div>
          )}

          {listing.special_instructions && (
            <div className="bg-balulu-primary-50 rounded-balulu-sm p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-balulu-primary-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-balulu-primary-800">
                  Instrucciones especiales
                </p>
                <p className="text-sm text-balulu-primary-700 mt-1">
                  {listing.special_instructions}
                </p>
              </div>
            </div>
          )}

          {/* Interest CTA */}
          {interested ? (
            <div className="bg-balulu-secondary-50 border-2 border-balulu-secondary-200 rounded-balulu p-5 text-center">
              <CheckCircle className="w-8 h-8 text-balulu-secondary-600 mx-auto mb-2" />
              <p className="font-semibold text-balulu-secondary-800">
                Ya enviaste tu interes
              </p>
              <p className="text-sm text-balulu-secondary-700 mt-1">
                Coordina los detalles directo con el dueño usando su contacto abajo.
              </p>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleInterestClick}
              className="btn-primary w-full"
            >
              <MessageCircle className="w-4.5 h-4.5 mr-2" />
              Me interesa ser foster
            </motion.button>
          )}

          {/* Direct contact */}
          {(listing.contact_phone ||
            listing.contact_whatsapp ||
            listing.contact_instagram) && (
            <div>
              <h3 className="font-bold text-balulu-text mb-3">
                Contacto directo
              </h3>
              <div className="flex flex-wrap gap-2">
                {listing.contact_whatsapp && (
                  <a href={`https://wa.me/${listing.contact_whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 text-sm font-semibold rounded-full hover:bg-green-100 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                )}
                {listing.contact_phone && (
                  <a href={`tel:${listing.contact_phone}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-balulu-primary-50 text-balulu-primary-700 text-sm font-semibold rounded-full hover:bg-balulu-primary-100 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Llamar
                  </a>
                )}
                {listing.contact_instagram && (
                  <a href={`https://instagram.com/${listing.contact_instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-700 text-sm font-semibold rounded-full hover:bg-pink-100 transition-colors"
                  >
                    <AtSign className="w-4 h-4" />
                    {listing.contact_instagram}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick chat modal */}
      <AnimatePresence>
        {showQuickChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !sending && setShowQuickChat(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-balulu shadow-balulu-lg p-6 max-w-md w-full"
            >
              {sent ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-balulu-secondary-600 mx-auto mb-3" />
                  <p className="font-bold text-balulu-text">¡Mensaje enviado!</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-balulu-text">
                      Enviar interes por {listing.pet_name}
                    </h3>
                    <button
                      onClick={() => setShowQuickChat(false)}
                      className="text-balulu-muted hover:text-balulu-text"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-2 mb-4">
                    {quickMessages.map((msg) => (
                      <button
                        key={msg}
                        onClick={() => setSelectedMessage(msg)}
                        className={`w-full text-left px-4 py-3 rounded-balulu-sm text-sm border-2 transition-colors ${
                          selectedMessage === msg
                            ? "border-balulu-secondary-500 bg-balulu-secondary-50 text-balulu-secondary-800"
                            : "border-balulu-border text-balulu-text hover:border-balulu-secondary-300"
                        }`}
                      >
                        {msg}
                      </button>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!selectedMessage || sending}
                    onClick={sendInterest}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? "Enviando..." : "Enviar mensaje"}
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
