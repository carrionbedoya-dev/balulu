"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, HeartHandshake, CheckCircle } from "lucide-react";
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

export default function PublishFosterPage() {
  const [formData, setFormData] = useState({
    pet_name: "",
    species: "perro",
    breed: "",
    age_months: "",
    size: "mediano",
    sex: "macho",
    start_date: "",
    end_date: "",
    location: "Cancun, Quintana Roo",
    compensation_type: "voluntario",
    compensation_details: "",
    covers_expenses: false,
    special_instructions: "",
    good_with_children: false,
    good_with_dogs: false,
    good_with_cats: false,
    description: "",
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

    if (!formData.start_date || !formData.end_date) {
      showToast("Indica las fechas de inicio y fin", "error");
      setLoading(false);
      return;
    }

    if (
      formData.compensation_type === "pagado" &&
      !formData.compensation_details
    ) {
      showToast("Describe el pago ofrecido (ej: $100 MXN/dia)", "error");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase
      .from("foster_listings")
      .insert({
        pet_name: formData.pet_name,
        species: formData.species,
        breed: formData.breed || null,
        age_months: formData.age_months ? parseInt(formData.age_months) : null,
        size: formData.size,
        sex: formData.sex,
        start_date: formData.start_date,
        end_date: formData.end_date,
        location: formData.location,
        compensation_type: formData.compensation_type,
        compensation_details: formData.compensation_details || null,
        covers_expenses: formData.covers_expenses,
        special_instructions: formData.special_instructions || null,
        good_with_children: formData.good_with_children,
        good_with_dogs: formData.good_with_dogs,
        good_with_cats: formData.good_with_cats,
        description: formData.description || null,
        contact_phone: formData.contact_phone || null,
        contact_whatsapp: formData.contact_whatsapp || null,
        contact_instagram: formData.contact_instagram || null,
        images: imageUrl ? [imageUrl] : [],
        status: "disponible",
        created_by: user.id,
      });

    if (insertError) {
      console.error(insertError);
      showToast("Error al publicar la solicitud de foster", "error");
      setLoading(false);
      return;
    }

    setSuccess(true);
    showToast("¡Solicitud de foster publicada!", "success");
    setTimeout(() => {
      router.push("/foster");
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
            href="/foster"
            className="inline-flex items-center gap-2 text-sm text-balulu-muted hover:text-balulu-text mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a foster
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
              <HeartHandshake className="w-7 h-7 text-balulu-secondary-600" />
            </motion.div>
            <h1 className="text-2xl font-bold text-balulu-text">
              Buscar foster temporal
            </h1>
            <p className="text-balulu-muted mt-2">
              Publica tu mascota para que alguien la cuide mientras la
              resuelves. BALULU solo conecta — el acuerdo se hace directo
              entre ustedes.
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
                ¡Solicitud publicada!
              </h3>
              <p className="text-balulu-muted">Redirigiendo a foster...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="pet_name" className="label">
                    Nombre de la mascota *
                  </label>
                  <input
                    id="pet_name"
                    type="text"
                    required
                    value={formData.pet_name}
                    onChange={(e) =>
                      setFormData({ ...formData, pet_name: e.target.value })
                    }
                    className="input"
                    placeholder="Ej: Luna"
                  />
                </div>

                <div>
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
                </div>

                <div>
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
                </div>

                <div>
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
                </div>

                <div>
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
                </div>

                <div>
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
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="start_date" className="label">
                    Fecha de inicio *
                  </label>
                  <input
                    id="start_date"
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    className="input"
                  />
                </div>
                <div>
                  <label htmlFor="end_date" className="label">
                    Fecha de fin *
                  </label>
                  <input
                    id="end_date"
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="label">
                  Ubicacion / zona
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
              </div>

              <ImageUpload value={imageUrl} onChange={setImageUrl} />

              <div>
                <label className="label">Compensacion *</label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {[
                    { value: "voluntario", label: "Voluntario" },
                    { value: "pagado", label: "Pagado" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          compensation_type: opt.value,
                        })
                      }
                      className={`px-3 py-2.5 text-sm font-semibold rounded-balulu-sm border-2 transition-all ${
                        formData.compensation_type === opt.value
                          ? "border-balulu-secondary-500 bg-balulu-secondary-50 text-balulu-secondary-700"
                          : "border-balulu-border text-balulu-muted hover:border-balulu-secondary-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.compensation_details}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      compensation_details: e.target.value,
                    })
                  }
                  className="input"
                  placeholder='Ej: "$100 MXN/dia" o "Se cubren gastos y alimentacion"'
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      covers_expenses: !formData.covers_expenses,
                    })
                  }
                  className={`mt-3 px-3 py-2.5 text-sm font-semibold rounded-balulu-sm border-2 transition-all ${
                    formData.covers_expenses
                      ? "border-balulu-secondary-500 bg-balulu-secondary-50 text-balulu-secondary-700"
                      : "border-balulu-border text-balulu-muted hover:border-balulu-secondary-300"
                  }`}
                >
                  Yo cubro gastos y alimentacion
                </button>
              </div>

              <div>
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
              </div>

              <div>
                <label htmlFor="special_instructions" className="label">
                  Instrucciones especiales (opcional)
                </label>
                <textarea
                  id="special_instructions"
                  rows={3}
                  value={formData.special_instructions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      special_instructions: e.target.value,
                    })
                  }
                  className="input resize-none"
                  placeholder="Ej: medicacion diaria, horarios de comida, rutina de paseo..."
                />
              </div>

              <div>
                <label className="label">Contacto (opcional)</label>
                <div className="grid sm:grid-cols-3 gap-3">
                  <input
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact_phone: e.target.value,
                      })
                    }
                    className="input"
                    placeholder="Telefono"
                  />
                  <input
                    type="tel"
                    value={formData.contact_whatsapp}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact_whatsapp: e.target.value,
                      })
                    }
                    className="input"
                    placeholder="WhatsApp"
                  />
                  <input
                    type="text"
                    value={formData.contact_instagram}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact_instagram: e.target.value,
                      })
                    }
                    className="input"
                    placeholder="@instagram"
                  />
                </div>
                <p className="text-xs text-balulu-muted mt-1.5">
                  Se mostrara en tu publicacion para que puedan contactarte
                  directo.
                </p>
              </div>

              <div>
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
                  placeholder="Describe la personalidad de tu mascota y por que necesitas foster temporal..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Publicando..." : "Publicar solicitud de foster"}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
