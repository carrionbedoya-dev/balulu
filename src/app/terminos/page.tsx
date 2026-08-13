export default function TermsPage() {
  return (
    <div className="min-h-screen bg-balulu-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-balulu-text mb-8">
          Terminos de servicio
        </h1>

        <div className="prose prose-balulu max-w-none">
          <p className="text-balulu-muted mb-6">
            Ultima actualizacion: {new Date().toLocaleDateString("es-MX")}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-balulu-text mb-3">
              1. Aceptacion de los terminos
            </h2>
            <p className="text-balulu-muted leading-relaxed">
              Al usar BALULU, aceptas estos terminos de servicio. Si no estas de
              acuerdo, no uses la plataforma.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-balulu-text mb-3">
              2. Descripcion del servicio
            </h2>
            <p className="text-balulu-muted leading-relaxed">
              BALULU es una plataforma tecnologica que facilita la conexion
              entre personas interesadas en adoptar mascotas y refugios,
              rescatistas u organizaciones que tienen mascotas disponibles para
              adopcion. BALULU no es propietaria de las mascotas listadas ni
              garantiza que una adopcion ocurra.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-balulu-text mb-3">
              3. Elegibilidad
            </h2>
            <p className="text-balulu-muted leading-relaxed">
              Debes tener al menos 16 anos para crear una cuenta. Los menores de
              16 anos pueden navegar la plataforma pero necesitan la
              participacion de un adulto para procesos de adopcion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-balulu-text mb-3">
              4. Contenido generado por usuarios
            </h2>
            <p className="text-balulu-muted leading-relaxed">
              Los usuarios pueden publicar listados de mascotas. BALULU se
              reserva el derecho de revisar, restringir, ocultar, suspender o
              eliminar cualquier publicacion o cuenta cuando sea razonablemente
              necesario para seguridad, prevencion de fraude, moderacion,
              cumplimiento legal o proteccion de la plataforma.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-balulu-text mb-3">
              5. Limitacion de responsabilidad
            </h2>
            <p className="text-balulu-muted leading-relaxed">
              BALULU facilita conexiones. La relacion de adopcion final existe
              entre las partes involucradas fuera de BALULU. No garantizamos la
              salud, seguridad o idoneidad de ninguna mascota ni la identidad o
              conducta de cada usuario.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-balulu-text mb-3">
              6. Conducta prohibida
            </h2>
            <p className="text-balulu-muted leading-relaxed">
              Esta prohibido el uso de BALULU para: trafico ilegal de animales,
              abuso, crueldad, peleas de animales, explotacion, esquemas de
              adopcion fraudulentos, actividad comercial ilegal o cualquier
              actividad maliciosa que involucre animales.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-balulu-text mb-3">
              7. Donaciones
            </h2>
            <p className="text-balulu-muted leading-relaxed">
              BALULU acepta donaciones voluntarias para mantener y mejorar la
              plataforma. Las donaciones no son obligatorias para usar el
              servicio, no garantizan una adopcion y no compran acceso
              preferencial a mascotas.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-balulu-text mb-3">
              8. Cambios a los terminos
            </h2>
            <p className="text-balulu-muted leading-relaxed">
              Podemos modificar estos terminos en cualquier momento. Los cambios
              entraran en vigor al publicarse en la plataforma.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-balulu-text mb-3">
              9. Contacto
            </h2>
            <p className="text-balulu-muted leading-relaxed">
              Para preguntas sobre estos terminos, contactanos en
              hola@balulu.app.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
