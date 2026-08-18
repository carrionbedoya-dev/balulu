"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, PawPrint, Shield, Users, ArrowRight, DollarSign } from "lucide-react";
import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/animations/StaggerContainer";
import { useToast } from "@/components/Toast";

export default function DonationsPage() {
  const [customAmount, setCustomAmount] = useState("");
  const { showToast } = useToast();

  const handleCustomDonation = () => {
    const amount = parseFloat(customAmount);
    if (!amount || amount <= 0) {
      showToast("Ingresa un monto valido", "error");
      return;
    }
    showToast(`Gracias por tu donacion de $${amount}!`, "success");
    setCustomAmount("");
  };

  return (
    <div className="min-h-screen bg-balulu-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-balulu-primary-900 via-balulu-primary-800 to-balulu-secondary-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1920&q=80')] bg-cover bg-center opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-b from-balulu-primary-900/50 to-balulu-primary-950" />
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/10"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.25, 0.1],
              rotate: [0, i % 2 === 0 ? 10 : -10, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          >
            <Heart className="w-8 h-8" fill="currentColor" />
          </motion.div>
        ))}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 bg-balulu-accent-500 rounded-balulu mx-auto mb-6 flex items-center justify-center shadow-balulu-lg"
            >
              <Heart className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Apoya la mision BALULU
            </h1>
            <p className="text-balulu-primary-200 text-lg max-w-2xl mx-auto">
              Tu donacion nos ayuda a mantener la plataforma, verificar
              organizaciones y seguir conectando mascotas con hogares llenos de
              amor.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Why donate */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-balulu-text mb-4">
              ¿Por que donar?
            </h2>
            <p className="text-balulu-muted text-lg max-w-2xl mx-auto">
              Cada contribucion nos permite seguir mejorando y expandiendo
              nuestro alcance
            </p>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Verificacion de organizaciones",
                desc: "Revisamos y verificamos cada refugio y rescatista para garantizar la seguridad de todos.",
              },
              {
                icon: Users,
                title: "Plataforma gratuita",
                desc: "Mantenemos BALULU accesible para todos, sin barreras economicas para adoptar o publicar.",
              },
              {
                icon: PawPrint,
                title: "Mas mascotas, mas hogares",
                desc: "Tu apoyo nos permite llegar a mas comunidades y conectar mas mascotas con familias.",
              },
            ].map((item, i) => (
              <StaggerItem key={i} className="text-center group">
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="w-16 h-16 bg-balulu-primary-100 text-balulu-primary-600 rounded-balulu mx-auto mb-6 flex items-center justify-center group-hover:bg-balulu-primary-600 group-hover:text-white transition-colors duration-300"
                >
                  <item.icon className="w-8 h-8" />
                </motion.div>
                <h3 className="text-xl font-bold text-balulu-text mb-3">
                  {item.title}
                </h3>
                <p className="text-balulu-muted leading-relaxed">
                  {item.desc}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Donation tiers */}
      <section className="py-20 bg-balulu-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-balulu-text mb-4">
              Elige tu contribucion
            </h2>
            <p className="text-balulu-muted text-lg">
              Todas las donaciones son voluntarias y nos ayudan a seguir
              adelante
            </p>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: "Amigo BALULU",
                amount: "$100",
                period: "mensual",
                benefits: [
                  "Apoyo basico a la plataforma",
                  "Reconocimiento en nuestra pagina",
                  "Actualizaciones exclusivas",
                ],
                highlighted: false,
                color: "from-balulu-primary-500 to-balulu-primary-600",
              },
              {
                name: "Protector",
                amount: "$250",
                period: "mensual",
                benefits: [
                  "Todo lo de Amigo BALULU",
                  "Badge especial en tu perfil",
                  "Acceso anticipado a nuevas funciones",
                  "Reporte mensual de impacto",
                ],
                highlighted: true,
                color: "from-balulu-accent-500 to-balulu-accent-600",
              },
              {
                name: "Guardian",
                amount: "$500",
                period: "mensual",
                benefits: [
                  "Todo lo de Protector",
                  "Soporte prioritario",
                  "Invitacion a eventos exclusivos",
                  "Mencion especial en comunicaciones",
                ],
                highlighted: false,
                color: "from-balulu-secondary-500 to-balulu-secondary-600",
              },
            ].map((tier, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`rounded-balulu-lg p-8 relative overflow-hidden ${
                    tier.highlighted
                      ? "bg-balulu-primary-600 text-white shadow-balulu-lg scale-105"
                      : "bg-white border border-balulu-border"
                  }`}
                >
                  {tier.highlighted && (
                    <div className="absolute top-0 right-0 bg-balulu-accent-500 text-white text-xs font-bold px-3 py-1 rounded-bl-balulu-sm">
                      POPULAR
                    </div>
                  )}
                  <h3
                    className={`text-xl font-bold mb-2 ${
                      tier.highlighted ? "text-white" : "text-balulu-text"
                    }`}
                  >
                    {tier.name}
                  </h3>
                  <div className="mb-6">
                    <span
                      className={`text-4xl font-bold ${
                        tier.highlighted ? "text-white" : "text-balulu-text"
                      }`}
                    >
                      {tier.amount}
                    </span>
                    <span
                      className={`text-sm ${
                        tier.highlighted
                          ? "text-balulu-primary-200"
                          : "text-balulu-muted"
                      }`}
                    >
                      /{tier.period}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.benefits.map((benefit, j) => (
                      <li
                        key={j}
                        className={`flex items-start gap-2 text-sm ${
                          tier.highlighted
                            ? "text-balulu-primary-100"
                            : "text-balulu-muted"
                        }`}
                      >
                        <svg
                          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            tier.highlighted
                              ? "text-balulu-accent-400"
                              : "text-balulu-secondary-500"
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      showToast(
                        `¡Gracias por elegir ${tier.name}! La pasarela de pago se activara muy pronto.`,
                        "success"
                      )
                    }
                    className={`w-full py-3 rounded-balulu-sm font-semibold transition-colors ${
                      tier.highlighted
                        ? "bg-white text-balulu-primary-700 hover:bg-balulu-primary-50"
                        : "btn-primary"
                    }`}
                  >
                    Elegir plan
                  </motion.button>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* One-time donation with custom amount */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-balulu-text mb-4">
              Donacion unica
            </h2>
            <p className="text-balulu-muted text-lg mb-8">
              Elige un monto o ingresa el que tu quieras
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {["$50", "$100", "$200", "$500", "$1000"].map((amount) => (
                <motion.button
                  key={amount}
                  whileHover={{ scale: 1.1, y: -4 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setCustomAmount(amount.replace("$", ""));
                    showToast(`¡Gracias por tu donacion de ${amount}!`, "success");
                  }}
                  className="px-8 py-4 bg-gradient-to-br from-balulu-primary-50 to-balulu-secondary-50 text-balulu-primary-700 font-bold rounded-balulu-sm border-2 border-balulu-primary-200 hover:border-balulu-accent-400 hover:from-balulu-accent-50 hover:to-balulu-accent-100 hover:text-balulu-accent-700 transition-all shadow-balulu hover:shadow-balulu-lg"
                >
                  {amount}
                </motion.button>
              ))}
            </div>

            {/* Custom amount */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto bg-balulu-primary-50 rounded-balulu p-6 border-2 border-balulu-primary-200"
            >
              <p className="text-sm font-medium text-balulu-text mb-4">
                ¿Quieres donar otro monto?
              </p>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-balulu-muted" />
                  <input
                    type="number"
                    min="1"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Ingresa monto"
                    className="input pl-10"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCustomDonation}
                  className="btn-accent px-6"
                >
                  Donar
                </motion.button>
              </div>
            </motion.div>

            <p className="text-sm text-balulu-muted mt-6">
              Las donaciones son procesadas de forma segura. BALULU no almacena
              datos de tarjetas de credito.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Impact counter */}
      <section className="py-20 bg-balulu-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1920&q=80')] bg-cover bg-center opacity-5" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl font-bold text-white mb-12">
              Nuestro impacto
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "1,200+", label: "Mascotas adoptadas" },
                { value: "50+", label: "Refugios verificados" },
                { value: "5,000+", label: "Usuarios activos" },
                { value: "98%", label: "Satisfaccion" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, type: "spring" }}
                >
                  <p className="text-3xl md:text-4xl font-bold text-balulu-accent-400 mb-2">
                    {stat.value}
                  </p>
                  <p className="text-balulu-primary-200 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl font-bold text-balulu-text mb-4">
              Otras formas de ayudar
            </h2>
            <p className="text-balulu-muted text-lg mb-8 max-w-2xl mx-auto">
              No puedes donar ahora? Comparte BALULU con tus amigos y familia.
              Cada conexion cuenta.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/explorar"
                className="btn-accent text-lg px-8 py-4 inline-flex"
              >
                Explorar mascotas
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
