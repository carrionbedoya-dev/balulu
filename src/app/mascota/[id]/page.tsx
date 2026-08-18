import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PetProfileClient from "./PetProfileClient";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: pet } = await supabase
    .from("pets")
    .select("name, species, breed, description, images, location")
    .eq("id", id)
    .single();

  if (!pet) {
    return { title: "Mascota no encontrada - BALULU" };
  }

  const title = `${pet.name} busca un hogar - BALULU`;
  const description =
    pet.description?.slice(0, 155) ||
    `${pet.name} es un/a ${pet.species}${pet.breed ? ` ${pet.breed}` : ""} que busca una familia${pet.location ? ` en ${pet.location}` : ""}. Conoce su historia en BALULU.`;
  const image =
    pet.images && pet.images.length > 0
      ? pet.images[0]
      : "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&q=80";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: pet.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function PetProfilePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: pet } = await supabase
    .from("pets")
    .select(
      "*, organizations(id, name, description, phone, email, location, verified)"
    )
    .eq("id", id)
    .single();

  if (!pet) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isFavorite = false;
  if (user) {
    const { data: fav } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("pet_id", id)
      .single();
    isFavorite = !!fav;
  }

  return <PetProfileClient pet={pet} initialFavorite={isFavorite} userId={user?.id} />;
}
