"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, User, Save, Loader2 } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function EditProfilePage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setEmail(user.email || "");
    setFullName(user.user_metadata?.full_name || "");
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });

    if (error) {
      showToast("Error al actualizar perfil", "error");
      setSaving(false);
      return;
    }

    showToast("Perfil actualizado exitosamente", "success");
    setSaving(false);
    setTimeout(() => router.push("/perfil"), 1000);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-balulu-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-balulu-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-balulu-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            href="/perfil"
            className="inline-flex items-center gap-2 text-sm text-balulu-muted hover:text-balulu-text mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al perfil
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-balulu shadow-balulu p-8"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-balulu-primary-100 rounded-balulu mx-auto mb-4 flex items-center justify-center">
              <User className="w-7 h-7 text-balulu-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-balulu-text">
              Editar perfil
            </h1>
            <p className="text-balulu-muted mt-2">
              Actualiza tu informacion personal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="label">
                Correo electronico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                disabled
                className="input bg-balulu-background opacity-60 cursor-not-allowed"
              />
              <p className="text-xs text-balulu-muted mt-1">
                El correo no se puede cambiar
              </p>
            </div>

            <div>
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
                placeholder="Tu nombre completo"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={saving}
              className="btn-primary w-full disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Guardar cambios
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
