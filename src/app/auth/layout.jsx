"use client";

import Image from "next/image";
import "./layout.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthLayout({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");

    if (token) {
      router.replace("/");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="auth-layout-container">
        <div
          className="auth-layout-main"
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <div
            className="spinner"
            style={{
              width: "2rem",
              height: "2rem",
              borderTop: "3px solid #ef4444",
            }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-layout-container">
      <div className="auth-layout-image-panel">
        <Image
          src="/images/authPageImage.jpg"
          alt="Imagen de un evento"
          fill
          className="next-image"
          priority
        />
        <div className="auth-layout-image-overlay" />
      </div>
      <div className="auth-layout-main">
        <div className="auth-layout-content">{children}</div>
      </div>
    </div>
  );
}
