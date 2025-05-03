import { Inter } from "next/font/google";
import Header from "../../components/layout/Header/Header";
import Footer from "../../components/layout/Footer/Footer";
import "./layout.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Contacto - Eventflix",
  description:
    "Ponte en contacto con el equipo de Eventflix para soporte o consultas.",
};

export default function ContactLayout({ children }) {
  return (
    <>
      <Header />
      <main className={`contact-layout ${inter.className}`}>{children}</main>
      <Footer />
    </>
  );
}
