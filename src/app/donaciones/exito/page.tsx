"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Heart, ArrowRight } from "lucide-react";

export default function DonationSuccessPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-balulu-background px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-balulu shadow-balulu-lg p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="w-20 h-20 bg-balulu-secondary-100 rounded-full mx-auto mb-6 flex items-center justify-center"
        >
          <CheckCircle className="w-10 h-10 text-balulu-secondary-600" />
        </motion.div>
        <h1 className="text-2xl font-bold text-balulu-text mb-2">
          ¡Gracias por tu donacion!
        </h1>
        <p className="text-balulu-muted mb-8">
          Tu apoyo ayuda a que mas mascotas encuentren un hogar. Recibiras un
          correo con el detalle de tu donacion.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/explorar" className="btn-primary justify-center">
            Explorar mascotas
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link
            href="/"
            className="text-sm text-balulu-muted hover:text-balulu-text font-medium"
          >
            Volver al inicio
          </Link>
        </div>
        <div className="mt-6 flex items-center justify-center gap-1 text-balulu-accent-500">
          <Heart className="w-4 h-4" fill="currentColor" />
          <Heart className="w-4 h-4" fill="currentColor" />
          <Heart className="w-4 h-4" fill="currentColor" />
        </div>
      </motion.div>
    </div>
  );
}
