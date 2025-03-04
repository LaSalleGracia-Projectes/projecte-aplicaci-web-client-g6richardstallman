import HomeCarousel from "@/components/Carousel";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NavbarCategorias from "@/components/NavbarCategorias";

export default function Home() {
  return (
    <section>
      <Header />
      {/* Carousel */}
      <HomeCarousel />

      {/* Navbar de categorías */}
      <NavbarCategorias />
      <Footer />
    </section>
  );
}
