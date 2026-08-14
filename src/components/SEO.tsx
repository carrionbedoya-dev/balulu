import { Metadata } from "next";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
}

export function generateMetadata({
  title = "BALULU - Encuentra tu compañero perfecto",
  description = "BALULU conecta personas con mascotas que necesitan un hogar. Descubre, conoce y adopta de forma segura y emocional.",
  keywords = ["adopcion", "mascotas", "perros", "gatos", "refugios"],
  ogImage = "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&q=80",
  ogType = "website",
}: SEOProps): Metadata {
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: ogType as "website" | "article",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
