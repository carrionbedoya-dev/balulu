"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Mail, Send, MapPin, Phone } from "lucide-react";
import { useToast } from "@/components/Toast";
import FadeIn from "@/components/animations/FadeIn";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("contact_messages").insert({
      name,
      email,
      subject,
      message,
    });

    if (error) {
      showToast("No se pudo enviar tu mensaje, intenta de nuevo", "error");
      setLoading(false);
      return;
    }

    showToast("¡Mensaje enviado! Te responderemos pronto.", "success");
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-balulu-background px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-balulu-muted hover:text-balulu-text mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <FadeIn>
          <h1 className="text-balulu-text mb-3">Contactanos</h1>
          <p className="text-lg text-balulu-muted mb-10 max-w-2xl">
            ¿Tienes dudas, sugerencias o quieres colaborar con BALULU?
            Escribenos, nos encantaria saber de ti.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-5 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 space-y-6"
          >
            <div className="card-premium p-6">
              <div className="w-12 h-12 bg-balulu-primary-100 rounded-balulu-sm flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-balulu-primary-600" />
              </div>
              <h3 className="font-bold text-balulu-text mb-1">Correo</h3>
              <p className="text-sm text-balulu-muted">hola@balulu.app</p>
            </div>

            <div className="card-premium p-6">
              <div className="w-12 h-12 bg-balulu-secondary-100 rounded-balulu-sm flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-balulu-secondary-600" />
              </div>
              <h3 className="font-bold text-balulu-text mb-1">Ubicacion</h3>
              <p className="text-sm text-balulu-muted">
                Cancun, Quintana Roo, Mexico
              </p>
            </div>

            <div className="card-premium p-6">
              <div className="w-12 h-12 bg-balulu-accent-100 rounded-balulu-sm flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-balulu-accent-600" />
              </div>
              <h3 className="font-bold text-balulu-text mb-1">Redes</h3>
              <p className="text-sm text-balulu-muted">
                Proximamente en Instagram y Facebook
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-3 bg-white rounded-balulu shadow-balulu p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="label">
                    Nombre
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="input"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
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
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="label">
                  Asunto
                </label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="input"
                  placeholder="¿Sobre que quieres hablar?"
                />
              </div>

              <div>
                <label htmlFor="message" className="label">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  className="input resize-none"
                  placeholder="Cuentanos mas..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 mr-2" />
                {loading ? "Enviando..." : "Enviar mensaje"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
