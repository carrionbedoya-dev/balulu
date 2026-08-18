"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Sparkles, Send } from "lucide-react";
import { useToast } from "@/components/Toast";

interface AdoptedPet {
  id: string;
  name: string;
  images: string[] | null;
}

export default function ShareStoryPage() {
  const [adoptedPets, setAdoptedPets] = useState<AdoptedPet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [story, setStory] = useState("");
  const [adopterName, setAdopterName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPets, setLoadingPets] = useState(true);
  const router = useRouter();
  const { showToast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    const fetchAdoptedPets = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      const { data } = await supabase
        .from("pets")
        .select("id, name, images")
        .eq("created_by", user.id)
        .eq("status", "adoptado");
      setAdoptedPets(data || []);
      setLoadingPets(false);
    };
    fetchAdoptedPets();
  }, []);

  const selectedPet = adoptedPets.find((p) => p.id === selectedPetId);

  useEffect(() => {
    if (selectedPet?.images && selectedPet.images.length > 0 && !photoUrl) {
      setPhotoUrl(selectedPet.images[0]);
    }
  }, [selectedPetId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet) {
      showToast("Selecciona una mascota", "error");
      return;
    }
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("success_stories").insert({
      pet_id: selectedPet.id,
      pet_name: selectedPet.name,
      photo_url: photoUrl,
      story,
      adopter_name: adopterName || null,
      created_by: user?.id,
    });

    if (error) {
      showToast("No se pudo publicar la historia", "error");
      setLoading(false);
      return;
    }

    showToast("¡Historia publicada en el muro de adopciones!", "success");
    router.push("/historias-exitosas");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-balulu-background px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/organizacion"
          className="inline-flex items-center gap-2 text-sm text-balulu-muted hover:text-balulu-text mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al panel
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-balulu shadow-balulu p-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-balulu-secondary-100 rounded-balulu-sm flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-balulu-secondary-600" />
            </div>
            <h1 className="text-2xl font-bold text-balulu-text">
              Comparte una historia de adopcion
            </h1>
          </div>
          <p className="text-balulu-muted mb-8">
            Cuenta como fue el proceso, aparecera en el muro publico de
            "Vidas cambiadas".
          </p>

          {loadingPets ? (
            <p className="text-balulu-muted">Cargando tus mascotas...</p>
          ) : adoptedPets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-balulu-muted">
                Todavia no tienes mascotas marcadas como "adoptado". Cuando
                una adopcion se complete, marca el estado en tu panel y
                regresa aqui.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">Mascota adoptada</label>
                <select
                  value={selectedPetId}
                  onChange={(e) => setSelectedPetId(e.target.value)}
                  required
                  className="input"
                >
                  <option value="">Selecciona una mascota</option>
                  {adoptedPets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">URL de la foto</label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  required
                  className="input"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="label">Nombre de la familia (opcional)</label>
                <input
                  type="text"
                  value={adopterName}
                  onChange={(e) => setAdopterName(e.target.value)}
                  className="input"
                  placeholder="Ej: Familia Gonzalez"
                />
              </div>

              <div>
                <label className="label">Historia</label>
                <textarea
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  required
                  rows={5}
                  className="input resize-none"
                  placeholder="Cuenta como fue el proceso de adopcion..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-60"
              >
                <Send className="w-4 h-4 mr-2" />
                {loading ? "Publicando..." : "Publicar historia"}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
