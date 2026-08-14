"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, PawPrint, Save, Loader2 } from "lucide-react";
import { useToast } from "@/components/Toast";

const speciesOptions = [
  { value: "perro", label: "Perro" },
  { value: "gato", label: "Gato" },
  { value: "conejo", label: "Conejo" },
  { value: "ave", label: "Ave" },
  { value: "otro", label: "Otro" },
];

const sizeOptions = [
  { value: "pequeno", label: "Pequeño" },
  { value: "mediano", label: "Mediano" },
  { value: "grande", label: "Grande" },
];

const sexOptions = [
  { value: "macho", label: "Macho" },
  { value: "hembra", label: "Hembra" },
  { value: "desconocido", label: "Desconocido" },
];

const statusOptions = [
  { value: "disponible", label: "Disponible" },
  { value: "en_proceso", label: "En proceso" },
  { value: "adoptado", label: "Adoptado" },
  { value: "no_disponible", label: "No disponible" },
];

export default function EditPetPage() {
  const params = useParams();
  const petId = params.id as string;
  const [formData, setFormData] = useState({
    name: "",
    species: "perro",
    breed: "",
    age_months: "",
    size: "mediano",
    sex: "macho",
    location: "",
    description: "",
    status: "disponible",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    fetchPet();
  }, [petId]);

  async function fetchPet() {
    const { data, error } = await supabase
      .from("pets")
      .select("*")
      .eq("id", petId)
      .single();

    if (error || !data) {
      showToast("Mascota no encontrada", "error");
      router.push("/organizacion");
      return;
    }

    setFormData({
      name: data.name,
      species: data.species,
      breed: data.breed || "",
      age_months: data.age_months?.toString() || "",
      size: data.size || "mediano",
      sex: data.sex || "macho",
      location: data.location || "",
      description: data.description || "",
      status: data.status || "disponible",
    });
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from("pets")
      .update({
        name: formData.name,
        species: formData.species,
        breed: formData.breed || null,
        age_months: formData.age_months ? parseInt(formData.age_months) : null,
        size: formData.size,
        sex: formData.sex,
        location: formData.location,
        description: formData.description,
        status: formData.status,
      })
      .eq("id", petId);

    if (error) {
      showToast("Error al actualizar la mascota", "error");
      setSaving(false);
      return;
    }

    showToast("Mascota actualizada exitosamente", "success");
    setSaving(false);
    setTimeout(() => router.push("/organizacion"), 1000);
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            href="/organizacion"
            className="inline-flex items-center gap-2 text-sm text-balulu-muted hover:text-balulu-text mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al panel
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
              <PawPrint className="w-7 h-7 text-balulu-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-balulu-text">
              Editar mascota
            </h1>
            <p className="text-balulu-muted mt-2">
              Actualiza la informacion de {formData.name}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="label">Nombre *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Especie *</label>
                <select
                  value={formData.species}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                  className="input"
                >
                  {speciesOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Raza</label>
                <input
                  type="text"
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Edad (meses)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.age_months}
                  onChange={(e) => setFormData({ ...formData, age_months: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Tamaño *</label>
                <select
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="input"
                >
                  {sizeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Sexo *</label>
                <select
                  value={formData.sex}
                  onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                  className="input"
                >
                  {sexOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Ubicacion *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="label">Estado *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="input"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Descripcion *</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input resize-none"
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
