"use client";

import { Carousel, Typography, Button } from "./ui";

export default function HomeCarousel() {
  return (
    <Carousel
      className="relative z-0 mt-16 md:mt-20 lg:mt-24 mx-auto"
      navigation={({ setActiveIndex, activeIndex, length }) => (
        <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
          {new Array(length).fill("").map((_, i) => (
            <span
              key={i}
              className={`block h-2 w-2 cursor-pointer rounded-full transition-colors content-[''] ${
                activeIndex === i ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}
    >
      {/* Imagen 1 */}
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full">
        <img
          src="/img1.webp"
          alt="Gestión de eventos corporativos"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 grid h-full w-full place-items-center bg-black/75">
          <div className="w-full px-4 md:w-3/4 lg:w-2/3 text-center">
            <Typography
              variant="h1"
              color="white"
              className="mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold"
            >
              Organiza tus eventos con facilidad
            </Typography>
            <Typography
              variant="lead"
              color="white"
              className="mb-8 md:mb-12 opacity-80 text-sm sm:text-base md:text-lg"
            >
              Ahorra tiempo y recursos gestionando tus eventos corporativos con
              nuestra solución especializada para <strong>PYMES</strong>. Desde
              talleres hasta conferencias, te ayudamos en cada paso del proceso.
            </Typography>
            <div className="flex justify-center gap-2">
              <Button
                size="lg"
                color="white"
                className="text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3"
              >
                Descubre Eventos
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Imagen 2 */}
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full">
        <img
          src="/img2.webp"
          alt="Análisis y reportes de eventos"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 grid h-full w-full items-center bg-black/75">
          <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 md:w-3/4 lg:w-2/3">
            <Typography
              variant="h1"
              color="white"
              className="mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold"
            >
              Genera valor y crecimiento
            </Typography>
            <Typography
              variant="lead"
              color="white"
              className="mb-8 md:mb-12 opacity-80 text-sm sm:text-base md:text-lg"
            >
              Nuestros reportes te permiten medir el éxito de cada evento,
              optimizar costos y mejorar la toma de decisiones. Conviértete en
              el referente de tu sector y haz crecer tu negocio.
            </Typography>
            <div className="flex gap-2">
              <Button
                size="lg"
                color="white"
                className="text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3"
              >
                Ver análisis
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Imagen 3 */}
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full">
        <img
          src="/img3.webp"
          alt="Gestión de audiencia"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 grid h-full w-full items-end bg-black/75">
          <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 pb-8 sm:pb-12 md:pb-16 lg:pb-20 md:w-3/4 lg:w-2/3">
            <Typography
              variant="h1"
              color="white"
              className="mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold"
            >
              Conecta con tu audiencia
            </Typography>
            <Typography
              variant="lead"
              color="white"
              className="mb-8 md:mb-12 opacity-80 text-sm sm:text-base md:text-lg"
            >
              Maximiza la asistencia y el impacto de tus eventos con
              herramientas de difusión y registro simples de usar. Llega a tu
              público ideal y ofrece una experiencia inolvidable.
            </Typography>
            <div className="flex gap-2">
              <Button
                size="lg"
                color="white"
                className="text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3"
              >
                Comenzar ahora
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Imagen 4 */}
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full">
        <img
          src="/img4.webp"
          alt="Eventos especiales"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 grid h-full w-full place-items-center bg-black/75">
          <div className="w-full px-4 md:w-3/4 lg:w-2/3 text-center">
            <Typography
              variant="h1"
              color="white"
              className="mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold"
            >
              Crea momentos únicos
            </Typography>
            <Typography
              variant="lead"
              color="white"
              className="mb-8 md:mb-12 opacity-80 text-sm sm:text-base md:text-lg"
            >
              Haz que cada evento sea especial y memorable. Nuestra plataforma
              te brinda las herramientas necesarias para crear experiencias
              extraordinarias.
            </Typography>
            <div className="flex justify-center gap-2">
              <Button
                size="lg"
                color="white"
                className="text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3"
              >
                Explorar más
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Carousel>
  );
}
