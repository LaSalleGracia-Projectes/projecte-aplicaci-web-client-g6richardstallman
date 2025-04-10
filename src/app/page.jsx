import HomeCarousel from "../components/Carousel";
import Footer from "../components/Footer";
import Header from "../components/Header";
import NavbarCategorias from "../components/NavbarCategorias";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Carousel */}
        <HomeCarousel />

        {/* Navbar de categorías */}
        <NavbarCategorias />

        {/* Sección de eventos destacados */}
        <section className="py-8 md:py-12 lg:py-16 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Eventos destacados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Tarjetas de eventos - Ejemplo */}
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative h-48">
                    <img
                      src={`/img${item}.webp`}
                      alt={`Evento ${item}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-full text-sm">
                      Destacado
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">
                      Nombre del evento {item}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#e53c3d] font-bold">29.99€</span>
                      <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors">
                        Comprar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sección de próximos eventos */}
        <section className="py-8 md:py-12 lg:py-16 px-4 md:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Próximos eventos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Lista de eventos - Ejemplo */}
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-100 rounded p-2 text-center min-w-[60px]">
                      <span className="block text-lg font-bold">15</span>
                      <span className="block text-sm text-gray-600">MAR</span>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Evento {item}</h3>
                      <p className="text-sm text-gray-600 mb-2">Barcelona</p>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        20:00h
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Banner CTA */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-black/75 z-10" />
          <img
            src="/img4.webp"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-8 text-center">
            <h2 className="text-white text-3xl md:text-4xl font-bold mb-6">
              ¿Quieres organizar tu propio evento?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Únete a nuestra comunidad de organizadores y descubre todas las
              herramientas que tenemos para ti.
            </p>
            <button className="bg-white text-black px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-100 transition-colors">
              Empezar ahora
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
