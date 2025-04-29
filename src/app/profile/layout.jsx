import ProfileNavbar from "./components/ProfileNavbar";
import "./layout.css";

export default function ProfileLayout({ children }) {
  return (
    <div className="profile-layout-container">
      <ProfileNavbar />
      <main className="profile-layout-content">{children}</main>
    </div>
  );
}
