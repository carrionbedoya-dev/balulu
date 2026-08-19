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
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [preferredSpecies, setPreferredSpecies] = useState<string[]>([]);
  const [preferredSize, setPreferredSize] = useState("");
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
    setNotifyEmail(user.user_metadata?.notify_email ?? true);
    setPreferredSpecies(user.user_metadata?.preferred_species || []);
    setPreferredSize(user.user_metadata?.preferred_size || "");
    setLoading(false);
  }

  const toggleSpecies = (species: string) => {
    setPreferredSpecies((prev) =>
      prev.includes(species)
        ? prev.filter((s) => s !== species)
        : [...prev, species]
    );
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        notify_email: notifyEmail,
        preferred_species: preferredSpecies,
        preferred_size: preferredSize,
      },
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

            <div className="border-t border-balulu-border pt-6">
              <h2 className="text-sm font-bold text-balulu-text uppercase tracking-wide mb-4">
                Preferencias
              </h2>

              <div className="flex items-center justify-between p-4 bg-balulu-background rounded-balulu-sm mb-5">
                <div>
                  <p className="font-semibold text-balulu-text text-sm">
                    Notificaciones por correo
                  </p>
                  <p className="text-xs text-balulu-muted mt-0.5">
                    Avisos cuando cambie el estado de tus solicitudes
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifyEmail(!notifyEmail)}
                  className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ${
                    notifyEmail ? "bg-balulu-primary-600" : "bg-balulu-border"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      notifyEmail ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="mb-5">
                <label className="label">Tipo de mascota que te interesa</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["perro", "gato", "conejo", "ave"].map((species) => (
                    <button
                      key={species}
                      type="button"
                      onClick={() => toggleSpecies(species)}
                      className={`px-3 py-2.5 text-sm font-semibold rounded-balulu-sm border-2 transition-all capitalize ${
                        preferredSpecies.includes(species)
                          ? "border-balulu-primary-500 bg-balulu-primary-50 text-balulu-primary-700"
                          : "border-balulu-border text-balulu-muted hover:border-balulu-primary-300"
                      }`}
                    >
                      {species}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="preferredSize" className="label">
                  Tamano preferido
                </label>
                <select
                  id="preferredSize"
                  value={preferredSize}
                  onChange={(e) => setPreferredSize(e.target.value)}
                  className="input"
                >
                  <option value="">Sin preferencia</option>
                  <option value="pequeno">Pequeno</option>
                  <option value="mediano">Mediano</option>
                  <option value="grande">Grande</option>
                </select>
              </div>
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
