import { Inter } from "next/font/google";
import Header from "../../components/layout/Header/Header";
import "./layout.css";
import Footer from "../../components/layout/Footer/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sobre Nosotros - Eventflix",
  description:
    "Conoce más sobre Eventflix - tu plataforma para descubrir y reservar eventos.",
};

export default function AboutLayout({ children }) {
  return (
    <>
      <Header />
      <main className={`about-layout ${inter.className}`}>{children}</main>
      <Footer />
    </>
  );
}
