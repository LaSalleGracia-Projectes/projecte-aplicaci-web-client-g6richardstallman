import { Inter } from "next/font/google";
import Header from "../../components/layout/Header/Header";
import Footer from "../../components/layout/Footer/Footer";
import "./layout.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Organizadores - Eventflix",
  description:
    "Descubre a los organizadores que hacen posibles los mejores eventos en Eventflix.",
};

export default function OrganizersLayout({ children }) {
  return (
    <>
      <Header />
      <main className={`organizers-layout ${inter.className}`}>{children}</main>
      <Footer />
    </>
  );
}
