"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  PawPrint,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/components/Toast";
import ImageUpload from "@/components/ImageUpload";

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

export default function PublishPetPage() {
  const [formData, setFormData] = useState({
    name: "",
    species: "perro",
    breed: "",
    age_months: "",
    size: "mediano",
    sex: "macho",
    location: "Cancun, Quintana Roo",
    description: "",
    good_with_children: false,
    good_with_dogs: false,
    good_with_cats: false,
    special_needs: "",
    contact_phone: "",
    contact_whatsapp: "",
    contact_instagram: "",
  });
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      showToast("Debes iniciar sesion para publicar", "error");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("pets").insert({
      name: formData.name,
      species: formData.species,
      breed: formData.breed || null,
      age_months: formData.age_months ? parseInt(formData.age_months) : null,
      size: formData.size,
      sex: formData.sex,
      location: formData.location,
      description: formData.description || null,
      good_with_children: formData.good_with_children,
      good_with_dogs: formData.good_with_dogs,
      good_with_cats: formData.good_with_cats,
      special_needs: formData.special_needs || null,
      contact_phone: formData.contact_phone || null,
      contact_whatsapp: formData.contact_whatsapp || null,
      contact_instagram: formData.contact_instagram || null,
      images: imageUrl ? [imageUrl] : [],
      status: "disponible",
      created_by: user.id,
    });

    if (insertError) {
      showToast("Error al publicar la mascota", "error");
      setLoading(false);
      return;
    }

    setSuccess(true);
    showToast("¡Mascota publicada exitosamente!", "success");
    setTimeout(() => {
      router.push("/organizacion");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-balulu-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
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
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-14 h-14 bg-balulu-secondary-100 rounded-balulu mx-auto mb-4 flex items-center justify-center"
            >
              <PawPrint className="w-7 h-7 text-balulu-secondary-600" />
            </motion.div>
            <h1 className="text-2xl font-bold text-balulu-text">
              Publicar una mascota
            </h1>
            <p className="text-balulu-muted mt-2">
              Completa la informacion para ayudar a encontrar un hogar
            </p>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-16 h-16 bg-balulu-secondary-100 rounded-balulu mx-auto mb-4 flex items-center justify-center"
              >
                <CheckCircle className="w-8 h-8 text-balulu-secondary-600" />
              </motion.div>
              <h3 className="text-xl font-bold text-balulu-text mb-2">
                ¡Mascota publicada!
              </h3>
              <p className="text-balulu-muted">
                Redirigiendo al panel de organizacion...
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label htmlFor="name" className="label">
                    Nombre de la mascota *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="input"
                    placeholder="Ej: Luna"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <label htmlFor="species" className="label">
                    Especie *
                  </label>
                  <select
                    id="species"
                    required
                    value={formData.species}
                    onChange={(e) =>
                      setFormData({ ...formData, species: e.target.value })
                    }
                    className="input"
                  >
                    {speciesOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label htmlFor="breed" className="label">
                    Raza
                  </label>
                  <input
                    id="breed"
                    type="text"
                    value={formData.breed}
                    onChange={(e) =>
                      setFormData({ ...formData, breed: e.target.value })
                    }
                    className="input"
                    placeholder="Ej: Labrador Mix"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <label htmlFor="age_months" className="label">
                    Edad (en meses)
                  </label>
                  <input
                    id="age_months"
                    type="number"
                    min="0"
                    value={formData.age_months}
                    onChange={(e) =>
                      setFormData({ ...formData, age_months: e.target.value })
                    }
                    className="input"
                    placeholder="Ej: 18"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label htmlFor="size" className="label">
                    Tamaño
                  </label>
                  <select
                    id="size"
                    value={formData.size}
                    onChange={(e) =>
                      setFormData({ ...formData, size: e.target.value })
                    }
                    className="input"
                  >
                    {sizeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <label htmlFor="sex" className="label">
                    Sexo
                  </label>
                  <select
                    id="sex"
                    value={formData.sex}
                    onChange={(e) =>
                      setFormData({ ...formData, sex: e.target.value })
                    }
                    className="input"
                  >
                    {sexOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="location" className="label">
                  Ubicacion
                </label>
                <input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="input"
                  placeholder="Ej: Cancun, Quintana Roo"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
              >
                <ImageUpload value={imageUrl} onChange={setImageUrl} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
              >
                <label className="label">Compatibilidad</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: "good_with_children", label: "Buena con niños" },
                    { key: "good_with_dogs", label: "Buena con perros" },
                    { key: "good_with_cats", label: "Buena con gatos" },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          [item.key]:
                            !formData[item.key as keyof typeof formData],
                        })
                      }
                      className={`px-3 py-2.5 text-sm font-semibold rounded-balulu-sm border-2 transition-all ${
                        formData[item.key as keyof typeof formData]
                          ? "border-balulu-primary-500 bg-balulu-primary-50 text-balulu-primary-700"
                          : "border-balulu-border text-balulu-muted hover:border-balulu-primary-300"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.47 }}
              >
                <label htmlFor="special_needs" className="label">
                  Necesidades especiales (opcional)
                </label>
                <input
                  id="special_needs"
                  type="text"
                  value={formData.special_needs}
                  onChange={(e) =>
                    setFormData({ ...formData, special_needs: e.target.value })
                  }
                  className="input"
                  placeholder="Ej: medicacion diaria, dieta especial..."
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.48 }}
              >
                <label className="label">Contacto para esta mascota (opcional)</label>
                <div className="grid sm:grid-cols-3 gap-3">
                  <input
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) =>
                      setFormData({ ...formData, contact_phone: e.target.value })
                    }
                    className="input"
                    placeholder="Telefono"
                  />
                  <input
                    type="tel"
                    value={formData.contact_whatsapp}
                    onChange={(e) =>
                      setFormData({ ...formData, contact_whatsapp: e.target.value })
                    }
                    className="input"
                    placeholder="WhatsApp"
                  />
                  <input
                    type="text"
                    value={formData.contact_instagram}
                    onChange={(e) =>
                      setFormData({ ...formData, contact_instagram: e.target.value })
                    }
                    className="input"
                    placeholder="@instagram"
                  />
                </div>
                <p className="text-xs text-balulu-muted mt-1.5">
                  Se mostrara en el perfil de esta mascota para que puedan contactarte directo.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="description" className="label">
                  Descripcion
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="input resize-none"
                  placeholder="Describe la personalidad, necesidades y caracteristicas de la mascota..."
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Publicando..." : "Dar en adopcion"}
                </motion.button>
              </motion.div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
