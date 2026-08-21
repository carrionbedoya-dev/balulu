import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServiceClient } from "@/lib/supabase/service";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { interestId } = await request.json();
    if (!interestId) {
      return NextResponse.json({ error: "Falta interestId" }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { data: interest, error } = await supabase
      .from("foster_interests")
      .select("message, foster_listings(pet_name, created_by)")
      .eq("id", interestId)
      .single();

    if (error || !interest || !interest.foster_listings) {
      return NextResponse.json({ error: "Interes no encontrado" }, { status: 404 });
    }

    const listing = interest.foster_listings as {
      pet_name: string;
      created_by: string | null;
    };
    if (!listing.created_by) {
      return NextResponse.json({ skipped: true });
    }

    const { data: userData } = await supabase.auth.admin.getUserById(
      listing.created_by
    );
    const email = userData?.user?.email;
    if (!email) {
      return NextResponse.json({ error: "Dueño sin correo" }, { status: 404 });
    }

    await resend.emails.send({
      from: "BALULU <onboarding@resend.dev>",
      to: email,
      subject: `Alguien quiere ser foster de ${listing.pet_name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #1d4ed8;">Nuevo interes de foster para ${listing.pet_name}</h2>
          <p>Alguien quiere cuidar a ${listing.pet_name} temporalmente.</p>
          <p style="background: #f3f4f6; padding: 12px; border-radius: 8px; color: #374151;">
            "${interest.message || "Sin mensaje adicional"}"
          </p>
          <a href="https://balulu.app/foster" style="display:inline-block; margin-top: 16px; background: #2563eb; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none;">
            Ver en BALULU
          </a>
        </div>
      `,
    });

    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("Error enviando notificacion de foster:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
