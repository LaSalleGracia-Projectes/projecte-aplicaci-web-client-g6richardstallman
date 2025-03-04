"use client";

import { Carousel, Typography, Button } from "@/components/ui";

export default function HomeCarousel() {
  return (
    <Carousel className="rounded-xl aspect-[16/9] w-full max-w-5xl mx-auto relative z-0 mt-24">
      {/* Imagen 1 */}
      <div className="relative h-full w-full">
        <img
          src="/img1.webp"
          alt="image 1"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 grid h-full w-full place-items-center bg-black/75">
          <div className="w-3/4 text-center md:w-2/4">
            <Typography
              variant="h1"
              color="white"
              className="mb-4 text-3xl md:text-4xl lg:text-5xl"
            >
              Organiza tus eventos con facilidad
            </Typography>
            <Typography
              variant="lead"
              color="white"
              className="mb-12 opacity-80"
            >
              Ahorra tiempo y recursos gestionando tus eventos corporativos con
              nuestra solución especializada para <strong>PYMES</strong>. Desde
              talleres hasta conferencias, te ayudamos en cada paso del proceso.
            </Typography>
            <div className="flex justify-center gap-2">
              <Button size="lg" color="white">
                Descubre Eventos
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Imagen 2 */}
      <div className="relative h-full w-full">
        <img
          src="/img2.webp"
          alt="image 2"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 grid h-full w-full items-center bg-black/75">
          <div className="w-3/4 pl-12 md:w-2/4 md:pl-20 lg:pl-32">
            <Typography
              variant="h1"
              color="white"
              className="mb-4 text-3xl md:text-4xl lg:text-5xl"
            >
              Genera valor y crecimiento
            </Typography>
            <Typography
              variant="lead"
              color="white"
              className="mb-12 opacity-80"
            >
              Nuestros reportes te permiten medir el éxito de cada evento,
              optimizar costos y mejorar la toma de decisiones. Conviértete en
              el referente de tu sector y haz crecer tu negocio.
            </Typography>
            <div className="flex gap-2" />
          </div>
        </div>
      </div>

      {/* Imagen 3 */}
      <div className="relative h-full w-full">
        <img
          src="/img3.webp"
          alt="image 3"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 grid h-full w-full items-end bg-black/75">
          <div className="w-3/4 pl-12 pb-12 md:w-2/4 md:pl-20 md:pb-20 lg:pl-32 lg:pb-32">
            <Typography
              variant="h1"
              color="white"
              className="mb-4 text-3xl md:text-4xl lg:text-5xl"
            >
              Conecta con tu audiencia
            </Typography>
            <Typography
              variant="lead"
              color="white"
              className="mb-12 opacity-80"
            >
              Maximiza la asistencia y el impacto de tus eventos con
              herramientas de difusión y registro simples de usar. Llega a tu
              público ideal y ofrece una experiencia inolvidable.
            </Typography>
            <div className="flex gap-2" />
          </div>
        </div>
      </div>

      {/* Imagen 4 */}
      <div className="relative h-full w-full">
        <img
          src="/img4.webp"
          alt="image 3"
          className="h-full w-full object-cover"
        />
      </div>
    </Carousel>
  );
}
