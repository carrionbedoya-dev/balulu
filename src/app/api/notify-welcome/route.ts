import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Falta email" }, { status: 400 });
    }

    const firstName = name?.split(" ")[0] || "";

    await resend.emails.send({
      from: "BALULU <onboarding@resend.dev>",
      to: email,
      subject: "¡Bienvenido a BALULU! 🐾",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #1d4ed8;">¡Bienvenido a BALULU${firstName ? `, ${firstName}` : ""}!</h2>
          <p>Gracias por unirte. Aqui puedes:</p>
          <ul style="color: #374151; line-height: 1.8;">
            <li>Conocer mascotas disponibles para adopcion en Cancun</li>
            <li>Buscar o publicar foster temporal</li>
            <li>Guardar tus favoritas y darles seguimiento</li>
          </ul>
          <a href="https://balulu.app/explorar" style="display:inline-block; margin-top: 16px; background: #2563eb; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none;">
            Conocer mascotas
          </a>
        </div>
      `,
    });

    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("Error enviando correo de bienvenida:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
