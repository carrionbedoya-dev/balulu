import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import FosterListingClient from "./FosterListingClient";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("foster_listings")
    .select("pet_name, species, breed, location, images")
    .eq("id", id)
    .single();

  if (!listing) {
    return { title: "Solicitud de foster no encontrada - BALULU" };
  }

  const title = `${listing.pet_name} busca foster temporal - BALULU`;
  const description = `${listing.pet_name} es un/a ${listing.species}${
    listing.breed ? ` ${listing.breed}` : ""
  } que necesita foster temporal en ${listing.location}.`;
  const image =
    listing.images && listing.images.length > 0
      ? listing.images[0]
      : "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1200&q=80";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: listing.pet_name }],
    },
  };
}

export default async function FosterListingPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("foster_listings")
    .select("*")
    .eq("id", id)
    .single();

  if (!listing) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let alreadyInterested = false;
  if (user) {
    const { data: interest } = await supabase
      .from("foster_interests")
      .select("id")
      .eq("user_id", user.id)
      .eq("listing_id", id)
      .single();
    alreadyInterested = !!interest;
  }

  return (
    <FosterListingClient
      listing={listing}
      userId={user?.id}
      alreadyInterested={alreadyInterested}
    />
  );
}
