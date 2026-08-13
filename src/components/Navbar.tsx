"use client";

import Link from "next/link";
import { useState } from "react";
import { PawPrint, Menu, X, Heart, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface NavbarProps {
  user?: { email?: string | null } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-balulu-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-balulu-primary-600 rounded-balulu-sm flex items-center justify-center group-hover:bg-balulu-primary-700 transition-colors">
              <PawPrint className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-balulu-primary-800 tracking-tight">
              BALULU
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/explorar"
              className="px-4 py-2 text-sm font-medium text-balulu-text hover:text-balulu-primary-700 hover:bg-balulu-primary-50 rounded-balulu-sm transition-all"
            >
              Explorar
            </Link>
            {user && (
              <Link
                href="/favoritos"
                className="px-4 py-2 text-sm font-medium text-balulu-text hover:text-balulu-primary-700 hover:bg-balulu-primary-50 rounded-balulu-sm transition-all flex items-center gap-1.5"
              >
                <Heart className="w-4 h-4" />
                Favoritos
              </Link>
            )}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/perfil"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-balulu-text hover:text-balulu-primary-700 hover:bg-balulu-primary-50 rounded-balulu-sm transition-all"
                >
                  <User className="w-4 h-4" />
                  Mi cuenta
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-balulu-muted hover:text-balulu-text transition-colors"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-balulu-text hover:text-balulu-primary-700 transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/registro"
                  className="btn-primary text-sm"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-balulu-sm hover:bg-balulu-primary-50 transition-colors"
          >
            {mobileOpen ? (
              <X className="w-6 h-6 text-balulu-text" />
            ) : (
              <Menu className="w-6 h-6 text-balulu-text" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-balulu-border px-4 py-4 space-y-2">
          <Link
            href="/explorar"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-3 text-sm font-medium text-balulu-text hover:bg-balulu-primary-50 rounded-balulu-sm"
          >
            Explorar mascotas
          </Link>
          {user && (
            <Link
              href="/favoritos"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-balulu-text hover:bg-balulu-primary-50 rounded-balulu-sm flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              Favoritos
            </Link>
          )}
          {user ? (
            <>
              <Link
                href="/perfil"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-balulu-text hover:bg-balulu-primary-50 rounded-balulu-sm"
              >
                Mi cuenta
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-balulu-muted hover:bg-balulu-primary-50 rounded-balulu-sm"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-balulu-text hover:bg-balulu-primary-50 rounded-balulu-sm"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/registro"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-balulu-primary-700 bg-balulu-primary-50 rounded-balulu-sm"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
