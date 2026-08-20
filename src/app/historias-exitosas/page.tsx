"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { createPublicClient } from "@/lib/supabase/client";
import { Heart, ArrowLeft, Sparkles } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";

interface Story {
  id: string;
  pet_name: string;
  photo_url: string;
  story: string;
  adopter_name: string | null;
  created_at: string | null;
}

export default function SuccessStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      const supabase = createPublicClient();
      const { data } = await supabase
        .from("success_stories")
        .select("id, pet_name, photo_url, story, adopter_name, created_at")
        .order("created_at", { ascending: false });
      setStories(data || []);
      setLoading(false);
    };
    fetchStories();
  }, []);

  return (
    <div className="min-h-screen bg-balulu-background">
      <div className="relative bg-gradient-to-br from-balulu-secondary-700 via-balulu-secondary-800 to-balulu-primary-900 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1920&q=80')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Link>
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 bg-white/15 rounded-balulu mx-auto mb-6 flex items-center justify-center backdrop-blur-sm"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-white mb-4">Vidas cambiadas</h1>
            <p className="text-balulu-secondary-100 text-lg max-w-2xl mx-auto">
              Cada historia aqui empezo con alguien que dijo "quiero
              adoptarte". Estas son algunas de esas historias.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <LoadingSkeleton count={6} type="card" />
        ) : stories.length === 0 ? (
          <EmptyState
            type="general"
            title="Todavia no hay historias publicadas"
            description="Cuando una organizacion marque una mascota como adoptada, su historia podra aparecer aqui."
            actionLabel="Conocer mascotas"
            actionHref="/explorar"
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 6) * 0.08 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-balulu shadow-balulu overflow-hidden card-premium"
              >
                <div className="relative aspect-[4/3] bg-balulu-border">
                  <Image
                    src={story.photo_url}
                    alt={story.pet_name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-balulu-secondary-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-balulu">
                    <Heart className="w-3.5 h-3.5" fill="currentColor" />
                    Adoptad{story.pet_name.endsWith("a") ? "a" : "o"}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-balulu-text mb-2">
                    {story.pet_name}
                  </h3>
                  <p className="text-balulu-muted text-sm leading-relaxed line-clamp-4">
                    {story.story}
                  </p>
                  {story.adopter_name && (
                    <p className="text-xs text-balulu-primary-600 font-semibold mt-3">
                      — Familia {story.adopter_name}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
