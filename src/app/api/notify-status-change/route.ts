import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServiceClient } from "@/lib/supabase/service";

const resend = new Resend(process.env.RESEND_API_KEY);

const statusMessages: Record<string, { subject: string; body: string }> = {
  aceptado: {
    subject: "¡Tu solicitud fue aceptada!",
    body: "La organizacion acepto tu interes. Es momento de coordinar los siguientes pasos con ellos.",
  },
  rechazado: {
    subject: "Actualizacion sobre tu solicitud",
    body: "Esta vez no fue posible avanzar con esta adopcion. No te desanimes, hay muchas otras mascotas esperando por ti.",
  },
  adoptado: {
    subject: "¡Felicidades por tu nueva familia!",
    body: "Se confirmo la adopcion. Gracias por darle un hogar a una mascota que lo necesitaba.",
  },
};

export async function POST(request: Request) {
  try {
    const { interestId } = await request.json();
    if (!interestId) {
      return NextResponse.json({ error: "Falta interestId" }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { data: interest, error } = await supabase
      .from("adoption_interests")
      .select("status, user_id, pets(name)")
      .eq("id", interestId)
      .single();

    if (error || !interest) {
      return NextResponse.json({ error: "Interes no encontrado" }, { status: 404 });
    }

    const template = statusMessages[interest.status || ""];
    if (!template) {
      return NextResponse.json({ skipped: true });
    }

    const { data: userData } = await supabase.auth.admin.getUserById(
      interest.user_id
    );
    const email = userData?.user?.email;
    if (!email) {
      return NextResponse.json({ error: "Usuario sin correo" }, { status: 404 });
    }

    const petName = (interest.pets as { name: string } | null)?.name || "la mascota";

    await resend.emails.send({
      from: "BALULU <onboarding@resend.dev>",
      to: email,
      subject: `${template.subject} - ${petName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #1d4ed8;">${template.subject}</h2>
          <p>Hola,</p>
          <p>${template.body}</p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
            Mascota: <strong>${petName}</strong>
          </p>
          <a href="https://balulu.app/perfil" style="display:inline-block; margin-top: 16px; background: #2563eb; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none;">
            Ver mi BALULU
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
