import Image from "next/image";
import "./layout.css";

export default function AuthLayout({ children }) {
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
