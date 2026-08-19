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
      .from("adoption_interests")
      .select("message, pets(name, created_by)")
      .eq("id", interestId)
      .single();

    if (error || !interest || !interest.pets) {
      return NextResponse.json({ error: "Interes no encontrado" }, { status: 404 });
    }

    const pet = interest.pets as { name: string; created_by: string | null };
    if (!pet.created_by) {
      return NextResponse.json({ skipped: true });
    }

    const { data: userData } = await supabase.auth.admin.getUserById(
      pet.created_by
    );
    const email = userData?.user?.email;
    if (!email) {
      return NextResponse.json({ error: "Organizacion sin correo" }, { status: 404 });
    }

    await resend.emails.send({
      from: "BALULU <onboarding@resend.dev>",
      to: email,
      subject: `Nuevo interes en ${pet.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #1d4ed8;">Alguien quiere adoptar a ${pet.name}</h2>
          <p>Recibiste una nueva solicitud de interes en BALULU.</p>
          <p style="background: #f3f4f6; padding: 12px; border-radius: 8px; color: #374151;">
            "${interest.message || "Sin mensaje adicional"}"
          </p>
          <a href="https://balulu.app/organizacion" style="display:inline-block; margin-top: 16px; background: #2563eb; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none;">
            Ver en mi panel
          </a>
        </div>
      `,
    });

    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("Error enviando notificacion:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
