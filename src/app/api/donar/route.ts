import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServiceClient } from "@/lib/supabase/service";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { donorEmail, donorName, amount } = await request.json();

    if (!donorEmail || !amount) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { data: donation, error } = await supabase
      .from("donations")
      .insert({
        donor_email: donorEmail,
        donor_name: donorName || null,
        amount: Number(amount),
        status: "pendiente_pasarela",
      })
      .select("id")
      .single();

    if (error || !donation) {
      console.error("Error guardando donacion:", error);
      return NextResponse.json(
        { error: "No se pudo registrar la donacion" },
        { status: 500 }
      );
    }

    try {
      await resend.emails.send({
        from: "BALULU <onboarding@resend.dev>",
        to: donorEmail,
        subject: "Gracias por tu intencion de donar a BALULU",
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #1d4ed8;">¡Gracias, ${donorName || "amig@"}!</h2>
            <p>Registramos tu interes en donar <strong>$${amount} MXN</strong> a BALULU.</p>
            <p style="color: #6b7280; font-size: 14px;">
              Estamos terminando de conectar nuestra pasarela de pagos. En
              cuanto este lista, te contactaremos a este correo para
              completar tu donacion de forma segura.
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              Mientras tanto, gracias por querer ayudar a que mas mascotas
              encuentren un hogar.
            </p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Error enviando correo de donacion:", emailErr);
    }

    return NextResponse.json({ success: true, donationId: donation.id });
  } catch (err) {
    console.error("Error en /api/donar:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
