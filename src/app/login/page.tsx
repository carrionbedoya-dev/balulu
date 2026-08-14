"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { PawPrint, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      showToast("Correo o contraseña incorrectos", "error");
      setLoading(false);
      return;
    }

    showToast("¡Bienvenido de vuelta!", "success");
    router.refresh();
    router.push("/explorar");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-balulu-background px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-balulu-muted hover:text-balulu-text mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <div className="bg-white rounded-balulu shadow-balulu p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <div className="w-14 h-14 bg-balulu-primary-100 rounded-balulu mx-auto mb-4 flex items-center justify-center">
              <PawPrint className="w-7 h-7 text-balulu-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-balulu-text">
              Bienvenido de vuelta
            </h1>
            <p className="text-balulu-muted mt-2">
              Inicia sesion para continuar
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="email" className="label">
                Correo electronico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
                placeholder="tu@email.com"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="password" className="label">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input pr-12"
                  placeholder="Tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-balulu-muted hover:text-balulu-text transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Iniciando sesion..." : "Iniciar sesion"}
              </motion.button>
            </motion.div>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center text-sm text-balulu-muted"
          >
            ¿No tienes cuenta?{" "}
            <Link
              href="/registro"
              className="text-balulu-primary-600 hover:text-balulu-primary-700 font-medium"
            >
              Registrate aqui
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}