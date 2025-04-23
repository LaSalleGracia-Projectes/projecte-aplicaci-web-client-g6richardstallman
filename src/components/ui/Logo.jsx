import Image from "next/image";
import Link from "next/link";

/**
 * Logo reutilizable
 *
 * Props:
 * - size: tamaño en px (ancho), por defecto 120 (alto proporcional)
 */
const Logo = ({ size = 120 }) => (
  <Link
    href="/"
    className={"flex items-center justify-center"}
    aria-label="Ir a inicio"
  >
    <Image
      src="/logo.jpg"
      alt="Eventflix Logo"
      width={size}
      height={Math.round(size * 0.67)}
      priority
      className="rounded transition duration-150 transform hover:scale-105 active:scale-95 object-cover"
    />
  </Link>
);

export default Logo;
