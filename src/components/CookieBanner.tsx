"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

const CONSENT_KEY = "balulu-cookie-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(
      CONSENT_KEY,
      JSON.stringify({ accepted: true, date: new Date().toISOString() })
    );
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(
      CONSENT_KEY,
      JSON.stringify({ accepted: false, date: new Date().toISOString() })
    );
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6"
        >
          <div className="max-w-3xl mx-auto bg-white rounded-balulu shadow-balulu-lg border border-balulu-border p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-11 h-11 bg-balulu-primary-50 rounded-balulu-sm flex items-center justify-center flex-shrink-0">
              <Cookie className="w-6 h-6 text-balulu-primary-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-balulu-text leading-relaxed">
                Usamos cookies para mejorar tu experiencia y mantener tu
                sesion activa. Puedes leer mas en nuestra{" "}
                <Link
                  href="/privacidad"
                  className="text-balulu-primary-600 font-semibold hover:underline"
                >
                  Politica de Privacidad
                </Link>
                .
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto flex-shrink-0">
              <button
                onClick={decline}
                className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-semibold text-balulu-muted hover:text-balulu-text transition-colors"
              >
                Rechazar
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={accept}
                className="flex-1 sm:flex-none btn-primary text-sm py-2.5 px-5"
              >
                Aceptar
              </motion.button>
            </div>
            <button
              onClick={decline}
              className="hidden sm:block absolute -top-2 -right-2 w-6 h-6 bg-balulu-text rounded-full text-white flex items-center justify-center hover:bg-balulu-primary-700 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
