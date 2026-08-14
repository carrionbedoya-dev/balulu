"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  PawPrint,
  Menu,
  X,
  User,
  LogOut,
  Heart,
  Search,
  Building2,
  HeartHandshake,
} from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<{ email: string | undefined } | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user ? { email: user.email } : null);
      setLoading(false);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { email: session.user.email } : null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { href: "/explorar", label: "Explorar", icon: Search },
    { href: "/favoritos", label: "Favoritos", icon: Heart },
    { href: "/donaciones", label: "Donar", icon: HeartHandshake },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-balulu-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 bg-gradient-to-br from-balulu-primary-500 to-balulu-primary-700 rounded-balulu-sm flex items-center justify-center shadow-balulu"
            >
              <PawPrint className="w-5.5 h-5.5 text-white" strokeWidth={2.5} />
            </motion.div>
            <span className="text-2xl font-extrabold tracking-tight gradient-text">
              BALULU
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive(link.href) ? "nav-link-active" : ""}`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/organizacion"
                      className="nav-link"
                    >
                      <Building2 className="w-4 h-4" />
                      Mi organizacion
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-balulu-muted hover:text-red-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar sesion
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/login"
                      className="text-sm font-medium text-balulu-text hover:text-balulu-primary-600 transition-colors"
                    >
                      Iniciar sesion
                    </Link>
                    <Link
                      href="/registro"
                      className="btn-primary text-sm"
                    >
                      Registrarse
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-balulu-sm hover:bg-balulu-primary-50 transition-colors"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-balulu-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-balulu-sm ${
                    isActive(link.href)
                      ? "bg-balulu-primary-50 text-balulu-primary-700"
                      : "text-balulu-text hover:bg-balulu-primary-50"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-balulu-border pt-2 mt-2">
                {!loading && (
                  <>
                    {user ? (
                      <>
                        <Link
                          href="/organizacion"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-balulu-text hover:bg-balulu-primary-50 rounded-balulu-sm"
                        >
                          <Building2 className="w-4 h-4" />
                          Mi organizacion
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setMobileOpen(false);
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-balulu-sm w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          Cerrar sesion
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-balulu-text hover:bg-balulu-primary-50 rounded-balulu-sm"
                        >
                          <User className="w-4 h-4" />
                          Iniciar sesion
                        </Link>
                        <Link
                          href="/registro"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-balulu-primary-600 font-medium hover:bg-balulu-primary-50 rounded-balulu-sm"
                        >
                          Registrarse
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}