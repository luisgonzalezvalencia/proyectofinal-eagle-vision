import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Eagle Vision</h1>
            <p className="text-gray-600">SDK para Reconocimiento Facial</p>
          </div>
          <nav>
            <Link href="/docs" className="text-blue-600 hover:text-blue-800 font-medium">
              Documentación
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="mb-16 text-center">
          <h2 className="text-4xl font-bold mb-4">Transformando la Identificación y Validación de Usuarios</h2>
          <p className="text-xl text-gray-600 mb-8">Solución de reconocimiento facial de alta precisión para organizaciones</p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <a href="https://admin.eaglevision-ia.com" target="_self">Solicitar Demostración</a>
          </Button>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Nuestra Misión</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Proveer un Kit de Desarrollo de Software para la identificación automatizada de las personas utilizando reconocimiento facial, que permita a las organizaciones integrar de manera sencilla y eficiente la validación de usuarios a sus propios sistemas. Utilizando inteligencia artificial, aseguramos una alta precisión y rapidez en el proceso de identificación.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Nuestra Visión</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Desarrollar un SDK especializado en reconocimiento facial, que facilite la integración con otros sistemas de gestión de acceso y asistencia, proporcionando una solución efectiva y de alto rendimiento para la validación de usuarios entrenados en diversos entornos como instituciones educativas y empresas.</p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Soluciones que Ofrecemos</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>
                    <CheckCircle2 className="mr-2 text-green-500" />
                    {solution.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{solution.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para revolucionar tu sistema de identificación?</h2>
          <p className="text-xl text-gray-600 mb-8">Contáctanos hoy para obtener más información sobre Eagle Vision</p>
          <Button className="bg-blue-600 hover:bg-blue-700">Contactar Ahora</Button>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Eagle Vision. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

const solutions = [
  {
    title: "Automatización del Registro",
    description: "Identifica y registra automáticamente la entrada y salida de personas en tu organización, eliminando errores y la necesidad de intervención manual."
  },
  {
    title: "Alta Precisión y Eficiencia",
    description: "Ofrece una solución más fiable que los sistemas tradicionales, proporcionando un registro en tiempo real."
  },
  {
    title: "Reducción de Costos",
    description: "Elimina la necesidad de tarjetas físicas o dispositivos adicionales, reduciendo costos de emisión y mantenimiento de infraestructura."
  },
  {
    title: "Menor Carga Administrativa",
    description: "Automatiza el proceso de ingreso, salida y registro de asistencia, reduciendo la carga en los administradores de tu organización."
  },
  {
    title: "Fácil Integración",
    description: "Diseñado para integrarse fácilmente en plataformas existentes sin necesidad de grandes inversiones adicionales. Puedes utilizarlo con tus sistemas de gestión de acceso y asistencia existentes."
  },
  {
    title: "Entrenamiento Continuo",
    description: "Eagle vision SDK utiliza inteligencia artificial durante los escaneos faciales para mejorar la precisión y adaptar el sistema a los cambios faciales que ocurren con el tiempo."
  }
]

