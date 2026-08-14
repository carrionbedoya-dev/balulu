"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PawPrint, Search, Heart, MessageCircle } from "lucide-react";

interface EmptyStateProps {
  type: "search" | "favorites" | "interests" | "pets" | "general";
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

const configs = {
  search: {
    icon: Search,
    title: "No encontramos mascotas",
    description: "Intenta con otros filtros o terminos de busqueda.",
    actionLabel: "Limpiar filtros",
    actionHref: "/explorar",
  },
  favorites: {
    icon: Heart,
    title: "No tienes favoritos aun",
    description: "Explora las mascotas disponibles y guarda las que te interesen.",
    actionLabel: "Explorar mascotas",
    actionHref: "/explorar",
  },
  interests: {
    icon: MessageCircle,
    title: "No tienes intereses de adopcion",
    description: "Cuando expreses interes en una mascota, aparecera aqui.",
    actionLabel: "Explorar mascotas",
    actionHref: "/explorar",
  },
  pets: {
    icon: PawPrint,
    title: "No has publicado mascotas",
    description: "Empieza a publicar mascotas disponibles para adopcion.",
    actionLabel: "Publicar mascota",
    actionHref: "/organizacion/publicar",
  },
  general: {
    icon: PawPrint,
    title: "No hay nada aqui",
    description: "Vuelve mas tarde o explora otras secciones.",
    actionLabel: "Volver al inicio",
    actionHref: "/",
  },
};

export default function EmptyState({
  type,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  const config = configs[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-20"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-24 h-24 bg-balulu-primary-100 rounded-balulu mx-auto mb-6 flex items-center justify-center"
      >
        <Icon className="w-12 h-12 text-balulu-primary-400" />
      </motion.div>
      <h3 className="text-xl font-semibold text-balulu-text mb-2">
        {title || config.title}
      </h3>
      <p className="text-balulu-muted max-w-md mx-auto mb-6">
        {description || config.description}
      </p>
      {(actionLabel || config.actionLabel) && (
        <Link
          href={actionHref || config.actionHref || "/"}
          className="btn-primary"
        >
          {actionLabel || config.actionLabel}
        </Link>
      )}
    </motion.div>
  );
}
