import Link from "next/link";
import { PawPrint, Heart, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-balulu-primary-950 text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-balulu-primary-500 rounded-balulu-sm flex items-center justify-center">
                <PawPrint className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                BALULU
              </span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              Conectando corazones con patas. Cada mascota merece un hogar
              lleno de amor.
            </p>
            <div className="flex items-center gap-1 text-sm text-white/60">
              <MapPin className="w-4 h-4" />
              Cancun, Quintana Roo, Mexico
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              Plataforma
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/explorar"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Conocer mascotas
                </Link>
              </li>
              <li>
                <Link
                  href="/organizacion"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Panel de organizacion
                </Link>
              </li>
              <li>
                <Link
                  href="/historias-exitosas"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Vidas cambiadas
                </Link>
              </li>
              <li>
                <Link
                  href="/donaciones"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Donar
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre-balulu"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Sobre BALULU
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/terminos"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Terminos de servicio
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidad"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Aviso de privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidad"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              Contacto
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-sm text-white/60">
                <Mail className="w-4 h-4" />
                hola@balulu.app
              </li>
              <li className="flex items-center gap-2 text-sm text-white/60">
                <Phone className="w-4 h-4" />
                +52 998 123 4567
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} BALULU. Todos los derechos
            reservados.
          </p>
          <p className="text-xs text-white/40 flex items-center gap-1">
            Hecho con <Heart className="w-3 h-3 text-balulu-accent-400" /> en
            Cancun
          </p>
        </div>
      </div>
    </footer>
  );
}
