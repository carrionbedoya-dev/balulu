"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";

export default function DonationPendingPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-balulu-background px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-balulu shadow-balulu-lg p-8 text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 bg-balulu-accent-100 rounded-full mx-auto mb-6 flex items-center justify-center"
        >
          <Clock className="w-10 h-10 text-balulu-accent-600" />
        </motion.div>
        <h1 className="text-2xl font-bold text-balulu-text mb-2">
          Tu pago esta en proceso
        </h1>
        <p className="text-balulu-muted mb-8">
          Estamos confirmando tu pago con Mercado Pago (por ejemplo, si
          pagaste en OXXO puede tardar unas horas). Te avisaremos por correo
          en cuanto se confirme.
        </p>
        <Link href="/" className="btn-primary justify-center inline-flex">
          Volver al inicio
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </motion.div>
    </div>
  );
}
