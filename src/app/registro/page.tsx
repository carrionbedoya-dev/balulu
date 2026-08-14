"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { PawPrint, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      showToast("Las contraseñas no coinciden", "error");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      showToast("La contraseña debe tener al menos 6 caracteres", "error");
      setLoading(false);
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (signUpError) {
      showToast(signUpError.message, "error");
      setLoading(false);
      return;
    }

    showToast("¡Cuenta creada exitosamente!", "success");
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
            <div className="w-14 h-14 bg-balulu-accent-100 rounded-balulu mx-auto mb-4 flex items-center justify-center">
              <PawPrint className="w-7 h-7 text-balulu-accent-600" />
            </div>
            <h1 className="text-2xl font-bold text-balulu-text">
              Crea tu cuenta
            </h1>
            <p className="text-balulu-muted mt-2">
              Unete a la comunidad BALULU
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="fullName" className="label">
                Nombre completo
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="input"
                placeholder="Tu nombre"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
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
              transition={{ delay: 0.4 }}
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
                  placeholder="Minimo 6 caracteres"
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
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="confirmPassword" className="label">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="input"
                placeholder="Repite tu contraseña"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="btn-accent w-full disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </motion.button>
            </motion.div>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-center text-sm text-balulu-muted"
          >
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="text-balulu-primary-600 hover:text-balulu-primary-700 font-medium"
            >
              Inicia sesion
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
