import React from "react";
import Link from "next/link";
import Image from "next/image";
import "./Logo.css";

const Logo = ({ size = 120 }) => {
  return (
    <Link href="/" className="logo-link" aria-label="Ir a inicio">
      <Image
        src="/images/logo.jpg"
        alt="Eventflix Logo"
        width={size}
        height={size}
        className="logo-img"
        style={{ height: "auto" }}
        priority
      />
    </Link>
  );
};

export default React.memo(Logo);
