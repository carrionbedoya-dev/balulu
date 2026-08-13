import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BALULU - Encuentra tu compañero perfecto",
  description:
    "BALULU conecta personas con mascotas que necesitan un hogar. Descubre, conoce y adopta de forma segura y emocional.",
  keywords: ["adopcion", "mascotas", "perros", "gatos", "refugios", "Cancun"],
  openGraph: {
    title: "BALULU - Encuentra tu compañero perfecto",
    description:
      "BALULU conecta personas con mascotas que necesitan un hogar.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans antialiased bg-balulu-background text-balulu-text min-h-screen flex flex-col">
        <Navbar user={user ? { email: user.email } : null} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
