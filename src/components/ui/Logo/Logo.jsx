import Image from "next/image";
import Link from "next/link";
import "./Logo.css";

const Logo = ({ size = 150 }) => (
  <Link href="/" className="logo-link" aria-label="Ir a inicio">
    <Image
      src="/logo.jpg"
      alt="Eventflix Logo"
      width={size}
      height={Math.round(size * 0.67)}
      priority
      className="logo-img"
    />
  </Link>
);

export default Logo;
