import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PetProfileClient from "./PetProfileClient";

interface PageProps {
  params: Promise<{ id: string }>;
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
