"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { XCircle, ArrowRight } from "lucide-react";

export default function DonationErrorPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-balulu-background px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-balulu shadow-balulu-lg p-8 text-center"
      >
        <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-balulu-text mb-2">
          No se pudo procesar tu pago
        </h1>
        <p className="text-balulu-muted mb-8">
          Algo salio mal con tu donacion. No se realizo ningun cargo. Puedes
          intentarlo de nuevo cuando quieras.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/donaciones" className="btn-primary justify-center">
            Intentar de nuevo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link
            href="/contacto"
            className="text-sm text-balulu-muted hover:text-balulu-text font-medium"
          >
            ¿Necesitas ayuda? Contactanos
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
