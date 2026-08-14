import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/components/Toast";
import PageTransition from "@/components/PageTransition";
import ScrollToTop from "@/components/ScrollToTop";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable} data-scroll-behavior="smooth">
      <body className="font-sans antialiased bg-balulu-background text-balulu-text min-h-screen flex flex-col">
        <ToastProvider>
          <Navbar />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <ScrollToTop />
        </ToastProvider>
      </body>
    </html>
  );
}