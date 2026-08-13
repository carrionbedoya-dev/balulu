import { PawPrint, Heart, Shield, Users, MapPin } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-balulu-background">
      {/* Hero */}
      <div className="bg-balulu-primary-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-balulu-primary-700 rounded-balulu mx-auto mb-6 flex items-center justify-center">
            <PawPrint className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Sobre BALULU</h1>
          <p className="text-balulu-primary-200 text-lg max-w-2xl mx-auto">
            Conectando corazones con patas. Cada mascota merece un hogar lleno
            de amor.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-balulu-text mb-6">
              Nuestra mision
            </h2>
            <p className="text-balulu-muted leading-relaxed mb-4">
              BALULU nacio con una idea simple pero poderosa: que ninguna
              mascota se quede sin un hogar por falta de conexion entre las
              personas adecuadas.
            </p>
            <p className="text-balulu-muted leading-relaxed">
              Somos una plataforma digital que facilita el descubrimiento,
              contacto y proceso de adopcion entre personas que buscan una
              mascota y refugios o rescatistas que tienen animales esperando
              un hogar.
            </p>
          </div>
          <div className="bg-balulu-primary-50 rounded-balulu-lg p-8">
            <div className="space-y-6">
              {[
                {
                  icon: Heart,
                  title: "Conexion emocional",
                  desc: "Creamos experiencias significativas entre personas y mascotas.",
                },
                {
                  icon: Shield,
                  title: "Confianza y seguridad",
                  desc: "Verificamos organizaciones y protegemos a todos los usuarios.",
                },
                {
                  icon: Users,
                  title: "Comunidad",
                  desc: "Unimos a adoptantes, refugios y rescatistas en un solo lugar.",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 bg-white rounded-balulu-sm flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-balulu-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-balulu-text">
                      {item.title}
                    </h4>
                    <p className="text-sm text-balulu-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-balulu-text text-center mb-12">
            Como funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Descubre",
                desc: "Explora perfiles de mascotas con fotos, personalidad y necesidades.",
              },
              {
                step: "2",
                title: "Conecta",
                desc: "Guarda tus favoritas y usa mensajes guiados para expresar interes.",
              },
              {
                step: "3",
                title: "Adopta",
                desc: "Coordina con el refugio y da el primer paso hacia una nueva familia.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-balulu-primary-600 text-white rounded-balulu mx-auto mb-4 flex items-center justify-center text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-balulu-text mb-2">
                  {item.title}
                </h3>
                <p className="text-balulu-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <MapPin className="w-8 h-8 text-balulu-primary-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-balulu-text mb-2">
          Donde estamos
        </h2>
        <p className="text-balulu-muted">
          Actualmente operamos en Cancun, Quintana Roo, Mexico. Con planes de
          expansion a toda la region y mas alla.
        </p>
      </div>
    </div>
  );
}
