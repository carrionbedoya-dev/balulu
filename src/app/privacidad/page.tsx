export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-balulu-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-balulu-text mb-8">
          Aviso de privacidad
        </h1>

        <div className="prose prose-balulu max-w-none">
          <p className="text-balulu-muted mb-6">
            Ultima actualizacion: {new Date().toLocaleDateString("es-MX")}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-balulu-text mb-3">
              Responsable del tratamiento de datos
            </h2>
            <p className="text-balulu-muted leading-relaxed">
              BALULU es responsable del tratamiento de los datos personales que
              nos proporcionas. Puedes contactarnos en hola@balulu.app.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-balulu-text mb-3">
              Datos que recopilamos
            </h2>
            <ul className="list-disc list-inside text-balulu-muted leading-relaxed space-y-1">
              <li>Nombre completo</li>
              <li>Correo electronico</li>
              <li>Fecha de nacimiento (para clasificacion de edad)</li>
              <li>Ubicacion general (ciudad/municipio)</li>
              <li>Informacion sobre mascotas que publicas</li>
              <li>Mensajes de interes de adopcion</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-balulu-text mb-3">
              Finalidades del tratamiento
            </h2>
            <p className="text-balulu-muted leading-relaxed">
              Tus datos personales se utilizan para: crear y gestionar tu
              cuenta, facilitar la conexion entre adoptantes y refugios,
              mostrarte mascotas relevantes, comunicarnos contigo sobre tu
              cuenta, y garantizar la seguridad de la plataforma.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-balulu-text mb-3">
              Derechos ARCO
            </h2>
            <p className="text-balulu-muted leading-relaxed">
              Tienes derecho a Acceder, Rectificar, Cancelar u Oponerte al
              tratamiento de tus datos personales. Para ejercer estos derechos,
              envianos un correo a hola@balulu.app con tu solicitud.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-balulu-text mb-3">
              Transferencias de datos
            </h2>
            <p className="text-balulu-muted leading-relaxed">
              No compartimos tus datos personales con terceros sin tu
              consentimiento, salvo cuando sea requerido por ley o necesario
              para la operacion del servicio (proveedores de infraestructura
              como Supabase).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-balulu-text mb-3">
              Seguridad
            </h2>
            <p className="text-balulu-muted leading-relaxed">
              Implementamos medidas de seguridad tecnicas y administrativas
              para proteger tus datos, incluyendo cifrado, control de acceso y
              politicas de seguridad de filas (RLS) en nuestra base de datos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-balulu-text mb-3">
              Menores de edad
            </h2>
            <p className="text-balulu-muted leading-relaxed">
              Los menores de 16 anos pueden navegar la plataforma, pero no
              pueden publicar mascotas ni iniciar procesos de adopcion sin la
              participacion de un adulto. No recopilamos intencionalmente datos
              de menores de 13 anos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-balulu-text mb-3">
              Cambios al aviso de privacidad
            </h2>
            <p className="text-balulu-muted leading-relaxed">
              Podemos actualizar este aviso de privacidad. Te notificaremos
              sobre cambios significativos a traves de la plataforma o por
              correo electronico.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
