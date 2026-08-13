import Link from "next/link";
import { PawPrint, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-balulu-primary-950 text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              Plataforma
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/explorar"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Explorar mascotas
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
                  href="/terminos"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Términos de servicio
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidad"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              Contacto
            </h4>
            <p className="text-sm text-white/60 leading-relaxed">
              Cancún, Quintana Roo, México
            </p>
            <p className="text-sm text-white/60 mt-2">
              hola@balulu.app
            </p>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} BALULU. Todos los derechos
            reservados.
          </p>
          <p className="text-xs text-white/40 flex items-center gap-1">
            Hecho con <Heart className="w-3 h-3 text-balulu-accent-400" /> en
            Cancún
          </p>
        </div>
      </div>
    </footer>
  );
}
