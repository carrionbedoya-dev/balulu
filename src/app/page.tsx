"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Heart, Shield, MessageCircle, ArrowRight, PawPrint } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/animations/StaggerContainer";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-balulu-primary-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1920&q=80')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-balulu-primary-900/80 to-balulu-primary-950" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-balulu-primary-800/50 rounded-full text-balulu-primary-200 text-sm font-medium mb-6 backdrop-blur-sm"
            >
              <PawPrint className="w-4 h-4" />
              Cancún, Quintana Roo
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              Encuentra a tu{" "}
              <motion.span
                initial={{ opacity: 0, color: "#fff" }}
                animate={{ opacity: 1, color: "#fb923c" }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-balulu-accent-400"
              >
                compañero perfecto
              </motion.span>
            </h1>
            <p className="text-lg md:text-xl text-balulu-primary-200 mb-8 leading-relaxed max-w-2xl">
              BALULU conecta personas con mascotas que necesitan un hogar.
              Descubre, conoce y da el primer paso hacia una conexión
              inolvidable.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/explorar" className="btn-accent text-base justify-center">
                Explorar mascotas
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/sobre-balulu" className="btn-secondary text-base justify-center bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/30">
                Conocer más
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-balulu-text mb-4">
              ¿Cómo funciona BALULU?
            </h2>
            <p className="text-balulu-muted text-lg max-w-2xl mx-auto">
              Tres pasos simples para encontrar a tu nuevo mejor amigo
            </p>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Descubre",
                desc: "Explora mascotas disponibles cerca de ti. Filtra por especie, tamaño, edad y más.",
                color: "bg-balulu-primary-100 text-balulu-primary-600",
              },
              {
                icon: Heart,
                title: "Conecta",
                desc: "Conoce su personalidad, necesidades y historia. Guarda tus favoritas.",
                color: "bg-balulu-accent-100 text-balulu-accent-600",
              },
              {
                icon: MessageCircle,
                title: "Adopta",
                desc: "Inicia el proceso de adopción con mensajes guiados y contacto directo.",
                color: "bg-balulu-secondary-100 text-balulu-secondary-600",
              },
            ].map((step, i) => (
              <StaggerItem key={i} className="text-center group">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`w-16 h-16 ${step.color} rounded-balulu mx-auto mb-6 flex items-center justify-center`}
                >
                  <step.icon className="w-8 h-8" />
                </motion.div>
                <h3 className="text-xl font-bold text-balulu-text mb-3">
                  {step.title}
                </h3>
                <p className="text-balulu-muted leading-relaxed">
                  {step.desc}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-20 bg-balulu-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left">
              <h2 className="text-3xl md:text-4xl font-bold text-balulu-text mb-6">
                Confianza en cada paso
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: Shield,
                    title: "Perfiles verificados",
                    desc: "Cada organización y rescatista pasa por un proceso de verificación.",
                  },
                  {
                    icon: Heart,
                    title: "Proceso transparente",
                    desc: "Información clara sobre cada mascota, sin sorpresas ni engaños.",
                  },
                  {
                    icon: MessageCircle,
                    title: "Comunicación guiada",
                    desc: "Mensajes predefinidos que facilitan el contacto de forma segura.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                    className="flex gap-4"
                  >
                    <div className="w-12 h-12 bg-balulu-primary-100 rounded-balulu-sm flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-balulu-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-balulu-text mb-1">
                        {item.title}
                      </h4>
                      <p className="text-balulu-muted text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
            <FadeIn direction="right" className="relative">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="aspect-[4/3] bg-balulu-primary-200 rounded-balulu-lg overflow-hidden relative"
              >
                <Image
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80"
                  alt="Persona abrazando a un perro"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-balulu-primary-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Listo para encontrar a tu compañero?
            </h2>
            <p className="text-balulu-primary-200 text-lg mb-8 max-w-2xl mx-auto">
              Miles de mascotas están esperando un hogar. El tuyo podría ser el
              siguiente.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/explorar" className="btn-accent text-lg px-8 py-4 inline-flex">
                Empezar a explorar
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
